import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Pdf = ({ product }) => {
  const downloadFile = async (url) => {
    try {
      await Linking.openURL("https://mccnp.com/storage/"+url);
    } catch (error) {
      console.log('Unable to open PDF:', error);
    }
  };

  const getFileName = (url, index) => {
    if (!url) return `Document ${index + 1}`;

    const fileName = url.split('/').pop()?.split('?')[0];

    return fileName || `Document ${index + 1}`;
  };

  if (!product?.pdfs?.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Documents</Text>

      {product.pdfs.map((pdf, index) => (
        <TouchableOpacity
          key={index}
          style={styles.pdfCard}
          onPress={() => downloadFile(pdf)}
          activeOpacity={0.75}
        >
          {/* PDF Icon */}
          <View style={styles.iconContainer}>
            <Icon
              name="file-pdf-box"
              size={32}
              color="#E53935"
            />
          </View>

          {/* File Information */}
          <View style={styles.pdfInfo}>
            <Text
              style={styles.pdfName}
              numberOfLines={1}
            >
              {getFileName(pdf, index)}
            </Text>

            <Text style={styles.pdfSubtitle}>
              PDF Document
            </Text>
          </View>

          {/* Download Button */}
          <View style={styles.downloadButton}>
            <Icon
              name="download"
              size={20}
              color="#E53935"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Pdf;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 12,
  },

  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',

    borderRadius: 16,
    padding: 12,

    marginBottom: 10,

    borderWidth: 1,
    borderColor: '#EEEEEE',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,

    backgroundColor: '#FFF1F1',

    alignItems: 'center',
    justifyContent: 'center',
  },

  pdfInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  pdfName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  pdfSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },

  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 12,

    backgroundColor: '#FFF1F1',

    alignItems: 'center',
    justifyContent: 'center',
  },
});