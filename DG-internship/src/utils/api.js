const API_BASE_URL = 'https://tjufwmnunr.ap-northeast-1.awsapprunner.com/api/v1';

export const apiClient = {
  async getApps() {
    try {
      const response = await fetch(`${API_BASE_URL}/apps`);
      if (!response.ok) {
        throw new Error('Failed to fetch apps');
      }
      const data = await response.json();
      return data.apps || [];
    } catch (error) {
      console.error('Error fetching apps:', error);
      throw error;
    }
  }
};