import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
}

interface JobCardProps {
    job: Job;
    onPress?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>
            <Text style={styles.location}>{job.location}</Text>
            <Text style={styles.salary}>{job.salary}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    company: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    location: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    salary: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
});

export default JobCard;