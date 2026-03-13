import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import uuid from 'react-native-uuid';

import { ThemeToggle } from '@/components/theme-toggle';
import { useAppContext } from '@/context/app-context';
import { Job } from '@/types/job';

type ApiRecord = Record<string, unknown>;

function readString(value: unknown, fallback = 'Not specified') {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
}

function normalizeJob(raw: ApiRecord): Job {
  const companyObj = typeof raw.company === 'object' && raw.company !== null ? (raw.company as ApiRecord) : {};
  const locationObj = typeof raw.location === 'object' && raw.location !== null ? (raw.location as ApiRecord) : {};

  return {
    id: String(uuid.v4()),
    title: readString(raw.title ?? raw.position ?? raw.job_title),
    company: readString(raw.company_name ?? companyObj.name),
    location: readString(raw.location_name ?? locationObj.name ?? raw.location),
    salary: readString(raw.salary ?? raw.salary_range ?? raw.compensation),
    description: readString(raw.description ?? raw.summary),
    applyUrl: readString(raw.url ?? raw.apply_url ?? raw.application_url ?? raw.job_url, ''),
  };
}

function extractJobArray(payload: unknown): ApiRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is ApiRecord => typeof item === 'object' && item !== null);
  }

  if (typeof payload !== 'object' || payload === null) {
    return [];
  }

  const data = payload as ApiRecord;
  const possibleKeys = ['jobs', 'data', 'results', 'items'];

  for (const key of possibleKeys) {
    const value = data[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is ApiRecord => typeof item === 'object' && item !== null);
    }
  }

  return [];
}

export default function JobFinderScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { colors } = useTheme();
  const router = useRouter();
  const { saveJob, isJobSaved, setApplicationTarget } = useAppContext();

  const fetchJobs = async () => {
    try {
      setErrorMessage('');
      const response = await fetch('https://empllo.com/api/v1');

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const apiJobs = extractJobArray(payload);
      const normalizedJobs = apiJobs.map(normalizeJob);
      setJobs(normalizedJobs);
    } catch {
      setErrorMessage('Unable to load jobs right now. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return jobs;
    }

    return jobs.filter((job) => {
      const searchable = `${job.title} ${job.company} ${job.location}`.toLowerCase();
      return searchable.includes(trimmedQuery);
    });
  }, [jobs, query]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleApply = (job: Job) => {
    setApplicationTarget({ job, source: 'finder' });
    router.push('/apply');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: colors.text }]}>Job Finder</Text>
          <ThemeToggle />
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search jobs by title, company, or location"
          placeholderTextColor={colors.border}
          style={[
            styles.searchInput,
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.card,
            },
          ]}
        />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>Loading jobs...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: colors.notification }]}>{errorMessage}</Text>
            <Pressable
              onPress={fetchJobs}
              style={({ pressed }) => [
                styles.retryButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}>
              <Text style={styles.primaryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={filteredJobs}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            ListEmptyComponent={<Text style={[styles.infoText, { color: colors.text }]}>No jobs found.</Text>}
            renderItem={({ item }) => {
              const saved = isJobSaved(item.id);
              return (
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.company, { color: colors.text }]}>{item.company}</Text>
                  <Text style={[styles.meta, { color: colors.text }]}>Location: {item.location}</Text>
                  <Text style={[styles.meta, { color: colors.text }]}>Salary: {item.salary}</Text>

                  <View style={styles.actionsRow}>
                    <Pressable
                      onPress={() => saveJob(item)}
                      disabled={saved}
                      style={({ pressed }) => [
                        styles.button,
                        {
                          backgroundColor: saved ? colors.border : colors.primary,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}>
                      <Text style={styles.primaryButtonText}>{saved ? 'Saved' : 'Save Job'}</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleApply(item)}
                      style={({ pressed }) => [styles.button, { borderColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}>
                      <Text style={[styles.outlineButtonText, { color: colors.primary }]}>Apply</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 6,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  company: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 110,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  outlineButtonText: {
    fontWeight: '700',
  },
});
