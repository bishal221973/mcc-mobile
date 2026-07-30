import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../../services/axios"
import Header from '../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


// const recentSearches = [
//   'iPhone',
//   'Shoes',
//   'Headphones',
//   'Laptop',
// ];

const Search = () => {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);

      return () => clearTimeout(timer);
    }, [])
  );


  // ==============================================


  const [recentSearches, setRecentSearches] = useState([]);

  const loadRecentSearches = async () => {
    try {
      const data = await AsyncStorage.getItem('recent_searches');

      if (data) {
        const searches = JSON.parse(data);

        setRecentSearches(
          Array.isArray(searches) ? searches.slice(0, 10) : []
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRecentSearches();
    // fetchProducts();
  }, []);

  const saveRecentSearch = async (text) => {
    if (!text.trim()) return;

    try {
      let searches = [...recentSearches];

      // Add newest search at the top
      searches.unshift(text);

      // Keep only the latest 10 searches
      searches = searches.slice(0, 10);

      setRecentSearches(searches);

      await AsyncStorage.setItem(
        'recent_searches',
        JSON.stringify(searches)
      );
    } catch (error) {
      console.log(error);
    }
  };


  const filter = () => {
    const text = search.trim();

    if (!text) return;

    saveRecentSearch(text);

    navigation.navigate("FilteredProducts", {
      search: text,
    });

    setSearch("");
  };
  

  const groupedRecentSearches = recentSearches.reduce((acc, text) => {
    const existing = acc.find(
      item => item.text.toLowerCase() === text.toLowerCase()
    );

    if (existing) {
      existing.count += 1;
    } else {
      acc.push({
        text,
        count: 1,
      });
    }

    return acc;
  }, []);

  const clearRecentSearch = () => {
    Alert.alert(
      "Clear Recent Searches",
      "Are you sure you want to clear all recent searches?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("recent_searches");
              setRecentSearches([]);
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <Header />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* <Text>{JSON.stringify(products)}</Text> */}
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          {/* <Ionicons
            name="search-outline"
            size={20}
            color="#7E8896"
          /> */}

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
            onSubmitEditing={filter}
          />

          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.7}
            onPress={() => filter()}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color="#7E8896"
            />
          </TouchableOpacity>
        </View>

        {/* Popular Searches */}
        {/* <View style={styles.sectionHeader}>
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
        </View> */}

        {/* Recent Searches */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>

          <TouchableOpacity onPress={clearRecentSearch}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.recentListContainer}>
          {groupedRecentSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              activeOpacity={0.7}
              onPress={() => setSearch(item.text)}
            >
              <View style={styles.recentLeftRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color="#9CA3AF"
                />

                <Text style={styles.recentText}>
                  {item.text}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {item.count > 1 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>
                      {item.count}
                    </Text>
                  </View>
                )}

                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color="#D1D5DB"
                  style={{ marginLeft: 10 }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={styles.recentListContainer}>
          {groupedRecentSearches.length > 0 ? (
            groupedRecentSearches.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                activeOpacity={0.7}
                onPress={() => setSearch(item.text)}
              >
                <View style={styles.recentLeftRow}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#9CA3AF"
                  />

                  <Text style={styles.recentText}>
                    {item.text}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.count > 1 && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>
                        {item.count}
                      </Text>
                    </View>
                  )}

                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#D1D5DB"
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="search-outline"
                size={60}
                color="#D1D5DB"
              />

              <Text style={styles.emptyTitle}>
                No Recent Searches
              </Text>

              <Text style={styles.emptySubtitle}>
                Your recent searches will appear here.
              </Text>
            </View>
          )}
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});