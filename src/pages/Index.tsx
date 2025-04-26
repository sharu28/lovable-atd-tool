
import React, { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import ResultsDisplay, { DetailError } from '@/components/ResultsDisplay';
import PromptEditor from '@/components/PromptEditor';
import SupportForm from '@/components/SupportForm';
import { Button } from '@/components/ui/button';
import { Settings, Mail } from 'lucide-react';
import { analyzeDocument, DEFAULT_AI_PROMPT } from '@/utils/aiProcessing';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<DetailError[]>([]);
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_AI_PROMPT);
  const [promptEditorOpen, setPromptEditorOpen] = useState(false);
  const [supportFormOpen, setSupportFormOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    
    try {
      const results = await analyzeDocument(uploadedFile, aiPrompt);
      setErrors(results);
      
      if (results.length === 0) {
        toast({
          title: "Analysis Complete",
          description: "No attention to detail issues found in your document.",
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: `Found ${results.length} attention to detail issue${results.length !== 1 ? 's' : ''}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem analyzing your document.",
        variant: "destructive",
      });
      console.error("Error processing document:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePrompt = (newPrompt: string) => {
    setAiPrompt(newPrompt);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detail Detective</h1>
              <p className="text-gray-500">AI-powered attention to detail checker</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setPromptEditorOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit AI Prompt
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSupportFormOpen(true)}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload Your Document</h2>
              <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
              
              {file && !isProcessing && errors.length === 0 && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <p className="text-green-800 text-center">
                    No attention to detail issues found in {file.name}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <ResultsDisplay 
                fileName={file?.name || ''} 
                errors={errors} 
                isLoading={isProcessing} 
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Detail Detective - AI-powered attention to detail checker
          </p>
        </div>
      </footer>

      <PromptEditor
        open={promptEditorOpen}
        onOpenChange={setPromptEditorOpen}
        currentPrompt={aiPrompt}
        onSavePrompt={handleSavePrompt}
      />

      <SupportForm 
        open={supportFormOpen} 
        onOpenChange={setSupportFormOpen} 
      />
    </div>
  );
};

export default Index;
