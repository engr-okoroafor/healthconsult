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
    
    const prompt = `As a ${doctorSpecialty}, analyze these symptoms and provide a comprehensive diagnosis:

Symptoms: ${symptoms}
Affected body parts: ${bodyParts.join(', ')}
Severity: ${severity}
Duration: ${duration}

Provide a detailed response with:
1. Most likely condition name
2. Confidence percentage (0-100)
3. Brief description of the condition
4. 5 natural remedies with specific instructions (be very specific with dosages, frequency, and application methods)
5. 5 healing foods and dietary recommendations (include specific foods, preparation methods, and consumption frequency)
6. 3 recommended medications (over-the-counter) with specific brand names, dosages, and usage instructions
7. 4 administration instructions (detailed steps for treatment application)
8. Important warning signs to watch for

Your response should be detailed and practical, with specific examples that a patient can immediately use.

Return your response in the following structure:
condition: condition name
confidence: number
description: description
naturalRemedies: [detailed remedy1, detailed remedy2, ...]
foods: [specific food1 with preparation, specific food2 with preparation, ...]
medications: [specific medication1 with dosage, specific medication2 with dosage, ...]
administration: [detailed instruction1, detailed instruction2, ...]
warning: warning text`;

    try {
      const response = await this.callOpenAIAPI(prompt, systemPrompt);
      
      try {
        // Try to parse as JSON first
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        // If not valid JSON, parse the structured text response
        return this.parseStructuredResponse(response);
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

  private parseStructuredResponse(text: string): any {
    const result: any = {
      condition: "",
      confidence: 75,
      description: "",
      naturalRemedies: [],
      foods: [],
      medications: [],
      administration: [],
      warning: ""
    };
    
    // Extract condition
    const conditionMatch = text.match(/condition:\s*([^\n]+)/i);
    if (conditionMatch) result.condition = conditionMatch[1].trim();
    
    // Extract confidence
    const confidenceMatch = text.match(/confidence:\s*(\d+)/i);
    if (confidenceMatch) result.confidence = parseInt(confidenceMatch[1]);
    
    // Extract description
    const descriptionMatch = text.match(/description:\s*([^\n]+)/i);
    if (descriptionMatch) result.description = descriptionMatch[1].trim();
    
    // Extract natural remedies
    const remediesSection = text.match(/naturalRemedies:\s*\[([\s\S]*?)\]/i);
    if (remediesSection) {
      const remedies = remediesSection[1].split(',').map(item => item.trim()).filter(item => item);
      result.naturalRemedies = remedies.length > 0 ? remedies : [
        "Drink ginger tea with honey 3 times daily (1 teaspoon grated ginger in hot water, steep 10 minutes, add 1 teaspoon honey)",
        "Apply warm compress to affected area for 15-20 minutes, 3-4 times daily",
        "Gargle with salt water (1/2 teaspoon salt in 8oz warm water) every 3 hours for sore throat",
        "Take steam inhalation with 3-5 drops of eucalyptus oil for 10 minutes twice daily",
        "Rest adequately with 7-8 hours of sleep in a slightly elevated position"
      ];
    }
    
    // Extract foods
    const foodsSection = text.match(/foods:\s*\[([\s\S]*?)\]/i);
    if (foodsSection) {
      const foods = foodsSection[1].split(',').map(item => item.trim()).filter(item => item);
      result.foods = foods.length > 0 ? foods : [
        "Chicken soup with garlic, onions, and ginger (1 bowl twice daily)",
        "Fresh citrus fruits like oranges and lemons (2 servings daily for vitamin C)",
        "Turmeric milk: 1 cup warm milk with 1/2 teaspoon turmeric and pinch of black pepper before bed",
        "Leafy greens like spinach and kale in smoothies or lightly steamed (1 cup daily)",
        "Probiotic-rich foods like yogurt with live cultures (1 small bowl daily)"
      ];
    }
    
    // Extract medications
    const medicationsSection = text.match(/medications:\s*\[([\s\S]*?)\]/i);
    if (medicationsSection) {
      const medications = medicationsSection[1].split(',').map(item => item.trim()).filter(item => item);
      result.medications = medications.length > 0 ? medications : [
        "Paracetamol (Tylenol) 500mg tablets: Take 1-2 tablets every 6 hours as needed, not exceeding 8 tablets in 24 hours",
        "Ibuprofen (Advil) 200mg: Take 1-2 tablets every 8 hours with food, not exceeding 6 tablets in 24 hours",
        "Loratadine (Claritin) 10mg: Take 1 tablet daily for allergic symptoms"
      ];
    }
    
    // Extract administration
    const administrationSection = text.match(/administration:\s*\[([\s\S]*?)\]/i);
    if (administrationSection) {
      const administration = administrationSection[1].split(',').map(item => item.trim()).filter(item => item);
      result.administration = administration.length > 0 ? administration : [
        "Take all medications with a full glass of water and after meals to prevent stomach irritation",
        "Apply compresses for the recommended duration and frequency, ensuring the temperature is comfortable",
        "Stay well-hydrated by drinking at least 8-10 glasses of water throughout the day",
        "Monitor your symptoms daily and keep track of any changes or improvements"
      ];
    }
    
    // Extract warning
    const warningMatch = text.match(/warning:\s*([^\n]+)/i);
    if (warningMatch) {
      result.warning = warningMatch[1].trim();
    } else {
      result.warning = "Seek immediate medical attention if symptoms worsen, if you develop high fever, severe pain, difficulty breathing, or if symptoms persist beyond 3-5 days. This AI-generated advice is not a substitute for professional medical care.";
    }
    
    return result;
  }

  private parseTextResponse(text: string): any {
    return {
      condition: "AI-Generated Diagnosis",
      confidence: 75,
      description: text.substring(0, 200) + "...",
      naturalRemedies: [
        "Rest and adequate sleep (8-9 hours nightly in a dark, quiet room)",
        "Stay hydrated with water (at least 8-10 glasses daily, more if feverish)",
        "Apply warm compress to affected areas (15 minutes, 3-4 times daily)",
        "Practice deep breathing exercises (5 minutes, 3 times daily)",
        "Drink ginger and honey tea (1 teaspoon each in hot water, 3 times daily)"
      ],
      foods: [
        "Fresh citrus fruits (oranges, lemons) - 2 servings daily for vitamin C",
        "Bone broth soup with vegetables (1 bowl twice daily)",
        "Leafy greens like spinach and kale (1 cup daily, lightly steamed)",
        "Anti-inflammatory foods like turmeric and ginger (add 1 teaspoon to meals)",
        "Probiotic-rich yogurt with live cultures (1 small bowl daily)"
      ],
      medications: [
        "Paracetamol (Tylenol) 500mg: 1-2 tablets every 6 hours as needed, maximum 8 tablets daily",
        "Ibuprofen (Advil) 200mg: 1-2 tablets every 8 hours with food if pain persists",
        "Loratadine (Claritin) 10mg: 1 tablet daily if allergic symptoms are present"
      ],
      administration: [
        "Take all medications with a full glass of water and after meals to prevent stomach irritation",
        "Apply compresses at the recommended temperature for 15-20 minutes at a time",
        "Increase fluid intake to at least 2-3 liters daily while symptoms persist",
        "Monitor temperature twice daily and keep a symptom journal to track progress"
      ],
      warning: "Seek immediate medical attention if you develop high fever (above 102°F/39°C), severe pain, difficulty breathing, persistent vomiting, or if symptoms worsen after 48 hours of home treatment. This AI-generated advice is not a substitute for professional medical care."
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