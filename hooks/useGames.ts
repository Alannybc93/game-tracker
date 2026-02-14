// hooks/useGames.ts
import { useState, useEffect } from 'react';

export interface Game {
  id: string;
  title: string;
  platform?: string;
  genre?: string;
  status?: 'playing' | 'completed' | 'backlog' | 'dropped';
  hoursPlayed?: number;
  rating?: number;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setGames([
        {
          id: '1',
          title: 'The Legend of Zelda: Breath of the Wild',
          platform: 'Nintendo Switch',
          genre: 'Aventura',
          status: 'completed',
          hoursPlayed: 85,
          rating: 10,
          imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co49xr.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'God of War Ragnarök',
          platform: 'PS5',
          genre: 'Ação',
          status: 'playing',
          hoursPlayed: 25,
          rating: 9,
          imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5e3u.jpg',
          createdAt: new Date().toISOString(),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addGame = async (game: Omit<Game, 'id' | 'createdAt'>) => {
    try {
      const newGame: Game = {
        ...game,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      setGames(prev => [...prev, newGame]);
      return newGame;
    } catch (err) {
      setError('Erro ao adicionar jogo');
      console.error('Erro ao adicionar jogo:', err);
      return null;
    }
  };

  const updateGame = async (id: string, updates: Partial<Game>) => {
    try {
      setGames(prev => prev.map(game =>
        game.id === id ? { ...game, ...updates, updatedAt: new Date().toISOString() } : game
      ));
      return games.find(game => game.id === id) || null;
    } catch (err) {
      setError('Erro ao atualizar jogo');
      console.error('Erro ao atualizar jogo:', err);
      return null;
    }
  };

  const deleteGame = async (id: string) => {
    try {
      setGames(prev => prev.filter(game => game.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao deletar jogo');
      console.error('Erro ao deletar jogo:', err);
      return false;
    }
  };

  const getGameById = (id: string) => {
    return games.find(game => game.id === id) || null;
  };

  return {
    games,
    isLoading,
    error,
    addGame,
    updateGame,
    deleteGame,
    getGameById,
    reloadGames: () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    },
  };
}