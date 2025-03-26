import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MenuStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MenuList" 
        component={MenuScreen}
        options={{
          title: '菜单列表',
        }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={{
          title: '菜谱详情',
        }}
      />
      <Stack.Screen 
        name="AddRecipe" 
        component={AddRecipeScreen}
        options={{
          title: '新增菜谱',
        }}
      />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: '首页',
          }}
        />
        <Tab.Screen 
          name="Menu" 
          component={MenuStack}
          options={{
            title: '菜单',
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            title: '个人中心',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 