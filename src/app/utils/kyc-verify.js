// Test Script to Verify KYC
// Run this in browser console after KYC submission

async function verifyKYC(userId) {
  try {
    // First get the KYC data
    const response = await fetch(`http://127.0.0.1:8000/kyc/user/${userId}`);
    const kycData = await response.json();
    
    console.log('Current KYC data:', kycData);
    
    // Verify the KYC
    const verifyResponse = await fetch(`http://127.0.0.1:8000/kyc/verify/${kycData.kyc_id}`, {
      method: 'PATCH'
    });
    
    const verifyResult = await verifyResponse.json();
    console.log('Verification result:', verifyResult);
    
    // Update session storage
    kycData.verified = true;
    sessionStorage.setItem('kycData', JSON.stringify(kycData));
    localStorage.removeItem('kycPending');
    
    console.log('✓ KYC verified and cached!');
    return verifyResult;
  } catch (error) {
    console.error('Error verifying KYC:', error);
  }
}

// Usage: verifyKYC(7) - replace 7 with your user_id
console.log('KYC Verify function loaded. Usage: verifyKYC(userId)');
