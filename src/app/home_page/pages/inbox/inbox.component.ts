import { Component } from '@angular/core';
import { Task } from '../../model';
import { HomeService } from '../../services/home.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent {
  tasks: Task[];
  isLoading: boolean = true;
  constructor(private homeService: HomeService, private dialog: Dialog) {}
  ngOnInit() {
    this.onFetchData();
  }
  onFetchData() {
    this.homeService.get_today_tasks().subscribe((res: Task[]) => {
      this.tasks = res;
      this.isLoading = false;
    });
  }

  delete_day_task(id: string) {
    this.homeService.delete_day_task(id).subscribe((res) => {
      this.onFetchData();
      this.homeService.refetchInbox.next(true);
    });
  }

  openDialog(task: Task): void {
    const dialogRef = this.dialog.open<string>(TaskFormComponent, {
      data: {
        title: task.title,
        due_date: task.due_date,
        des: task.des,
        id: task.id,
        section_id: task.taskable_id,
      },
    });

    dialogRef.closed.subscribe((result) => {
      if (result === 'refetch') {
        this.onFetchData();
      }
    });
  }
}
