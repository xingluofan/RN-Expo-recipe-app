import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from 'react-native';
import { useRecipes } from '../../contexts/RecipeContext';
import { Link } from 'expo-router';

export default function RecipeListScreen() {
  const { recipes } = useRecipes();

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>还没有添加任何菜谱</Text>
          <Link href="/add" style={styles.addButton}>
            <Text style={styles.addButtonText}>添加菜谱</Text>
          </Link>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/recipe/${item.id}`} style={styles.recipeItem}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  recipeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
});
