import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { useRecipes } from '../context/RecipeContext';
import { getImagePath } from '../utils/storage';
import { Recipe } from '../types/recipe';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledTextInput = styled(TextInput);

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 48) / 2; // 考虑左右边距16，中间间距16
const cardImageHeight = (cardWidth * 240) / 342; // 保持342:240的比例

type RootStackParamList = {
  MenuList: undefined;
  RecipeDetail: { recipe: Recipe };
  AddRecipe: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RecipeCard = ({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) => (
  <StyledTouchableOpacity 
    onPress={onPress} 
    className="overflow-hidden"
    style={styles.card}
  >
    <StyledImage
      source={recipe.image ? { uri: getImagePath(recipe.image) } : require('../../assets/default.png')}
      style={styles.cardImage}
      resizeMode="cover"
      defaultSource={require('../../assets/default.png')}
    />
    <StyledView className="p-2">
      <StyledText 
        className="font-bold text-base" 
        numberOfLines={1}
      >
        {recipe.name}
      </StyledText>
      <StyledText 
        className="text-gray-500 text-sm mt-1" 
        numberOfLines={1}
      >
        {recipe.notes || '暂无描述'}
      </StyledText>
    </StyledView>
  </StyledTouchableOpacity>
);

export default function MenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { recipes, loading, error, refreshRecipes } = useRecipes();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleAddPress}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>添加</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail', { recipe });
  };

  const handleAddPress = () => {
    navigation.navigate('AddRecipe');
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (recipe.notes && recipe.notes.toLowerCase().includes(searchText.toLowerCase()))
  );

  if (error) {
    return (
      <StyledView className="flex-1 items-center justify-center bg-white">
        <StyledText className="text-red-500">{error}</StyledText>
      </StyledView>
    );
  }

  const renderItem = ({ item, index }: { item: Recipe; index: number }) => (
    <View style={[
      styles.cardContainer,
      index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }
    ]}>
      <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
    </View>
  );

  return (
    <StyledView className="flex-1 bg-gray-100">
      <StyledView className="px-4 py-2 bg-white">
        <StyledView className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
          <StyledText className="text-gray-400 mr-2">🔍</StyledText>
          <StyledTextInput
            placeholder="搜索菜品"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-base"
          />
        </StyledView>
      </StyledView>

      <FlatList
        data={filteredRecipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <StyledView className="flex-1 items-center justify-center py-8">
            <StyledText className="text-gray-500 text-lg mb-4">
              {searchText ? '未找到相关菜品' : '暂无菜谱'}
            </StyledText>
          </StyledView>
        }
      />
    </StyledView>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 16,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContainer: {
    flex: 1,
    maxWidth: cardWidth,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: cardImageHeight,
    backgroundColor: '#f0f0f0',
  },
}); 