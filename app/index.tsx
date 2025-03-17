import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/recipe';
import { RecipeProvider } from '../contexts/RecipeContext';
import { RecipeList } from '../components/RecipeList';
import { RecipeDetail } from '../components/RecipeDetail';
import { RecipeForm } from '../components/RecipeForm';
import { useRecipes } from '../contexts/RecipeContext';

const HomeScreen = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const { addRecipe, updateRecipe } = useRecipes();

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleAddPress = () => {
    setShowForm(true);
    setEditingRecipe(null);
  };

  const handleEditPress = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
    setSelectedRecipe(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleFormSubmit = async (data: { name: string; image: string; notes?: string }) => {
    if (editingRecipe) {
      await updateRecipe(editingRecipe.id, data);
    } else {
      await addRecipe({
        id: Date.now().toString(),
        name: data.name,
        description: data.notes || '',
        ingredients: [],
        steps: [],
        image: data.image,
        createdAt: new Date().toISOString(),
      });
    }
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <RecipeList onRecipePress={handleRecipePress} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPress}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <Modal
        visible={!!selectedRecipe}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onEdit={handleEditPress}
          />
        )}
      </Modal>

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <RecipeForm
          recipe={editingRecipe || undefined}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <RecipeProvider>
      <HomeScreen />
    </RecipeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});