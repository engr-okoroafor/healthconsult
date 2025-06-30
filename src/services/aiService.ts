class AIService {
  private getApiKey(): string | null {
    // Check environment variable first
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey && envKey.trim()) {
      return envKey.trim();
    }
    
    // Fallback to localStorage (for settings override)
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey && storedKey.trim()) {
      return storedKey.trim();
    }
    
    return null;
  }

  private async callOpenAIAPI(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt || 'You are a medical AI assistant. Provide helpful, accurate medical information while emphasizing the importance of consulting healthcare professionals.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  async analyzeImage(imageBase64: string, doctorSpecialty: string, bodyParts: string[], imageType: string): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a ${doctorSpecialty} AI assistant specializing in medical image analysis. Analyze the provided medical image and provide a comprehensive diagnosis.`;

    const prompt = `
Analyze this ${imageType} image focusing on ${bodyParts.join(', ')} and provide:

1. Detailed visual findings
2. Most likely diagnosis with confidence percentage
3. Severity assessment (mild/moderate/severe)
4. Recommended next steps
5. Natural remedies and treatments
6. Recommended foods and supplements
7. Medications if needed
8. Warning signs to watch for

Format as JSON:
{
  "findings": [
    {
      "type": "finding type",
      "description": "detailed description",
      "severity": "mild/moderate/severe",
      "confidence": 0.85
    }
  ],
  "diagnosis": {
    "condition": "primary diagnosis",
    "confidence": 0.90,
    "description": "detailed explanation"
  },
  "naturalRemedies": ["remedy1", "remedy2"],
  "foods": ["food1", "food2"],
  "medications": ["med1", "med2"],
  "warning": "important warnings"
}
`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch {
        return this.parseImageAnalysisResponse(content, doctorSpecialty);
      }
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }

  async generateSymptomDiagnosis(symptoms: string, bodyParts: string[], severity: string, duration: string, doctorSpecialty: string = 'General Physician'): Promise<any> {
    const systemPrompt = `You are a ${doctorSpecialty} AI assistant. Provide comprehensive medical analysis tailored to your specialty.`;
    
    const prompt = `
As a ${doctorSpecialty}, analyze these symptoms and provide a comprehensive diagnosis:

Symptoms: ${symptoms}
Affected body parts: ${bodyParts.join(', ')}
Severity: ${severity}
Duration: ${duration}

Provide a structured response with:
1. Most likely condition name
2. Confidence percentage (0-100)
3. Brief description of the condition
4. 5 natural remedies with specific instructions
5. 5 healing foods and dietary recommendations
6. 3 recommended medications (over-the-counter)
7. 4 administration instructions
8. Important warning signs to watch for

Format as JSON:
{
  "condition": "condition name",
  "confidence": number,
  "description": "description",
  "naturalRemedies": ["remedy1", "remedy2", ...],
  "foods": ["food1", "food2", ...],
  "medications": ["med1", "med2", ...],
  "administration": ["instruction1", "instruction2", ...],
  "warning": "warning text"
}
`;

    try {
      const response = await this.callOpenAIAPI(prompt, systemPrompt);
      
      try {
        return JSON.parse(response);
      } catch {
        return this.parseTextResponse(response);
      }
    } catch (error) {
      console.error('AI diagnosis generation failed:', error);
      throw error;
    }
  }

  async generateTreatmentPlan(condition: string, severity: string, doctorSpecialty: string = 'General Physician'): Promise<any> {
    const systemPrompt = `You are a ${doctorSpecialty} AI assistant. Create comprehensive treatment plans tailored to your specialty.`;
    
    const prompt = `
As a ${doctorSpecialty}, create a comprehensive treatment plan for: ${condition} (${severity} severity)

Provide a detailed treatment plan with:
1. Lifecycle phases (3 phases with descriptions)
2. 6 natural remedies with specific instructions
3. 6 healing foods and dietary recommendations
4. 4 recommended medications
5. 5 recommended exercises
6. Daily schedule with 4 time-based activities
7. 4 prevention tips for future occurrences
8. Possible causes (3-4 causes)

Format as JSON:
{
  "lifecyclePhases": {
    "phase1": "description",
    "phase2": "description", 
    "phase3": "description"
  },
  "naturalRemedies": ["remedy1", ...],
  "foods": ["food1", ...],
  "medications": ["med1", ...],
  "exercises": ["exercise1", ...],
  "dailySchedule": [
    {"time": "08:00", "activity": "activity", "type": "medication"},
    ...
  ],
  "preventionTips": ["tip1", ...],
  "possibleCauses": ["cause1", ...]
}
`;

    try {
      const response = await this.callOpenAIAPI(prompt, systemPrompt);
      
      try {
        return JSON.parse(response);
      } catch {
        return this.parseTreatmentResponse(response);
      }
    } catch (error) {
      console.error('Treatment plan generation failed:', error);
      throw error;
    }
  }

  async generateHealthArticle(topic: string, doctorSpecialty: string = 'General Physician'): Promise<any> {
    const systemPrompt = `You are a ${doctorSpecialty} AI assistant. Write comprehensive health education content from your specialty perspective.`;
    
    const prompt = `
As a ${doctorSpecialty}, write a comprehensive health education article about: ${topic}

Include:
1. Detailed overview (2-3 paragraphs)
2. 6 key points with actionable advice
3. 5 natural treatments with specific instructions
4. Scientific evidence and recent research
5. Prevention strategies
6. When to seek medical attention

Format as JSON:
{
  "title": "article title",
  "overview": "detailed overview text",
  "keyPoints": ["point1", "point2", ...],
  "naturalTreatments": ["treatment1", ...],
  "evidence": "scientific evidence text",
  "prevention": ["strategy1", ...],
  "seekHelp": "when to seek medical attention"
}
`;

    try {
      const response = await this.callOpenAIAPI(prompt, systemPrompt);
      
      try {
        return JSON.parse(response);
      } catch {
        return this.parseArticleResponse(response, topic);
      }
    } catch (error) {
      console.error('Health article generation failed:', error);
      throw error;
    }
  }

  private parseImageAnalysisResponse(text: string, doctorSpecialty: string): any {
    return {
      findings: [
        {
          type: "AI Visual Analysis",
          description: `${doctorSpecialty} analysis: ${text.substring(0, 200)}...`,
          severity: "moderate",
          confidence: 0.75
        }
      ],
      diagnosis: {
        condition: "AI-Generated Analysis",
        confidence: 0.75,
        description: text.substring(0, 300) + "..."
      },
      naturalRemedies: [
        "Rest and adequate sleep",
        "Stay hydrated with water",
        "Apply warm or cold compress as appropriate",
        "Practice stress reduction techniques",
        "Maintain healthy diet"
      ],
      foods: [
        "Fresh fruits and vegetables",
        "Lean proteins",
        "Whole grains",
        "Anti-inflammatory foods",
        "Plenty of fluids"
      ],
      medications: [
        "Over-the-counter pain relievers as needed",
        "Consult pharmacist for recommendations",
        "Follow package instructions"
      ],
      warning: "Consult a healthcare professional for proper diagnosis and treatment."
    };
  }

  private parseTextResponse(text: string): any {
    return {
      condition: "AI-Generated Diagnosis",
      confidence: 75,
      description: text.substring(0, 200) + "...",
      naturalRemedies: [
        "Rest and adequate sleep",
        "Stay hydrated with water",
        "Apply warm or cold compress",
        "Practice stress reduction",
        "Maintain healthy diet"
      ],
      foods: [
        "Fresh fruits and vegetables",
        "Lean proteins",
        "Whole grains",
        "Anti-inflammatory foods",
        "Plenty of fluids"
      ],
      medications: [
        "Over-the-counter pain relievers as needed",
        "Consult pharmacist for recommendations",
        "Follow package instructions"
      ],
      administration: [
        "Take medications with food",
        "Follow recommended dosages",
        "Monitor symptoms closely",
        "Seek medical attention if worsening"
      ],
      warning: "Consult a healthcare professional if symptoms persist or worsen."
    };
  }

  private parseTreatmentResponse(text: string): any {
    return {
      lifecyclePhases: {
        phase1: "Immediate relief and symptom management",
        phase2: "Active treatment and healing",
        phase3: "Recovery and prevention"
      },
      naturalRemedies: [
        "Rest and adequate sleep",
        "Stress reduction techniques",
        "Natural anti-inflammatory foods",
        "Gentle exercise as tolerated",
        "Hydration therapy",
        "Herbal remedies as appropriate"
      ],
      foods: [
        "Anti-inflammatory foods",
        "Fresh fruits and vegetables",
        "Lean proteins",
        "Whole grains",
        "Healthy fats",
        "Adequate hydration"
      ],
      medications: [
        "Over-the-counter pain relief",
        "Anti-inflammatory medications",
        "Topical treatments",
        "Supplements as recommended"
      ],
      exercises: [
        "Gentle stretching",
        "Light walking",
        "Breathing exercises",
        "Range of motion activities",
        "Gradual activity increase"
      ],
      dailySchedule: [
        { time: "08:00", activity: "Morning medication and breakfast", type: "medication" },
        { time: "12:00", activity: "Healthy lunch and light exercise", type: "nutrition" },
        { time: "18:00", activity: "Evening medication", type: "medication" },
        { time: "21:00", activity: "Relaxation and preparation for sleep", type: "wellness" }
      ],
      preventionTips: [
        "Maintain healthy lifestyle",
        "Regular exercise routine",
        "Stress management",
        "Adequate sleep"
      ],
      possibleCauses: [
        "Lifestyle factors",
        "Environmental triggers",
        "Genetic predisposition",
        "Previous injuries or conditions"
      ]
    };
  }

  private parseArticleResponse(text: string, topic: string): any {
    return {
      title: `Understanding ${topic}: A Comprehensive Guide`,
      overview: text.substring(0, 300) + "...",
      keyPoints: [
        "Understanding the condition",
        "Recognizing symptoms early",
        "Lifestyle modifications",
        "Treatment options",
        "Prevention strategies",
        "Long-term management"
      ],
      naturalTreatments: [
        "Dietary modifications",
        "Herbal remedies",
        "Physical therapy",
        "Stress management",
        "Sleep optimization"
      ],
      evidence: "Recent research supports the effectiveness of natural treatments combined with conventional medicine.",
      prevention: [
        "Regular health screenings",
        "Healthy diet and exercise",
        "Stress management",
        "Adequate sleep"
      ],
      seekHelp: "Seek immediate medical attention if symptoms are severe, persistent, or worsening."
    };
  }

  isConfigured(): boolean {
    return !!this.getApiKey();
  }
}

export const aiService = new AIService();