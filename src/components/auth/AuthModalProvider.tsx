'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import AuthModal from './AuthModal';

export type AuthMode = 'login' | 'register';

type AuthModalContextValue = {
  openLogin: () => void;
  openRegister: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

type AuthModalProviderProps = {
  children: ReactNode;
  // /login veya /register route'undan doğrudan girilince modal açık başlasın diye (URL ile açılabilme).
  initialMode?: AuthMode | null;
};

// Login/Register artık ayrı sayfalar değil, landing'in üzerinde açılan bir modal: bu provider
// hangi modun (login/register/kapalı) açık olduğunu tutar, Navbar ve Hero gibi tetikleyiciler
// useAuthModal() ile açar. Modal'ın kendisi tek yerde (AuthModal) render edilir.
export function AuthModalProvider({ children, initialMode = null }: AuthModalProviderProps) {
  const [mode, setMode] = useState<AuthMode | null>(initialMode);

  return (
    <AuthModalContext.Provider
      value={{
        openLogin: () => setMode('login'),
        openRegister: () => setMode('register'),
      }}
    >
      {children}
      {mode && <AuthModal mode={mode} onClose={() => setMode(null)} onSwitchMode={setMode} />}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
