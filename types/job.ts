export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  applyUrl: string;
};

export type ApplicationSource = 'finder' | 'saved';
