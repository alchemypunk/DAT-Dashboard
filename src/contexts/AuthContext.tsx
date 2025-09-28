import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isRegistered: boolean;
  isAdmin: boolean;
  login: (asAdmin: boolean) => void;
  logout: () => void;
  register: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock state: 'guest' (unregistered) | 'user' (registered) | 'admin'
  const [userRole, setUserRole] = useState<'guest' | 'user' | 'admin'>('guest');

  const isRegistered = userRole === 'user' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  const login = (asAdmin: boolean = false) => {
    // 简化模拟登录逻辑
    setUserRole(asAdmin ? 'admin' : 'user');
    alert(`Logged in as: ${asAdmin ? 'Admin' : 'Registered User'}`);
  };

  const register = () => {
    // 简化模拟注册逻辑
    setUserRole('user');
    alert('Registration successful! Logged in as Registered User.');
  };

  const logout = () => {
    setUserRole('guest');
    alert('Logged out. Viewing limited data.');
  };

  return (
    <AuthContext.Provider value={{ isRegistered, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}