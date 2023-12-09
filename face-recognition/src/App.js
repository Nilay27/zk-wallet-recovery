import * as faceapi from 'face-api.js';
import './App.css';
import Registration from './components/registration';
import Recovery from './components/recovery';
import WalletAddressInput from './components/walletAddressInput';
import { useState, useContext, useEffect } from 'react';
import {ChakraProvider, Box, Center, Button} from "@chakra-ui/react";
import { VideoContext } from './components/videoContext'; // Update the import path as necessary
import { WalletConnectContext } from './components/walletConnectContext';
import {getSignedContract} from './utils/ethereum';
import { WalletGoerli, WalletABI } from './utils/constants';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const { videoRef, handleVideoOnLoad} = useContext(VideoContext);
  const { account } = useContext(WalletConnectContext);
  const [walletAddress, setWalletAddress] = useState("");

  const checkWalletAddress = async (address) => {
    // Replace with your contract interaction logic
    // For example:
    let owner;
    console.log("checking wallet address", address);
    try {
      const walletContract = getSignedContract(address, WalletABI);
      owner = await walletContract.getOwner();
      const featureVectorHash = BigInt(await walletContract.getFeatureVectorHash());
      console.log("feature vector hash", featureVectorHash)
      // if feature vector hash is not empty which is a bigInt is > 0, then the wallet is registered
      if (featureVectorHash > 0) {
        console.log("I am here")
        setIsRegistered(true);
        setWalletAddress(address);
        return {isRegistered: "true", address: owner};
      }
    } catch (err) {
      console.log(err);
    }
    console.log(isRegistered)
    return {isRegistered: "false", address: owner};
  };

  const handleReset = async() => {
    const walletContract = getSignedContract(walletAddress, WalletABI);
    const zeroArray = new Array(128).fill(0);
    await walletContract.removeRecovery(zeroArray);
    setIsRegistered(false);
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
          <div> Connected Wallet Address: {account} </div>
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
          {isRegistered ? <Recovery /> : <Registration onRegistration/>}
          <Button 
          className="submit-button"  
          rounded={'full'}
          colorScheme={'pink'}
          bgColor={'#FC72FF'}
          color={'#311C31'} 
          onClick={handleReset}
          >Reset</Button>
        </div>
    </ChakraProvider>
    
  );
}

export default App;
