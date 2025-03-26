import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';

// 动态导入 ImageManipulator
let ImageManipulator: any;
if (Platform.OS !== 'web') {
  ImageManipulator = require('expo-image-manipulator');
}

// 请求图片选择权限
export const requestImagePermission = async () => {
  if (Platform.OS === 'web') return;
  
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('需要相册权限才能选择图片');
  }
};

// 选择图片
export const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: Platform.OS === 'web' ? 1 : 0.6,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
};

// 压缩图片
export const compressImage = async (uri: string) => {
  if (Platform.OS === 'web') {
    return uri;
  }

  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800, height: 800 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('图片压缩失败:', error);
    return uri;
  }
};

// 保存图片到本地
export const saveImageToLocal = async (uri: string): Promise<string> => {
  const filename = `${uuidv4()}.jpg`;
  
  if (Platform.OS === 'web') {
    // Web平台直接返回文件名
    return filename;
  }

  const destination = `${FileSystem.documentDirectory}recipe-images/${filename}`;
  try {
    await FileSystem.copyAsync({
      from: uri,
      to: destination
    });
    return filename;
  } catch (error) {
    console.error('保存图片失败:', error);
    throw error;
  }
};

// 删除本地图片
export const deleteLocalImage = async (filename: string) => {
  if (Platform.OS === 'web') {
    return;
  }

  const path = `${FileSystem.documentDirectory}recipe-images/${filename}`;
  try {
    await FileSystem.deleteAsync(path);
  } catch (error) {
    console.error('删除图片失败:', error);
  }
}; 