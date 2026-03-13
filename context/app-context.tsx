import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

import { ApplicationSource, Job } from '@/types/job';

type ThemeMode = 'light' | 'dark';

type ApplicationTarget = {
  job: Job;
  source: ApplicationSource;
};

type AppContextValue = {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeSavedJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  applicationTarget: ApplicationTarget | null;
  setApplicationTarget: (target: ApplicationTarget | null) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(deviceColorScheme === 'dark' ? 'dark' : 'light');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [applicationTarget, setApplicationTarget] = useState<ApplicationTarget | null>(null);

  const saveJob = (job: Job) => {
    setSavedJobs((currentJobs) => {
      const exists = currentJobs.some((savedJob) => savedJob.id === job.id);
      return exists ? currentJobs : [...currentJobs, job];
    });
  };

  const removeSavedJob = (jobId: string) => {
    setSavedJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
  };

  const isJobSaved = (jobId: string) => savedJobs.some((job) => job.id === jobId);

  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      themeMode,
      toggleTheme,
      savedJobs,
      saveJob,
      removeSavedJob,
      isJobSaved,
      applicationTarget,
      setApplicationTarget,
    }),
    [applicationTarget, savedJobs, themeMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
