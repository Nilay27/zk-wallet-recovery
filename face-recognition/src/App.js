import * as faceapi from 'face-api.js';
import './App.css';
import Registration from './components/registration';
import Recovery from './components/recovery';
import WalletAddressInput from './components/walletAddressInput';
import { useState, useContext, useEffect } from 'react';
import {ChakraProvider, Box, Center} from "@chakra-ui/react";
import { VideoContext } from './components/videoContext'; // Update the import path as necessary


function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const { videoRef, handleVideoOnLoad} = useContext(VideoContext);
  
  const checkWalletAddress = async (address) => {
    // Replace with your contract interaction logic
    // For example:
    // const owner = await myContract.methods.getOwnerOf(address).call();
    // return owner;
    console.log(address);
    setIsRegistered(true);
    return {isRegistered: "true", address: address};
  };

  
  return (
    <ChakraProvider>
        <div className="App">
          <header className="App-header">
            <Box className="navbar"
            bgColor={'white.400'}
            color={'black'} 
            fontWeight={'bold'}
            fontFamily={'monospace'}
            fontSize={'3xl'}
            // bgGradient={'linear(to-r, green.200, pink.500)'}
            >
              ZK Wallet Recovery
            </Box>
          </header>
          <WalletAddressInput onAddressSubmit={checkWalletAddress}/>
          <Center className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="video-element"
              onLoadedMetadata={handleVideoOnLoad} // Add this event handler
            ></video>
            <div className="face-guide"></div>
          </Center>
          {isRegistered ? <Recovery /> : <Registration onRegistration = {setIsRegistered}/>}
        </div>
    </ChakraProvider>
    
  );
}

export default App;
