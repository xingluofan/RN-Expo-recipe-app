import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useRecipes } from '../context/RecipeContext';
import { getImagePath } from '../utils/storage';
import { Recipe } from '../types/recipe';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

export default function RecipeDetailScreen({ route, navigation }: any) {
  const { recipe }: { recipe: Recipe } = route.params;
  const { deleteRecipe } = useRecipes();

  const handleDelete = async () => {
    try {
      await deleteRecipe(recipe.id);
      navigation.goBack();
    } catch (error) {
      console.error('删除菜谱失败:', error);
    }
  };

  return (
    <StyledScrollView className="flex-1 bg-white">
      <StyledImage
        source={{ uri: getImagePath(recipe.image) }}
        className="w-full h-64"
        resizeMode="cover"
      />
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold mb-2">{recipe.name}</StyledText>
        {recipe.notes && (
          <StyledText className="text-gray-600 mb-4 whitespace-pre-wrap">
            {recipe.notes}
          </StyledText>
        )}
        <StyledTouchableOpacity
          onPress={handleDelete}
          className="bg-red-500 py-2 px-4 rounded-lg"
        >
          <StyledText className="text-white text-center">删除菜谱</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledScrollView>
  );
} 