import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditDrawerContextType {
  open: () => void;
  close: () => void;
  visible: boolean;
}

const EditDrawerContext = createContext<EditDrawerContextType | undefined>(undefined);

export const useEditDrawer = () => {
  const ctx = useContext(EditDrawerContext);
  if (!ctx) throw new Error('useEditDrawer must be used within EditDrawerProvider');
  return ctx;
};

export const EditDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return (
    <EditDrawerContext.Provider value={{ open, close, visible }}>
      {children}
    </EditDrawerContext.Provider>
  );
};
