import axios from 'axios';
import { expect } from 'chai';

describe('Password Policy Enforcement', function() {
  this.timeout(10000); // 10 seconds timeout

  it('should enforce strong password policies', async () => {
    const url = 'http://localhost:5500/api/auth/signup';
    const weakPassword = '12345'; // Example of a weak password
    
    try {
      const response = await axios.post(url, {
        firstName: "Test",
        lastName: "User",
        email: "weakpassword@example.com",
        password: weakPassword
      });

      // The server should reject this weak password
      expect(response.status).to.equal(400);
    } catch (error) {
      expect(error.response.status).to.equal(400); // Ensure the request is rejected
      expect(error.response.data.msg).to.include('Password must be stronger'); // Adjust based on your server's error message
    }
  });
});
