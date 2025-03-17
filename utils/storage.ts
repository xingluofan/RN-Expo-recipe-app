import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { Recipe, StorageSchema, STORAGE_KEY, IMAGE_DIR } from '../types/recipe';

// 确保图片目录存在
const ensureImageDir = async () => {
  const imageDir = `${FileSystem.documentDirectory}${IMAGE_DIR}`;
  const dirInfo = await FileSystem.getInfoAsync(imageDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true });
  }
  return imageDir;
};

// 初始化存储
export const initializeStorage = async (): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      const initialData: StorageSchema = {
        recipes: [],
        meta: {
          initialized: true,
          lastBackupTime: new Date().toISOString()
        }
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
    await ensureImageDir();
  } catch (error) {
    console.error('初始化存储失败:', error);
    throw error;
  }
};

// 获取所有菜谱
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const storage: StorageSchema = JSON.parse(data);
    return storage.recipes;
  } catch (error) {
    console.error('获取菜谱失败:', error);
    throw error;
  }
};

// 保存菜谱
export const saveRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> => {
  try {
    const newRecipe: Recipe = {
      ...recipe,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };

    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const storage: StorageSchema = data ? JSON.parse(data) : { recipes: [], meta: { initialized: true } };
    
    storage.recipes.push(newRecipe);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    
    return newRecipe;
  } catch (error) {
    console.error('保存菜谱失败:', error);
    throw error;
  }
};

// 删除菜谱
export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return;

    const storage: StorageSchema = JSON.parse(data);
    const recipe = storage.recipes.find(r => r.id === id);
    
    if (recipe?.image) {
      try {
        await FileSystem.deleteAsync(recipe.image);
      } catch (error) {
        console.warn('删除图片文件失败:', error);
      }
    }

    storage.recipes = storage.recipes.filter(r => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('删除菜谱失败:', error);
    throw error;
  }
};

// 更新菜谱
export const updateRecipe = async (id: string, updates: Partial<Recipe>): Promise<Recipe> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) throw new Error('未找到存储数据');

    const storage: StorageSchema = JSON.parse(data);
    const index = storage.recipes.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('未找到要更新的菜谱');
    
    storage.recipes[index] = {
      ...storage.recipes[index],
      ...updates
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    return storage.recipes[index];
  } catch (error) {
    console.error('更新菜谱失败:', error);
    throw error;
  }
};

// 获取图片存储路径
export const getImagePath = async (fileName: string): Promise<string> => {
  const imageDir = await ensureImageDir();
  return `${imageDir}/${fileName}`;
}; 