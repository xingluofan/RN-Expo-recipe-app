import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';
import { IMAGE_DIR, THUMBNAIL_SIZE, FULL_IMAGE_SIZE, IMAGE_QUALITY } from '../types/recipe';
import { getImagePath } from './storage';

// 请求相机和相册权限
export const requestMediaPermissions = async () => {
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  return {
    cameraGranted: cameraPermission.granted,
    libraryGranted: libraryPermission.granted
  };
};

// 压缩图片
export const compressImage = async (uri: string, size: number = FULL_IMAGE_SIZE): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: size, height: size } }],
      {
        compress: IMAGE_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG
      }
    );
    return result.uri;
  } catch (error) {
    console.error('图片压缩失败:', error);
    throw error;
  }
};

// 保存图片到应用目录
export const saveImage = async (uri: string): Promise<string> => {
  try {
    const fileName = `${uuidv4()}.jpg`;
    const destinationPath = await getImagePath(fileName);
    
    await FileSystem.copyAsync({
      from: uri,
      to: destinationPath
    });
    
    return destinationPath;
  } catch (error) {
    console.error('保存图片失败:', error);
    throw error;
  }
};

// 从相机拍摄图片
export const takePhoto = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled && result.assets[0]) {
      const compressed = await compressImage(result.assets[0].uri);
      return await saveImage(compressed);
    }
    return null;
  } catch (error) {
    console.error('拍照失败:', error);
    throw error;
  }
};

// 从相册选择图片
export const pickImage = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled && result.assets[0]) {
      const compressed = await compressImage(result.assets[0].uri);
      return await saveImage(compressed);
    }
    return null;
  } catch (error) {
    console.error('选择图片失败:', error);
    throw error;
  }
};

// 生成缩略图
export const generateThumbnail = async (uri: string): Promise<string> => {
  try {
    return await compressImage(uri, THUMBNAIL_SIZE);
  } catch (error) {
    console.error('生成缩略图失败:', error);
    throw error;
  }
};

// 获取图片本地URI
export const getLocalImageUri = (path: string): string => {
  return Platform.OS === 'android' ? `file://${path}` : path;
}; 