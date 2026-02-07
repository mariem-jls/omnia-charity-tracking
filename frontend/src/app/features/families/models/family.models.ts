// features/families/models/family.model.ts
export interface Family {
  id: string;
  reference: string;
  headOfFamily: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  familySize?: number;
  needsDescription?: string;
  priorityLevel: PriorityLevel;
  notes?: string;
  frequentAidTypes: AidType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PriorityLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface AidType {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  price?: number;
  // Ajoutez d'autres propriétés selon votre modèle AidType
}

export interface FamilyCreateRequest {
  reference?: string;
  headOfFamily: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  familySize?: number;
  needsDescription?: string;
  priorityLevel: PriorityLevel;
  notes?: string;
  frequentAidTypes?: string[];
}

export interface FamilyUpdateRequest {
  headOfFamily?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  familySize?: number;
  needsDescription?: string;
  priorityLevel?: PriorityLevel;
  notes?: string;
  frequentAidTypes?: string[];
}