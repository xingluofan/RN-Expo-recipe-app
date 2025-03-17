import React from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useRecipes } from '../contexts/RecipeContext';
import { RecipeImage } from './RecipeImage';
import { Recipe } from '../types/recipe';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (WINDOW_WIDTH - CARD_MARGIN * 3) / 2;

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(recipe)}
      activeOpacity={0.7}
    >
      <RecipeImage
        uri={recipe.image}
        width={CARD_WIDTH - CARD_MARGIN * 2}
        height={CARD_WIDTH - CARD_MARGIN * 2}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>
        {recipe.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {recipe.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface RecipeListProps {
  onRecipePress: (recipe: Recipe) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ onRecipePress }) => {
  const { recipes, loading, refreshRecipes } = useRecipes();

  const renderItem = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={onRecipePress} />
  );

  if (recipes.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>还没有添加任何菜谱</Text>
        <Text style={styles.emptySubText}>点击右上角的"+"按钮开始添加吧！</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshRecipes} />
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: CARD_MARGIN,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: CARD_MARGIN * 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: CARD_MARGIN,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
}); 