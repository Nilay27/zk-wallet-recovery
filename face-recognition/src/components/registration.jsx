import React, { useState } from 'react';
import { Center, VStack, Input, ChakraProvider, Select, Box, Button, HStack, useToast } from '@chakra-ui/react';

function Registration() {
  // State to store the selected questions and their answers
  const [qa, setQa] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]);
  const toast = useToast();

  // Example questions
  const questions = [
    "What is your favorite color?",
    "What is your hometown?",
    "What is your hobby?",
    // ... add more questions as needed
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
  const handleSubmit = () => {    
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
  };

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
        onClick={handleSubmit}>
        Register
      </Button>
    </div>      
  );
}

export default Registration;
