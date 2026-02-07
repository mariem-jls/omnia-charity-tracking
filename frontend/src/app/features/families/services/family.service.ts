// features/families/services/family.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Family, FamilyCreateRequest, FamilyUpdateRequest } from '../models/family.models';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private apiUrl = 'http://localhost:8081/api/families';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Family[]> {
    return this.http.get<Family[]>(this.apiUrl);
  }

  getById(id: string): Observable<Family> {
    return this.http.get<Family>(`${this.apiUrl}/${id}`);
  }

  create(family: FamilyCreateRequest): Observable<Family> {
    return this.http.post<Family>(this.apiUrl, family);
  }

  update(id: string, family: FamilyUpdateRequest): Observable<Family> {
    return this.http.put<Family>(`${this.apiUrl}/${id}`, family);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Family[]> {
    return this.http.get<Family[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }

  findByPriority(priority: string): Observable<Family[]> {
    return this.http.get<Family[]>(`${this.apiUrl}/priority/${priority}`);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // Méthode pour vérifier si une référence existe
  checkReferenceExists(reference: string): Observable<boolean> {
    // À implémenter si votre API le supporte
    // Sinon, vérification côté client
    return new Observable(subscriber => {
      this.getAll().subscribe({
        next: (families) => {
          const exists = families.some(f => f.reference === reference);
          subscriber.next(exists);
          subscriber.complete();
        },
        error: (error) => {
          console.error('Erreur lors de la vérification de la référence:', error);
          subscriber.next(false);
          subscriber.complete();
        }
      });
    });
  }
}