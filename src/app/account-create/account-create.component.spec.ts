import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AccountCreateComponent } from './account-create.component';
import { of, throwError } from 'rxjs';

describe('AccountCreateComponent', () => {
  let component: AccountCreateComponent;
  let fixture: ComponentFixture<AccountCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCreateComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate initial deposit minimum', () => {
    component.accountType = 'Savings';
    component.initialDeposit = 100;
    
    const result = component['validateForm']();
    
    expect(result).toBe(false);
    expect(component.errorMessage).toBe('Minimum initial deposit is ₹500');
  });

  it('should validate account type is required', () => {
    component.accountType = '';
    component.initialDeposit = 1000;
    
    const result = component['validateForm']();
    
    expect(result).toBe(false);
    expect(component.errorMessage).toBe('Account type is required');
  });

  it('should submit account creation successfully', () => {
    spyOn(component['http'], 'post').and.returnValue(of({
      account_id: 1,
      account_number: 123456789012,
      account_type: 'Savings',
      initial_deposit: 1000,
      total_balance: 1000
    }));
    spyOn(component['router'], 'navigate');
    
    component.accountType = 'Savings';
    component.initialDeposit = 1000;
    component.onSubmit();
    
    expect(component.isLoading).toBe(false);
    expect(component.showSuccessMessage).toBe(true);
  });

  it('should handle account creation error', () => {
    spyOn(component['http'], 'post').and.returnValue(throwError({
      status: 400,
      error: { detail: 'Invalid data' }
    }));
    
    component.accountType = 'Savings';
    component.initialDeposit = 1000;
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Invalid data');
  });

  it('should reset form after submission', () => {
    component.accountType = 'Savings';
    component.initialDeposit = 1000;
    
    component['resetForm']();
    
    expect(component.accountType).toBe('Savings'); // Account type not reset
    expect(component.initialDeposit).toBe(0);
  });
});
