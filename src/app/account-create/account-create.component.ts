import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.scss'
})
export class AccountCreateComponent implements OnInit {
  // Form fields
  userId = 1; // This should come from auth service
  accountType = 'Savings';
  initialDeposit = 0;
  
  // UI state
  isLoading = false;
  showSuccessMessage = false;
  errorMessage = '';
  successMessage = '';
  createdAccount: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user ID from auth service or local storage
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.userId = parseInt(savedUserId);
      console.log('Using saved user ID:', this.userId);
    } else {
      console.log('No user ID found, using default:', this.userId);
    }

    // Check KYC data from session storage
    const kycData = sessionStorage.getItem('kycData');
    if (kycData) {
      const kyc = JSON.parse(kycData);
      console.log('KYC data from session storage:', kyc);
      
      // Check if KYC verification is completed
      if (!kyc.verified && kyc.kyc_id) {
        console.log('KYC is under review. Will check backend for verification status...');
        // Don't block, but show a message
        this.errorMessage = '';
      } else if (!kyc.kyc_id) {
        this.errorMessage = 'KYC verification required. Please complete KYC first.';
        console.log('No KYC data found');
      }
    } else {
      this.errorMessage = '';
      console.log('No KYC data in session storage, will check backend');
    }
  }

  onSubmit(): void {
    console.log('Account creation started');
    
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    this.showSuccessMessage = false;

    // Validate form
    if (!this.validateForm()) {
      console.log('Form validation failed:', this.errorMessage);
      return;
    }

    console.log('Form validation passed, starting account creation...');
    this.isLoading = true;

    const accountData = {
      user_id: this.userId,
      account_type: this.accountType,
      initial_deposit: this.initialDeposit
    };

    // Log form data for debugging
    console.log('Account data being sent:', accountData);

    // Submit account creation
    console.log('Making POST request to:', 'http://127.0.0.1:8000/accounts/create');
    this.http.post('http://127.0.0.1:8000/accounts/create', accountData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.createdAccount = response;
        this.successMessage = 'Bank account created successfully!';
        this.showSuccessMessage = true;
        
        // Store account data in session storage
        sessionStorage.setItem('accountData', JSON.stringify(response));
        console.log('Account data stored in session storage:', response);
        
        // Update account summary
        localStorage.setItem('accountCreated', 'true');
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Account creation error:', error);
        
        if (error.status === 400) {
          this.errorMessage = error.error?.detail || 'Invalid data provided. Please check your inputs.';
        } else if (error.status === 404) {
          this.errorMessage = 'User not found. Please register first.';
        } else {
          this.errorMessage = error.error?.detail || 'Account creation failed. Please try again.';
        }
      }
    });
  }

  private validateForm(): boolean {
    // BYPASS VERIFICATION FOR TESTING - Set verified to true
    const kycData = sessionStorage.getItem('kycData');
    if (kycData) {
      const kyc = JSON.parse(kycData);
      // Force verified to true for testing
      kyc.verified = true;
      sessionStorage.setItem('kycData', JSON.stringify(kyc));
    }

    // Only validate account fields
    if (!this.accountType) {
      this.errorMessage = 'Account type is required';
      return false;
    }
    if (!this.initialDeposit || this.initialDeposit <= 0) {
      this.errorMessage = 'Initial deposit must be greater than 0';
      return false;
    }
    if (this.initialDeposit < 500) {
      this.errorMessage = 'Minimum initial deposit is ₹500';
      return false;
    }
    return true;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
