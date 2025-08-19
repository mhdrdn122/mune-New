import { createContext, useState, useEffect, useContext } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

export const showSidebar = createContext("");

const ShowSidebarProvider = ({ children }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [isCollapsed, setIsCollapsed] = useState(isSmallDevice);

  useEffect(() => {
    setIsCollapsed(isSmallDevice);
  }, [isSmallDevice]);

  return (
    <showSidebar.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </showSidebar.Provider>
  );
};

export default ShowSidebarProvider;

export const useShowSidebar = () => {
  const result = useContext(showSidebar);
  return result;
};
