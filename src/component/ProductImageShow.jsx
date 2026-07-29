import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const images = [
  require('../../assets/slider/4.webp'),
  require('../../assets/slider/5.webp'),
  require('../../assets/slider/6.webp'),
];

const ProductImageShow = () => {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef(null);

  return (
    <View style={styles.container}>

      {/* Main Product Image */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image
          source={images[1]}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>


      {/* Popup */}
      <Modal
        visible={visible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >

        <View style={styles.modal}>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Icon
              name="close"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>


          {/* Main Slider */}
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
              <Image
                source={item}
                style={styles.popupImage}
                resizeMode="contain"
              />
            )}
          />


          {/* Bottom Thumbnail */}
          <View style={styles.thumbnailContainer}>

            <FlatList
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (

                <TouchableOpacity
                  onPress={() => {
                    setActiveIndex(index);

                    flatListRef.current?.scrollToIndex({
                      index: index,
                      animated: true,
                    });
                  }}
                >

                  <Image
                    source={item}
                    style={[
                      styles.thumbnail,
                      activeIndex === index && styles.activeThumbnail
                    ]}
                  />

                </TouchableOpacity>

              )}
            />

          </View>


        </View>

      </Modal>

    </View>
  );
};

export default ProductImageShow;


const styles = StyleSheet.create({

  container:{
    alignItems:'center',
    justifyContent:'center',
  },

  image:{
    width:width,
    height:300,
  },


  modal:{
    flex:1,
    backgroundColor:'#fff',
    justifyContent:'center',
  },


  closeButton:{
    position:'absolute',
    top:40,
    right:20,
    zIndex:10,
    backgroundColor:'red',
    borderRadius:20,
    padding:5,
  },


  popupImage:{
    width:width,
    height:height*0.75,
  },


  thumbnailContainer:{
    position:'absolute',
    bottom:30,
    width:width,
    alignItems:'center',
  },


  thumbnail:{
    width:50,
    height:50,
    borderRadius:8,
    marginHorizontal:5,
    borderWidth:2,
    borderColor:'#777',
  },


  activeThumbnail:{
    borderColor:'#fff',
    borderWidth:3,
  },

});