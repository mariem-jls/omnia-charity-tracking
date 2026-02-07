import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

// Interface pour le modèle d'utilisateur
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created: string;
  address?: string;
  familyId?: number;
  lastLogin?: string;
  notes?: string;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  standalone: true, // <-- Ajouter ceci
  imports: [CommonModule] // <-- Importer les modules nécessaires
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  userId: number | null = null;
  isLoading = true;
  
  // Données simulées pour les utilisateurs
  private mockUsers: User[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '+1234567890', 
      role: 'ADMIN', 
      status: 'ACTIVE', 
      created: '07/02/26',
      address: '123 Main St, New York, NY 10001',
      familyId: 101,
      lastLogin: '06/02/26 14:30',
      notes: 'Super administrateur avec tous les droits'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '+0987654321', 
      role: 'VOLUNTEER', 
      status: 'INACTIVE', 
      created: '07/02/26',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      familyId: 102,
      lastLogin: '05/02/26 09:15',
      notes: 'Bénévole depuis 2 ans'
    },
    { 
      id: 3, 
      name: 'Bob Wilson', 
      email: 'bob@example.com', 
      phone: '+33612345678', 
      role: 'MANAGER', 
      status: 'ACTIVE', 
      created: '07/02/26',
      address: '789 Pine Rd, Chicago, IL 60007',
      familyId: 103,
      lastLogin: '07/02/26 10:45',
      notes: 'Gère une équipe de 5 bénévoles'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis l'URL
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.loadUserDetails();
    });
  }

  loadUserDetails(): void {
    this.isLoading = true;
    
    // Simuler un délai de chargement
    setTimeout(() => {
      if (this.userId) {
        const foundUser = this.mockUsers.find(user => user.id === this.userId);
        
        if (foundUser) {
          this.user = { ...foundUser };
        } else {
          // Si l'utilisateur n'est pas trouvé, rediriger vers la liste
          this.router.navigate(['/users']);
        }
      }
      this.isLoading = false;
    }, 500);
  }

  // Getters sécurisés
  getUser(): User {
    return this.user as User;
  }

  getStatusClass(): string {
    const user = this.user;
    if (!user) return 'status-unknown';
    switch (user.status) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'PENDING': return 'status-pending';
      default: return 'status-unknown';
    }
  }

  getRoleClass(): string {
    const user = this.user;
    if (!user) return 'role-other';
    switch (user.role) {
      case 'ADMIN': return 'role-admin';
      case 'MANAGER': return 'role-manager';
      case 'VOLUNTEER': return 'role-volunteer';
      default: return 'role-other';
    }
  }

  getInitials(): string {
    const user = this.user;
    if (!user || !user.name) return '??';
    const parts = user.name.split(' ');
    const firstInitial = parts[0] ? parts[0].charAt(0) : '';
    const secondInitial = parts[1] ? parts[1].charAt(0) : '';
    return firstInitial + secondInitial;
  }

  getStatusText(): string {
    const user = this.user;
    if (!user) return 'Inconnu';
    return user.status === 'ACTIVE' ? 'Actif' : 'Inactif';
  }

  getToggleButtonText(): string {
    const user = this.user;
    if (!user) return 'Changer le statut';
    return user.status === 'ACTIVE' ? 'Désactiver' : 'Activer';
  }

  isActive(): boolean {
    return this.user?.status === 'ACTIVE';
  }

  getEmail(): string {
    return this.user?.email || '';
  }

  getPhone(): string {
    return this.user?.phone || '';
  }

  getCreated(): string {
    return this.user?.created || '';
  }

  getFamilyId(): string {
    const user = this.user;
    return user?.familyId ? user.familyId.toString() : 'Non spécifié';
  }

  getAddress(): string {
    return this.user?.address || '';
  }

  getLastLogin(): string {
    return this.user?.lastLogin || 'Jamais connecté';
  }

  getNotes(): string {
    return this.user?.notes || '';
  }

  goBack(): void {
    this.location.back();
  }

  editUser(): void {
    if (this.userId) {
      this.router.navigate(['/users', this.userId, 'edit']);
    }
  }

  toggleStatus(): void {
    if (this.user) {
      this.user.status = this.user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }
  }

  deleteUser(): void {
    if (this.user && confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${this.user.name}" ?`)) {
      // Ici, vous ajouteriez la logique pour supprimer l'utilisateur
      console.log(`Utilisateur ${this.user.name} supprimé`);
      this.router.navigate(['/users']);
    }
  }
}