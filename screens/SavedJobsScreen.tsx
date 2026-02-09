import React, { useState, useEffect } from 'react';
import {

View,
Text,
FlatList,
StyleSheet,
ActivityIndicator,
TouchableOpacity,
} from 'react-native';

interface Job {
id: string;
title: string;
company: string;
location: string;
salary: string;
}

export default function SavedJobsScreen() {
const [savedJobs, setSavedJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    loadSavedJobs();
}, []);

const loadSavedJobs = async () => {
    try {
        // TODO: Fetch saved jobs from storage or API
        setLoading(false);
    } catch (error) {
        console.error('Error loading saved jobs:', error);
        setLoading(false);
    }
};

const handleRemoveSavedJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
};

if (loading) {
    return <ActivityIndicator size="large" style={styles.container} />;
}

return (
    <View style={styles.container}>
        <Text style={styles.title}>Saved Jobs</Text>
        <FlatList
            data={savedJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.jobCard}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <Text style={styles.jobCompany}>{item.company}</Text>
                    <Text style={styles.jobLocation}>{item.location}</Text>
                    <Text style={styles.jobSalary}>{item.salary}</Text>
                </TouchableOpacity>
            )}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No saved jobs yet</Text>
            }
        />
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 16, backgroundColor: '#fff' },
title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
jobCard: { padding: 12, marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
jobTitle: { fontSize: 16, fontWeight: '600' },
jobCompany: { fontSize: 14, color: '#666' },
jobLocation: { fontSize: 12, color: '#999' },
jobSalary: { fontSize: 14, fontWeight: '500', marginTop: 8, color: '#007AFF' },
emptyText: { textAlign: 'center', fontSize: 16, color: '#999', marginTop: 32 },
});