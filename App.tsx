import React, { useEffect } from 'react';
import { RecipeProvider } from './src/context/RecipeContext';
import { initializeStorage } from './src/utils/storage';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { styled } from 'nativewind';

// 启用原生屏幕优化
enableScreens(true);

const StyledGestureHandlerRootView = styled(GestureHandlerRootView);

export default function App() {
  useEffect(() => {
    initializeStorage().catch(console.error);
  }, []);

  return (
    <StyledGestureHandlerRootView className="flex-1">
      <RecipeProvider>
        <BottomTabNavigator />
      </RecipeProvider>
    </StyledGestureHandlerRootView>
  );
} 