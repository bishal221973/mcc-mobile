import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from "../services/axios"
import { BASE_URL } from '../services/config';

const categories1 = [
  {
    id: '1',
    name: 'Concrete',
    image: require('../../assets/categories/1.webp'),
  },
  {
    id: '2',
    name: 'Adhesive',
    image: require('../../assets/categories/2.webp'),
  },
  {
    id: '3',
    name: 'Waterproof',
    image: require('../../assets/categories/3.webp'),
  },
  {
    id: '4',
    name: 'Civil Laboratory Equipment',
    image: require('../../assets/categories/4.webp'),
  },

];

const Categories = ({categoriesList}) => {

  return (
    <View style={styles.container}>
      {/* <Text>{JSON.stringify(categoriesList)}</Text> */}
      <FlatList
        data={categoriesList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.logo_url }}  style={styles.image} />
            </View>

            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
    marginHorizontal: 15,
  },

  item: {
    alignItems: 'center',
    marginRight: 18,
    width: 80,
  },

  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  image: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    borderRadius: 35
  },

  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});