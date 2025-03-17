import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  createdAt: string;
}

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  clearAllRecipes: () => void;
  refreshRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshRecipes = async () => {
    setLoading(true);
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRecipes();
  }, []);

  const saveRecipes = async (newRecipes: Recipe[]) => {
    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(newRecipes));
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  };

  const addRecipe = (recipe: Recipe) => {
    const newRecipes = [...recipes, recipe];
    setRecipes(newRecipes);
    saveRecipes(newRecipes);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    const newRecipes = recipes.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    );
    setRecipes(newRecipes);
    saveRecipes(newRecipes);
  };

  const deleteRecipe = (id: string) => {
    const newRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(newRecipes);
    saveRecipes(newRecipes);
  };

  const clearAllRecipes = () => {
    setRecipes([]);
    saveRecipes([]);
  };

  return (
    <RecipeContext.Provider value={{ 
      recipes, 
      loading,
      addRecipe, 
      updateRecipe,
      deleteRecipe, 
      clearAllRecipes,
      refreshRecipes 
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
} 