async function testAnalytics() {
  try {
    // 1. Login to get token
    const loginRes = await fetch('http://127.0.0.1:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@amu.edu', password: 'password123' })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.token) {
      console.error('Login failed:', loginData);
      return;
    }
    
    // 2. Fetch stats
    const statsRes = await fetch('http://127.0.0.1:5001/api/analytics/stats', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    const statsText = await statsRes.text();
    console.log('Stats Response Status:', statsRes.status);
    console.log('Stats Response Body:', statsText);

  } catch (err) {
    console.error(err);
  }
}

testAnalytics();
