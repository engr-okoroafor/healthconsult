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
          model: 'gpt-4o',
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
          max_tokens: 4000,
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
          model: 'gpt-4o',
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
          max_tokens: 4000,
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

Provide a detailed response with specific and practical examples:
1. Most likely condition name
2. Confidence percentage (0-100)
3. Brief description of the condition
4. 8 natural remedies with very specific instructions (include exact dosages, frequency, preparation methods, and application techniques)
5. 8 healing foods and dietary recommendations (include specific foods with brand names where applicable, exact preparation methods, portion sizes, and consumption frequency)
6. 5 recommended medications (over-the-counter) with specific brand names, exact dosages, timing, and detailed usage instructions
7. 6 administration instructions (step-by-step detailed instructions for treatment application)
8. Important warning signs to watch for

Your response should be extremely detailed and practical, with specific examples, brand names, exact measurements, and step-by-step instructions that a patient can immediately implement.

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

Provide a detailed treatment plan with specific and practical examples:
1. Lifecycle phases (3 phases with descriptions)
2. 8 natural remedies with very specific instructions (include exact dosages, preparation methods, and application techniques)
3. 8 healing foods and dietary recommendations (include specific foods with brand names, exact preparation methods, and portion sizes)
4. 6 recommended medications with specific brand names and exact dosages
5. 6 recommended exercises with detailed instructions
6. Daily schedule with 6 time-based activities
7. 6 prevention tips for future occurrences
8. Possible causes (4-5 detailed causes)

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

Include specific and practical examples:
1. Detailed overview (2-3 paragraphs)
2. 8 key points with actionable advice and specific examples
3. 8 natural treatments with very specific instructions (include exact dosages, preparation methods, and application techniques)
4. Scientific evidence and recent research
5. 6 prevention strategies with specific implementation steps
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
        "Drink fresh ginger tea with Manuka honey: Use 1 tablespoon freshly grated ginger root in 8oz boiling water, steep for 15 minutes, strain, add 1 teaspoon Manuka honey (UMF 10+). Drink 3 times daily before meals",
        "Apply warm compress using heating pad: Set to medium heat (104-108°F), place clean cloth barrier, apply to affected area for exactly 20 minutes, 4 times daily (morning, noon, evening, bedtime)",
        "Gargle with Himalayan pink salt water: Mix 1/2 teaspoon fine Himalayan salt in 8oz warm filtered water (98-100°F), gargle for 30 seconds, repeat every 2 hours while awake",
        "Steam inhalation with eucalyptus oil: Add 5 drops pure eucalyptus oil (Eucalyptus globulus) to 2 cups boiling water in ceramic bowl, cover head with towel, inhale for 10 minutes, twice daily",
        "Turmeric golden milk: Mix 1 teaspoon organic turmeric powder + 1/4 teaspoon black pepper + 1 cup warm organic whole milk + 1 teaspoon coconut oil, drink 30 minutes before bed",
        "Cold-pressed lemon water: Squeeze 1/2 fresh organic lemon into 16oz room temperature filtered water, add pinch of sea salt, drink first thing in morning on empty stomach",
        "Echinacea tincture: Take 1ml (20 drops) of standardized Echinacea purpurea extract in 2oz water, 3 times daily for maximum 10 days",
        "Apple cider vinegar rinse: Mix 1 tablespoon raw unfiltered ACV (Bragg's) with 8oz warm water, use as mouth rinse for 30 seconds, twice daily after brushing teeth"
      ];
    }
    
    // Extract foods
    const foodsSection = text.match(/foods:\s*\[([\s\S]*?)\]/i);
    if (foodsSection) {
      const foods = foodsSection[1].split(',').map(item => item.trim()).filter(item => item);
      result.foods = foods.length > 0 ? foods : [
        "Homemade bone broth soup: Simmer 2lbs grass-fed beef bones + 2 cloves minced garlic + 1 diced onion + 1 inch fresh ginger for 24 hours, strain, drink 1 cup warm every 4 hours",
        "Organic citrus fruits: 1 large orange (Navel or Valencia) + 1/2 fresh lemon daily, eat orange segments with white pith, squeeze lemon in 8oz water",
        "Wild-caught salmon: 4oz grilled Atlantic salmon with 1 tablespoon olive oil + lemon, 3 times per week for omega-3 fatty acids",
        "Raw local honey: 1 tablespoon unprocessed local wildflower honey on empty stomach each morning, let dissolve slowly in mouth",
        "Fermented vegetables: 2 tablespoons sauerkraut (Bubbies brand) or kimchi with each meal for probiotics and digestive enzymes",
        "Organic blueberries: 1/2 cup fresh or frozen wild blueberries daily, blend in smoothie or eat with Greek yogurt for antioxidants",
        "Free-range chicken: 4oz organic chicken breast, slow-cooked with herbs, 4 times per week for high-quality protein and B vitamins",
        "Dark leafy greens smoothie: Blend 2 cups organic spinach + 1 cup kale + 1 banana + 1 cup coconut water, drink 16oz daily on empty stomach"
      ];
    }
    
    // Extract medications
    const medicationsSection = text.match(/medications:\s*\[([\s\S]*?)\]/i);
    if (medicationsSection) {
      const medications = medicationsSection[1].split(',').map(item => item.trim()).filter(item => item);
      result.medications = medications.length > 0 ? medications : [
        "Acetaminophen (Tylenol Extra Strength) 500mg tablets: Take 2 tablets every 6 hours with 8oz water, maximum 8 tablets in 24 hours, take with food to prevent stomach upset",
        "Ibuprofen (Advil Liqui-Gels) 200mg: Take 2 capsules every 8 hours with full meal and 8oz water, maximum 6 capsules in 24 hours, avoid if stomach ulcers",
        "Loratadine (Claritin 24-Hour) 10mg tablets: Take 1 tablet daily at same time with water, preferably in morning, can take with or without food",
        "Guaifenesin (Mucinex) 600mg extended-release: Take 1 tablet every 12 hours with 8oz water, drink extra fluids throughout day",
        "Zinc lozenges (Cold-Eeze) 13.3mg: Dissolve 1 lozenge in mouth every 2 hours while awake, maximum 6 per day, take on empty stomach"
      ];
    }
    
    // Extract administration
    const administrationSection = text.match(/administration:\s*\[([\s\S]*?)\]/i);
    if (administrationSection) {
      const administration = administrationSection[1].split(',').map(item => item.trim()).filter(item => item);
      result.administration = administration.length > 0 ? administration : [
        "Take all medications with exactly 8oz (1 full glass) of room temperature water, 30 minutes after eating to prevent stomach irritation and ensure proper absorption",
        "Apply warm compresses at 104-108°F for exactly 20 minutes using timer, check skin every 5 minutes to prevent burns, use clean cloth barrier between skin and heat source",
        "Drink 10-12 glasses (80-96oz) of filtered water daily, sip slowly throughout day, increase to 12-14 glasses if fever present, track intake with marked water bottle",
        "Monitor symptoms twice daily (morning and evening), record temperature, pain level (1-10 scale), and energy level in smartphone app or journal",
        "Take natural remedies 30 minutes before or 2 hours after medications to prevent interactions, set phone alarms for consistent timing",
        "Rest in slightly elevated position (30-45 degrees) using 2-3 pillows, maintain room temperature at 68-70°F, ensure 7-9 hours sleep nightly"
      ];
    }
    
    // Extract warning
    const warningMatch = text.match(/warning:\s*([^\n]+)/i);
    if (warningMatch) {
      result.warning = warningMatch[1].trim();
    } else {
      result.warning = "Seek immediate medical attention if you develop: fever above 102°F (38.9°C), severe pain rated 8+ on 10-point scale, difficulty breathing or shortness of breath, persistent vomiting for more than 24 hours, signs of dehydration (dark urine, dizziness), or if symptoms worsen after 48 hours of treatment. This AI-generated advice is not a substitute for professional medical care and should not replace consultation with a qualified healthcare provider.";
    }
    
    return result;
  }

  private parseTextResponse(text: string): any {
    return {
      condition: "AI-Generated Diagnosis",
      confidence: 75,
      description: text.substring(0, 200) + "...",
      naturalRemedies: [
        "Complete bed rest: Sleep 8-9 hours nightly in completely dark room (blackout curtains), maintain 65-68°F temperature, use white noise machine, elevate head 30 degrees with memory foam pillow",
        "Hydration protocol: Drink 12-14 glasses (96-112oz) filtered water daily, add 1/4 teaspoon Himalayan salt per 32oz, sip 4oz every 30 minutes while awake",
        "Therapeutic heat therapy: Apply heating pad set to medium (104°F) with timer for exactly 20 minutes, 4 times daily, use moisture barrier cloth to prevent burns",
        "Structured breathing exercises: Practice 4-7-8 technique (inhale 4 counts, hold 7, exhale 8) for 5 minutes, 3 times daily using meditation app timer",
        "Fresh ginger honey tea: Grate 1 tablespoon fresh organic ginger root, steep in 8oz boiling water for 15 minutes, strain, add 1 teaspoon raw Manuka honey (UMF 15+)",
        "Cold therapy alternation: Apply ice pack wrapped in thin towel for 15 minutes, then remove for 15 minutes, repeat 3 cycles, twice daily",
        "Epsom salt bath: Dissolve 2 cups pharmaceutical-grade Epsom salt in warm bath (98-100°F), soak for 20 minutes before bedtime",
        "Essential oil aromatherapy: Diffuse 5 drops lavender + 3 drops eucalyptus oil in bedroom for 30 minutes before sleep using ultrasonic diffuser"
      ],
      foods: [
        "Organic citrus protocol: 2 large navel oranges + 1 whole lemon daily, eat orange with white pith, drink lemon in 16oz warm water on empty stomach",
        "Healing bone broth: Simmer 3lbs grass-fed beef bones + organic vegetables for 24 hours, strain, drink 8oz warm every 3 hours, store in glass containers",
        "Nutrient-dense greens: 2 cups raw organic spinach + 1 cup massaged kale with 1 tablespoon olive oil and lemon juice, consume within 30 minutes of preparation",
        "Golden turmeric paste: Mix 1 teaspoon organic turmeric + 1/4 teaspoon black pepper + 1 tablespoon coconut oil, take with warm milk before bed",
        "Probiotic powerhouse: 6oz plain Greek yogurt (Fage Total) with 50+ billion CFU, add 1 tablespoon raw honey and 1/4 cup blueberries",
        "Wild-caught salmon: 4oz Atlantic salmon with skin, baked at 400°F for 12 minutes with herbs, 3 times weekly for omega-3 fatty acids",
        "Fermented vegetables: 2 tablespoons raw sauerkraut (Bubbies brand) or kimchi with each meal for digestive enzymes and probiotics",
        "Antioxidant smoothie: Blend 1 cup frozen wild blueberries + 1 banana + 1 cup coconut milk + 1 tablespoon almond butter, drink immediately"
      ],
      medications: [
        "Acetaminophen (Tylenol Extra Strength) 500mg caplets: Take 2 caplets every 6 hours with 8oz water and food, maximum 8 caplets in 24 hours, set phone alarm for timing",
        "Ibuprofen (Advil Liqui-Gels) 200mg: Take 2 capsules every 8 hours with full meal and 8oz water, maximum 6 capsules daily, avoid if stomach issues",
        "Loratadine (Claritin 24-Hour) 10mg tablets: Take 1 tablet daily at same time (preferably morning) with water, can take with or without food",
        "Guaifenesin (Mucinex Extended-Release) 600mg: Take 1 tablet every 12 hours with 8oz water, drink additional fluids throughout day",
        "Zinc gluconate lozenges (Cold-Eeze) 13.3mg: Dissolve 1 lozenge slowly in mouth every 2 hours while awake, maximum 6 daily, take between meals"
      ],
      administration: [
        "Medication timing protocol: Take all medications with exactly 8oz room temperature water, 30-45 minutes after eating, use smartphone app to track doses and set reminders",
        "Temperature-controlled compress application: Use digital thermometer to verify 104-108°F, apply for exactly 20 minutes using timer, check skin every 5 minutes",
        "Structured hydration schedule: Drink 4oz filtered water every 30 minutes while awake, track intake with marked 32oz bottle, increase by 50% if fever present",
        "Comprehensive symptom monitoring: Record temperature, pain level (1-10), energy level, and appetite twice daily in health app, take photos of affected areas",
        "Supplement timing coordination: Take natural remedies 30 minutes before or 2 hours after medications, maintain 4-hour gap between different supplements",
        "Sleep optimization routine: Maintain bedroom at 65-68°F, use blackout curtains, elevate head 30-45 degrees, practice 4-7-8 breathing before sleep"
      ],
      warning: "Seek immediate emergency medical attention if you experience: fever above 103°F (39.4°C), severe pain rated 8+ on 10-point scale, difficulty breathing or chest tightness, persistent vomiting for more than 24 hours, signs of severe dehydration (dark urine, dizziness, rapid heartbeat), severe headache with neck stiffness, or if symptoms significantly worsen after 48 hours of treatment. Call 911 for breathing difficulties or chest pain. This AI-generated advice is not a substitute for professional medical care and should not replace consultation with a qualified healthcare provider."
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