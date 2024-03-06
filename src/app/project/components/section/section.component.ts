import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Section } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HomeService } from 'src/app/home_page/services/home.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { TaskFormComponent } from 'src/app/home_page/components/task-form/task-form.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {
  @Input() section_id: string;
  @Output() refetchData = new EventEmitter(null);
  section: Section;
  form: FormGroup;
  constructor(
    public projectService: ProjectService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    public dialog: Dialog
  ) {}

  ngOnInit() {
    this.projectService
      .get_section(this.route.snapshot.params['id'], this.section_id)
      .subscribe((res: Section) => {
        this.section = res;
      });

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      des: new FormControl(null),
      due_date: new FormControl(null),
    });
  }
  activeForm(id: string) {
    this.projectService.activeFormId.next(id);
  }
  updateTitle() {
    this.projectService
      .update_section(
        this.route.snapshot.params['id'],
        this.section_id,
        this.section.title
      )
      .subscribe((res: any) => {
        this.section = res;
        this.refetchData.emit();
      });
  }
  deleteSection() {
    this.projectService
      .delete_section(this.route.snapshot.params['id'], this.section_id)
      .subscribe((res) => {
        this.refetchData.emit();
      });
  }
  createTask() {
    let task: any;
    if (this.form.value.due_date) {
      const date = new Date(this.form.value.due_date);

      const formattedDate =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2);

      task = { ...this.form.value, due_date: formattedDate };
    } else {
      task = this.form.value;
    }

    this.projectService
      .create_task(this.route.snapshot.params['id'], this.section_id, task)
      .subscribe((res) => {
        this.homeService.refetchInbox.next(true);
        this.refetchData.emit();
        this.activeForm(null);
      });
  }
  drop(event: CdkDragDrop<any[]>) {
    const prevIndex = event.previousIndex;
    const newIndex = event.currentIndex;
    const currentContainer = event.container.data;
    const previousContainer = event.previousContainer.data;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // console.log(currentContainer);

      const tasks_to_update: any[] = [];

      currentContainer.map((data, i) => {
        data.position = i;
        tasks_to_update.push(currentContainer[i]);
      });

      this.homeService
        .update_tasks_multiple(tasks_to_update)
        .subscribe((res) => {
          this.refetchData.emit();
        });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const tasks_to_update: any[] = [];
      currentContainer[newIndex].position = newIndex;
      currentContainer[newIndex].taskable_id = this.section_id;

      tasks_to_update.push(currentContainer[newIndex]);

      currentContainer.map((data, i) => {
        if (i > newIndex) {
          data.position += 1;
          tasks_to_update.push(currentContainer[i]);
        }
      });
      previousContainer.map((data, i) => {
        if (data.position > prevIndex) {
          data.position -= 1;
          tasks_to_update.push(previousContainer[i]);
        }
      });
      this.homeService
        .update_tasks_multiple(tasks_to_update)
        .subscribe((res) => {
          this.refetchData.emit();
        });
    }
  }

  deleteTask(taskId: string) {
    this.projectService
      .delete_task(this.route.snapshot.params['id'], this.section_id, taskId)
      .subscribe((res) => {
        this.refetchData.emit();
      });
  }

  openDialog(title: string, id: string, des: string, due_date: string): void {
    const dialogRef = this.dialog.open<string>(TaskFormComponent, {
      data: {
        title: title,
        des: des,
        id: id,
        due_date: due_date,
        section_id: this.section_id,
      },
    });

    dialogRef.closed.subscribe((result) => {
      if (result === 'refetch') {
        this.refetchData.emit();
      }
    });
  }
}
