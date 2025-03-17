import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/recipe';
import { RecipeImage } from './RecipeImage';
import * as imageUtils from '../utils/imageUtils';
import { MAX_NAME_LENGTH, MAX_NOTES_LENGTH } from '../types/recipe';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: { name: string; image: string; notes?: string }) => Promise<void>;
  onClose: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  recipe,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState(recipe?.name || '');
  const [image, setImage] = useState(recipe?.image || '');
  const [notes, setNotes] = useState(recipe?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      const { libraryGranted } = await imageUtils.requestMediaPermissions();
      if (!libraryGranted) {
        Alert.alert('权限错误', '需要相册访问权限才能选择图片');
        return;
      }

      const result = await imageUtils.pickImage();
      if (result) {
        setImage(result);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片失败');
    }
  };

  const handleCamera = async () => {
    try {
      const { cameraGranted } = await imageUtils.requestMediaPermissions();
      if (!cameraGranted) {
        Alert.alert('权限错误', '需要相机权限才能拍照');
        return;
      }

      const result = await imageUtils.takePhoto();
      if (result) {
        setImage(result);
      }
    } catch (error) {
      Alert.alert('错误', '拍照失败');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('错误', '请输入菜谱名称');
      return;
    }

    if (!image) {
      Alert.alert('错误', '请添加菜谱图片');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        name: name.trim(),
        image,
        notes: notes.trim(),
      });
      onClose();
    } catch (error) {
      Alert.alert('错误', '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView bounces={false}>
        <View style={styles.imageContainer}>
          {image ? (
            <RecipeImage
              uri={image}
              width={300}
              height={300}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>添加图片</Text>
            </View>
          )}
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[styles.imageButton, styles.cameraButton]}
              onPress={handleCamera}
            >
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.imageButton, styles.galleryButton]}
              onPress={handleImagePick}
            >
              <Ionicons name="images" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>名称</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="请输入菜谱名称"
              maxLength={MAX_NAME_LENGTH}
            />
            <Text style={styles.counter}>
              {name.length}/{MAX_NAME_LENGTH}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>备注</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="添加备注信息（可选）"
              multiline
              maxLength={MAX_NOTES_LENGTH}
            />
            <Text style={styles.counter}>
              {notes.length}/{MAX_NOTES_LENGTH}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
          disabled={loading}
        >
          <Text style={styles.buttonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.submitButtonText]}>
            {loading ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f8f8',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#999',
  },
  imageButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
  },
  imageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  galleryButton: {
    backgroundColor: '#5856D6',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: 'white',
  },
}); 