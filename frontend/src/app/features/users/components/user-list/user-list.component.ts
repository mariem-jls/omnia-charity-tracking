import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm = '';
  selectedRole = 'all';
  showActiveOnly = false;
  
  // Propriété pour le template
  roles = ['Admin', 'Manager', 'Volunteer'];

  ngOnInit(): void {
    this.loadMockUsers();
  }

  loadMockUsers(): void {
    this.users = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: 'Admin',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        role: 'Volunteer',
        active: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@example.com',
        phone: '+33612345678',
        role: 'Manager',
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
    this.filteredUsers = [...this.users];
  }

  applyFilters(): void {
    let result = [...this.users];
    
    if (this.selectedRole !== 'all') {
      result = result.filter(user => user.role === this.selectedRole);
    }
    
    if (this.showActiveOnly) {
      result = result.filter(user => user.active);
    }
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.phone && user.phone.toLowerCase().includes(term))
      );
    }
    
    this.filteredUsers = result;
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'bg-danger';
      case 'Manager': return 'bg-warning text-dark';
      case 'Volunteer': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  toggleUserStatus(user: any): void {
    user.active = !user.active;
    this.applyFilters();
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.id !== id);
      this.applyFilters();
    }
  }
}