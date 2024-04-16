import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, Section } from '../../models';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  project: Project;
  sectionName: string;
  isAddSectionForm: boolean;
  isLoading: boolean = true;
  isSaving: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.refetchData();
  }
  refetchData() {
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      this.projectService.get_project(params['id']).subscribe((res) => {
        this.project = res;

        this.isLoading = false;
        this.isAddSectionForm = res.sections.length == 0;
      });
    });
  }
  updateTitle() {
    this.projectService
      .update_project(this.project.title, this.project.id)
      .subscribe((res) => {
        this.project.title = res.title;
        this.projectService.refetchProjects.next(true);
      });
  }
  addSection() {
    this.isSaving = true;
    this.projectService
      .create_section(this.project.id, this.sectionName)
      .subscribe((res) => {
        this.sectionName = null;
        this.projectService.get_project(this.project.id).subscribe((res) => {
          this.project = res;
          this.isSaving = false;
          this.isAddSectionForm = false;
        });
      });
  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.project.sections,
      event.previousIndex,
      event.currentIndex
    );

    const currentContainer = event.container.data;

    const sections_to_update = currentContainer.map((section, i) => {
      return { id: section.id, title: section.title, position: i };
    });

    this.projectService
      .update_sections_multiple(sections_to_update)
      .subscribe((res) => {
        this.refetchData();
      });
  }
}
