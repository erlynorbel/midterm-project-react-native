import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types/Job';

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await axios.get('https://empllo.com/api/v1');
  
  return response.data.map((job: any) => ({
    ...job,
    id: uuidv4(), // Assign unique ID
  }));
};
