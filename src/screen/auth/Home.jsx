import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from "../../component/Header"
import Slider from "../../component/Slider"
import Categories from "../../component/Categories"
import Products from "../../component/Products"
import Search from "../../component/Search"
import axios from "../../services/axios"
import { useRoute } from '@react-navigation/native';
import HomeSkeletonLoader from "../../component/HomeSkeletonLoader"
const PRIMARY = '#2563EB';

const Home = ({ navigation }) => {

  const [sliderData, setSliderData] = useState([]);
  // const [categoryFilter, setCategoryFilter] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [productCarousels, setProductCarousels] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const route = useRoute();


  const fetchSliders = async () => {
    try {
      const response = await axios.get('/theme/customizations');

      const carousel = response.data.data.find(
        item => item.type === 'image_carousel'
      );

      setSliderData(carousel?.options?.images ?? []);

      const categoryFilters = response.data.data.find(
        item => item.type === 'category_carousel'
      );

      const productCaros = response.data.data.filter(
        item => item.type === 'product_carousel'
      );

      setProductCarousels(productCaros);

      const filters = categoryFilters?.options?.filters;

      if (filters) {
        await fetchCategory(filters);
      }

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  const fetchCategory = async (filters) => {
    try {
      const res = await axios.get("/descendant-categories", {
        params: {
          parent_id: filters.parent_id,
        },
      });


      let categories = res.data.data;


      // =======Asc=======
      if (filters.sort === "asc") {
        categories.sort((a, b) => a.position - b.position);
      } else if (filters.sort === "desc") {
        categories.sort((a, b) => b.position - a.position);
      }

      // Limit
      if (filters.limit) {
        categories = categories.slice(0, Number(filters.limit));
      }

      if (filters.name) {
        categories = categories.filter(
          item => item.name.toLowerCase() === filters.name.toLowerCase()
        );
      }



      setCategoriesList(categories);



    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const loadHome = async () => {
      setLoading(true);

      try {
        await fetchSliders();
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);

    try {
      // setLoading(true);
      await fetchSliders();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
      // setLoading(false);
    }
  };

  if (loading) {
    return (
        <HomeSkeletonLoader/>
    );
}

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      {/* <Text>{JSON.stringify(route.params?.search)}</Text> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Slider sliderData={sliderData} />
        <Search />
        <Categories categoriesList={categoriesList} />

        {/* <Text>{JSON.stringify(productCarousels)}</Text> */}

        {/* horizontal */}
        <FlatList
          data={productCarousels}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={({ item }) => (
            // <Text>{JSON.stringify(item?.options?.filters)} /////</Text>
            <Products title={item?.options?.title} filters={item?.options?.filters} />
          )}
        />
        {/* <Products title="WATERPROOF / CEMENTITIOUS BONDING AGENT PRODUCTS" />
        <Products title="MOUNT DRY MIX PRODUCTS" /> */}
        {/* Welcome Card */}

      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  content: {
    padding: 0,
  },

  welcomeCard: {
    backgroundColor: PRIMARY,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },

  welcome: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#E5E7EB',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 25,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },

  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },

  banner: {
    backgroundColor: PRIMARY,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  bannerText: {
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 15,
  },
});