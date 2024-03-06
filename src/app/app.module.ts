import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './auth/pages/welcome-page/welcome-page.component';
import { SignInComponent } from './auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeeklyPlanComponent } from './home_page/pages/weekly-plan/weekly-plan.component';
import { LayoutComponent } from './core/pages/layout/layout.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { SingleDayComponent } from './home_page/components/single-day/single-day.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogModule } from '@angular/cdk/dialog';
import { TaskFormComponent } from './home_page/components/task-form/task-form.component';
import { InboxComponent } from './home_page/pages/inbox/inbox.component';
import { ProjectComponent } from './project/pages/project/project.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SectionComponent } from './project/components/section/section.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    SignInComponent,
    SignUpComponent,
    WeeklyPlanComponent,
    LayoutComponent,
    SidebarComponent,
    SingleDayComponent,
    TaskFormComponent,
    InboxComponent,
    ProjectComponent,
    SectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    DialogModule,
    ScrollingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
