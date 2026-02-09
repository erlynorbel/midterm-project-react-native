import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
}

export default function JobFinderScreen() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Add search logic here
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search jobs..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.jobCard}>
                        <Text style={styles.jobTitle}>{item.title}</Text>
                        <Text>{item.company}</Text>
                        <Text>{item.location}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    searchInput: { borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 8 },
    jobCard: { padding: 12, marginBottom: 8, borderWidth: 1, borderRadius: 8 },
    jobTitle: { fontSize: 16, fontWeight: 'bold' },
});