import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text, View, StyleSheet, Dimensions} from 'react-native';

type SlidingNamesProps = {
  names: string[];
  interval?: number; // en ms
  style?: object;
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const SliderNames: React.FC<SlidingNamesProps> = ({
  names,
  interval = 3000,
  style,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      // Slide from right to center
      translateX.setValue(SCREEN_WIDTH);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Après affichage, on prépare la prochaine valeur
        setTimeout(() => {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % names.length);
          });
        }, interval - 1000); // laisse un moment avant de sortir
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval, names.length, translateX]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={{transform: [{translateX}]}}>
        <Text style={styles.text}>{names[currentIndex]}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    color: 'white',
  },
});

export default SliderNames;
