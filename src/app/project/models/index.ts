import { Task } from 'src/app/home_page/model';

export interface Project {
  id: string;
  title: string;
  position: number;
  sections?: Section[];
}

export interface Section {
  id: string;
  title: string;
  tasks?: Task[];
}
