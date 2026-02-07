
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

// Importer les routes
import { usersRoutes } from './users.routes';

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  // ← POUR ngModel
    RouterModule.forChild(usersRoutes)
  ],
  exports: [
    UserListComponent
  ]
})
export class UsersModule { }
