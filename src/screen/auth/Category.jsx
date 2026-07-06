import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Categories from '../../component/Categories';
import Header from '../../component/Header';

const Category = () => {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <>
      <Header />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#7E8896"
          />

          <TextInput
            ref={inputRef}
            placeholder="Search categories"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
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

        <Categories />
      </ScrollView>
    </>
  );
};

export default Category;

// Replaced generic hex colors with explicit variables matching your brand identity
const BRAND_PRIMARY = '#0C3F80';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Bagisto uses clean white surfaces
        padding: 16,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Off-white modern input backdrop
        borderRadius: 8, // Sharp, professional premium curvature
        paddingHorizontal: 16,
        height: 48,
        marginBottom: 24,
    },

    input: {
        flex: 1,
        height: '100%',
        marginLeft: 12,
        fontSize: 15,
        color: '#1F2937',
    },

    filterButton: {
        paddingLeft: 12,
        borderLeftWidth: 1,
        borderLeftColor: '#E5E7EB', // Separator block line
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
        letterSpacing: 0.3,
    },

    clearAllText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },

    recentListContainer: {
        marginBottom: 24,
    },

    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // Clean bordered separator rows
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

    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },

    tag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6, // Square block style tags matching web marketplace layouts
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    tagText: {
        color: '#374151',
        fontWeight: '500',
        fontSize: 13,
    },

    categoriesWrapper: {
        marginTop: 8,
        marginBottom: 40,
    }
});
