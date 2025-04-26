
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndUploadFile(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      validateAndUploadFile(e.target.files[0]);
    }
  };

  const validateAndUploadFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document (.docx)",
        variant: "destructive",
      });
      return;
    }
    
    onFileUpload(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors
        ${dragActive ? 'border-brand-light-purple bg-brand-light-purple/5' : 'border-gray-300 hover:border-brand-light-purple/50'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.docx"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-brand-light-purple/10 p-4">
          <Upload className="h-10 w-10 text-brand-purple" />
        </div>
        <h3 className="text-lg font-medium">Upload your document</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Drag and drop your PDF or Word document here, or click the button below
        </p>
        <Button 
          onClick={handleButtonClick}
          disabled={isProcessing}
          className="bg-brand-purple hover:bg-brand-light-purple"
        >
          Select File
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
