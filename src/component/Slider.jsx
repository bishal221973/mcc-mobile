import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';

import { BASE_URL } from '../services/config';

const { width } = Dimensions.get('window');

const Slider = ({ sliderData = [] }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when slider data changes
  useEffect(() => {
    if (sliderData.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= sliderData.length) {
      setCurrentIndex(0);

      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: false,
        });
      }, 100);
    }
  }, [sliderData.length]);

  // Auto slide
  useEffect(() => {
    if (sliderData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex =
          prevIndex >= sliderData.length - 1
            ? 0
            : prevIndex + 1;

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderData.length]);

  if (!sliderData || sliderData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) =>
          item?.id?.toString() || index.toString()
        }
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );

          // Make sure index is valid
          if (index >= 0 && index < sliderData.length) {
            setCurrentIndex(index);
          }
        }}
        onScrollToIndexFailed={info => {
          // Fallback if FlatList hasn't measured the item yet
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: Math.min(
                info.index,
                sliderData.length - 1
              ),
              animated: true,
            });
          }, 100);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{
                uri: `${BASE_URL}/${item.image}`,
              }}
              style={styles.image}
            />
          </View>
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

  slide: {
    width: width,
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