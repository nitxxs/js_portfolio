"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type EditModeContextType = {
  isEditing: boolean;
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  enterEditMode: (password: string) => boolean;
  exitEditMode: () => void;
};

const EditModeContext = createContext<EditModeContextType>({
  isEditing: false,
  showPasswordModal: false,
  setShowPasswordModal: () => {},
  enterEditMode: () => false,
  exitEditMode: () => {},
});

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const enterEditMode = (password: string) => {
    if (password === "!kevin7979") {
      setIsEditing(true);
      setShowPasswordModal(false);
      return true;
    }
    return false;
  };

  const exitEditMode = () => {
    setIsEditing(false);
  };

  return (
    <EditModeContext.Provider
      value={{
        isEditing,
        showPasswordModal,
        setShowPasswordModal,
        enterEditMode,
        exitEditMode,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
