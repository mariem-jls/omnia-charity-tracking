// features/families/components/family-form/family-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { FamilyService } from '../../services/family.service';
import { Family, PriorityLevel, FamilyCreateRequest, FamilyUpdateRequest } from '../../models/family.models';

@Component({
  selector: 'app-family-form',
  standalone: true,
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class FamilyFormComponent implements OnInit {
  familyForm: FormGroup;
  isEditMode = false;
  familyId: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Options pour les select
  priorityLevels = Object.values(PriorityLevel);
  
  // Exemple de types d'aide fréquents
  frequentAidTypes = [
    { id: '1', name: 'Colis alimentaire' },
    { id: '2', name: 'Médicaments' },
    { id: '3', name: 'Vêtements' },
    { id: '4', name: 'Fournitures scolaires' },
    { id: '5', name: 'Aide financière' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private familyService: FamilyService
  ) {
    this.familyForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.familyId = params['id'];
        this.loadFamily(this.familyId!);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      headOfFamily: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      address: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      familySize: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      needsDescription: [''],
      priorityLevel: [PriorityLevel.Medium, Validators.required],
      notes: [''],
      frequentAidTypes: [[]] // Tableau d'IDs
    });
  }

  loadFamily(id: string): void {
    this.isLoading = true;
    this.familyService.getById(id).subscribe({
      next: (family: Family) => {
        // Convertir les frequentAidTypes en tableau d'IDs
        const frequentAidTypeIds = family.frequentAidTypes?.map(aid => aid.id) || [];
        
        this.familyForm.patchValue({
          ...family,
          frequentAidTypes: frequentAidTypeIds
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement:', error);
        this.errorMessage = 'Impossible de charger la famille';
        this.isLoading = false;
        
        // Pour le développement, charger des données mockées
        if (this.isEditMode) {
          this.loadMockData();
        }
      }
    });
  }

  loadMockData(): void {
    // Données mockées pour le développement
    const mockFamily = {
      headOfFamily: 'Mohamed Ben Ali',
      phone: '12345678',
      address: '15 Rue de la République, Tunis',
      latitude: 36.8065,
      longitude: 10.1815,
      familySize: 6,
      needsDescription: 'Besoin d\'aide alimentaire et de fournitures scolaires',
      priorityLevel: PriorityLevel.Medium,
      notes: 'Famille avec 4 enfants en âge scolaire',
      frequentAidTypes: ['1', '4'] // IDs des types d'aide
    };
    
    this.familyForm.patchValue(mockFamily);
    this.isLoading = false;
  }

  onSubmit(): void {
    if (this.familyForm.invalid) {
      this.markFormGroupTouched(this.familyForm);
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const formValue = this.familyForm.value;
    
    if (this.isEditMode && this.familyId) {
      const updateDto: FamilyUpdateRequest = formValue;
      
      this.familyService.update(this.familyId, updateDto).subscribe({
        next: (updatedFamily) => {
          this.successMessage = 'Famille mise à jour avec succès!';
          this.isLoading = false;
          
          // Redirection après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/families', updatedFamily.id]);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.errorMessage = 'Erreur lors de la mise à jour de la famille';
          this.isLoading = false;
        }
      });
    } else {
      const createDto: FamilyCreateRequest = {
        ...formValue,
        reference: this.generateReference()
      };
      
      this.familyService.create(createDto).subscribe({
        next: (newFamily) => {
          this.successMessage = 'Famille créée avec succès!';
          this.isLoading = false;
          
          // Redirection après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/families', newFamily.id]);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Erreur lors de la création:', error);
          this.errorMessage = 'Erreur lors de la création de la famille';
          this.isLoading = false;
        }
      });
    }
  }

  generateReference(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FAM-${year}${month}-${random}`;
  }

  onCancel(): void {
    if (this.familyForm.dirty) {
      if (confirm('Les modifications non sauvegardées seront perdues. Continuer ?')) {
        this.router.navigate(['/families']);
      }
    } else {
      this.router.navigate(['/families']);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Méthodes utilitaires pour le template
  getPriorityLabel(priority: PriorityLevel): string {
    switch(priority) {
      case PriorityLevel.High: return 'Haute';
      case PriorityLevel.Medium: return 'Moyenne';
      case PriorityLevel.Low: return 'Basse';
      default: return priority;
    }
  }

  // Getters pour faciliter l'accès aux champs
  get headOfFamily() { return this.familyForm.get('headOfFamily'); }
  get phone() { return this.familyForm.get('phone'); }
  get address() { return this.familyForm.get('address'); }
  get familySize() { return this.familyForm.get('familySize'); }
  get priorityLevel() { return this.familyForm.get('priorityLevel'); }

  // Pour les checkbox multiples
  onAidTypeChange(event: any, aidTypeId: string): void {
    const frequentAidTypes = this.familyForm.get('frequentAidTypes')?.value || [];
    
    if (event.target.checked) {
      frequentAidTypes.push(aidTypeId);
    } else {
      const index = frequentAidTypes.indexOf(aidTypeId);
      if (index > -1) {
        frequentAidTypes.splice(index, 1);
      }
    }
    
    this.familyForm.get('frequentAidTypes')?.setValue(frequentAidTypes);
  }

  isAidTypeSelected(aidTypeId: string): boolean {
    const frequentAidTypes = this.familyForm.get('frequentAidTypes')?.value || [];
    return frequentAidTypes.includes(aidTypeId);
  }
}