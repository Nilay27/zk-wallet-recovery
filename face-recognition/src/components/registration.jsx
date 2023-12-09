import React, { useState, useEffect, useContext } from 'react';
import { Input, Select, Button, HStack, useToast } from '@chakra-ui/react';
import { VideoContext } from './videoContext';
import ReedSolomonEC from '../fuzzy_commitment/ErrorCorrection';
import * as helper from '../fuzzy_commitment/Helpers';
import {getSignedContract} from '../utils/ethereum';
import { WalletABI, WalletGoerli } from '../utils/constants';

function Registration() {
  // State to store the selected questions and their answers
  const [qa, setQa] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]);
  const [isQaSubmitted, setIsQaSubmitted] = useState(false); // State to track if the form is submitted
  const toast = useToast();
  const { handleCaptureClick, detections} = useContext(VideoContext);
  const rc_ec = new ReedSolomonEC();
  const [personalInfo, setPersonalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Example questions
  const questions = [
    "What is your favorite color?",
    "A pin that you will never forget?",
    "Where is your hometown?",
    "What is your hobby?",
    "Your Social Security Number?"
  ];

  // Handle question selection
  const handleSelect = (question, index) => {
    const newQa = [...qa];
    newQa[index] = { ...newQa[index], question };
    setQa(newQa);
  };

  // Handle answer input
  const handleAnswer = (answer, index) => {
    //convert answer to lowercase
    answer = answer.toLowerCase();
    const newQa = [...qa];
    newQa[index] = { ...newQa[index], answer };
    setQa(newQa);
  };

  // Function to handle form submission
  const handleSubmit = async () => {    
    // ensure all questions are answered and all questions are different
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
    const uniqueQuestions = new Set(qa.map(item => item.question));
    if (uniqueQuestions.size !== qa.length) {
      toast({
        title: "Error",
        description: "Please select different questions",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return; // Exit the function if there are duplicate questions
    }
    console.log(qa);
    setIsQaSubmitted(true);
    // concat all questions and respective answers and set it as personal info also remove any spaces and convert to lowercase
    const personalInfo = qa.map(item => item.question + item.answer).join('').replace(/\s/g, '').toLowerCase();
    setPersonalInfo(personalInfo);
    console.log(personalInfo);
     
    await handleCaptureClick();
  };

  // once the qa is submitted, save the qa as object in local storage
    useEffect(() => {
        if(isQaSubmitted) {
            localStorage.setItem('qa', JSON.stringify(qa));
        }
    }, [isQaSubmitted]);

    useEffect(() => {
      if (detections.length > 0) {
        console.log(detections);
        // toast for generating fuzzy commitment
        toast({
          title: "Generating fuzzy commitment...",
          description: "Please wait...",
          status: "info",
          duration: 3000,
          isClosable: true,
        })
        const processDetections = async () => {
          if (detections.length > 0) {
            const { commitment, featureVectorHash } = await rc_ec.fuzzyCommitment(detections[0].descriptor);
            
            const commitmentArray = Array.from(commitment); // Convert Uint8Array to regular array
            console.log('commitmentArray', commitmentArray);
            localStorage.setItem('commitment', JSON.stringify(commitmentArray));


            console.log('featureVectorHash', featureVectorHash);
            // console.log('Wallet contract', walletContract);
            const personalInfoHash = await helper.sha256ToBigInt(personalInfo);
            const hashOfPersonalInfoHash = await helper.poseidonHash([personalInfoHash]);
            const contractCallArguments = [featureVectorHash, hashOfPersonalInfoHash, commitment];
            console.log('contractCallArguments', contractCallArguments);
            console.log('sending commitment to wallet for registration');
            const walletContract = getSignedContract(WalletGoerli,WalletABI);
            const isRegistered = await walletContract.registerForRecovery(featureVectorHash, hashOfPersonalInfoHash, [...commitment]);
            setIsLoading(true);
            walletContract.on('RecoveryRegistered', (newOwner, feature_vec_hash) => {
              console.log('WalletRecovered event emitted');
              console.log('newOwner', newOwner);
              console.log('nullifierHash', feature_vec_hash);
              toast({
                title: "Success",
                description: "Face Registered for recovery",
                status: "success",
                duration: 3000,
                isClosable: true,
              })
              setIsLoading(false);
            });
            
          }
        };
        processDetections().catch(console.error);
      }else if (isQaSubmitted && detections.length === 0){
        toast({
          title: "Error",
          description: "No face detected",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return;
      }
      
      
    }, [detections]);

  return (
    <div>
      <div className="question-container">
        <HStack width="full" justify="center" mx="auto" spacing={20}>
          {qa.map((item, index) => (
            <div key={index}>
              <Select
                placeholder="Select question"
                value={item.question}
                onChange={(e) => handleSelect(e.target.value, index)}
                width="full"
                color={item.question ? "white" : "gray.500"}
              >
                {questions.map((question, qIndex) => (
                  <option key={qIndex} value={question}>{question}</option>
                ))}
              </Select>
              <Input
                mt={2}
                placeholder="Your answer"
                value={item.answer}
                onChange={(e) => handleAnswer(e.target.value, index)}
                color={item.answer ? "white" : "gray.500"}
                type='password'
              />
            </div>
          ))}
        </HStack>
      </div>
      <Button className="submit-button"  
        rounded={'full'}
        colorScheme={'pink'}
        bgColor={'#FC72FF'}
        color={'#311C31'} 
        isLoading={isLoading}
        loadingText="Registering"
        onClick={handleSubmit}>
        Register
      </Button>
    </div>      
  );
}

export default Registration;
