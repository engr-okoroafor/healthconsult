class TavusService {
  private apiKey: string;
  private baseURL = 'https://tavusapi.com/v2';

  constructor() {
    // Try environment variable first, then localStorage for settings override
    this.apiKey = this.getApiKey();
  }

  private getApiKey(): string {
    // Check localStorage first (for settings override)
    const storedKey = localStorage.getItem('tavus_api_key');
    if (storedKey && storedKey.trim() && storedKey.length > 10) {
      return storedKey.trim();
    }
    
    // Fallback to environment variable
    const envKey = import.meta.env.VITE_TAVUS_API_KEY || '';
    return envKey;
  }

  async getReplicaStatus(replicaId: string): Promise<any> {
    // For demo purposes, return mock data if API key is not configured
    if (!this.isConfigured()) {
      return {
        id: replicaId,
        status: 'completed',
        thumbnail_video_url: null
      };
    }
    
    try {
      const response = await fetch(`${this.baseURL}/replicas/${replicaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus replica status check failed:', error);
      throw error;
    }
  }

  async startConsultation(replicaId: string, personaId: string): Promise<any> {
    // For demo purposes, return mock data if API key is not configured
    if (!this.isConfigured()) {
      return {
        conversation_id: `demo-${Date.now()}`,
        status: 'active',
        video_url: null
      };
    }
    
    try {
      const response = await fetch(`${this.baseURL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          replica_id: replicaId,
          persona_id: personaId,
          callback_url: `${window.location.origin}/api/tavus/callback`
        })
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus consultation start failed:', error);
      throw error;
    }
  }

  async endConsultation(conversationId: string): Promise<any> {
    // For demo purposes, return mock data if API key is not configured
    if (!this.isConfigured() || conversationId.startsWith('demo-')) {
      return {
        status: 'ended'
      };
    }
    
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      // Handle empty response
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.error('Tavus consultation end failed:', error);
      // Return success to prevent UI from getting stuck
      return { success: true };
    }
  }

  async getConversationStatus(conversationId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus status check failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    const apiKey = this.getApiKey();
    return !!apiKey && apiKey.length > 10;
  }
}

export const tavusService = new TavusService();