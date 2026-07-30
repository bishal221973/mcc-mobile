import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import axios from '../../services/axios';
import { useNavigation } from '@react-navigation/native';

const PRIMARY = '#0C3F80';

const Category = () => {
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/categories",{
        params:{
          limit:50
        }
      });

      const sortedCategories = (res.data.data || []).sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );

      setCategories(sortedCategories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategory();
  }, []);

  const filteredCategories = categories.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('AllProduct', {
          categoryId: item.id,
        })
      }
    >
      {item.logo_url ? (
        <Image
          source={{ uri: item.logo_url }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons
            name="grid-outline"
            size={45}
            color={PRIMARY}
          />
        </View>
      )}

      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />

      <View style={styles.container}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#7E8896"
          />

          <TextInput
            placeholder="Search categories..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Categories */}
        {/* <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Ionicons
                name="folder-open-outline"
                size={60}
                color="#D1D5DB"
              />

              <Text style={styles.emptyTitle}>
                No Categories Found
              </Text>
            </View>
          )}
        />
         */}
        <FlatList
          data={filteredCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="large" color={PRIMARY} />
            ) : null
          }
        />
      </View>
    </>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  image: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 12,
    borderRadius:50
  },

  placeholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  empty: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
});