import { createContext, useContext, useState, useCallback } from "react";

const WaitlistContext = createContext(null);

export const WaitlistProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const openWaitlist = useCallback(() => setOpen(true), []);
  return (
    <WaitlistContext.Provider value={{ open, setOpen, openWaitlist }}>
      {children}
    </WaitlistContext.Provider>
  );
};

export const useWaitlist = () => useContext(WaitlistContext);
