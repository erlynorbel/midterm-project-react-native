import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppContext } from '@/context/app-context';

type FormValues = {
  name: string;
  email: string;
  contactNumber: string;
  hireReason: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialFormValues: FormValues = {
  name: '',
  email: '',
  contactNumber: '',
  hireReason: '',
};

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const contactNumber = values.contactNumber.trim();
  const hireReason = values.hireReason.trim();

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (!/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name)) {
    errors.name = 'Name contains invalid characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!contactNumber) {
    errors.contactNumber = 'Contact number is required.';
  } else {
    const normalizedContact = contactNumber.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    const digitsOnly = normalizedContact.replace(/\D/g, '');

    if (!/^\+?\d{10,15}$/.test(normalizedContact) || digitsOnly.length < 10 || digitsOnly.length > 15) {
      errors.contactNumber = 'Contact number must be 10 to 15 digits.';
    }
  }

  if (!hireReason) {
    errors.hireReason = 'This field is required.';
  } else if (hireReason.length < 20) {
    errors.hireReason = 'Please provide at least 20 characters.';
  } else if (hireReason.length > 500) {
    errors.hireReason = 'Please keep your answer within 500 characters.';
  }

  return errors;
}

export default function ApplyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { applicationTarget, setApplicationTarget } = useAppContext();

  const [values, setValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const job = applicationTarget?.job;
  const source = applicationTarget?.source;

  const remainingChars = useMemo(() => 500 - values.hireReason.trim().length, [values.hireReason]);

  const setField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  const submitApplication = () => {
    const formErrors = validateForm(values);
    setErrors(formErrors);
    setSubmitted(true);

    if (Object.keys(formErrors).length > 0 || !job) {
      return;
    }

    setValues(initialFormValues);
    setErrors({});
    setApplicationTarget(null);

    Alert.alert('Application Submitted', `Your application for ${job.title} has been received.`, [
      {
        text: 'Okay',
        onPress: () => {
          if (source === 'saved') {
            router.dismissAll();
            return;
          }

          router.back();
        },
      },
    ]);
  };

  if (!job) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No job selected.</Text>
          <Pressable
            onPress={() => router.replace('/(tabs)/index')}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}>
            <Text style={styles.primaryButtonText}>Go to Job Finder</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.jobBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
          <Text style={[styles.jobCompany, { color: colors.text }]}>{job.company}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <TextInput
            value={values.name}
            onChangeText={(text) => setField('name', text)}
            placeholder="Enter your full name"
            placeholderTextColor={colors.border}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
          />
          {submitted && errors.name ? <Text style={[styles.error, { color: colors.notification }]}>{errors.name}</Text> : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            value={values.email}
            onChangeText={(text) => setField('email', text)}
            placeholder="example@email.com"
            placeholderTextColor={colors.border}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
          />
          {submitted && errors.email ? <Text style={[styles.error, { color: colors.notification }]}>{errors.email}</Text> : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Contact Number</Text>
          <TextInput
            value={values.contactNumber}
            onChangeText={(text) => setField('contactNumber', text)}
            placeholder="e.g. +639123456789"
            placeholderTextColor={colors.border}
            keyboardType="phone-pad"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
          />
          {submitted && errors.contactNumber ? (
            <Text style={[styles.error, { color: colors.notification }]}>{errors.contactNumber}</Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Why should we hire you?</Text>
          <TextInput
            value={values.hireReason}
            onChangeText={(text) => setField('hireReason', text)}
            placeholder="Share your strengths and value to the company"
            placeholderTextColor={colors.border}
            multiline
            numberOfLines={5}
            maxLength={500}
            style={[
              styles.textarea,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.card,
              },
            ]}
          />
          <Text style={[styles.counter, { color: colors.text }]}>{remainingChars} characters left</Text>
          {submitted && errors.hireReason ? (
            <Text style={[styles.error, { color: colors.notification }]}>{errors.hireReason}</Text>
          ) : null}
        </View>

        <Pressable
          onPress={submitApplication}
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}>
          <Text style={styles.primaryButtonText}>Confirm Application</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  jobBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  jobCompany: {
    fontSize: 15,
    fontWeight: '600',
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  counter: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  error: {
    fontSize: 12,
  },
  submitButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
