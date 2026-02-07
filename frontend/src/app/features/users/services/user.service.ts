import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  User, 
  Role, 
  CreateUserDTO, 
  UpdateUserDTO,
  LoginDTO,
  AuthResponse 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  // CRUD Operations
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(userData: CreateUserDTO): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(id: string, userData: UpdateUserDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Auth Operations
  login(credentials: LoginDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  // Status Management
  activateUser(id: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateUser(id: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // Filter Operations
  getUsersByRole(role: Role): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/active`);
  }
}