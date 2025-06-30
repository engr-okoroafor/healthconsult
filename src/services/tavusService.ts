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
    if (storedKey && storedKey.trim()) {
      return storedKey.trim();
    }
    
    // Fallback to environment variable
    return import.meta.env.VITE_TAVUS_API_KEY || '';
  }

  async getReplicaStatus(replicaId: string): Promise<any> {
    try {
      if (!this.isConfigured()) {
        console.warn('Tavus API key not configured, returning mock status');
        return { status: 'completed', message: 'Demo mode - replica ready' };
      }

      const response = await fetch(`${this.baseURL}/replicas/${replicaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        let errorMessage = `Tavus API error: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.text();
          if (errorBody) {
            console.error('Tavus API error body:', errorBody);
            errorMessage += ` - ${errorBody}`;
          }
        } catch (parseError) {
          console.error('Could not parse Tavus error response:', parseError);
        }
        console.error('Full Tavus error details:', { status: response.status, statusText: response.statusText, url: response.url });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus replica status check failed:', error);
      throw error;
    }
  }

  async startConsultation(replicaId: string, personaId: string): Promise<any> {
    try {
      if (!this.isConfigured()) {
        console.warn('Tavus API key not configured, returning mock conversation for replica:', replicaId);
        return { 
          conversation_id: `demo_${Date.now()}`,
          status: 'active',
          message: 'Demo conversation started',
          video_url: null
        };
      }

      // Check if this is a demo replica ID
      if (replicaId.startsWith('demo-replica-') || personaId.startsWith('demo-persona-')) {
        console.warn('Demo IDs detected, returning mock conversation:', { replicaId, personaId });
        return { 
          conversation_id: `demo_${Date.now()}`,
          status: 'active',
          message: 'Demo conversation started with demo replica',
          video_url: null
        };
      }

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
        let errorMessage = `Tavus API error: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.text();
          if (errorBody) {
            console.error('Tavus API error body:', errorBody);
            errorMessage += ` - ${errorBody}`;
          }
        } catch (parseError) {
          console.error('Could not parse Tavus error response:', parseError);
        }
        console.error('Full Tavus error details:', { status: response.status, statusText: response.statusText, url: response.url });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus consultation start failed:', error);
      throw error;
    }
  }

  async endConsultation(conversationId: string): Promise<any> {
    try {
      // For demo purposes, if no API key, return mock response
      if (!this.isConfigured()) {
        return { success: true, message: "Conversation ended successfully (demo mode)" };
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

        // First get response as text
        const text = await response.text();
        
        // If empty response, return success object
        if (!text || text.trim() === '') {
          return { success: true, message: "Conversation ended successfully" };
        }
        
        // Try to parse as JSON
        try {
          const data = JSON.parse(text);
          return data;
        } catch (parseError) {
          console.warn('Could not parse Tavus response as JSON:', parseError);
          return { success: true, message: "Conversation ended successfully" };
        }
      } catch (error) {
        console.error('Tavus consultation end failed:', error);
        // Return a fallback success response to prevent UI errors
        return { success: true, message: "Conversation ended (fallback response)" };
      }
    } catch (error) {
      console.error('Tavus consultation end failed:', error);
      throw error;
    }
  }

  async getConversationStatus(conversationId: string): Promise<any> {
    try {
      if (!this.isConfigured()) {
        return { status: 'active', message: 'Demo conversation status' };
      }

      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        let errorMessage = `Tavus API error: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.text();
          if (errorBody) {
            console.error('Tavus API error body:', errorBody);
            errorMessage += ` - ${errorBody}`;
          }
        } catch (parseError) {
          console.error('Could not parse Tavus error response:', parseError);
        }
        console.error('Full Tavus error details:', { status: response.status, statusText: response.statusText, url: response.url });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus status check failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 10;
  }
}

export const tavusService = new TavusService();