import logo from './logo.svg';
import './App.css';
import Registeration from './components/registration';
import WalletAddressInput from './components/walletAddressInput';
import { useState, useRef, useEffect } from 'react';
import {ChakraProvider, Box, Center} from "@chakra-ui/react";
import { use } from 'chai';


function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const videoRef = useRef(null);
  const isVideoReady = useRef(false);
  const canvasRef = useRef(null);

  // Function to handle video metadata loading
  const handleVideoOnLoad = () => {
    if (videoRef.current) {
      isVideoReady.current = true;
      console.log('Video dimensions:', videoRef.current.videoWidth, videoRef.current.videoHeight);
    }
  };

  const checkWalletAddress = async (address) => {
    // Replace with your contract interaction logic
    // For example:
    // const owner = await myContract.methods.getOwnerOf(address).call();
    // return owner;
    console.log(address);
    return {isRegistered: "false", address: address};
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch((err) => console.error('Error accessing camera:', err));
  };

  useEffect(() => {
    startVideo();
  }, []);

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
      <video
          ref={videoRef}
          autoPlay
          playsInline
          className="video-element"
          onLoadedMetadata={handleVideoOnLoad} // Add this event handler
        ></video>
        <div className="face-guide"></div>
      </Center>
      <Registeration />
    </div>
    </ChakraProvider>
    
  );
}

export default App;
