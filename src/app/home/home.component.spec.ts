import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cached KYC status on init', () => {
    // Set up localStorage
    localStorage.setItem('kycStatus', JSON.stringify({ verified: true, kyc_id: 1 }));
    
    fixture.detectChanges();
    
    expect(component.kycStatus).toBe('completed');
  });

  it('should check KYC status when valid KYC exists', () => {
    spyOn(component['http'], 'get').and.returnValue(of({
      kyc_id: 1,
      verified: true,
      user_id: 1
    }));
    
    component.checkKYCStatus();
    
    expect(component.hasValidKYC).toBe(true);
    expect(component.kycStatus).toBe('completed');
  });

  it('should set pending status when no KYC exists', () => {
    spyOn(component['http'], 'get').and.returnValue(throwError({ status: 404 }));
    
    component.checkKYCStatus();
    
    expect(component.hasValidKYC).toBe(false);
    expect(component.kycStatus).toBe('pending');
  });

  it('should enable account creation when KYC is completed', () => {
    component.kycStatus = 'completed';
    
    expect(component.isAccountCreationEnabled()).toBe(true);
  });

  it('should disable account creation when KYC is pending', () => {
    component.kycStatus = 'pending';
    
    expect(component.isAccountCreationEnabled()).toBe(false);
  });

  it('should navigate to KYC page', () => {
    spyOn(component['router'], 'navigate');
    
    component.navigateToKYC();
    
    expect(component['router'].navigate).toHaveBeenCalledWith(['/kyc']);
  });

  it('should navigate to account create page', () => {
    spyOn(component['router'], 'navigate');
    
    component.navigateToAccountCreate();
    
    expect(component['router'].navigate).toHaveBeenCalledWith(['/account-create']);
  });
});
