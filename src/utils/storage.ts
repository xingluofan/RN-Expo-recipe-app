import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Recipe, StorageSchema } from '../types/recipe';
import { Platform } from 'react-native';

const STORAGE_KEY = '@recipe_app';
const IMAGE_DIR = Platform.OS === 'web' ? '' : `${FileSystem.documentDirectory}recipe-images/`;

// 确保图片目录存在
export const ensureImageDir = async () => {
  if (Platform.OS === 'web') return;

  const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
  }
};

// 获取存储数据
export const getStorageData = async (): Promise<StorageSchema> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      recipes: [],
      meta: {
        initialized: false
      }
    };
  } catch (error) {
    console.error('读取存储数据失败:', error);
    throw error;
  }
};

// 保存存储数据
export const setStorageData = async (data: StorageSchema): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('保存存储数据失败:', error);
    throw error;
  }
};

// 获取图片本地路径
export const getImagePath = (filename: string): string => {
  if (Platform.OS === 'web') {
    // Web平台直接返回文件名
    return filename;
  }
  return `${IMAGE_DIR}${filename}`;
};

// 清理未使用的图片
export const cleanupUnusedImages = async (recipes: Recipe[]): Promise<void> => {
  if (Platform.OS === 'web') return;

  try {
    const files = await FileSystem.readDirectoryAsync(IMAGE_DIR);
    const usedImages = new Set(recipes.map(r => r.image.split('/').pop()));
    
    for (const file of files) {
      if (!usedImages.has(file)) {
        await FileSystem.deleteAsync(`${IMAGE_DIR}${file}`);
      }
    }
  } catch (error) {
    console.error('清理未使用图片失败:', error);
  }
};

// 初始化存储
export const initializeStorage = async (): Promise<void> => {
  try {
    await ensureImageDir();
    const data = await getStorageData();
    if (!data.meta.initialized) {
      data.meta.initialized = true;
      await setStorageData(data);
    }
  } catch (error) {
    console.error('初始化存储失败:', error);
    throw error;
  }
};