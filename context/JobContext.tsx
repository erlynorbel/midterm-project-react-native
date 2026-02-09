import React, { createContext, useContext, useState } from 'react';
import { Job } from '../types/Job';

interface JobContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    if (!savedJobs.find(j => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const removeJob = (id: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  return (
    <JobContext.Provider value={{ savedJobs, saveJob, removeJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobs must be used inside JobProvider');
  return context;
};
