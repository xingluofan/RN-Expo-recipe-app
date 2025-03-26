import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import * as storage from '../utils/storage';
import * as imageUtils from '../utils/image';
import { Platform } from 'react-native';

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  addRecipe: (name: string, notes?: string) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  refreshRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRecipes = async () => {
    try {
      setLoading(true);
      const data = await storage.getStorageData();
      setRecipes(data.recipes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载菜谱失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRecipes();
  }, []);

  const addRecipe = async (name: string, notes?: string) => {
    try {
      const imageUri = await imageUtils.pickImage();
      if (!imageUri) return;

      let finalUri = imageUri;
      if (Platform.OS !== 'web') {
        finalUri = await imageUtils.compressImage(imageUri);
      }

      const filename = await imageUtils.saveImageToLocal(finalUri);

      const newRecipe: Recipe = {
        id: crypto.randomUUID(),
        name: name.trim(),
        image: filename,
        notes,
        createdAt: new Date().toISOString()
      };

      const data = await storage.getStorageData();
      data.recipes.push(newRecipe);
      await storage.setStorageData(data);
      await refreshRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加菜谱失败');
      throw err;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        await imageUtils.deleteLocalImage(recipe.image);
      }

      const data = await storage.getStorageData();
      data.recipes = data.recipes.filter(r => r.id !== id);
      await storage.setStorageData(data);
      await refreshRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除菜谱失败');
      throw err;
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      const data = await storage.getStorageData();
      const index = data.recipes.findIndex(r => r.id === id);
      if (index === -1) throw new Error('菜谱不存在');

      data.recipes[index] = { ...data.recipes[index], ...updates };
      await storage.setStorageData(data);
      await refreshRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新菜谱失败');
      throw err;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        addRecipe,
        deleteRecipe,
        updateRecipe,
        refreshRecipes
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};