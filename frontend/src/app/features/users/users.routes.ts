
import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

export const usersRoutes: Routes = [
  { path: '', component: UserListComponent }, // /users
  { path: 'new', component: UserFormComponent }, // /users/new
  { path: ':id', component: UserDetailComponent }, // /users/:id
  { path: ':id/edit', component: UserFormComponent } // /users/:id/edit
];
