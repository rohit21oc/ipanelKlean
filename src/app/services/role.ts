import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

export interface UserRole {
  email: string;
  role: string;
  modules: string[];
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private firestore = inject(Firestore);

  // User ka data Firestore se fetch karo
  async getUserData(email: string): Promise<UserRole | null> {
    try {
      const docRef = doc(this.firestore, 'users', email);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as UserRole;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  // Naya user add karo (admin ke liye)
  async addUser(userData: UserRole): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'users', userData.email);
      await setDoc(docRef, userData);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  // Local storage se modules lo
  getAllowedModules(): string[] {
    const m = localStorage.getItem('userModules');
    return m ? JSON.parse(m) : [];
  }

  // Local storage se role lo
  getCurrentRole(): string {
    return localStorage.getItem('userRole') || '';
  }
}