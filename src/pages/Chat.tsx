import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  FileText,
  Search,
  Brain,
  MessageSquare
} from 'lucide-react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! I\'m your AI Medical Assistant. I can help you with case analysis, similar case searches, diagnostic insights, and medical research. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      icon: Search,
      title: 'Find Similar Cases',
      description: 'Search for cases with similar findings',
      action: 'Find cases similar to chest X-ray with nodular opacity'
    },
    {
      icon: Brain,
      title: 'Diagnostic Insight',
      description: 'Get AI-powered diagnostic suggestions',
      action: 'What are the differential diagnoses for bilateral pulmonary nodules?'
    },
    {
      icon: FileText,
      title: 'Literature Review',
      description: 'Find relevant medical literature',
      action: 'Show me recent studies about AI in radiology'
    }
  ];

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: getAIResponse(content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    if (query.toLowerCase().includes('similar cases')) {
      return `I found 3 similar cases in our database:

**Case 1**: 45-year-old patient with similar nodular opacity
- **Modality**: Chest X-Ray
- **Findings**: 12mm nodule, right upper lobe
- **Outcome**: Benign granuloma confirmed by biopsy

**Case 2**: 52-year-old patient with comparable presentation
- **Modality**: CT Chest
- **Findings**: Multiple small nodules
- **Outcome**: Inflammatory changes, resolved with treatment

**Case 3**: 38-year-old patient with related findings
- **Modality**: Chest X-Ray
- **Findings**: Solitary pulmonary nodule
- **Outcome**: Follow-up showed stability

Would you like me to provide more details on any of these cases?`;
    }

    if (query.toLowerCase().includes('differential diagnoses')) {
      return `For bilateral pulmonary nodules, here are the key differential diagnoses:

**Malignant Causes:**
- Metastatic disease (most common)
- Primary lung cancer (multiple primaries)
- Lymphoma

**Benign Causes:**
- Granulomatous disease (sarcoidosis, histoplasmosis)
- Rheumatoid arthritis
- Wegener's granulomatosis
- Septic emboli

**Recommended Workup:**
1. Compare with prior imaging
2. Assess patient's cancer history
3. Consider PET scan for metabolic activity
4. Tissue sampling if indicated

Would you like me to elaborate on any specific diagnosis or discuss imaging characteristics?`;
    }

    if (query.toLowerCase().includes('recent studies')) {
      return `Here are some recent notable studies on AI in radiology:

**1. "AI in Chest Radiography" (2024)**
- **Journal**: Radiology AI
- **Key Finding**: AI systems achieve 94% accuracy in detecting pulmonary nodules
- **Impact**: Demonstrates potential for screening programs

**2. "Deep Learning for Medical Imaging" (2024)**
- **Journal**: Nature Medicine
- **Key Finding**: Multi-modal AI improves diagnostic confidence by 23%
- **Impact**: Shows promise for clinical decision support

**3. "AI-Assisted Reporting" (2023)**
- **Journal**: JACR
- **Key Finding**: Reduces reporting time by 40% while maintaining accuracy
- **Impact**: Addresses radiologist workflow challenges

Would you like me to summarize any specific study or discuss implementation strategies?`;
    }

    return `I understand you're asking about "${query}". I can help you with:

- Case analysis and diagnostic insights
- Similar case searches from our database
- Medical literature reviews
- Differential diagnoses
- Treatment recommendations
- Imaging interpretation guidance

Could you provide more specific details about what you'd like to know? For example, patient age, symptoms, imaging findings, or specific medical questions you have.`;
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-medical-dark mb-2">AI Medical Assistant</h1>
        <p className="text-gray-600">Ask questions, find similar cases, and get AI-powered insights for your medical cases.</p>
      </motion.div>

      <div className="flex-1 flex gap-6">
        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 backdrop-blur-md bg-glass-white rounded-2xl border border-white/20 shadow-lg flex flex-col"
        >
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-medical-primary to-medical-secondary ml-3' 
                      : 'bg-gradient-to-br from-medical-secondary to-green-600 mr-3'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-medical-primary to-medical-secondary text-white'
                      : 'bg-white/50 border border-white/30 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-medical-secondary to-green-600 mr-3 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/50 border border-white/30 rounded-2xl p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputMessage);
              }}
              className="flex space-x-3"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about cases, diagnoses, or medical insights..."
                className="flex-1 p-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white p-3 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Quick Actions Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-80 space-y-4"
        >
          <div className="backdrop-blur-md bg-glass-white rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-medical-primary mr-2" />
              <h3 className="text-lg font-semibold text-medical-dark">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="w-full p-4 text-left rounded-xl bg-white/30 hover:bg-white/50 transition-colors border border-white/20 hover:border-medical-primary/30"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-medical-primary/20 to-medical-secondary/20 rounded-lg mr-3">
                      <action.icon className="h-4 w-4 text-medical-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-md bg-glass-green rounded-2xl border border-green-200/30 shadow-lg p-6">
            <div className="flex items-center mb-3">
              <MessageSquare className="h-5 w-5 text-medical-secondary mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Tips</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Be specific about patient details</li>
              <li>• Include imaging modality and findings</li>
              <li>• Ask for differential diagnoses</li>
              <li>• Request similar case comparisons</li>
              <li>• Inquire about treatment options</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;