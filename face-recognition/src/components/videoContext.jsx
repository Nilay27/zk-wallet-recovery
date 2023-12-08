// VideoContext.js
import React, { createContext, useRef, useState, useCallback, useContext, useEffect} from 'react';
import { FaceApiContext } from './faceApiContext'; // Import FaceApiContext

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const { isModelLoaded, faceapi } = useContext(FaceApiContext); // Consume the FaceApiContext
  const videoRef = useRef();
  const isVideoReady = useRef(false);
  const [detections, setDetections] = useState([]);

  // Function to handle video metadata loading
  const handleVideoOnLoad = () => {
    if (videoRef.current) {
      isVideoReady.current = true;
      console.log('Video dimensions:', videoRef.current.videoWidth, videoRef.current.videoHeight);
    }
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


  const handleCaptureClick = useCallback(async () => {
    console.log('isModelLoaded:', isModelLoaded);
    if (isModelLoaded && videoRef.current && isVideoReady.current) {
      console.log('Capturing image...');
      // ... your face detection logic here ...
      const options = new faceapi.TinyFaceDetectorOptions();
      const detections = await faceapi.detectAllFaces(videoRef.current, options).withFaceLandmarks().withFaceDescriptors();
      console.log('Detections:', detections);
      setDetections(detections);
    }
  }, [isModelLoaded, faceapi]);

  // You would also need functions to handle video startup, etc.

  return (
    <VideoContext.Provider value={{ videoRef, handleCaptureClick, detections, isVideoReady, handleVideoOnLoad}}>
      {children}
    </VideoContext.Provider>
  );
};
