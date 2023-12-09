import React, { useState } from 'react';
import { Box, Input, Button, Center, Text } from '@chakra-ui/react';
import { WalletGoerli, WalletABI } from '../utils/constants';

const WalletAddressInput = ({ onAddressSubmit }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [ownerInfo, setOwnerInfo] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  

  const handleAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleSubmit = async () => {
    setIsChecking(true);
    // Call your contract check function here.
    // This is a placeholder for the logic you would use to interact with your contract.
    try {
      const ownerInfo = await onAddressSubmit(walletAddress);
      setOwnerInfo(ownerInfo); // Assume this function returns the owner information
    } catch (error) {
      console.error('Error checking wallet address:', error);
      setOwnerInfo('Error retrieving owner information.');
    }
    setIsChecking(false);
  };

  return (
    <div className='wallet-address-input'>
      <Box p={4}>
      <Center mb={4}>
        <Text>Enter your wallet address:</Text>
      </Center>
      <Center mb={4}>
        <Input
          value={walletAddress}
          onChange={handleAddressChange}
          placeholder="Enter wallet address"
          size="md"
          width="250px"
          color={"white"}
        />
      </Center>
      <Center>
        <Button 
        onClick={handleSubmit} 
        isLoading={isChecking}
        rounded={'full'}
        colorScheme={'pink'}
        bgColor={'#FC72FF'}
        color={'#311C31'} 
        >
          Check Address
        </Button>
      </Center>
      <Center mt={4}>
        <Text color={"white"}>Owner Information: {ownerInfo.address}</Text>
      </Center>
      <Center>
      <Text color={"white"}>Is Recovery Resitered: {ownerInfo.isRegistered}</Text>
      </Center>
    </Box>
    </div>
    
  );
};

export default WalletAddressInput;
