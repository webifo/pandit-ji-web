"use client";

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { loadUserFromStorage } from '@/store/slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadUserFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
