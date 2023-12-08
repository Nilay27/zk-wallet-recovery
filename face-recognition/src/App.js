import logo from './logo.svg';
import './App.css';
import Registeration from './components/registration';
import WalletAddressInput from './components/walletAddressInput';
import { useState } from 'react';
import {ChakraProvider, Box, Center} from "@chakra-ui/react";


function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  const checkWalletAddress = async (address) => {
    // Replace with your contract interaction logic
    // For example:
    // const owner = await myContract.methods.getOwnerOf(address).call();
    // return owner;
    console.log(address);
    return {isRegistered: "false", address: address};
  };


  return (
    <ChakraProvider>
    <div className="App">
      <header className="App-header">
        <Box className="navbar">
          ZK Face Recovery
        </Box>
      </header>
      <WalletAddressInput onAddressSubmit={checkWalletAddress}/>
      <Center className="video-container">
          {/* Embed your video component here */}
      </Center>
      <Registeration />
    </div>
    </ChakraProvider>
    
  );
}

export default App;
