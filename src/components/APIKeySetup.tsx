
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { hasValidAPIKey, setOpenAIKey } from '@/utils/openai';
import { useToast } from '@/hooks/use-toast';

interface APIKeySetupProps {
  onKeySet: () => void;
}

const APIKeySetup: React.FC<APIKeySetupProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    setOpenAIKey(apiKey);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully",
    });
    onKeySet();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up OpenAI API Key</CardTitle>
        <CardDescription>
          To use the attention to detail checker, you need to provide your OpenAI API key.
          This key will be stored in your browser and only used for processing documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button type="submit">Save API Key</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default APIKeySetup;
