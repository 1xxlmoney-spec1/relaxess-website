#!/usr/bin/env node

/**
 * Direct OpenAI API Test
 * Makes a real API call to OpenAI and logs exact error output
 */

const axios = require('axios');

async function testOpenAIAPI() {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key found in EXPO_PUBLIC_OPENAI_API_KEY');
    process.exit(1);
  }

  console.log('🔑 API Key (first 20 chars):', apiKey.substring(0, 20) + '...');
  console.log('');

  const client = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  });

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: 'Hello, how are you?',
      },
    ],
    max_tokens: 100,
    temperature: 0.8,
  };

  console.log('📋 Request Payload:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('');

  console.log('🌐 Making API call to https://api.openai.com/v1/chat/completions...');
  console.log('');

  try {
    const response = await client.post('/chat/completions', payload);
    
    console.log('✅ SUCCESS - HTTP 200 OK');
    console.log('');
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('');
    console.log('📋 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('');
    
    if (response.data.choices && response.data.choices[0]) {
      console.log('💬 Assistant Response:');
      console.log(response.data.choices[0].message.content);
    }
    
  } catch (error) {
    console.error('❌ API CALL FAILED');
    console.error('');
    
    if (error.response) {
      console.error('📊 HTTP Status Code:', error.response.status);
      console.error('📊 Status Text:', error.response.statusText);
      console.error('');
      console.error('📋 Response Headers:');
      console.error(JSON.stringify(error.response.headers, null, 2));
      console.error('');
      console.error('📋 Response Data (Error Body):');
      console.error(JSON.stringify(error.response.data, null, 2));
      console.error('');
    } else if (error.request) {
      console.error('❌ No response received from server');
      console.error('📋 Request:', error.request);
      console.error('');
    }
    
    console.error('🔍 Error Message:', error.message);
    console.error('🔗 Error Code:', error.code);
    console.error('⏱️ Timeout:', error.timeout);
    console.error('');
    console.error('📋 Full Error Object:');
    console.error(JSON.stringify({
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    }, null, 2));
  }
}

testOpenAIAPI();
