import { Component } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HomeService } from 'src/app/home_page/services/home.service';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/project/services/project.service';
import { Project } from 'src/app/project/models';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  len: number;
  activeUrl: string;
  projects: Project[];
  addProject: boolean = false;
  projectName: string;
  activeId: string;
  constructor(
    public coreService: CoreService,
    public authService: AuthService,
    private homeService: HomeService,
    private projectService: ProjectService,
    private router: Router
  ) {}
  ngOnInit() {
    this.homeService.refetchInbox.subscribe((value) => {
      this.homeService.get_today_tasks().subscribe((res) => {
        this.len = res.length;
      });
    });
    this.projectService.refetchProjects.subscribe((value) => {
      this.projectService.get_projects().subscribe((res: Project[]) => {
        this.projects = res;
      });
    });

    this.router.events.subscribe((event: any) => {
      this.activeUrl = this.router.url;

      if (this.activeUrl.split('/').length > 1) {
        this.activeId = this.activeUrl.split('/')[2];
      }
    });
  }
  onSave() {
    this.projectService
      .create_project({ title: this.projectName })
      .subscribe((res) => {
        this.projectService.get_projects().subscribe((res: Project[]) => {
          this.projects = res;
        });
        this.router.navigate(['projects', res.id]);
      });

    this.addProject = false;
    this.projectName = null;
  }
  closeProjectForm(e: any) {
    if (!e.target.classList.contains('project-form')) {
      this.addProject = false;
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
    const currentContainer = event.container.data;
    const projects_to_update = currentContainer.map((project, i) => {
      return { id: project.id, title: project.title, position: i };
    });

    this.projectService
      .update_projects_multiple(projects_to_update)
      .subscribe((res) => {
        this.projectService.get_projects().subscribe((res: Project[]) => {
          this.projects = res;
        });
      });
  }

  deleteProject(id: string) {
    this.projectService.delete_project(id).subscribe((res) => {
      this.projectService.get_projects().subscribe((res: Project[]) => {
        this.projects = res;
      });
    });
  }
}
