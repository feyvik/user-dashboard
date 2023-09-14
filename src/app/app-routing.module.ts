import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ShellComponent } from './shell/shell.component';
import { AddUserComponent } from './add-user/add-user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'user-dashboard',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: UserDashboardComponent,
      },
      { path: 'add-user', component: AddUserComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
