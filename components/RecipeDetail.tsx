import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/recipe';
import { RecipeImage } from './RecipeImage';
import { useRecipes } from '../contexts/RecipeContext';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onClose,
  onEdit,
}) => {
  const { deleteRecipe } = useRecipes();

  const handleDelete = () => {
    Alert.alert(
      '删除菜谱',
      '确定要删除这个菜谱吗？此操作不可恢复。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
              onClose();
            } catch (error) {
              Alert.alert('错误', '删除菜谱失败');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.imageContainer}>
          <RecipeImage
            uri={recipe.image}
            width={WINDOW_WIDTH}
            height={WINDOW_WIDTH}
            resizeMode="contain"
            enableZoom
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          {recipe.notes && (
            <Text style={styles.notes}>{recipe.notes}</Text>
          )}
          <Text style={styles.date}>
            创建于 {new Date(recipe.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.rightButtons}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => onEdit(recipe)}
          >
            <Ionicons name="pencil" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteButton: {
    backgroundColor: '#fff0f0',
  },
}); 