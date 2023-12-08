import React, { useState, useEffect, useContext } from 'react';
import { Box, Input, Button, HStack, useToast, Text } from '@chakra-ui/react';
import { FaceApiContext } from './faceApiContext';

function Recovery() {
  // Load QA from local storage if it exists, otherwise set initial state
  const [qa, setQa] = useState(() => {
    const savedQa = localStorage.getItem('qa');
    return savedQa ? JSON.parse(savedQa) : [{ question: '', answer: '' }];
  });
  const { isModelLoaded, faceapi } = useContext(FaceApiContext);

  const toast = useToast();

  // Handle answer input
  const handleAnswer = (answer, index) => {
    answer = answer.toLowerCase();
    const newQa = [...qa];
    newQa[index] = { ...newQa[index], answer };
    setQa(newQa);
  };

  // Function to handle the recovery process
  const startRecovery = () => {
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
     
    // Logic to handle recovery. For now, just logging to the console.
    console.log('Recovery started with:', qa);
  };

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
        onClick={startRecovery}>
        Start Recovery
      </Button>
    </div>      
  );
}

export default Recovery;
