import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Recipe } from '../types/recipe';

interface ImportData {
  recipes: Recipe[];
  meta: {
    exportedAt: string;
  };
}

export const pickBackupFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
    });

    if (result.canceled) {
      return null;
    }

    const file = result.assets[0];
    const content = await FileSystem.readAsStringAsync(file.uri);
    const data = JSON.parse(content) as ImportData;

    // 验证数据结构
    if (!Array.isArray(data.recipes)) {
      throw new Error('无效的数据格式');
    }

    return data;
  } catch (error) {
    console.error('导入文件失败:', error);
    throw error;
  }
};

export const importRecipes = async (data: ImportData): Promise<void> => {
  try {
    // 确保图片目录存在
    const imageDir = `${FileSystem.documentDirectory}recipe-images/`;
    const dirInfo = await FileSystem.getInfoAsync(imageDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true });
    }

    // 保存数据
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}recipe_data.json`,
      JSON.stringify(data)
    );

    return;
  } catch (error) {
    console.error('导入数据失败:', error);
    throw error;
  }
}; 