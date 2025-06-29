import express from 'express';
import { auth } from '../middleware/auth';
import { GeminiService } from '../services/geminiService';
import { VectorSearchService } from '../services/vectorSearchService';
import { ChatMessage } from '../models/ChatMessage';

const router = express.Router();
const gemini = new GeminiService();
const vectorSearch = new VectorSearchService();

// Send message to AI assistant
router.post('/message', auth, async (req, res) => {
  try {
    const { message, context } = req.body;

    // Save user message
    const userMessage = new ChatMessage({
      userId: req.user.userId,
      content: message,
      role: 'user',
      context,
      timestamp: new Date()
    });
    await userMessage.save();

    // Get relevant context using vector search
    const similarCases = await vectorSearch.findSimilarCases(message, 3);
    
    // Generate AI response using Gemini
    const aiResponse = await gemini.generateChatResponse(message, similarCases, context);

    // Save AI response
    const assistantMessage = new ChatMessage({
      userId: req.user.userId,
      content: aiResponse,
      role: 'assistant',
      context: { similarCases },
      timestamp: new Date()
    });
    await assistantMessage.save();

    res.json({
      userMessage,
      assistantMessage
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get chat history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const messages = await ChatMessage.find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Clear chat history
router.delete('/history', auth, async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user.userId });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as chatRoutes };