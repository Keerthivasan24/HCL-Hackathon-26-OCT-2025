import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userName = 'User'; // This should come from auth service or user data
  userId = 1;
  
  // Status tracking
  kycStatus = 'pending'; // pending, completed
  accountStatus = 'not_created'; // not_created, created
  userAccounts: any[] = [];
  totalBalance = 0;
  hasValidKYC = false; // Track if valid KYC exists

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get user data from auth service or local storage
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.userId = parseInt(savedUserId);
    }
    
    // Check cached KYC status first
    this.loadCachedKYCStatus();
    this.checkKYCStatus();
    this.checkAccountStatus();

    // Poll for KYC verification status if pending
    const kycPending = localStorage.getItem('kycPending');
    if (kycPending === 'true') {
      console.log('KYC is pending, checking for verification status...');
      this.pollKYCVerificationStatus();
    }
  }

  private pollKYCVerificationStatus(): void {
    // Poll every 5 seconds to check if KYC is verified
    const interval = setInterval(() => {
      this.checkKYCStatus();
      
      const kycData = sessionStorage.getItem('kycData');
      if (kycData) {
        const kyc = JSON.parse(kycData);
        if (kyc.verified) {
          console.log('KYC is now verified!');
          localStorage.removeItem('kycPending');
          clearInterval(interval);
        }
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      console.log('Stopped polling for KYC verification');
    }, 300000);
  }

  // Method to refresh data when returning from other pages
  refreshData(): void {
    this.loadCachedKYCStatus();
    this.checkKYCStatus();
    this.checkAccountStatus();
  }

  private loadCachedKYCStatus(): void {
    const cachedKYC = localStorage.getItem('kycStatus');
    if (cachedKYC) {
      const kycData = JSON.parse(cachedKYC);
      this.kycStatus = kycData.verified ? 'completed' : 'pending';
      console.log('Loaded cached KYC status:', this.kycStatus);
    }
  }

  private cacheKYCStatus(kycData: any): void {
    localStorage.setItem('kycStatus', JSON.stringify(kycData));
    console.log('Cached KYC status:', kycData);
  }

  navigateToKYC(): void {
    this.router.navigate(['/kyc']);
  }

  navigateToAccountCreate(): void {
    this.router.navigate(['/account-create']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private checkKYCStatus(): void {
    // Check cached KYC data in session storage first
    const cachedKYCData = sessionStorage.getItem('kycData');
    if (cachedKYCData) {
      const kycData = JSON.parse(cachedKYCData);
      if (kycData.kyc_id) {
        this.hasValidKYC = true;
        this.kycStatus = kycData.verified ? 'completed' : 'pending';
        console.log('Loaded KYC data from session storage:', kycData);
      }
    }

    // Check KYC status from backend for fresh data
    this.http.get(`http://127.0.0.1:8000/kyc/user/${this.userId}`).subscribe({
      next: (response: any) => {
        // Store KYC data in session storage
        if (response && response.kyc_id) {
          sessionStorage.setItem('kycData', JSON.stringify(response));
          this.hasValidKYC = true;
          if (response.verified) {
            this.kycStatus = 'completed';
          } else {
            this.kycStatus = 'pending';
          }
        } else {
          this.hasValidKYC = false;
          this.kycStatus = 'pending';
        }
      },
      error: (error) => {
        console.log('KYC not found or not verified');
        this.hasValidKYC = false;
        this.kycStatus = 'pending';
      }
    });
  }

  private checkAccountStatus(): void {
    // First check session storage for account data
    const accountData = sessionStorage.getItem('accountData');
    if (accountData) {
      const account = JSON.parse(accountData);
      this.accountStatus = 'created';
      this.userAccounts = [account];
      this.totalBalance = parseFloat(account.total_balance);
      console.log('Loaded account data from session storage:', account);
    }

    // Also check backend for updated account data
    this.http.get(`http://127.0.0.1:8000/accounts/user/${this.userId}`).subscribe({
      next: (accounts: any) => {
        if (accounts && accounts.length > 0) {
          this.accountStatus = 'created';
          this.userAccounts = accounts;
          this.totalBalance = accounts.reduce((sum: number, account: any) => sum + parseFloat(account.total_balance), 0);
          // Update session storage with latest data
          sessionStorage.setItem('accountData', JSON.stringify(accounts[0]));
        } else {
          this.accountStatus = 'not_created';
        }
      },
      error: (error) => {
        console.log('No accounts found in backend');
        // Keep session storage data if it exists
      }
    });
  }

  isAccountCreationEnabled(): boolean {
    return this.kycStatus === 'completed';
  }
}
