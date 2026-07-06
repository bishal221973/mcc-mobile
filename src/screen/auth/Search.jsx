import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../../component/Header';

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
  const inputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);

      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <>
      <Header />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#7E8896"
          />

          <TextInput
            ref={inputRef}
            autoFocus
            placeholder="Search products, brands and more..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            selectionColor="#0C3F80"
          />

          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color="#7E8896"
            />
          </TouchableOpacity>
        </View>

        {/* Popular Searches */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
        </View>

        <View style={styles.tagContainer}>
          {popularSearches.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.tag}
              activeOpacity={0.7}
              onPress={() => setSearch(item)}
            >
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Searches */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>

          <TouchableOpacity>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentListContainer}>
          {recentSearches.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.recentItem}
              activeOpacity={0.7}
              onPress={() => setSearch(item)}
            >
              <View style={styles.recentLeftRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color="#9CA3AF"
                />

                <Text style={styles.recentText}>
                  {item}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward-outline"
                size={16}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default Search;

const BRAND_PRIMARY = '#0C3F80';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1F2937',
    height: '100%',
  },

  filterButton: {
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  clearAllText: {
    color: BRAND_PRIMARY,
    fontWeight: '600',
    fontSize: 13,
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 28,
  },

  tag: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },

  recentListContainer: {
    marginBottom: 30,
  },

  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  recentLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recentText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#4B5563',
  },
});