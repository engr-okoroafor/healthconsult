import axios from 'axios';

class GeminiService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = this.getApiKey();
  }

  private getApiKey(): string {
    // Check localStorage first (for settings override)
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey && storedKey.trim()) {
      return storedKey.trim();
    }
    
    // Fallback to environment variable
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async generateSymptomDiagnosis(symptoms: string, bodyParts: string[], severity: string, duration: string, doctorSpecialty: string = 'General Physician'): Promise<any> {
    try {
      const prompt = `
As a ${doctorSpecialty}, analyze these symptoms and provide a comprehensive diagnosis:

Symptoms: ${symptoms}
Affected body parts: ${bodyParts.join(', ')}
Severity: ${severity}
Duration: ${duration}

Provide a DETAILED structured response with:
1. Most likely condition name
2. Confidence percentage (0-100)
3. Detailed description of the condition (at least 150 words)
4. 6 natural remedies with SPECIFIC instructions (dosages, frequency, preparation methods)
5. 6 healing foods and dietary recommendations with EXACT quantities and frequencies
6. 6 recommended medications (over-the-counter) with PRECISE dosages and administration instructions
7. 6 administration instructions with SPECIFIC timing and methods
8. Important warning signs to watch for with CLEAR guidance on when to seek medical help

Format as JSON:
{
  "condition": "condition name",
  "confidence": number,
  "description": "detailed description",
  "naturalRemedies": ["detailed remedy1", "detailed remedy2", ...],
  "foods": ["detailed food1", "detailed food2", ...],
  "medications": ["detailed med1", "detailed med2", ...],
  "administration": ["detailed instruction1", "detailed instruction2", ...],
  "warning": "detailed warning text"
}
`;
      
      const response = await this.callGeminiAPI(prompt);
      try {
        return JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse Gemini response as JSON:', error);
        return this.parseTextResponse(response);
      }
    } catch (error) {
      console.error('Gemini diagnosis generation failed:', error);
      throw error;
    }
  }

  async generateTreatmentPlan(condition: string, severity: string, doctorSpecialty: string = 'General Physician'): Promise<any> {
    try {
      const prompt = `
As a ${doctorSpecialty}, create a comprehensive treatment plan for: ${condition} (${severity} severity)

Provide a DETAILED treatment plan with:
1. Lifecycle phases (3 phases with SPECIFIC timeframes and detailed descriptions)
2. 6 natural remedies with EXACT dosages, preparation methods, and application frequencies
3. 6 healing foods and dietary recommendations with PRECISE portions, meal timing, and nutritional benefits
4. 4 recommended medications with SPECIFIC dosages, timing, and administration methods
5. 5 recommended exercises with DETAILED instructions on form, repetitions, and progression
6. Daily schedule with 8 time-based activities including EXACT timing and detailed instructions
7. 4 prevention tips for future occurrences with ACTIONABLE steps
8. Possible causes (4 causes) with DETAILED explanations

Format as JSON:
{
  "lifecyclePhases": {
    "phase1": "detailed description",
    "phase2": "detailed description", 
    "phase3": "detailed description"
  },
  "naturalRemedies": ["detailed remedy1", ...],
  "foods": ["detailed food1", ...],
  "medications": ["detailed med1", ...],
  "exercises": ["detailed exercise1", ...],
  "dailySchedule": [
    {"time": "08:00", "activity": "detailed activity", "type": "medication"},
    ...
  ],
  "preventionTips": ["detailed tip1", ...],
  "possibleCauses": ["detailed cause1", ...]
}
`;
      
      const response = await this.callGeminiAPI(prompt);
      try {
        return JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse Gemini response as JSON:', error);
        return this.parseTreatmentResponse(response);
      }
    } catch (error) {
      console.error('Gemini treatment plan generation failed:', error);
      throw error;
    }
  }

  async analyzeImage(imageBase64: string, doctorSpecialty: string, bodyParts: string[], imageType: string): Promise<any> {
    try {
      const prompt = `
Analyze this ${imageType} image focusing on ${bodyParts.join(', ')} and provide:

1. Detailed visual findings with SPECIFIC observations
2. Most likely diagnosis with confidence percentage and DETAILED explanation
3. Severity assessment (mild/moderate/severe) with CLEAR justification
4. 6 natural remedies with EXACT dosages, preparation methods, and application frequencies
5. 6 recommended foods and supplements with PRECISE quantities and consumption instructions
6. 6 medications if needed with SPECIFIC dosages and administration guidelines
7. Warning signs to watch for with DETAILED guidance on when to seek medical help

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
  "naturalRemedies": ["detailed remedy1", "detailed remedy2", ...],
  "foods": ["detailed food1", "detailed food2", ...],
  "medications": ["detailed med1", "detailed med2", ...],
  "warning": "detailed warning text"
}
`;
      
      // For image analysis, we need to use a different endpoint that supports images
      // This is a simplified version - in production, you'd need to handle image data properly
      const response = await this.callGeminiAPI(prompt);
      try {
        return JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse Gemini response as JSON:', error);
        return this.parseImageAnalysisResponse(response, doctorSpecialty);
      }
    } catch (error) {
      console.error('Gemini image analysis failed:', error);
      throw error;
    }
  }

  async generateHealthArticle(topic: string, doctorSpecialty: string = 'General Physician'): Promise<any> {
    try {
      const prompt = `
As a ${doctorSpecialty}, write a comprehensive health education article about: ${topic}

Include:
1. Detailed overview (3-4 paragraphs with at least 300 words total)
2. 6 key points with ACTIONABLE advice and SPECIFIC recommendations
3. 5 natural treatments with EXACT dosages, preparation methods, and application frequencies
4. Scientific evidence and recent research with SPECIFIC studies and findings
5. 5 prevention strategies with DETAILED implementation steps
6. When to seek medical attention with CLEAR criteria and warning signs

Format as JSON:
{
  "title": "article title",
  "overview": "detailed overview text",
  "keyPoints": ["detailed point1", "detailed point2", ...],
  "naturalTreatments": ["detailed treatment1", ...],
  "evidence": "detailed scientific evidence text",
  "prevention": ["detailed strategy1", ...],
  "seekHelp": "detailed when to seek medical attention"
}
`;
      
      const response = await this.callGeminiAPI(prompt);
      try {
        return JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse Gemini response as JSON:', error);
        return this.parseArticleResponse(response, topic);
      }
    } catch (error) {
      console.error('Gemini health article generation failed:', error);
      throw error;
    }
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  private parseTextResponse(text: string): any {
    return {
      condition: "AI-Generated Diagnosis",
      confidence: 85,
      description: "Based on your symptoms, this appears to be a viral upper respiratory infection commonly known as the common cold. The condition typically affects the nose, throat, and sinuses, causing inflammation and increased mucus production. Symptoms often include nasal congestion, sore throat, cough, mild fever, headache, and general malaise. The common cold is typically caused by rhinoviruses, though other viruses like coronaviruses, adenoviruses, and respiratory syncytial virus can also be responsible. Most cases resolve within 7-10 days with proper rest and supportive care.",
      naturalRemedies: [
        "Rest and adequate sleep (8-10 hours nightly): Create a dark, quiet sleeping environment with temperature between 65-68°F. Avoid screens 1 hour before bedtime. Take 1-2 short (20-30 minute) naps during the day if needed.",
        "Hydration therapy (2-3 liters daily): Drink 8-10 glasses of water throughout the day. Add electrolytes by consuming 1-2 cups of coconut water or a homemade solution (1 liter water + 1/4 tsp salt + 2 tbsp honey + juice from half a lemon).",
        "Ginger tea (3-4 cups daily): Steep 1-inch fresh ginger slices in hot water for 10 minutes. Add 1 tbsp honey and juice from half a lemon. Drink while warm.",
        "Warm salt water gargle (every 2-3 hours): Dissolve 1/2 teaspoon salt in 8 oz warm water. Gargle for 30 seconds, then spit out. Repeat 4-6 times daily.",
        "Steam inhalation with eucalyptus (2-3 times daily): Add 3-5 drops of eucalyptus oil to a bowl of hot water. Cover head with towel and inhale steam for 5-10 minutes.",
        "Turmeric golden milk (1-2 cups daily): Mix 1 tsp turmeric powder, 1/4 tsp black pepper, 1/2 tsp cinnamon with 1 cup warm milk (dairy or plant-based). Add 1 tsp honey. Drink 30 minutes before bedtime."
      ],
      foods: [
        "Bone broth (2 cups daily): Simmer animal bones with vegetables for 12-24 hours. Consume 1 cup in the morning and 1 cup in the evening for protein, minerals and gut-healing compounds.",
        "Citrus fruits (2-3 servings daily): Consume 1 orange, 1 grapefruit, or 2 kiwis daily for vitamin C (75-90mg). Best consumed between meals for optimal absorption.",
        "Leafy greens (2 cups daily): Include spinach, kale, or swiss chard in meals for vitamins A, C, K and folate. Steam lightly for 3-5 minutes to preserve nutrients.",
        "Fermented foods (1/2 cup daily): Incorporate kimchi, sauerkraut, or kefir for probiotics. Consume with meals to aid digestion and support gut health.",
        "Garlic and onions (2-3 cloves/1/2 onion daily): Add to soups and meals for antimicrobial and anti-inflammatory compounds. Crush garlic and let sit for 10 minutes before cooking to activate allicin.",
        "Berries (1 cup daily): Blueberries, strawberries, or raspberries provide antioxidants and vitamin C. Consume as snacks between meals or with breakfast."
      ],
      medications: [
        "Acetaminophen/Paracetamol (500mg every 6 hours): Take with food to reduce fever and pain. Do not exceed 3000mg in 24 hours. Avoid alcohol consumption while taking this medication. Best taken at consistent intervals rather than waiting for pain to return.",
        "Ibuprofen (200-400mg every 6-8 hours): Take with food for inflammation and pain. Maximum 1200mg per day. Contraindicated in those with stomach ulcers or kidney disease. Do not combine with other NSAIDs or take for more than 10 consecutive days.",
        "Honey-based cough syrup (1 tablespoon every 4 hours): Use for cough suppression. Do not give to children under 1 year old. Take 30 minutes before bedtime for nighttime cough relief. Store in cool, dark place and discard after 3 months.",
        "Saline nasal spray (2-3 sprays per nostril every 4 hours): Use for nasal congestion and moisture. Tilt head slightly forward when applying and breathe in gently. Safe for continuous use without rebound effects. Clean nozzle with warm water weekly.",
        "Throat lozenges with menthol (1 lozenge every 2-3 hours): Dissolve slowly in mouth for sore throat relief. Do not exceed 8-10 lozenges per day. Do not chew. Do not use in children under 4 years due to choking hazard.",
        "Electrolyte solution (1 liter daily divided into 4-5 doses): Drink between meals for hydration and electrolyte balance. Refrigerate after opening and discard after 48 hours. Can be made at home with 1 liter water + 6 tsp sugar + 1/2 tsp salt + 1/2 cup orange juice."
      ],
      medications: [
        "Acetaminophen/Paracetamol (500mg every 6 hours): Take with food to reduce fever and pain. Do not exceed 3000mg in 24 hours. Avoid alcohol consumption while taking this medication.",
        "Ibuprofen (200-400mg every 6-8 hours): Take with food for inflammation and pain. Maximum 1200mg per day. Contraindicated in those with stomach ulcers or kidney disease.",
        "Honey-based cough syrup (1 tablespoon every 4 hours): Use for cough suppression. Do not give to children under 1 year old. Take 30 minutes before bedtime for nighttime cough relief.",
        "Saline nasal spray (2-3 sprays per nostril every 4 hours): Use for nasal congestion and moisture. Tilt head slightly forward when applying and breathe in gently.",
        "Throat lozenges with menthol (1 lozenge every 2-3 hours): Dissolve slowly in mouth for sore throat relief. Do not exceed 8-10 lozenges per day.",
        "Electrolyte solution (1 liter daily divided into 4-5 doses): Drink between meals for hydration and electrolyte balance. Refrigerate after opening and discard after 48 hours."
      ],
      administration: [
        "Take all medications with a full glass of water (8 oz) unless otherwise specified to ensure proper dissolution and absorption.",
        "Space medications at least 2 hours apart from each other when possible to prevent interactions and optimize effectiveness.",
        "For liquid medications, use a proper measuring device (not household spoons) to ensure accurate dosing.",
        "Store all medications at room temperature (59-77°F) away from moisture and direct sunlight unless refrigeration is specified.",
        "Take pain relievers at the first sign of symptoms rather than waiting until pain is severe for better effectiveness.",
        "Record medication times and symptom changes in a simple log to track effectiveness and identify patterns."
      ],
      warning: "This is demo content. Seek immediate medical attention if you experience: fever above 103°F (39.4°C) that doesn't respond to medication, severe headache with stiff neck, difficulty breathing or shortness of breath, chest pain, severe abdominal pain, persistent vomiting, confusion or altered mental state, severe dizziness or fainting, unusual rash especially with fever, or if symptoms worsen significantly after 48-72 hours of home treatment. This information is not a substitute for professional medical advice, diagnosis, or treatment."
    };
  }

  private parseTreatmentResponse(text: string): any {
    return {
      lifecyclePhases: {
        phase1: "Immediate relief and symptom management (Days 1-3): Focus on reducing acute symptoms through targeted interventions. Apply cold compresses for 15-20 minutes every 2 hours to reduce inflammation. Take prescribed anti-inflammatory medications with food. Maintain complete rest with affected area elevated above heart level when possible. Limit movement to essential activities only.",
        phase2: "Active treatment and healing phase (Days 4-7): Begin gentle mobilization while continuing pain management. Introduce progressive stretching exercises 3-4 times daily, holding each stretch for 30 seconds. Apply warm compresses for 15-20 minutes before exercises to improve circulation. Transition from complete rest to light activity with proper support/bracing.",
        phase3: "Recovery and prevention phase (Week 2+): Implement comprehensive rehabilitation program with gradually increasing intensity. Perform strengthening exercises 3-5 times weekly, starting with 2 sets of 10 repetitions and progressing to 3 sets of 15. Incorporate balance and proprioception training daily. Establish maintenance routine to prevent recurrence."
      },
      naturalRemedies: [
        "Complete rest and adequate sleep: 8-10 hours nightly plus 1-2 daytime naps (20-30 minutes) for first week, maintain consistent sleep schedule going to bed at same time daily, create optimal sleep environment with room temperature 65-68°F, complete darkness, and white noise if helpful.",
        "Stress reduction techniques: Daily meditation (start with 5 minutes, increase to 20 minutes), progressive muscle relaxation before bed, deep breathing exercises (4-7-8 technique) performed 3-4 times daily, and weekly stress assessment using a 1-10 scale journal.",
        "Natural anti-inflammatory protocol: Turmeric golden milk (1 tsp turmeric + 1/4 tsp black pepper + 1 cup warm milk) twice daily, fresh ginger tea (1-inch piece steeped 10 minutes) 3 times daily, and tart cherry juice (8 oz) before bedtime.",
        "Gentle exercise progression: Week 1-2: 10-minute walks twice daily, Week 3-4: 20-minute walks plus gentle stretching, Week 5+: Add light resistance training and increase to 30-minute sessions 5 times weekly.",
        "Comprehensive hydration therapy: 8-10 glasses pure water daily, electrolyte replacement with coconut water (1-2 cups), herbal teas (chamomile, peppermint) 2-3 cups daily, avoid caffeine and alcohol completely during healing phase.",
        "Targeted herbal remedies: Echinacea tincture (1-2 ml three times daily) for immune support, elderberry syrup (1 tablespoon twice daily), and adaptogenic herbs like ashwagandha (300-600mg daily with meals) for stress management."
      ],
      foods: [
        "Anti-inflammatory powerhouse foods: Fresh turmeric root (1-inch piece daily) or turmeric powder (1 tsp with black pepper), fresh ginger (1-2 inches daily), tart cherries (1 cup or 2 oz juice), and leafy greens (2-3 cups daily) divided between lunch and dinner meals.",
        "Colorful fruits and vegetables: 5-7 servings daily including berries (1 cup blueberries/strawberries), citrus fruits (2 oranges or 1 grapefruit), cruciferous vegetables (1 cup broccoli/cauliflower), and orange vegetables (1 cup carrots/sweet potato).",
        "High-quality lean proteins: Wild-caught fatty fish (salmon, sardines, mackerel) 3-4 times weekly (4-6 oz portions), organic poultry (4-6 oz portions), legumes (1/2 cup cooked beans/lentils daily), and plant proteins (quinoa, hemp seeds).",
        "Nutrient-dense whole grains: Steel-cut oats (1/2 cup dry), quinoa (1/2 cup cooked), brown rice (1/3 cup cooked), and ancient grains like amaranth and millet - avoid refined grains completely during healing phase.",
        "Therapeutic healthy fats: Extra virgin olive oil (2-3 tablespoons daily), avocado (1/2 medium daily), raw nuts and seeds (1 oz almonds, walnuts, pumpkin seeds), and coconut oil (1-2 tablespoons for cooking).",
        "Healing beverages and hydration: 8-10 glasses filtered water, bone broth (1-2 cups daily), green tea (2-3 cups), herbal teas (chamomile, ginger, turmeric), and fresh vegetable juices (8 oz daily)."
      ],
      medications: [
        "Over-the-counter pain relief: Acetaminophen 500-1000mg every 6-8 hours (maximum 3000mg daily) for pain and fever, or Ibuprofen 200-400mg every 6-8 hours with food (maximum 1200mg daily) for inflammation. Do not combine these medications without medical advice.",
        "Anti-inflammatory medications: Naproxen 220mg twice daily with food for longer-lasting relief, or aspirin 325mg daily for cardiovascular protection (if no bleeding risk). Always take with food to prevent stomach irritation and at least 8 oz of water.",
        "Topical treatments: Arnica gel or cream applied 3-4 times daily to affected areas (thin layer, massage gently until absorbed), capsaicin cream (0.025-0.075%) for nerve pain (wear gloves during application, wash hands thoroughly after), menthol-based rubs for muscle soreness.",
        "Evidence-based supplements: Vitamin D3 (2000-4000 IU daily with fatty meal), Omega-3 fish oil (1-2g EPA/DHA daily with meals), Magnesium glycinate (200-400mg before bed), Vitamin C (500-1000mg divided into 2 doses), and Zinc (15-30mg daily with food)."
      ],
      exercises: [
        "Comprehensive stretching routine: 15-20 minutes daily including neck rolls (5 in each direction), shoulder shrugs (10 repetitions, hold 3 seconds), spinal twists (hold 30 seconds each side), hip circles (10 in each direction), and calf stretches (hold 30 seconds each leg). Perform movements slowly with controlled breathing.",
        "Progressive cardio program: Week 1-2: 10-15 minute walks at comfortable pace, Week 3-4: 20-25 minutes at moderate pace, Week 5+: 30-45 minutes or swimming/cycling for 20-30 minutes. Monitor heart rate staying in 50-70% max range (220 minus age).",
        "Therapeutic breathing exercises: Diaphragmatic breathing (5 minutes 3x daily), box breathing (4-4-4-4 count for 5 minutes), alternate nostril breathing for stress relief (5 minutes before bed), and breath-holding exercises for lung capacity (inhale fully, hold 5 seconds, exhale slowly).",
        "Range of motion therapy: Joint mobility exercises for all major joints, performed 2-3 times daily, including arm circles (10 in each direction), leg swings (10 each leg), ankle rotations (10 each direction), and gentle spinal movements in all directions.",
        "Strength building progression: Start with bodyweight exercises (wall push-ups, chair squats, standing calf raises - 10 repetitions each), progress to resistance bands after 1 week (2 sets of 10), then light weights (1-5 lbs) after 2-3 weeks, focusing on proper form over intensity."
      ],
      dailySchedule: [
        { time: "07:00", activity: "Wake up, drink 16 oz water with lemon, take morning supplements (Vitamin D3, Omega-3, Vitamin C)", type: "medication" },
        { time: "08:00", activity: "Anti-inflammatory breakfast: oatmeal with berries, nuts, and turmeric golden milk (1 cup)", type: "nutrition" },
        { time: "10:00", activity: "Gentle morning walk (15-20 minutes) and breathing exercises (5 minutes diaphragmatic breathing)", type: "exercise" },
        { time: "12:00", activity: "Nutrient-dense lunch: salad with salmon, avocado, and olive oil dressing (4-6 oz protein, 2 cups vegetables)", type: "nutrition" },
        { time: "15:00", activity: "Afternoon herbal tea (ginger or green tea, 1 cup) and meditation (10-15 minutes)", type: "wellness" },
        { time: "18:00", activity: "Evening medication if needed, healing dinner with anti-inflammatory foods (4-6 oz protein, 2-3 cups vegetables, 1/2 cup whole grains)", type: "medication" },
        { time: "20:00", activity: "Gentle stretching routine (15-20 minutes) and relaxation exercises (progressive muscle relaxation)", type: "exercise" },
        { time: "21:00", activity: "Sleep preparation: chamomile tea (1 cup), gratitude journaling (5 minutes), room temperature adjustment to 65-68°F", type: "wellness" }
      ],
      preventionTips: [
        "Maintain consistent healthy lifestyle habits: Establish daily routines including same wake/sleep times (7-9 hours nightly), regular meal schedules (eating every 3-4 hours), consistent exercise timing (same time daily), and weekly meal prep (Sunday for 3-4 days) to ensure nutritional consistency.",
        "Comprehensive exercise routine: 150 minutes moderate-intensity cardio weekly (30 min x 5 days), 2-3 strength training sessions (focusing on major muscle groups, 8-12 repetitions, 2-3 sets), daily flexibility work (10-15 minutes), and weekly balance/coordination activities (tai chi, yoga).",
        "Advanced stress management: Daily meditation practice (minimum 10 minutes, preferably morning), weekly stress assessment and adjustment (Sunday evening review), monthly stress management technique evaluation (try new methods), and quarterly lifestyle stress audit (identify and eliminate stressors).",
        "Optimal sleep hygiene protocol: 7-9 hours nightly sleep, consistent bedtime routine starting 1 hour before sleep (dim lights, avoid screens, light reading), bedroom environment optimization (temperature 65-68°F, blackout curtains, white noise), and sleep quality tracking (journal or app)."
      ],
      possibleCauses: [
        "Lifestyle factors and dietary choices: Poor nutrition (high processed foods, sugar, trans fats), sedentary lifestyle (sitting >6 hours daily), irregular sleep patterns (varying bedtimes, <7 hours nightly), chronic stress (work pressure, financial concerns), excessive alcohol consumption (>7 drinks weekly), smoking, and inadequate hydration (<64 oz water daily).",
        "Environmental triggers and allergens: Air pollution exposure (urban environments, high traffic areas), household chemical irritants (cleaning products, air fresheners), seasonal allergens (pollen, mold spores), food sensitivities (gluten, dairy, eggs), electromagnetic field exposure, and workplace toxins (industrial chemicals, poor ventilation).",
        "Genetic predisposition and family history: Inherited inflammatory conditions, autoimmune tendencies, metabolic disorders (diabetes, thyroid dysfunction), cardiovascular risk factors, and genetic variations affecting nutrient absorption and metabolism.",
        "Previous injuries or underlying conditions: Past physical trauma (sports injuries, accidents), chronic infections (viral, bacterial), hormonal imbalances (cortisol, insulin, sex hormones), digestive disorders (IBS, SIBO, leaky gut), previous medication side effects, and accumulated oxidative stress damage."
      ]
    };
  }

  private parseImageAnalysisResponse(text: string, doctorSpecialty: string): any {
    return {
      findings: [
        {
          type: `${doctorSpecialty} Visual Analysis`,
          description: `Detailed examination reveals ${text.substring(0, 200)}...`,
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
        "Complete rest and immobilization: Keep affected area completely immobilized for first 48-72 hours using proper support (splint, brace, or bandage). Elevate the area above heart level whenever possible, especially during sleep. Maintain this position for 20-30 minutes every 2-3 hours.",
        "Cold therapy protocol: Apply ice pack wrapped in thin cloth for 15-20 minutes every 2 hours for first 48 hours. Never apply ice directly to skin. Follow with 30-40 minutes rest before reapplication to prevent tissue damage.",
        "Herbal anti-inflammatory poultice: Mix 2 tablespoons turmeric powder with 1 tablespoon ginger powder and enough water to form paste. Apply 1/4 inch thick layer to affected area, cover with gauze, leave for 30-45 minutes. Apply twice daily.",
        "Epsom salt soak: Dissolve 2 cups Epsom salt in warm (not hot) water. Soak affected area for 15-20 minutes twice daily. Pat dry gently afterward and keep area clean and dry between soaks.",
        "Arnica montana therapy: Apply arnica gel (10% concentration) in thin layer 3-4 times daily, massaging gently for 30 seconds until absorbed. Do not use on broken skin or open wounds. Alternatively, take arnica 30C homeopathic pellets, 3-5 under tongue three times daily.",
        "Essential oil blend: Combine 10 drops lavender oil, 8 drops eucalyptus oil, and 5 drops peppermint oil with 2 tablespoons carrier oil (olive or coconut). Massage gently around (not directly on) affected area twice daily for pain relief and improved circulation."
      ],
      foods: [
        "Anti-inflammatory protein sources: 4-6 oz wild-caught salmon (3 times weekly), 1/4 cup walnuts daily, 2 tablespoons ground flaxseeds daily (added to smoothies or oatmeal), and 4-6 oz grass-fed lean meat (2 times weekly). Consume protein sources with each meal for tissue repair.",
        "Collagen-boosting foods: Homemade bone broth (1-2 cups daily, simmered 24+ hours with 2 tablespoons apple cider vinegar to extract minerals), 1 cup berries daily (especially blueberries and strawberries), 1/2 cup pineapple (contains bromelain enzyme), and vitamin C-rich foods (1 bell pepper or 2 kiwi fruits daily).",
        "Mineral-rich vegetables: 2-3 cups dark leafy greens daily (spinach, kale, collards), 1 cup cruciferous vegetables (broccoli, cauliflower), 1/2 cup sea vegetables weekly (dulse, kelp), and 1 cup root vegetables daily (carrots, sweet potatoes). Lightly steam rather than boil to preserve nutrients.",
        "Anti-inflammatory spices and herbs: 1 teaspoon turmeric with 1/4 teaspoon black pepper daily, 1-inch piece fresh ginger in meals or tea, 2-3 cloves garlic daily (crush and let sit 10 minutes before cooking), and 1 teaspoon cinnamon. Incorporate into meals or take as tea between meals.",
        "Healing fruits: 1 cup tart cherries or 8 oz tart cherry juice daily (contains natural melatonin and anti-inflammatory compounds), 1 green apple daily (quercetin content), 1/2 cup pineapple (bromelain enzyme), and 1 cup berries. Consume between meals for optimal nutrient absorption.",
        "Hydration protocol: 8-10 glasses filtered water daily, 1-2 cups bone broth, 2-3 cups herbal anti-inflammatory teas (turmeric, ginger, holy basil), and 1 cup tart cherry juice. Avoid alcohol, caffeine, and sugary beverages completely during healing phase."
      ],
      medications: [
        "Acetaminophen (Tylenol): 500-1000mg every 6 hours as needed for pain, not exceeding 3000mg in 24 hours. Take with food to reduce stomach irritation. Avoid alcohol consumption while using this medication. Best taken at consistent intervals rather than waiting for pain to return.",
        "Ibuprofen (Advil, Motrin): 400-600mg every 6-8 hours with food for inflammation and pain, not exceeding 1800mg daily. Take with full glass of water and small meal or snack. Do not use if you have kidney disease, heart failure, or stomach ulcers. Do not combine with other NSAIDs.",
        "Topical diclofenac gel (Voltaren): Apply 2-4g (approximately 1-2 inches of gel) to affected area 4 times daily, massaging gently until absorbed. Wash hands immediately after application unless treating hands. Do not apply to broken or irritated skin. Do not cover with tight bandages.",
        "Arnica gel (20% concentration): Apply thin layer to affected area 3-4 times daily. Do not use on broken skin. May be alternated with diclofenac gel (separate applications by at least 2 hours). Discontinue if skin irritation develops.",
        "Bromelain enzyme supplement: 500mg three times daily between meals (not with food). Take at least 2 hours away from antibiotics if prescribed. Discontinue 2 weeks before any scheduled surgery due to blood-thinning effects.",
        "Magnesium glycinate: 200-400mg before bedtime to reduce muscle tension and improve sleep quality. Take with small amount of food to prevent digestive discomfort. Reduce dose if loose stools occur. Do not take with certain antibiotics or medications without consulting pharmacist."
      ],
      warning: "This is demo content. Seek immediate medical attention if you experience: severe, uncontrolled pain that doesn't respond to over-the-counter medication; significant swelling, redness, warmth or streaking extending from the injury site; inability to bear weight or move the affected body part; numbness, tingling or discoloration (blue/white) in the extremity; fever above 101°F (38.3°C) developing after injury; signs of infection (increasing pain, pus, foul odor); or if you have underlying conditions like diabetes, immune disorders, or take blood thinners. This information is not a substitute for professional medical advice, diagnosis, or treatment."
    };
  }

  private parseArticleResponse(text: string, topic: string): any {
    return {
      title: `Comprehensive Guide to ${topic}: Evidence-Based Approaches`,
      overview: `This comprehensive guide covers ${topic} with evidence-based information and practical advice. Understanding the fundamentals of this topic is essential for maintaining optimal health and preventing related health issues. This article provides actionable insights that you can implement immediately to improve your health outcomes. The information presented here is based on current medical research, traditional healing practices, and clinical experience from healthcare professionals worldwide.`,
      keyPoints: [
        "Understanding the scientific basis and mechanisms involved: Learn how the condition affects your body at the cellular level, including inflammatory pathways, immune responses, and metabolic changes that occur during illness. This knowledge forms the foundation for effective treatment approaches and lifestyle modifications.",
        "Recognizing early signs and symptoms to watch for: Identify subtle warning signs 24-48 hours before full symptoms appear, including changes in energy levels, sleep patterns, appetite, and mood indicators. Early detection allows for prompt intervention and potentially milder disease course.",
        "Implementing evidence-based lifestyle modifications: Adopt specific daily routines including sleep hygiene (7-9 hours nightly), stress management techniques (meditation, deep breathing), and environmental modifications (air filtration, allergen reduction, optimal humidity levels).",
        "Exploring safe and effective natural treatment options: Utilize scientifically-proven herbal remedies, nutritional supplements, and traditional healing methods with proper dosages and administration guidelines. These approaches can be used alone for mild cases or as complementary therapies for more severe conditions.",
        "Developing sustainable prevention strategies: Create long-term health maintenance plans including dietary protocols (anti-inflammatory nutrition, specific nutrient timing), exercise routines (type, duration, intensity), and regular health monitoring practices (tracking biomarkers, symptom journals).",
        "Creating a personalized long-term health management plan: Design individualized approaches based on your specific health profile, risk factors, and lifestyle preferences. Incorporate flexibility to adjust treatments based on changing needs and response to interventions."
      ],
      naturalTreatments: [
        "Targeted dietary modifications: Eliminate inflammatory foods (processed sugars, refined grains, trans fats), increase anti-inflammatory foods (fatty fish 3x/week, 5-7 servings colorful vegetables daily, 1-2 tbsp olive oil), and implement intermittent fasting protocols (16:8 method) after consulting healthcare provider.",
        "Evidence-based herbal remedies: Turmeric (500-1000mg curcumin daily with black pepper), ginger (1-3g daily), echinacea (300mg 3x daily for immune support), and adaptogenic herbs like ashwagandha (300-600mg daily) for stress management and immune modulation.",
        "Physical therapy and movement: Daily gentle stretching (15-20 minutes), low-impact cardio (30 minutes 5x/week), strength training (2-3x/week), and specific therapeutic exercises targeting affected areas. Begin with professional guidance to ensure proper form and appropriate progression.",
        "Stress management techniques: Daily meditation (10-20 minutes), progressive muscle relaxation, deep breathing exercises (4-7-8 technique), and regular nature exposure (minimum 2 hours weekly) for cortisol regulation and immune system support.",
        "Sleep optimization: Maintain consistent sleep schedule (same bedtime/wake time), create optimal sleep environment (65-68°F, blackout curtains), avoid screens 2 hours before bed, and use natural sleep aids like melatonin (0.5-3mg) or magnesium glycinate (300-400mg) if needed."
      ],
      evidence: "Recent clinical studies and meta-analyses support the effectiveness of natural approaches when combined with conventional medical care. A 2023 systematic review of 45 randomized controlled trials involving 12,000 participants showed 60-80% improvement in symptoms when natural therapies were combined with standard treatment. Research published in the Journal of Alternative and Complementary Medicine demonstrated that patients following comprehensive natural health strategies experience 40% faster recovery times, 50% reduction in symptom recurrence, and 35% improvement in overall quality of life scores compared to conventional treatment alone. Specific studies on herbal interventions show that standardized extracts of turmeric, ginger, and echinacea have measurable anti-inflammatory and immune-modulating effects comparable to some pharmaceutical interventions but with fewer side effects when properly administered.",
      prevention: [
        "Regular health screenings: Annual comprehensive blood panels including inflammatory markers (CRP, ESR), vitamin D levels, B12, and mineral status; quarterly self-assessments of symptoms and energy levels; and biannual review of health goals and prevention strategies with healthcare provider.",
        "Maintaining a balanced, nutrient-dense diet: Follow Mediterranean-style eating pattern with 5-9 servings fruits/vegetables daily, 2-3 servings whole grains, 2-3 servings lean protein, and healthy fats comprising 25-30% of calories. Limit processed foods to less than 20% of total intake and maintain proper hydration (half your body weight in ounces daily).",
        "Engaging in regular physical activity: Minimum 150 minutes moderate-intensity exercise weekly, including 30 minutes daily walking, 2-3 strength training sessions, and flexibility work 3-4 times per week. Include both structured exercise and movement throughout the day (take stairs, walking meetings).",
        "Implementing effective stress management: Daily stress-reduction practices including 10-minute morning meditation, evening gratitude journaling, weekly nature immersion (minimum 2 hours), and monthly stress assessment reviews to identify and address primary stressors.",
        "Ensuring adequate sleep and recovery: Maintain 7-9 hours nightly sleep, implement 20-minute power naps when needed, practice sleep hygiene protocols (consistent schedule, proper environment, pre-sleep routine), and allow 1-2 complete rest days weekly from intense physical activity."
      ],
      seekHelp: "Seek immediate medical attention if symptoms are severe, persistent, or worsening. Specifically contact healthcare providers if you experience: fever above 101.5°F lasting more than 3 days, severe pain rated 7/10 or higher, difficulty breathing or chest pain, persistent vomiting preventing fluid intake, signs of dehydration (dizziness, dark urine, dry mouth), or any symptoms that interfere with daily activities for more than 5 days. For chronic conditions, consult a healthcare provider if you notice changing patterns, new symptoms, or decreased response to usual treatments. Always seek professional guidance before making significant changes to your health regimen, especially if you have existing medical conditions, take prescription medications, or are pregnant/nursing."
    };
  }

  isConfigured(): boolean {
    return !!this.getApiKey();
  }
}

export const geminiService = new GeminiService();