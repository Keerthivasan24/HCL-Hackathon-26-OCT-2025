import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-dropdown',
  template: `
    <div class="profile-dropdown">
      <div class="profile-trigger" (click)="toggleDropdown()">
        <div class="profile-icon">👤</div>
        <span class="user-name">{{ userName }}</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="dropdown-menu" *ngIf="showDropdown" (click)="closeDropdown()">
        <div class="dropdown-item" (click)="logout()">
          <span class="logout-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-dropdown {
      position: relative;
      z-index: 1000;
    }

    .profile-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: white;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .profile-icon {
      font-size: 20px;
    }

    .user-name {
      font-weight: 600;
      color: #2d3748;
      font-size: 14px;
    }

    .dropdown-arrow {
      font-size: 10px;
      color: #718096;
      transition: transform 0.3s ease;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      min-width: 150px;
      overflow: hidden;
      animation: slideDown 0.2s ease-out;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 14px;
      color: #2d3748;
      font-weight: 500;

      &:hover {
        background: #f7fafc;
      }

      .logout-icon {
        font-size: 16px;
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ProfileDropdownComponent {
  showDropdown = false;
  userName = 'User';

  constructor(private router: Router) {
    // Get user name from session storage
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.fullname || 'User';
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    // Clear all storage
    sessionStorage.clear();
    localStorage.clear();
    
    // Redirect to registration
    this.router.navigate(['/auth/register']);
  }
}
