import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ShellComponent } from './shell/shell.component';
import { ManageUserFormComponent } from './manage-user-form/manage-user-form.component';

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
      { path: 'add-user', component: ManageUserFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
