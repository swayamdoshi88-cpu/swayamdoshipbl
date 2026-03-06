import { GoogleGenAI } from '@google/genai';

/**
 * Initializes the Gemini client and sends a prompt to get a spending tip.
 * @param prompt The prompt to send to the Gemini model.
 * @returns A string containing the generated spending tip.
 * @throws An error if the API key is missing or the API call fails.
 */
export async function generateSpendingTip(prompt: string): Promise<string> {
  // Ensure the API key is available
  if (!process.env.API_KEY) {
    throw new Error('API_KEY is not set in environment variables.');
  }

  // Create a new GoogleGenAI instance for each call to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using gemini-2.5-flash for text tasks
      contents: prompt,
      config: {
        // Optional: configure temperature or other parameters
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    // Extract the text output from the response
    const text = response.text;
    if (!text) {
      throw new Error('No text was returned from the Gemini API.');
    }

    return text.trim();
  } catch (error: any) {
    console.error('Error in Gemini API call:', error);
    // You might want to implement retry logic here for specific error types
    if (error.message.includes('API_KEY')) {
      // Specific handling for API key issues if needed, though process.env.API_KEY should be handled by runtime.
      throw new Error('Gemini API Error: Invalid or missing API key.');
    }
    throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
  }
}
