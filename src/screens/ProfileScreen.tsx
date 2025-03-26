import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useRecipes } from '../context/RecipeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { pickBackupFile, importRecipes } from '../utils/import';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ProfileScreen() {
  const { recipes, refreshRecipes } = useRecipes();

  const handleExport = async () => {
    try {
      const data = {
        recipes,
        meta: {
          exportedAt: new Date().toISOString(),
        },
      };

      const jsonString = JSON.stringify(data, null, 2);
      const filePath = `${FileSystem.documentDirectory}recipe_backup.json`;
      
      await FileSystem.writeAsStringAsync(filePath, jsonString);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      } else {
        Alert.alert('错误', '您的设备不支持分享功能');
      }
    } catch (error) {
      console.error('导出失败:', error);
      Alert.alert('错误', '导出失败，请重试');
    }
  };

  const handleImport = async () => {
    try {
      const data = await pickBackupFile();
      if (!data) return;

      await importRecipes(data);
      await refreshRecipes();
      Alert.alert('成功', '数据导入成功');
    } catch (error) {
      console.error('导入失败:', error);
      Alert.alert('错误', '导入失败，请确保文件格式正确');
    }
  };

  const handleClearData = async () => {
    Alert.alert(
      '确认清除',
      '此操作将清除所有菜谱数据，且无法恢复。是否继续？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确认清除',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(`${FileSystem.documentDirectory}recipe-images/`, { idempotent: true });
              await refreshRecipes();
              Alert.alert('成功', '数据已清除');
            } catch (error) {
              console.error('清除数据失败:', error);
              Alert.alert('错误', '清除数据失败，请重试');
            }
          },
        },
      ]
    );
  };

  return (
    <StyledView className="flex-1 bg-gray-100 p-4">
      <StyledView className="bg-white rounded-lg p-4 mb-4">
        <StyledText className="text-xl font-bold mb-4">数据管理</StyledText>
        <StyledTouchableOpacity
          onPress={handleExport}
          className="bg-blue-500 py-3 px-4 rounded-lg mb-4"
        >
          <StyledText className="text-white text-center text-lg">导出数据</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={handleImport}
          className="bg-green-500 py-3 px-4 rounded-lg mb-4"
        >
          <StyledText className="text-white text-center text-lg">导入数据</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={handleClearData}
          className="bg-red-500 py-3 px-4 rounded-lg"
        >
          <StyledText className="text-white text-center text-lg">清除数据</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <StyledView className="bg-white rounded-lg p-4">
        <StyledText className="text-xl font-bold mb-4">应用信息</StyledText>
        <StyledText className="text-gray-600">当前菜谱数量：{recipes.length}</StyledText>
        <StyledText className="text-gray-600">版本：1.0.0</StyledText>
      </StyledView>
    </StyledView>
  );
} 