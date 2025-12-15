const Groq = require('groq-sdk').default;
require('dotenv').config({ path: '.env.local' });

async function testGroq() {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not found in environment');
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Test with a simple completion
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "Groq API is working!"' }],
      model: 'mixtral-8x7b-32768',
      max_tokens: 20
    });

    if (completion.choices[0]?.message?.content) {
      console.log('✅ Groq API connection successful');
      process.exit(0);
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('❌ Groq API connection failed:', error.message);
    process.exit(1);
  }
}

testGroq();
