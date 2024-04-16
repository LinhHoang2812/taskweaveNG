import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DailyTask, Task } from '../../model';
import { HomeService } from '../../services/home.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-single-day',
  templateUrl: './single-day.component.html',
  styleUrls: ['./single-day.component.scss'],
})
export class SingleDayComponent {
  @Input() day: DailyTask;
  @Input() index: number;
  @Output() fetchData = new EventEmitter();
  @ViewChild('form') form: ElementRef;

  day_of_week: string;
  tasks: Task[];
  task_title: string;
  due_date: string;
  isToday: boolean;
  is_originalDate_today: boolean;
  isLoading: boolean = false;

  constructor(private homeService: HomeService, public dialog: Dialog) {}

  ngOnInit() {
    this.day_of_week = this.day.day_of_week;
    this.due_date = this.day.date;

    this.isToday =
      new Date().toLocaleDateString() ===
      new Date(Date.parse(this.due_date)).toLocaleDateString();

    this.tasks = this.day.tasks.map((task, index) => {
      return {
        title: task.title,
        des: task.des,
        id: task.id,
        position: task.position,
        due_date: this.day.date,
      };
    });
  }
  fetch_daily_tasks(date: any) {
    this.homeService.get_daily_tasks(date).subscribe((res: Task[]) => {
      this.tasks = res;
    });
  }
  create_day_task() {
    this.isLoading = true;

    this.homeService
      .create_day_task({ title: this.task_title, due_date: this.day.date })
      .subscribe((res) => {
        this.fetch_daily_tasks(this.due_date);
        this.task_title = null;
        // this.fetchData.emit();
        this.isLoading = false;
        if (this.isToday) {
          this.homeService.refetchInbox.next(true);
        }
      });
  }
  delete_day_task(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    this.homeService.delete_day_task(id).subscribe((res) => {
      // this.fetchData.emit();

      this.fetch_daily_tasks(this.due_date);

      if (this.isToday) {
        this.homeService.refetchInbox.next(true);
      }
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
      const tasks_to_update: any[] = [];

      currentContainer.map((data, i) => {
        data.position = i;
        tasks_to_update.push(currentContainer[i]);
      });

      this.homeService
        .update_tasks_multiple(tasks_to_update)
        .subscribe((res) => {
          this.fetchData.emit();
        });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const tasks_to_update: any[] = [];

      this.is_originalDate_today =
        new Date(
          Date.parse(currentContainer[newIndex]['due_date'])
        ).toLocaleDateString() === new Date().toLocaleDateString();

      currentContainer[newIndex].position = newIndex;
      currentContainer[newIndex]['due_date'] = this.due_date;
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
          this.fetchData.emit();
          if (this.isToday || this.is_originalDate_today) {
            this.homeService.refetchInbox.next(true);
          }
        });

      //css
      // if (this.form.nativeElement.classList.contains('mt-16')) {
      //   this.form.nativeElement.classList.remove('mt-16');
      // }
    }
  }

  // enter(event: any) {
  //   if (event.currentIndex == event.container.data.length) {
  //     this.form.nativeElement.classList.add('mt-16');
  //   }
  // }
  // exit(event: any) {
  //   if (this.form.nativeElement.classList.contains('mt-16')) {
  //     this.form.nativeElement.classList.remove('mt-16');
  //   }
  // }

  openDialog(title: string, id: string, des: string): void {
    const dialogRef = this.dialog.open<string>(TaskFormComponent, {
      data: {
        title: title,
        due_date: this.due_date,
        des: des,
        id: id,
        section_id: null,
      },
    });

    dialogRef.closed.subscribe((result) => {
      if (result === 'refetch') {
        this.fetchData.emit();
      }
    });
  }
}
