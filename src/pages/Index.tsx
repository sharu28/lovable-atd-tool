
import React, { useState, useEffect } from 'react';
import FileUploader from '@/components/FileUploader';
import ResultsDisplay, { DetailError } from '@/components/ResultsDisplay';
import PromptEditor from '@/components/PromptEditor';
import SupportForm from '@/components/SupportForm';
import APIKeySetup from '@/components/APIKeySetup';
import { Button } from '@/components/ui/button';
import { Settings, Mail } from 'lucide-react';
import { analyzeDocument, DEFAULT_AI_PROMPT, hasValidAPIKey } from '@/utils/openai';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<DetailError[]>([]);
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_AI_PROMPT);
  const [promptEditorOpen, setPromptEditorOpen] = useState(false);
  const [supportFormOpen, setSupportFormOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasApiKey(hasValidAPIKey());
  }, []);

  const handleFileUpload = async (uploadedFile: File) => {
    if (!hasApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set up your OpenAI API key first",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);
    setErrors([]);
    
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem analyzing your document.",
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
            <div className="text-center w-full">
              <h1 className="text-3xl font-bold text-gray-900">Attention to Detail Checker</h1>
              <p className="text-gray-500">AI-powered document analysis</p>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center space-y-8">
            {!hasApiKey ? (
              <div className="w-full max-w-2xl">
                <APIKeySetup onKeySet={() => setHasApiKey(true)} />
              </div>
            ) : (
              <>
                <div className="w-full max-w-2xl">
                  <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
                  
                  {file && !isProcessing && errors.length === 0 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                      <p className="text-green-800 text-center">
                        No attention to detail issues found in {file.name}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="w-full">
                  <ResultsDisplay 
                    fileName={file?.name || ''} 
                    errors={errors} 
                    isLoading={isProcessing} 
                  />
                </div>
              </>
            )}
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
