import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const ProductRender = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item?.product?.product?.images[0]?.small_image_url ?? item?.product?.images[0]?.small_image_url }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.name}>
          {item?.product?.product?.name ?? item?.product?.name}
        </Text>

        <View style={styles.bottomRow}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={styles.price}>{item?.product?.product?.formatted_price ?? item?.product?.formatted_price} </Text>
            <Text style={[styles.price, { color: '#000', fontSize: 13 }]}>X</Text>
            <Text style={[styles.price, { color: '#000', fontSize: 13 }]}>{item.quantity}</Text>
          </View>


        </View>
      </View>
    </View>
  )
}

export default ProductRender

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    // marginHorizontal: 15,
    // marginVertical: 6,
    padding: 12,
    // borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  price: {
    color: '#0C3F80',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
})