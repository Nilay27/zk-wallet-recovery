import React, { createContext, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export const FaceApiContext = createContext();

export const FaceApiProvider = ({ children }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/model');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/model');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/model');
      setIsModelLoaded(true);
      console.log('Models loaded');
    };

    loadModels().catch(console.error);
  }, []);

  return (
    <FaceApiContext.Provider value={{ isModelLoaded, faceapi }}>
      {children}
    </FaceApiContext.Provider>
  );
};
