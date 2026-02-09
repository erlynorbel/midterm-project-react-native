import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search...',
    onSearch,
}) => {
    const [searchText, setSearchText] = useState('');

    const handleClear = () => {
        setSearchText('');
        onSearch('');
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#999" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    onSearch(text);
                }}
                placeholderTextColor="#999"
            />
            {searchText.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
    },
});