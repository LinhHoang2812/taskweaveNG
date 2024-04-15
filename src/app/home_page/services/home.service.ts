import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DailyTask, Task } from '../model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  headers = new HttpHeaders();

  refetchInbox = new BehaviorSubject(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.token.subscribe((value) => {
      this.headers = this.headers
        .set('Content-Type', 'application/json;')
        .set('Authorization', `Bearer ${value}`);
    });
  }

  get_weekly_tasks(day: any): Partial<Observable<DailyTask[]>> {
    return this.http.get<DailyTask[]>(
      `https://taskweaveapi.onrender.com/api/v1/weekly_tasks?day=${day}`,
      {
        headers: this.headers,
      }
    );
  }
  create_day_task(payload: {
    title: string;
    due_date: string;
  }): Partial<Observable<Task>> {
    return this.http.post<Task>(
      'https://taskweaveapi.onrender.com/api/v1/day_tasks',
      { task: payload },
      { headers: this.headers }
    );
  }
  delete_day_task(id: string) {
    return this.http.delete(
      `https://taskweaveapi.onrender.com/api/v1/day_tasks/${id}`,
      {
        headers: this.headers,
      }
    );
  }
  update_tasks_multiple(tasks: Task[]) {
    return this.http.put(
      `https://taskweaveapi.onrender.com/api/v1/update_day_tasks_multiple`,
      {
        tasks: tasks,
      },
      { headers: this.headers }
    );
  }
  update_day_task(id: string, task: { title: string; des: string }) {
    return this.http.put(
      `https://taskweaveapi.onrender.com/api/v1/day_tasks/${id}`,
      { task: task },
      { headers: this.headers }
    );
  }

  get_today_tasks(): Partial<Observable<Task[]>> {
    return this.http.get<Task[]>(
      'https://taskweaveapi.onrender.com/api/v1/today_tasks',
      {
        headers: this.headers,
      }
    );
  }
}
