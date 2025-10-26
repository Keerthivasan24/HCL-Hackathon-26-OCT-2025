import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.scss'
})
export class KycComponent implements OnInit {
  // Form fields
  userId = 1; // This should come from auth service
  aadharNumber = '';
  panNumber = '';
  selectedFiles: File[] = [];
  
  // UI state
  isLoading = false;
  showSuccessMessage = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user ID from auth service or local storage
    // For now, using a default value
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.userId = parseInt(savedUserId);
      console.log('Using saved user ID:', this.userId);
    } else {
      console.log('No user ID found, using default:', this.userId);
    }
  }

  onSubmit(): void {
    console.log('KYC form submission started');
    
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    this.showSuccessMessage = false;

    // Validate form
    if (!this.validateForm()) {
      console.log('Form validation failed:', this.errorMessage);
      return;
    }

    console.log('Form validation passed, starting submission...');
    this.isLoading = true;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('user_id', this.userId.toString());
    formData.append('aadhar_number', this.aadharNumber);
    formData.append('pan_number', this.panNumber);

    // Add files if any (backend expects single file parameter)
    if (this.selectedFiles.length > 0) {
      // Send only the first file as the backend expects a single file parameter
      formData.append('kyc_document', this.selectedFiles[0]);
    }

    // Log form data for debugging
    console.log('Form data being sent:', {
      userId: this.userId,
      aadharNumber: this.aadharNumber,
      panNumber: this.panNumber,
      filesCount: this.selectedFiles.length
    });

    // Submit KYC data
    console.log('Making POST request to:', 'http://127.0.0.1:8000/kyc/create');
    this.http.post('http://127.0.0.1:8000/kyc/create', formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        // Store complete KYC data in session storage
        const kycData = {
          kyc_id: response.kyc_id,
          user_id: response.user_id,
          aadhar_number: response.aadhar_number,
          pan_number: response.pan_number,
          kyc_document: response.kyc_document,
          verified: response.verified
        };
        sessionStorage.setItem('kycData', JSON.stringify(kycData));
        console.log('KYC data stored in session storage:', kycData);
        
        // Determine success message based on verification status
        if (response.verified) {
          this.successMessage = 'KYC verification completed successfully! You can now create your bank account.';
        } else {
          this.successMessage = 'KYC verification submitted successfully! Your documents are under review. Verification may take 1-2 business days.';
          // Store that we need to check verification status
          localStorage.setItem('kycPending', 'true');
        }
        
        this.showSuccessMessage = true;
        this.resetForm();
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'KYC submission failed. Please try again.';
        console.error('KYC submission error:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  private validateForm(): boolean {
    if (!this.aadharNumber.trim()) {
      this.errorMessage = 'Aadhar number is required';
      return false;
    }
    if (!this.isValidAadhar(this.aadharNumber)) {
      this.errorMessage = 'Please enter a valid 12-digit Aadhar number';
      return false;
    }
    if (!this.panNumber.trim()) {
      this.errorMessage = 'PAN number is required';
      return false;
    }
    if (!this.isValidPAN(this.panNumber)) {
      this.errorMessage = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
      return false;
    }
    return true;
  }

  private isValidAadhar(aadhar: string): boolean {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  }

  private isValidPAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  }

  private resetForm(): void {
    this.aadharNumber = '';
    this.panNumber = '';
    this.selectedFiles = [];
  }

  clearError(): void {
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
