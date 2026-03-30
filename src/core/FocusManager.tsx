import React, { createContext, useContext, useEffect, useState } from 'react';

interface FocusContextType {
  register: (id: string, ref: React.RefObject<HTMLElement>) => void;
  unregister: (id: string) => void;
  moveNext: () => void;
  movePrev: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registry, setRegistry] = useState<Record<string, React.RefObject<HTMLElement>>>({});
  const [order, setOrder] = useState<string[]>([]);

  const register = (id: string, ref: React.RefObject<HTMLElement>) => {
    setRegistry(prev => ({ ...prev, [id]: ref }));
    setOrder(prev => [...new Set([...prev, id])]);
  };

  const unregister = (id: string) => {
    setRegistry(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setOrder(prev => prev.filter(item => item !== id));
  };

  const moveNext = () => {
    const current = document.activeElement;
    const currentIndex = order.findIndex(id => registry[id].current === current);
    const nextIndex = (currentIndex + 1) % order.length;
    registry[order[nextIndex]]?.current?.focus();
  };

  const movePrev = () => {
    const current = document.activeElement;
    const currentIndex = order.findIndex(id => registry[id].current === current);
    const prevIndex = (currentIndex - 1 + order.length) % order.length;
    registry[order[prevIndex]]?.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        moveNext();
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        movePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, registry]);

  return (
    <FocusContext.Provider value={{ register, unregister, moveNext, movePrev }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocusNavigation = () => {
  const context = useContext(FocusContext);
  if (!context) throw new Error('useFocusNavigation must be used within FocusProvider');
  return context;
};
