import axios from 'axios';

class TokenService {
  private token: string | null = null;

  async getValidToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }
    return this.refreshToken();
  }

  private async refreshToken(): Promise<string> {
    try {
      const response = await axios.post('/api/token');
      this.token = response.data.access_token;
      console.log('Nouveau token généré:', this.token);
      if (!this.token) {
        throw new Error('Token non reçu');
      }
      return this.token;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw new Error('Erreur lors du rafraîchissement du token');
    }
  }
}

export const tokenService = new TokenService();