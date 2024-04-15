import { Component } from '@angular/core';
import { DailyTask } from '../../model';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-weekly-plan',
  templateUrl: './weekly-plan.component.html',
  styleUrls: ['./weekly-plan.component.scss'],
})
export class WeeklyPlanComponent {
  fullday: Date = new Date();
  isLoading: boolean = true;

  selected_day: string = this.getDay(new Date());

  last_day_of_week: string;
  first_day_of_week: string;

  weekly_tasks: DailyTask[];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.onFetchData(this.selected_day);
  }
  onFetchData(day: any) {
    this.homeService.get_weekly_tasks(day).subscribe((res: DailyTask[]) => {
      this.weekly_tasks = res;
      this.isLoading = false;
      this.last_day_of_week = res.find((item, i) => i === res.length - 1).date;
      this.first_day_of_week = res.find((item, i) => i === 0).date;
    });
  }
  getDay(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' : ''}${
      date.getMonth() + 1
    }-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
  }

  next() {
    const next = new Date(Date.parse(this.selected_day));
    next.setDate(next.getDate() + 7);
    this.selected_day = this.getDay(next);
    this.onFetchData(this.selected_day);
  }
  prev() {
    const next = new Date(Date.parse(this.selected_day));
    next.setDate(next.getDate() - 7);
    this.selected_day = this.getDay(next);
    this.onFetchData(this.selected_day);
  }
}
