import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import axios from '../../services/axios';

const FilteredProducts = ({navigation}) => {
  const route = useRoute();
  const search = route.params?.search ?? "";

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (pageNumber = 1, refresh = false) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.get("/products", {
        params: {
          page: pageNumber,
          query:search,

        },
      });

      let data = res.data.data || [];

      // Local filtering
      if (search.trim()) {
        data = data.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (refresh) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }

      if (res.data.meta) {
        setPage(res.data.meta.current_page);
        setLastPage(res.data.meta.last_page);
      } else {
        setPage(pageNumber);
        setLastPage(pageNumber);
      }

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    fetchProducts(1, true);
  }, [search]);

  const loadMore = () => {
    if (!loading && page < lastPage) {
      fetchProducts(page + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts(1, true);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductShow', {
            id: item.id
        })}>
      <Image
        source={{ uri: item.images?.[0]?.url }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.price}>
          {item.formatted_price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />

      <View style={styles.container}>

        <Text style={styles.heading}>
          Search: {search}
        </Text>

        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color="#0C3F80"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.empty}>
                <Text>No products found.</Text>
              </View>
            )
          }
        />
      </View>
    </>
  );
};

export default FilteredProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    marginTop: 8,
    color: "#0C3F80",
    fontWeight: "700",
  },

  empty: {
    marginTop: 80,
    alignItems: "center",
  },
});