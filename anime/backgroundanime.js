import React, { useEffect,useRef } from 'react';
import { Animated, Easing, ImageBackground, Image } from 'react-native';

import backgroundImage from '../assets/images/chiken.png';

export default function BackgroundAnimation()
{
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(translation, {
      toValue: 300,
      duration: 1500,
      useNativeDriver: true,
    })

  const loopedAnimation = Animated.loop(animation);
  loopedAnimation.start();

  return () => loopedAnimation.stop();
    }, [translation]);

  return (
    <Animated.View
      style={{
        transform: [
          { translateX: translation },
        ],
      }} source={backgroundImage}
    >
        <Image style={{width:80, height:80}}source={backgroundImage}/>
    </Animated.View>
  );
}

