import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: WINDOW_WIDTH } = Dimensions.get('window');

interface RecipeImageProps {
  uri?: string;
  width: number;
  height: number;
  resizeMode?: 'cover' | 'contain';
  enableZoom?: boolean;
}

export const RecipeImage: React.FC<RecipeImageProps> = ({
  uri,
  width = WINDOW_WIDTH,
  height = WINDOW_WIDTH,
  resizeMode = 'cover',
  enableZoom = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ImageComponent = enableZoom ? (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <AnimatedImage
        source={{ uri }}
        style={[
          styles.image,
          { width, height },
          imageStyle
        ]}
        contentFit={resizeMode}
        transition={200}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />
    </PinchGestureHandler>
  ) : (
    <Image
      source={{ uri }}
      style={[styles.image, { width, height }]}
      contentFit={resizeMode}
      transition={200}
      onLoadStart={() => setIsLoading(true)}
      onLoad={() => setIsLoading(false)}
    />
  );

  return (
    <View style={[styles.container, { width, height }]}>
      {ImageComponent}
      {isLoading && (
        <View style={[styles.loadingContainer, { width, height }]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.7)',
  },
}); 