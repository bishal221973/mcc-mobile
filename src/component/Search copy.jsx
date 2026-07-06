import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const recentSearches = [
  'iPhone',
  'Shoes',
  'Headphones',
  'Laptop',
];

const popularSearches = [
  'Electronics',
  'Fashion',
  'Watch',
  'Gaming',
  'Smart TV',
  'Mobile',
  'Beauty',
  'Furniture',
];

const Search = () => {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color="#777" />

        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          placeholderTextColor="#999"
          returnKeyType="search"
        />

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      <Text style={styles.sectionTitle}>Recent Searches</Text>

      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recentItem}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.recentText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Popular Searches */}
      <Text style={styles.sectionTitle}>Popular Searches</Text>

      <View style={styles.tagContainer}>
        {popularSearches.map((item) => (
          <TouchableOpacity key={item} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Search;

const PRIMARY = '#2563EB';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 3,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    fontSize: 16,
    color: '#111',
  },

  filterButton: {
    paddingLeft: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 10,
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },

  recentText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#374151',
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  tag: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },

  tagText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },
});