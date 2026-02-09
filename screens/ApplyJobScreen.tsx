import React, { useState } from 'react';
import {

View,
Text,
TextInput,
TouchableOpacity,
ScrollView,
StyleSheet,
Alert,
} from 'react-native';

interface JobApplication {
fullName: string;
email: string;
phone: string;
resume: string;
coverLetter: string;
}

export default function ApplyJobScreen() {
const [application, setApplication] = useState<JobApplication>({
    fullName: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: '',
});

const handleInputChange = (field: keyof JobApplication, value: string) => {
    setApplication((prev) => ({
        ...prev,
        [field]: value,
    }));
};

const handleSubmit = () => {
    if (!application.fullName || !application.email || !application.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
    }
    Alert.alert('Success', 'Application submitted successfully!');
    console.log('Application submitted:', application);
};

return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>Apply for Job</Text>

        <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={application.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Email *"
            keyboardType="email-address"
            value={application.email}
            onChangeText={(text) => handleInputChange('email', text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Phone *"
            keyboardType="phone-pad"
            value={application.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
        />

        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Resume"
            multiline
            numberOfLines={4}
            value={application.resume}
            onChangeText={(text) => handleInputChange('resume', text)}
        />

        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Cover Letter"
            multiline
            numberOfLines={4}
            value={application.coverLetter}
            onChangeText={(text) => handleInputChange('coverLetter', text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Application</Text>
        </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
},
input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
},
textArea: {
    textAlignVertical: 'top',
},
button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
},
buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},
});