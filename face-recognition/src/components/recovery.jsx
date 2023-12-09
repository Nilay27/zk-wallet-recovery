import React, { useState, useEffect, useContext } from 'react';
import { Box, Input, Button, HStack, useToast, Text } from '@chakra-ui/react';
import { VideoContext } from './videoContext';
import {getSignedContract} from '../utils/ethereum';
import { WalletABI, WalletGoerli } from '../utils/constants';
import * as helper from '../fuzzy_commitment/Helpers';
import ReedSolomonEC from '../fuzzy_commitment/ErrorCorrection';
import { buildContractCallArgs, generateProof } from '../utils/snark.ts';

function Recovery() {
  // Load QA from local storage if it exists, otherwise set initial state
  const [qa, setQa] = useState(() => {
    const savedQa = localStorage.getItem('qa');
    if (savedQa) {
      const questions = JSON.parse(savedQa);
      // Return only questions with empty answers
      return questions.map(q => ({ question: q.question, answer: '' }));
    }
    return [{ question: '', answer: '' }]; // Default state if nothing in storage
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { handleCaptureClick, detections} = useContext(VideoContext);
  const [isQaSubmitted, setIsQaSubmitted] = useState(false); // State to track if the form is submitted
  const walletContract = getSignedContract(WalletGoerli,WalletABI);
  const toast = useToast();
  const [hashOfPersonalInfoHash, setHashOfPersonalInfoHash] = useState(0n);
  const [personalInfoHash, setPersonalInfoHash] = useState(0n);
  const rc_ec = new ReedSolomonEC();

  // Handle answer input
  const handleAnswer = (answer, index) => {
    answer = answer.toLowerCase();
    const newQa = [...qa];
    newQa[index] = { ...newQa[index], answer };
    setQa(newQa);
  };

  // Function to handle the recovery process
  const handleSubmit = async () => {
    if(qa[0].answer === '' || qa[1].answer === '' || qa[2].answer === '') {
        toast({
          title: "Error",
          description: "Please answer all questions",
          status: "error",
          duration: 3000,
          isClosable: true,
        })      
        return;
      }
    const personalInfo = qa.map(item => item.question + item.answer).join('').replace(/\s/g, '').toLowerCase();
    console.log(personalInfo);
    setIsQaSubmitted(true);
    const personalInfoHash = await helper.sha256ToBigInt(personalInfo);
    const hashOfPersonalInfoHash = await helper.poseidonHash([personalInfoHash]);
    const personalInfoHashInWallet = BigInt(await walletContract.getHashOfPersonalInfoHash());
    console.log("personalInfoHashInWallet: ", personalInfoHashInWallet);
    console.log("hashOfPersonalInfoHash: ", hashOfPersonalInfoHash);
    if (personalInfoHashInWallet !== hashOfPersonalInfoHash){
      toast({
        title: "Error",
        description: "Your personal information does not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      })      
      return;
    }else{
      toast({
        title: "Success",
        description: "Your personal information matches",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }
    setHashOfPersonalInfoHash(hashOfPersonalInfoHash);
    setPersonalInfoHash(personalInfoHash);
    // Logic to handle recovery. For now, just logging to the console.
    await handleCaptureClick();
  };

  useEffect(() => {
    if (detections.length > 0 && isQaSubmitted){
      console.log(detections);
        // toast for generating fuzzy commitment
        const generateZKProof = async () => {
          // read commitment from local storage
          const storedCommitment = localStorage.getItem('commitment');
          console.log('storedCommitment', storedCommitment);
          const commitmentArray = storedCommitment ? JSON.parse(storedCommitment) : [];
          
          console.log('commitmentArray', commitmentArray.length);
          console.log('detections[0].descriptor', detections[0].descriptor.length);
          var err_vector;
          var feat_vec_prime;
          var feature_vec_hash;
          try {
            const result = await rc_ec.recover(
                detections[0].descriptor,
                commitmentArray,
            );
            // Continue with your logic here if the call is successful
            err_vector = result.err_vector;
            feat_vec_prime = result.feat_vec_prime;
            feature_vec_hash = result.feature_vec_hash;
          } catch (error) {
              console.error('Error recovering wallet:', error);
              toast({
                title: "Error",
                description: "Your face does not match",
                status: "error",
                duration: 3000,
                isClosable: true,
              })
              return;
          }
          console.log('err_vector', err_vector);
          const featureVecInContract = BigInt(await walletContract.getFeatureVectorHash());
          if(featureVecInContract !== feature_vec_hash){
            toast({
              title: "Error",
              description: "Your face does not match",
              status: "error",
              duration: 3000,
              isClosable: true,
            })      
            return;
          }else{
            toast({
              title: "Success",
              description: "Your face matches",
              status: "success",
              duration: 3000,
              isClosable: true,
            })
          }
          toast({
            title: "Generating ZK proof",
            description: "Please wait...",
            status: "info",
            duration: 5000,
            isClosable: true,
          })
          const nullifier = helper.generateRandom128Bit();
          const nullifierHash = await helper.poseidonHash([nullifier]);
          const {proof, publicSignals} = await generateProof(
            feat_vec_prime,
            err_vector,
            feature_vec_hash,
            nullifier,
            nullifierHash,
            personalInfoHash,
            hashOfPersonalInfoHash);
          console.log('proof', proof);
          console.log('publicSignals', publicSignals);
          const contractCallArguments = buildContractCallArgs(proof, publicSignals);
          console.log('contractCallArguments', contractCallArguments);
          const result = await walletContract.recoverWallet(...contractCallArguments);
          console.log('result', result);
          setIsLoading(true);
          walletContract.on('WalletRecovered', (newOwner, nullifierHash) => {
            console.log('WalletRecovered event emitted');
            console.log('newOwner', newOwner);
            console.log('nullifierHash', nullifierHash);
            toast({
              title: "Success",
              description: "Wallet recovered" + `new owner: ${newOwner}`,
              status: "success",
              duration: 3000,
              isClosable: true,
            })
            setIsLoading(false);
          });
          setIsQaSubmitted(false);
          setQa([{ question: '', answer: '' }]);
      };
      generateZKProof().catch(console.error);
    }
  },[detections]);

  return (
    <div>
      <div className="question-container">
        <HStack width="full" justify="center" mx="auto" spacing={20}>
          {qa.map((item, index) => (
            <Box key={index} width="full">
              <Text color="white">{item.question}</Text>
              <Input
                mt={2}
                placeholder="Your answer"
                value={item.answer}
                onChange={(e) => handleAnswer(e.target.value, index)}
                color="white"
                type='password'
              />
            </Box>
          ))}
        </HStack>
      </div>
      <Button className="submit-button"
        rounded={'full'}
        colorScheme={'pink'}
        bgColor={'#FC72FF'}
        color={'#311C31'}
        isLoading={isLoading}
        loadingText="Recovering..."
        onClick={handleSubmit}>
        Start Recovery
      </Button>
    </div>      
  );
}

export default Recovery;
