const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent('Say "Gemini API is working!"');
    const response = result.response.text();

    if (response) {
      console.log('✅ Gemini API connection successful');
      process.exit(0);
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error.message);
    process.exit(1);
  }
}

testGemini();
