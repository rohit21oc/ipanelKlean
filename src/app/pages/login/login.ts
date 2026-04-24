import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  isSignup = false;
  errorMsg = '';
  loading = false;

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
  }

  async submitEmailAuth() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Email aur password daalo!';
      return;
    }

    this.errorMsg = '';
    this.loading = true;

    try {
      if (this.isSignup) {
        await createUserWithEmailAndPassword(this.auth, this.email, this.password);
        this.errorMsg = 'Account created! Admin se modules assign karwao.';
        this.loading = false;
        return;
      }

      // Login
      const result = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const email = result.user.email!;
      await this.authService.fetchAndStoreUserData(email);

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential') {
        this.errorMsg = 'Email or password is wrong!';
      } else if (error.code === 'auth/email-already-in-use') {
        this.errorMsg = 'Email already registered hai!';
      } else if (error.code === 'auth/weak-password') {
        this.errorMsg = 'Password should be at least 6 characters long!';
      } else {
        this.errorMsg = 'Something went wrong: ' + error.message;
      }
    } finally {
      this.loading = false;
    }
  }

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.errorMsg = '';
    this.email = '';
    this.password = '';
  }
}