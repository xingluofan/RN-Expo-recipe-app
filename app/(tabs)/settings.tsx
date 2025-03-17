import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native';
import { useRecipes } from '../../contexts/RecipeContext';

export default function SettingsScreen() {
  const { clearAllRecipes } = useRecipes();

  const handleClearAll = () => {
    Alert.alert(
      '确认删除',
      '确定要删除所有菜谱吗？此操作不可恢复。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => clearAllRecipes(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClearAll}>
        <Text style={styles.buttonText}>删除所有菜谱</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.version}>版本: 1.0.0</Text>
        <Text style={styles.copyright}>© 2024 我的菜谱 App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
  },
}); 