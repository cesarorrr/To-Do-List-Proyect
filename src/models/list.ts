import { Task } from './task';

export interface List {
  id: number;
  title: string;
  tasks: Task[];
  isFinished: boolean;
  createdAt: Date;
}
