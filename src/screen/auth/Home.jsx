import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from "../../component/Header"
import Slider from "../../component/Slider"
import Categories from "../../component/Categories"
import Products from "../../component/Products"
import Search from "../../component/Search"
const PRIMARY = '#2563EB';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        <Slider/>
        <Search/>
        <Categories/>
        <Products title="CONCRETE PRODUCTS"/>
        <Products title="WATERPROOF / CEMENTITIOUS BONDING AGENT PRODUCTS"/>
        <Products title="MOUNT DRY MIX PRODUCTS"/>
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