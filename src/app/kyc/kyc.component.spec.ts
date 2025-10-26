import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { KycComponent } from './kyc.component';
import { of, throwError } from 'rxjs';

describe('KycComponent', () => {
  let component: KycComponent;
  let fixture: ComponentFixture<KycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate Aadhar number format', () => {
    component.aadharNumber = '123456789012';
    component.panNumber = 'ABCDE1234F';
    
    const result = component['validateForm']();
    
    expect(result).toBe(true);
  });

  it('should fail validation for invalid Aadhar number', () => {
    component.aadharNumber = '12345';
    component.panNumber = 'ABCDE1234F';
    
    const result = component['validateForm']();
    
    expect(result).toBe(false);
    expect(component.errorMessage).toBe('Please enter a valid 12-digit Aadhar number');
  });

  it('should fail validation for invalid PAN number', () => {
    component.aadharNumber = '123456789012';
    component.panNumber = 'INVALID';
    
    const result = component['validateForm']();
    
    expect(result).toBe(false);
    expect(component.errorMessage).toBe('Please enter a valid PAN number (e.g., ABCDE1234F)');
  });

  it('should submit KYC form successfully', () => {
    spyOn(component['http'], 'post').and.returnValue(of({
      kyc_id: 1,
      verified: true,
      user_id: 1
    }));
    spyOn(component['router'], 'navigate');
    spyOn(localStorage, 'setItem');
    
    component.aadharNumber = '123456789012';
    component.panNumber = 'ABCDE1234F';
    component.onSubmit();
    
    expect(component.isLoading).toBe(false);
    expect(component.showSuccessMessage).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('kycStatus', '{"verified":true}');
  });

  it('should handle KYC submission error', () => {
    spyOn(component['http'], 'post').and.returnValue(throwError({
      error: { detail: 'User not found' }
    }));
    
    component.aadharNumber = '123456789012';
    component.panNumber = 'ABCDE1234F';
    component.onSubmit();
    
    expect(component.errorMessage).toBe('User not found');
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(1024)).toBe('1 KB');
    expect(component.formatFileSize(0)).toBe('0 Bytes');
  });

  it('should remove file from selected files', () => {
    const file1 = new File([''], 'test1.pdf');
    const file2 = new File([''], 'test2.pdf');
    component.selectedFiles = [file1, file2];
    
    component.removeFile(0);
    
    expect(component.selectedFiles.length).toBe(1);
    expect(component.selectedFiles[0]).toBe(file2);
  });
});
