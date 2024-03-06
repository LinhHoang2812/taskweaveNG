export interface DailyTask {
  day_of_week: string;
  date: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  des?: string;
  due_date?: string;
  taskable_id?: string;
  taskable_type?: string;
  user_id?: string;
  position?: number;
}
