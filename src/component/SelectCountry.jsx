import React, { useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../services/axios';

const SelectCountry = ({ value, onChange }) => {
    const [visible, setVisible] = useState(false);
    // const [selectedCountry, setSelectedCountry] = useState('Country');
    const [countryLists, setCountries] = useState([]);
    const [search, setSearch] = useState('');

    const handleSelect = (country) => {
        onChange?.(country); // Send selected country to parent
        setVisible(false);
        setSearch('');
    };

    const fetchCountry = async () => {
        try {
            const response = await axios.get('/countries', {
                params: {
                    limit: 500,
                },
            });

            const sortedCountries = (response?.data?.data || []).sort((a, b) =>
                a.name.localeCompare(b.name),
            );

            setCountries(sortedCountries);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCountry();
    }, []);

    const filteredCountries = useMemo(() => {
        return countryLists.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase()),
        );
    }, [countryLists, search]);

    return (
        <>
            <Text style={styles.label}>Country</Text>
            <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setVisible(true)}
            >
                <Ionicons
                    name="earth-outline"
                    size={20}
                    color="#666"
                    style={{ marginRight: 10 }}
                />

                <Text style={styles.label}>
                    {value?.name || 'Country'}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#666"
                    style={{ marginLeft: 'auto' }}
                />
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => {
                        setVisible(false);
                        setSearch('');
                    }}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modal}>
                        <Text style={styles.title}>Select Country</Text>

                        <View style={styles.searchContainer}>
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color="#666"
                                style={{ marginRight: 8 }}
                            />

                            <TextInput
                                placeholder="Search country..."
                                value={search}
                                onChangeText={setSearch}
                                style={styles.searchInput}
                                autoCapitalize="none"
                            />
                        </View>

                        <FlatList
                            data={filteredCountries}
                            keyExtractor={(item) => item.id.toString()}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No country found.</Text>
                            }
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default SelectCountry;

const styles = StyleSheet.create({
    selectBox: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
    },
    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
});