import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import axios from "../services/axios"
import { BASE_URL } from '../services/config';
const { width } = Dimensions.get('window');




const Slider = ({sliderData}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!sliderData || sliderData.length === 0) return;

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
  }, [currentIndex, sliderData]);

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
          <Image
            source={{ uri: `${BASE_URL}/${item.image}` }}
            style={styles.image}
          />)}
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