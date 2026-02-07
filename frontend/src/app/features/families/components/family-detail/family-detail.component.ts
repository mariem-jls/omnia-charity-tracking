// features/families/components/family-detail/family-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FamilyService } from '../../services/family.service';
import { Family, PriorityLevel } from '../../models/family.models';

@Component({
  selector: 'app-family-detail',
  standalone: true,
  templateUrl: './family-detail.component.html',
  styleUrls: ['./family-detail.component.css'],
  imports: [CommonModule, RouterModule]
})
export class FamilyDetailComponent implements OnInit {
  family: Family | null = null;
  isLoading = true;
  errorMessage = '';
  
  // Options pour l'affichage
  priorityLabels: Record<PriorityLevel, string> = {
    [PriorityLevel.High]: 'Haute',
    [PriorityLevel.Medium]: 'Moyenne', 
    [PriorityLevel.Low]: 'Basse'
  };
  
  priorityIcons: Record<PriorityLevel, string> = {
    [PriorityLevel.High]: 'fas fa-exclamation-triangle',
    [PriorityLevel.Medium]: 'fas fa-exclamation-circle',
    [PriorityLevel.Low]: 'fas fa-info-circle'
  };
  
  priorityColors: Record<PriorityLevel, string> = {
    [PriorityLevel.High]: 'priority-high',
    [PriorityLevel.Medium]: 'priority-medium',
    [PriorityLevel.Low]: 'priority-low'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.loadFamily();
  }

  loadFamily(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.errorMessage = 'ID de famille non valide';
      this.isLoading = false;
      return;
    }

    this.familyService.getById(id).subscribe({
      next: (data: Family) => {
        this.family = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement:', error);
        this.errorMessage = 'Impossible de charger les détails de la famille';
        this.isLoading = false;
        // Charger des données mockées pour le développement
        this.loadMockData(id);
      }
    });
  }

  loadMockData(id: string): void {
    // Données mockées pour le développement
    this.family = {
      id: id,
      reference: 'FAM-2025-001',
      headOfFamily: 'Mohamed Ben Ali',
      phone: '12345678',
      address: '15 Rue de la République, Tunis',
      latitude: 36.8065,
      longitude: 10.1815,
      familySize: 6,
      needsDescription: 'Besoin d\'aide alimentaire régulière et de fournitures scolaires pour 4 enfants. La famille a également besoin de vêtements pour l\'hiver et d\'une assistance médicale occasionnelle.',
      priorityLevel: PriorityLevel.Medium,
      notes: 'Famille avec 4 enfants en âge scolaire (8, 10, 12, 14 ans). Le père est travailleur journalier avec un revenu irrégulier. Deux des enfants ont besoin de lunettes.',
      frequentAidTypes: [
        { id: '1', name: 'Colis alimentaire', description: 'Produits alimentaires de base' },
        { id: '4', name: 'Fournitures scolaires', description: 'Cahiers, stylos, cartables' }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    };
    this.isLoading = false;
  }

  editFamily(): void {
    if (this.family) {
      this.router.navigate(['/families', this.family.id, 'edit']);
    }
  }

  deleteFamily(): void {
    if (!this.family) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement la famille "${this.family.headOfFamily}" ?\nCette action est irréversible.`)) {
      this.familyService.delete(this.family.id).subscribe({
        next: () => {
          alert(`Famille "${this.family!.headOfFamily}" supprimée avec succès`);
          this.router.navigate(['/families']);
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la famille');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/families']);
  }

  printDetails(): void {
    window.print();
  }

  shareDetails(): void {
    if (navigator.share && this.family) {
      navigator.share({
        title: `Fiche Famille: ${this.family.headOfFamily}`,
        text: `Famille ${this.family.reference} - ${this.family.headOfFamily}`,
        url: window.location.href
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      alert('Fonction de partage non disponible sur ce navigateur');
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Non disponible';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return 'Date invalide';
    }
  }

  formatDateShort(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(dateObj);
    } catch (error) {
      return 'N/A';
    }
  }

  getGoogleMapsUrl(): string | null {
    if (!this.family?.latitude || !this.family?.longitude) return null;
    return `https://www.google.com/maps?q=${this.family.latitude},${this.family.longitude}`;
  }

  openMap(): void {
    const url = this.getGoogleMapsUrl();
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Localisation non disponible pour cette famille');
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copié dans le presse-papier !');
    }).catch(err => {
      console.error('Erreur lors de la copie:', err);
    });
  }

  getFamilyStatus(): string {
    if (!this.family?.createdAt) return 'Inactive';
    
    const now = new Date();
    const lastUpdate = this.family.updatedAt ? new Date(this.family.updatedAt) : new Date(this.family.createdAt);
    const diffMonths = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (diffMonths < 3) return 'Active';
    if (diffMonths < 6) return 'À vérifier';
    return 'Inactive';
  }

  getStatusColor(): string {
    const status = this.getFamilyStatus();
    switch(status) {
      case 'Active': return 'status-active';
      case 'À vérifier': return 'status-warning';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
  }
}