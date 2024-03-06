import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Project, Section } from '../models';
import { Task } from 'src/app/home_page/model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  refetchProjects = new BehaviorSubject<boolean>(false);
  activeFormId = new BehaviorSubject<string>(null);
  headers = new HttpHeaders();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.token.subscribe((value) => {
      this.headers = this.headers
        .set('Content-Type', 'application/json;')
        .set('Authorization', `Bearer ${value}`);
    });
  }

  get_projects(): Partial<Observable<Project[]>> {
    return this.http.get<Project[]>('http://localhost:3000/api/v1/projects', {
      headers: this.headers,
    });
  }
  get_project(id: string): Partial<Observable<Project>> {
    return this.http.get<Project>(
      `http://localhost:3000/api/v1/projects/${id}`,
      {
        headers: this.headers,
      }
    );
  }
  create_project(project: { title: string }): Partial<Observable<Project>> {
    return this.http.post<Project>(
      'http://localhost:3000/api/v1/projects',
      {
        project: project,
      },
      {
        headers: this.headers,
      }
    );
  }
  update_project(title: string, id: string): Partial<Observable<Project>> {
    return this.http.put<Project>(
      `http://localhost:3000/api/v1/projects/${id}`,
      {
        project: { title },
      },
      {
        headers: this.headers,
      }
    );
  }
  delete_project(id: string): Partial<Observable<Project>> {
    return this.http.delete<Project>(
      `http://localhost:3000/api/v1/projects/${id}`,

      {
        headers: this.headers,
      }
    );
  }

  update_projects_multiple(projects: Project[]) {
    return this.http.put(
      'http://localhost:3000/api/v1/update_projects_multiple',
      {
        projects,
      },
      {
        headers: this.headers,
      }
    );
  }

  get_section(
    projectId: string,
    sectionId: string
  ): Partial<Observable<Section>> {
    return this.http.get<Section>(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}`,
      { headers: this.headers }
    );
  }
  create_section(projectId: string, sectionName: string) {
    return this.http.post(
      `http://localhost:3000/api/v1/projects/${projectId}/sections`,
      {
        section: { title: sectionName },
      },
      {
        headers: this.headers,
      }
    );
  }

  update_section(projectId: string, sectionId: string, sectionName: string) {
    return this.http.put(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}`,
      {
        section: { title: sectionName },
      },
      {
        headers: this.headers,
      }
    );
  }
  update_sections_multiple(sections: Section[]) {
    return this.http.put(
      `http://localhost:3000/api/v1/update_sections_multiple`,
      {
        sections,
      },
      { headers: this.headers }
    );
  }

  delete_section(projectId: string, sectionId: string) {
    return this.http.delete(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}`,
      { headers: this.headers }
    );
  }

  get_tasks(projectId: string, sectionId: string): Partial<Observable<Task[]>> {
    return this.http.get<Task[]>(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}/tasks`,
      { headers: this.headers }
    );
  }
  get_task(
    projectId: string,
    sectionId: string,
    taskId: string
  ): Partial<Observable<Task>> {
    return this.http.get<Task>(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}/tasks/${taskId}`,
      { headers: this.headers }
    );
  }

  create_task(projectId: string, sectionId: string, task: Task) {
    return this.http.post(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}/tasks`,
      {
        task,
      },
      {
        headers: this.headers,
      }
    );
  }
  update_task(
    projectId: string,
    sectionId: string,
    taskId: string,
    task: Task
  ) {
    return this.http.put(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}/tasks/${taskId}`,
      {
        task,
      },
      {
        headers: this.headers,
      }
    );
  }

  delete_task(projectId: string, sectionId: string, taskId: string) {
    return this.http.delete(
      `http://localhost:3000/api/v1/projects/${projectId}/sections/${sectionId}/tasks/${taskId}`,
      { headers: this.headers }
    );
  }
}
