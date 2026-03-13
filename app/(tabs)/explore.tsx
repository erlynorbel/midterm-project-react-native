import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ThemeToggle } from '@/components/theme-toggle';
import { useAppContext } from '@/context/app-context';
import { Job } from '@/types/job';

export default function SavedJobsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { savedJobs, removeSavedJob, setApplicationTarget } = useAppContext();

  const handleApply = (job: Job) => {
    setApplicationTarget({ job, source: 'saved' });
    router.push('/apply');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: colors.text }]}>Saved Jobs</Text>
          <ThemeToggle />
        </View>

        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.text }]}>No saved jobs yet.</Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.company, { color: colors.text }]}>{item.company}</Text>
              <Text style={[styles.meta, { color: colors.text }]}>Location: {item.location}</Text>
              <Text style={[styles.meta, { color: colors.text }]}>Salary: {item.salary}</Text>

              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() => handleApply(item)}
                  style={({ pressed }) => [styles.button, { borderColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}>
                  <Text style={[styles.outlineButtonText, { color: colors.primary }]}>Apply</Text>
                </Pressable>

                <Pressable
                  onPress={() => removeSavedJob(item.id)}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: colors.notification,
                      borderColor: colors.notification,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}>
                  <Text style={styles.primaryButtonText}>Remove Job</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
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
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 24,
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
