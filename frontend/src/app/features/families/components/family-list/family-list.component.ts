// features/families/components/family-list/family-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FamilyService } from '../../services/family.service';
import { Family, PriorityLevel } from '../../models/family.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-family-list',
  standalone: true,
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css'],
    imports: [CommonModule, FormsModule, RouterModule] // ✅ IMPORTANT
})
export class FamilyListComponent implements OnInit {
  families: Family[] = [];
  filteredFamilies: Family[] = [];
  isLoading = true;
  isDeleting = false;
  searchTerm = '';
  selectedPriority: string = 'ALL';
  totalFamilies = 0;
  window = window;
  // Correspond aux valeurs de l'enum PriorityLevel de Spring Boot
  priorityLevels = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'High', label: 'Haute', enumValue: PriorityLevel.High },
    { value: 'Medium', label: 'Moyenne', enumValue: PriorityLevel.Medium },
    { value: 'Low', label: 'Basse', enumValue: PriorityLevel.Low }
  ];

  constructor(
    private router: Router,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.loadFamilies();
  }

  loadFamilies(): void {
    this.isLoading = true;
    this.familyService.getAll().subscribe({
      next: (data: Family[]) => {
        this.families = data;
        this.filteredFamilies = [...data];
        this.totalFamilies = data.length;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des familles:', error);
        this.isLoading = false;
        // Charger des données mockées pour le développement
        this.loadMockData();
      }
    });
  }

  loadMockData(): void {
    this.families = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        reference: 'FAM-2025-001',
        headOfFamily: 'Mohamed Ben Ali',
        phone: '12345678',
        address: '15 Rue de la République, Tunis',
        latitude: 36.8065,
        longitude: 10.1815,
        familySize: 6,
        needsDescription: 'Besoin d\'aide alimentaire et de fournitures scolaires',
        priorityLevel: PriorityLevel.Medium, // Correspond à l'enum Spring Boot
        notes: 'Famille avec 4 enfants en âge scolaire',
        frequentAidTypes: [],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        reference: 'FAM-2025-002',
        headOfFamily: 'Fatima Trabelsi',
        phone: '23456789',
        address: '45 Avenue Habib Bourguiba, Sfax',
        latitude: 34.7406,
        longitude: 10.7603,
        familySize: 4,
        needsDescription: 'Aide médicale et produits d\'hygiène',
        priorityLevel: PriorityLevel.High,
        notes: 'Mère célibataire avec 3 enfants',
        frequentAidTypes: [],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        reference: 'FAM-2025-003',
        headOfFamily: 'Ali Jabeur',
        phone: '34567890',
        address: '78 Rue du Lac, Bizerte',
        latitude: 37.2744,
        longitude: 9.8739,
        familySize: 5,
        needsDescription: 'Vêtements et couvertures pour l\'hiver',
        priorityLevel: PriorityLevel.Low,
        notes: 'Personne âgée avec famille élargie',
        frequentAidTypes: [],
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        reference: 'FAM-2025-004',
        headOfFamily: 'Salma Ghanmi',
        phone: '45678901',
        address: '32 Avenue de la Liberté, Gabès',
        latitude: 33.8815,
        longitude: 10.0982,
        familySize: 7,
        needsDescription: 'Aide alimentaire mensuelle',
        priorityLevel: PriorityLevel.High,
        notes: 'Famille avec des personnes handicapées',
        frequentAidTypes: [],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        reference: 'FAM-2025-005',
        headOfFamily: 'Karim Hammami',
        phone: '56789012',
        address: '12 Rue des Oliviers, Nabeul',
        latitude: 36.4511,
        longitude: 10.7351,
        familySize: 3,
        needsDescription: 'Aide pour loyer et factures',
        priorityLevel: PriorityLevel.Medium,
        notes: 'Chômeur avec 2 enfants',
        frequentAidTypes: [],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-19')
      }
    ];
    this.filteredFamilies = [...this.families];
    this.totalFamilies = this.families.length;
    this.isLoading = false;
  }

  applyFilters(): void {
    this.filteredFamilies = this.families.filter(family => {
      // Filtre par recherche
      const matchesSearch = !this.searchTerm || 
        family.headOfFamily.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        family.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        family.phone.includes(this.searchTerm) ||
        family.reference.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtre par priorité
      const matchesPriority = this.selectedPriority === 'ALL' || 
        family.priorityLevel === this.selectedPriority;
      
      return matchesSearch && matchesPriority;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onPriorityChange(priority: string): void {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  searchFamilies(): void {
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.familyService.search(this.searchTerm).subscribe({
        next: (data: Family[]) => {
          this.filteredFamilies = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors de la recherche:', error);
          // Si l'API échoue, utiliser le filtrage local
          this.applyFilters();
          this.isLoading = false;
        }
      });
    } else {
      this.applyFilters();
    }
  }

  getFamiliesByPriority(priority: string): void {
    if (priority !== 'ALL') {
      this.isLoading = true;
      this.familyService.findByPriority(priority).subscribe({
        next: (data: Family[]) => {
          this.filteredFamilies = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du filtrage par priorité:', error);
          // Si l'API échoue, utiliser le filtrage local
          this.selectedPriority = priority;
          this.applyFilters();
          this.isLoading = false;
        }
      });
    } else {
      this.selectedPriority = 'ALL';
      this.applyFilters();
    }
  }

  addNewFamily(): void {
    this.router.navigate(['/families/new']);
  }

  viewFamily(id: string): void {
    this.router.navigate(['/families', id]);
  }

  editFamily(id: string): void {
    this.router.navigate(['/families', id, 'edit']);
  }

  deleteFamily(id: string, name: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la famille "${name}" ?\nCette action est irréversible.`)) {
      this.isDeleting = true;
      this.familyService.delete(id).subscribe({
        next: () => {
          // Supprimer de la liste locale
          this.families = this.families.filter(f => f.id !== id);
          this.filteredFamilies = this.filteredFamilies.filter(f => f.id !== id);
          this.totalFamilies = this.families.length;
          this.isDeleting = false;
          
          alert(`Famille "${name}" supprimée avec succès`);
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          this.isDeleting = false;
          alert(`Erreur lors de la suppression de la famille "${name}"`);
        }
      });
    }
  }

 getPriorityClass(priority: any): string {
  // Accepte 'any' et convertit en string
  const priorityStr = String(priority);
  switch(priorityStr) {
    case 'High': return 'priority-high';
    case 'Medium': return 'priority-medium';
    case 'Low': return 'priority-low';
    default: return '';
  }
}

 getPriorityIcon(priority: any): string {
  const priorityStr = String(priority);
  switch(priorityStr) {
    case 'High': return 'fas fa-exclamation-triangle';
    case 'Medium': return 'fas fa-exclamation-circle';
    case 'Low': return 'fas fa-info-circle';
    default: return 'fas fa-circle';
  }
}

getPriorityLabel(priority: any): string {
  const priorityStr = String(priority);
  switch(priorityStr) {
    case 'High': return 'Haute';
    case 'Medium': return 'Moyenne';
    case 'Low': return 'Basse';
    default: return priorityStr;
  }
  }

  getStats() {
    const stats = {
      total: this.families.length,
      highPriority: this.families.filter(f => f.priorityLevel === PriorityLevel.High).length,
      mediumPriority: this.families.filter(f => f.priorityLevel === PriorityLevel.Medium).length,
      lowPriority: this.families.filter(f => f.priorityLevel === PriorityLevel.Low).length,
      totalMembers: this.families.reduce((sum, f) => sum + (f.familySize || 0), 0),
      withLocation: this.families.filter(f => f.latitude && f.longitude).length
    };
    
    return stats;
  }

  getLocationIcon(family: Family): string {
    return family.latitude && family.longitude ? 'fas fa-map-marker-alt' : 'fas fa-map-marker-alt text-muted';
  }

  getLocationTooltip(family: Family): string {
    if (family.latitude && family.longitude) {
      return `Localisation: ${family.latitude.toFixed(4)}, ${family.longitude.toFixed(4)}`;
    }
    return 'Localisation non définie';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
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

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedPriority = 'ALL';
    this.filteredFamilies = [...this.families];
  }

  // Calcule la date de la dernière aide reçue (pour l'affichage)
  getLastAidDate(family: Family): string {
    // À implémenter si vous avez une relation avec les distributions d'aide
    return 'N/A';
  }

  // Export des données
  exportToCSV(): void {
    const headers = ['Référence', 'Chef de famille', 'Téléphone', 'Adresse', 'Membres', 'Priorité', 'Statut'];
    const csvData = this.filteredFamilies.map(family => [
      family.reference,
      family.headOfFamily,
      family.phone,
      family.address,
      family.familySize || 0,
      this.getPriorityLabel(family.priorityLevel),
      family.createdAt ? 'Active' : 'Inactive'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `familles_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printList(): void {
    window.print();
  }

  // Naviguer vers la carte des familles (si implémentée)
  viewOnMap(): void {
    const familiesWithLocation = this.families.filter(f => f.latitude && f.longitude);
    if (familiesWithLocation.length > 0) {
      alert(`${familiesWithLocation.length} familles avec localisation disponible.`);
      // this.router.navigate(['/families/map']); // Si vous avez une page carte
    } else {
      alert('Aucune famille n\'a de localisation définie.');
    }
  }
}