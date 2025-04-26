
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface DetailError {
  id: string;
  type: 'critical' | 'warning' | 'info';
  location: string;
  description: string;
  suggestion: string;
}

interface ResultsDisplayProps {
  fileName: string;
  errors: DetailError[];
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ fileName, errors, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>Analysis in Progress</div>
              <span className="animate-pulse-subtle">
                <Badge variant="outline" className="bg-brand-light-purple/10 text-brand-purple">Processing</Badge>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl font-semibold">Analysis Results for {fileName}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        We found {errors.length} attention to detail issue{errors.length !== 1 ? 's' : ''} in your document.
      </p>
      
      {errors.map((error) => (
        <Card key={error.id} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{error.location}</span>
              <Badge 
                className={
                  error.type === 'critical' ? 'bg-red-100 text-red-800' : 
                  error.type === 'warning' ? 'bg-amber-100 text-amber-800' : 
                  'bg-blue-100 text-blue-800'
                }
              >
                {error.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{error.description}</p>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Suggestion:</p>
              <p className="text-sm">{error.suggestion}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResultsDisplay;
