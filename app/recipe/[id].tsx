import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native';
import { useRecipes } from '../../contexts/RecipeContext';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const { recipes, deleteRecipe } = useRecipes();
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>未找到该菜谱</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这个菜谱吗？此操作不可恢复。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteRecipe(recipe.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        <Text style={styles.sectionTitle}>食材</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.listItem}>
            • {ingredient}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>步骤</Text>
        {recipe.steps.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            {index + 1}. {step}
          </Text>
        ))}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <FontAwesome name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>删除菜谱</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 