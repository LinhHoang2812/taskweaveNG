import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { Task } from '../../model';
import { HomeService } from '../../services/home.service';
import { ProjectService } from 'src/app/project/services/project.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent {
  @ViewChild('des') des: ElementRef;
  @ViewChild('title') title: ElementRef;
  isLoading: boolean = false;

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
    private homeService: HomeService,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {}

  onSave() {
    this.isLoading = true;
    if (!this.data.section_id) {
      this.homeService
        .update_day_task(this.data.id, {
          title: this.title.nativeElement.innerText,
          des: this.des.nativeElement.innerText,
        })
        .subscribe((res) => {
          this.dialogRef.close('refetch');
        });
    } else {
      let formattedDate: string;
      if (this.data.due_date) {
        const date = new Date(this.data.due_date);

        formattedDate =
          date.getFullYear() +
          '-' +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + date.getDate()).slice(-2);
      }
      this.projectService
        .update_task(
          this.route.snapshot.params['id'],
          this.data.section_id,
          this.data.id,

          {
            title: this.title.nativeElement.innerText,
            des: this.des.nativeElement.innerText,
            id: this.data.id,
            due_date: formattedDate,
          }
        )
        .subscribe((res) => {
          this.dialogRef.close('refetch');
          this.isLoading = false;
          this.homeService.refetchInbox.next(true);
        });
    }
  }
}
