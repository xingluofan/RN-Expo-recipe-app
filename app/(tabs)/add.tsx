import { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useRecipes } from '../../contexts/RecipeContext';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddRecipeScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState('');

  const { addRecipe } = useRecipes();

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
      exif: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('请输入菜谱名称');
      return;
    }

    addRecipe({
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      ingredients: ingredients.trim().split('\n'),
      steps: steps.trim().split('\n'),
      image,
      createdAt: new Date().toISOString(),
    });

    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>菜谱名称</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="请输入菜谱名称"
        />

        <Text style={styles.label}>简介</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="请输入菜谱简介"
          multiline
        />

        <Text style={styles.label}>食材（每行一个）</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="例如：\n鸡蛋 2个\n面粉 500g"
          multiline
        />

        <Text style={styles.label}>步骤（每行一个）</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={steps}
          onChangeText={setSteps}
          placeholder="例如：\n1. 将面粉倒入碗中\n2. 加入鸡蛋搅拌"
          multiline
        />

        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Text style={styles.imageButtonText}>
            {image ? '更换图片' : '添加图片'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>保存菜谱</Text>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 