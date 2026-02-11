import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';

interface Props {
  delay: number;
  color: string;
}

const RadarCircle = ({delay, color}: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withDelay(
        delay, // Remplacez 'delay' par votre valeur numérique en millisecondes
        withTiming(1, {duration: 3000}),
      ),
      -1, // Répète indéfiniment
      false, // Pas de boucle inversée
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.5, 2], 'clamp');
    const opacity = interpolate(progress.value, [0, 1], [0.5, 0], 'clamp');

    return {
      transform: [{scale}],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.circle, {backgroundColor: color}, animatedStyle]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});

export default RadarCircle;
