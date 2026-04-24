import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  user$ = user(this.auth);

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const email = result.user.email!;
      await this.fetchAndStoreUserData(email);
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed! Dobara try karo.');
    }
  }

  async fetchAndStoreUserData(email: string) {
    const docRef = doc(this.firestore, 'users', email);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      localStorage.setItem('userRole', data['role']);
      localStorage.setItem('userModules', JSON.stringify(data['modules']));
      this.router.navigate(['/dashboard']);
    } else {
      alert('Access denied! Admin se modules assign karwao.');
      await this.logout();
    }
  }

  getUserModules(): string[] {
    const m = localStorage.getItem('userModules');
    return m ? JSON.parse(m) : [];
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  async logout() {
    await signOut(this.auth);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}