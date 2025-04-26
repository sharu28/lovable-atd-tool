
import OpenAI from 'openai';
import { DetailError } from '@/components/ResultsDisplay';

const STORAGE_KEY = 'openai_api_key';

export const getOpenAIKey = () => localStorage.getItem(STORAGE_KEY);
export const setOpenAIKey = (key: string) => localStorage.setItem(STORAGE_KEY, key);

// Function to check if we have a valid API key
export const hasValidAPIKey = () => {
  const key = getOpenAIKey();
  return key && key.startsWith('sk-');
};

// Function to extract text from a File object
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      resolve(text);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const analyzeDocument = async (
  file: File,
  aiPrompt: string
): Promise<DetailError[]> => {
  if (!hasValidAPIKey()) {
    throw new Error('No valid OpenAI API key found. Please set your API key first.');
  }

  const openai = new OpenAI({
    apiKey: getOpenAIKey(),
    dangerouslyAllowBrowser: true
  });

  try {
    const documentText = await extractTextFromFile(file);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an attention to detail checker. Analyze the following document and return a JSON array of issues found. Each issue should have: type (critical/warning/info), location (page/section reference), description (the issue found), and suggestion (how to fix it).`
        },
        {
          role: 'user',
          content: `${aiPrompt}\n\nDocument content:\n${documentText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"errors": []}');
    
    if (!Array.isArray(result.errors)) {
      throw new Error('Invalid response format from AI');
    }

    return result.errors.map((error: any, index: number) => ({
      id: index.toString(),
      type: error.type || 'info',
      location: error.location || 'Unknown location',
      description: error.description || 'No description provided',
      suggestion: error.suggestion || 'No suggestion provided'
    }));
  } catch (error: any) {
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw error;
  }
};
