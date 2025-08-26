import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!visible && ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Disconnect after the element becomes visible
        }
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [visible, ref]);

  return [ref, visible];
};

export default useIntersectionObserver;
