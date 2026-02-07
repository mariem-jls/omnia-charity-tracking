// src/app/features/users/components/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userId: string = ''; // ← Initialisez avec string vide
  isEditMode = false;
  
  // Pour éviter l'erreur TypeScript
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = params['id'] || '';
        if (this.userId) {
          this.loadUser(this.userId);
        }
      }
    });
  }

  loadUser(id: string): void {
    console.log('Loading user:', id);
    // Implémentez plus tard
  }

  onSubmit(): void {
    console.log('Form submitted');
    this.router.navigate(['/users']);
  }
}