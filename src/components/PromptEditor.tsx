
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface PromptEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPrompt: string;
  onSavePrompt: (prompt: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  open,
  onOpenChange,
  currentPrompt,
  onSavePrompt,
}) => {
  const [promptText, setPromptText] = useState(currentPrompt);
  const { toast } = useToast();

  const handleSave = () => {
    if (promptText.trim().length < 10) {
      toast({
        title: "Prompt too short",
        description: "Please enter a more detailed prompt",
        variant: "destructive",
      });
      return;
    }

    onSavePrompt(promptText);
    toast({
      title: "Prompt saved",
      description: "Your custom AI prompt has been updated",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit AI Analysis Prompt</DialogTitle>
          <DialogDescription>
            Customize how the AI analyzes documents for attention to detail issues.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder="Enter your custom AI prompt here..."
          />
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="mb-2">Tips for effective prompts:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be specific about what kinds of errors to look for</li>
              <li>Include examples of common mistakes if possible</li>
              <li>Specify the format you want for the results</li>
              <li>Consider the domain-specific terminology for your documents</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-brand-purple hover:bg-brand-light-purple">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptEditor;
