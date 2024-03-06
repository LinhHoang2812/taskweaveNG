import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './auth/pages/welcome-page/welcome-page.component';
import { SignInComponent } from './auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component';
import { LayoutComponent } from './core/pages/layout/layout.component';
import { WeeklyPlanComponent } from './home_page/pages/weekly-plan/weekly-plan.component';
import { authGuard } from './auth.guard';
import { InboxComponent } from './home_page/pages/inbox/inbox.component';
import { ProjectComponent } from './project/pages/project/project.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: LayoutComponent,

        children: [
          { path: '', component: WeeklyPlanComponent },
          { path: 'projects/:id', component: ProjectComponent },
          { path: 'inbox', component: InboxComponent },
        ],
      },
    ],
  },
  {
    path: 'auth',
    component: WelcomePageComponent,
    children: [
      { path: 'signin', component: SignInComponent },
      { path: 'signup', component: SignUpComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
