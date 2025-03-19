'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Medspa } from '@/types';

interface FavoritesContextType {
  favorites: Medspa[];
  addFavorite: (medspa: Medspa) => void;
  removeFavorite: (medspaId: string) => void;
  isFavorite: (medspaId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Medspa[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (medspa: Medspa) => {
    setFavorites(prev => {
      // Check if medspa is already in favorites
      if (prev.some(item => item.id === medspa.id)) {
        return prev;
      }
      return [...prev, medspa];
    });
  };

  const removeFavorite = (medspaId: string) => {
    setFavorites(prev => prev.filter(medspa => medspa.id !== medspaId));
  };

  const isFavorite = (medspaId: string) => {
    return favorites.some(medspa => medspa.id === medspaId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
