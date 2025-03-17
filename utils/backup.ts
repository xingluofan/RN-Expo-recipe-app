import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Share } from 'react-native';
import { STORAGE_KEY, IMAGE_DIR } from '../types/recipe';

// 将图片转换为Base64
const imageToBase64 = async (path: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('图片转Base64失败:', error);
    throw error;
  }
};

// 将Base64转换为图片文件
const base64ToImage = async (base64: string, fileName: string): Promise<string> => {
  try {
    const imageDir = `${FileSystem.documentDirectory}${IMAGE_DIR}`;
    const filePath = `${imageDir}/${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return filePath;
  } catch (error) {
    console.error('Base64转图片失败:', error);
    throw error;
  }
};

// 导出数据
export const exportData = async (): Promise<void> => {
  try {
    // 获取存储数据
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) throw new Error('没有可导出的数据');
    
    const storage = JSON.parse(data);
    const exportData = { ...storage };
    
    // 转换图片为Base64
    for (let i = 0; i < exportData.recipes.length; i++) {
      const recipe = exportData.recipes[i];
      if (recipe.image) {
        const base64 = await imageToBase64(recipe.image);
        exportData.recipes[i] = {
          ...recipe,
          image: `data:image/jpeg;base64,${base64}`
        };
      }
    }
    
    // 生成导出文件
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `RecipeBackup_${timestamp}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(exportData, null, 2));
    
    // 分享文件
    if (Platform.OS === 'ios') {
      await Share.share({ url: filePath });
    } else {
      const androidPath = `file://${filePath}`;
      await Share.share({ url: androidPath });
    }
  } catch (error) {
    console.error('导出数据失败:', error);
    throw error;
  }
};

// 导入数据
export const importData = async (fileUri: string): Promise<void> => {
  try {
    // 读取备份文件
    const content = await FileSystem.readAsStringAsync(fileUri);
    const importData = JSON.parse(content);
    
    // 验证数据格式
    if (!importData.recipes || !Array.isArray(importData.recipes)) {
      throw new Error('无效的备份文件格式');
    }
    
    // 确保图片目录存在
    const imageDir = `${FileSystem.documentDirectory}${IMAGE_DIR}`;
    const dirInfo = await FileSystem.getInfoAsync(imageDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true });
    }
    
    // 转换Base64图片为文件
    for (let i = 0; i < importData.recipes.length; i++) {
      const recipe = importData.recipes[i];
      if (recipe.image && recipe.image.startsWith('data:image/jpeg;base64,')) {
        const base64 = recipe.image.split('base64,')[1];
        const fileName = `${recipe.id}.jpg`;
        const filePath = await base64ToImage(base64, fileName);
        importData.recipes[i] = {
          ...recipe,
          image: filePath
        };
      }
    }
    
    // 更新存储数据
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...importData,
      meta: {
        ...importData.meta,
        lastBackupTime: new Date().toISOString()
      }
    }));
  } catch (error) {
    console.error('导入数据失败:', error);
    throw error;
  }
}; 