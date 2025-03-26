import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { useRecipes } from '../context/RecipeContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

export default function AddRecipeScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const { addRecipe } = useRecipes();

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('请输入菜谱名称');
      return;
    }

    try {
      await addRecipe(name.trim(), notes.trim());
      navigation.goBack();
    } catch (error) {
      console.error('添加菜谱失败:', error);
      alert('添加菜谱失败，请重试');
    }
  };

  return (
    <StyledScrollView className="flex-1 bg-white">
      <StyledView className="p-4">
        <StyledText className="text-lg font-bold mb-2">菜谱名称</StyledText>
        <StyledTextInput
          value={name}
          onChangeText={setName}
          placeholder="请输入菜谱名称（最多30字）"
          maxLength={30}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        />

        <StyledText className="text-lg font-bold mb-2">备注</StyledText>
        <StyledTextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="请输入备注（最多500字）"
          multiline
          numberOfLines={6}
          maxLength={500}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        />

        <StyledTouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-500 py-3 px-4 rounded-lg"
        >
          <StyledText className="text-white text-center text-lg">添加菜谱</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledScrollView>
  );
} 