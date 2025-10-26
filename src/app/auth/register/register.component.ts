import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fullname = '';
  email_id = '';
  password = '';
  place = '';
  location = '';
  state = '';
  selectedFile: File | null = null;
  
  // UI state management
  isLoading = false;
  showSuccessMessage = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    this.showSuccessMessage = false;

    // Basic validation
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const user = {
      fullname: this.fullname,
      email_id: this.email_id,
      password: this.password,
      place: this.place,
      location: this.location,
      state: this.state
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Welcome to our platform.';
        this.showSuccessMessage = true;
        this.resetForm();
        
        // Save user data
        if (response.user_id) {
          // Save user ID
          localStorage.setItem('userId', response.user_id.toString());
          
          // Save complete user data in session storage
          const userData = {
            user_id: response.user_id,
            fullname: response.fullname,
            email_id: response.email_id,
            place: response.place,
            location: response.location,
            state: response.state
          };
          sessionStorage.setItem('userData', JSON.stringify(userData));
          console.log('User data saved to session storage:', userData);
        }
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  private validateForm(): boolean {
    if (!this.fullname.trim()) {
      this.errorMessage = 'Full name is required';
      return false;
    }
    if (!this.email_id.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }
    if (!this.isValidEmail(this.email_id)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    if (!this.password.trim()) {
      this.errorMessage = 'Password is required';
      return false;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    if (!this.place.trim()) {
      this.errorMessage = 'Place is required';
      return false;
    }
    if (!this.location.trim()) {
      this.errorMessage = 'Location is required';
      return false;
    }
    if (!this.state.trim()) {
      this.errorMessage = 'State is required';
      return false;
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm(): void {
    this.fullname = '';
    this.email_id = '';
    this.password = '';
    this.place = '';
    this.location = '';
    this.state = '';
    this.selectedFile = null;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
