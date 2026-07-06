import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const sliderData = [
  {
    id: '1',
    image: require('../../assets/slider/1.webp'),
  },
  {
    id: '2',
    image: require('../../assets/slider/2.webp'),
  },
  {
    id: '3',
    image: require('../../assets/slider/3.webp'),
  },
  {
    id: '4',
    image: require('../../assets/slider/4.webp'),
  },
  {
    id: '5',
    image: require('../../assets/slider/5.webp'),
  },
  {
    id: '6',
    image: require('../../assets/slider/6.webp'),
  },
  
];

const Slider = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === sliderData.length - 1 ? 0 : currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <Image source={item.image} style={styles.image} />
        )}
      />

      <View style={styles.pagination}>
        {sliderData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },

  image: {
    width: width - 30,
    height: 180,
    marginHorizontal: 15,
    borderRadius: 15,
    resizeMode: 'cover',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 20,
    backgroundColor: '#0C3F80',
  },
});