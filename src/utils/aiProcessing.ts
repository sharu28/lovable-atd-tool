
import { DetailError } from '@/components/ResultsDisplay';

// Default AI prompt for attention to detail checking
export const DEFAULT_AI_PROMPT = `Analyze the provided SOA (Statement of Advice) document for attention to detail errors, including:

1. Typos and grammatical errors
2. Inconsistent terminology or naming
3. Incorrect data or calculations
4. Formatting inconsistencies
5. Missing information or incomplete sections
6. Logical inconsistencies or contradictions
7. Compliance issues or missing disclosures

For each issue found, provide:
- The specific location in the document
- A description of the error
- A suggested correction`;

// Mock function to simulate AI analysis of documents
// In a real implementation, this would call an actual AI service
export const analyzeDocument = async (
  file: File, 
  aiPrompt: string
): Promise<DetailError[]> => {
  console.log(`Analyzing ${file.name} with custom prompt: ${aiPrompt}`);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock results - in a real implementation, this would come from the AI
  const mockResults: DetailError[] = [
    {
      id: '1',
      type: 'critical',
      location: 'Page 2, Section 1.3',
      description: 'Client name "John Smith" inconsistent with "Jon Smith" used elsewhere in the document.',
      suggestion: 'Verify the correct spelling of the client name and ensure consistency throughout the document.'
    },
    {
      id: '2',
      type: 'warning',
      location: 'Page 4, Financial Summary Table',
      description: 'Total assets value ($425,000) does not match sum of individual assets ($435,000).',
      suggestion: 'Recalculate the total assets value or check individual asset values for accuracy.'
    },
    {
      id: '3',
      type: 'info',
      location: 'Page 7, Risk Profile',
      description: 'Risk tolerance stated as "moderate" but investment recommendations suggest a "conservative" approach.',
      suggestion: 'Align investment recommendations with stated risk profile or provide explanation for the difference.'
    },
    {
      id: '4',
      type: 'warning',
      location: 'Page 9, Fee Structure',
      description: 'Annual fee percentage (0.85%) multiplied by investment amount does not match stated fee ($4,250).',
      suggestion: 'Verify fee calculation for accuracy.'
    },
    {
      id: '5',
      type: 'critical',
      location: 'Page 12, Disclosure Statement',
      description: 'Missing required disclaimer about investment risks.',
      suggestion: 'Add standard disclaimer text about investment risks to the disclosure section.'
    }
  ];
  
  // Return a random subset of the mock results to simulate different findings
  return mockResults.filter(() => Math.random() > 0.3);
};
