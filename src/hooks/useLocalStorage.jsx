import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key);
    // console.log(jsonValue)
    if (jsonValue != null) return JSON.parse(jsonValue);
    if (typeof initialValue === "function") return initialValue();
    else return initialValue;
  });

  useEffect(() => {
    const setLocalStorage = async () => {
      await localStorage.setItem(key, JSON.stringify(value));
    };
    
    setLocalStorage(); 
  }, [key, value]);

  return [value, setValue];
}
