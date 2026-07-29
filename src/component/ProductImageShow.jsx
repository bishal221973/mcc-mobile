import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');

// Fallback placeholder image URL if none exists
const PLACEHOLDER_IMG = 'https://placeholder.com';

const ProductImageShow = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Fallback safely to empty array if undefined
  const images = product?.images || [];

  return (
    <View style={styles.container}>
      {/* Main Slider Section */}
      {images.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.slideItem}>
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
        />
      ) : (
        <View style={styles.slideItem}>
          <Image
            source={{ uri: PLACEHOLDER_IMG }}
            style={styles.image}
            resizeMode="cover"
            />
        </View>
      )}

      {/* Modern Dynamic Inline Dot Indicators */}
      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ProductImageShow;

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  slideItem: {
    width: width,
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 24, // Floats cleanly over the bottom of the image area
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  activeDot: {
    width: 20, // Expanded pill style for the current selected slide
    backgroundColor: '#007AFF',
  },
});
