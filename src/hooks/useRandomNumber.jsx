import { useState, useCallback } from 'react';

const useRandomNumber = (min = 0, max = 100) => {
  const [randomNumber, setRandomNumber] = useState(1);
  // Function to generate a random number
  const generateRandomNumber = useCallback(() => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, [min, max]);

  // Function to refresh the random number
  const refreshRandomNumber = () => {
    setRandomNumber(generateRandomNumber());
  };

  return [randomNumber, refreshRandomNumber];
};

export default useRandomNumber;
