import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppData } from './types';
import { useAppData as useAppDataHook } from './hooks/useAppData';

type Screen = 'home' | 'add' | 'transaction' | 'share' | 'report';

interface AppContextType {
  appData: AppData;
  updateAppData: (data: AppData) => void;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  activePhone: string | null;
  setActivePhone: (phone: string | null) => void;
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  shareData: any;
  setShareData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { appData, updateAppData } = useAppDataHook();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [activePhone, setActivePhone] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [shareData, setShareData] = useState<any>(null);
  const [toast, setToast] = useState<{msg: string, type: string, visible: boolean}>({msg: '', type: 'info', visible: false});

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  return (
    <AppContext.Provider value={{
      appData, updateAppData,
      currentScreen, setCurrentScreen,
      activePhone, setActivePhone,
      isEditMode, setIsEditMode,
      showToast,
      shareData, setShareData
    }}>
      {children}
      {/* Toast */}
      <div className={`fixed z-[1000] left-1/2 -translate-x-1/2 min-w-[250px] max-w-[90%] text-center rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${toast.visible ? 'bottom-20 opacity-100 visible' : 'bottom-8 opacity-0 invisible'} ${toast.type === 'success' ? 'bg-[#198754] border border-[#146c43]' : toast.type === 'error' ? 'bg-[#dc3545] border border-[#b02a37]' : 'bg-[#0dcaf0] border border-[#087990] text-black'}`}>
        {toast.msg}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
