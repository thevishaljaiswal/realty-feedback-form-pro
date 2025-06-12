
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Survey } from '@/pages/SurveyManagement';
import { Edit, Trash2, BarChart3, Eye, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveyListProps {
  surveys: Survey[];
  onEdit: (survey: Survey) => void;
  onDelete: (surveyId: string) => void;
  onViewAnalytics: (survey: Survey) => void;
  onUpdateSurvey: (survey: Survey) => void;
}

const SurveyList: React.FC<SurveyListProps> = ({ 
  surveys, 
  onEdit, 
  onDelete, 
  onViewAnalytics,
  onUpdateSurvey 
}) => {
  const { toast } = useToast();

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateSampleResponses = (survey: Survey) => {
    const sampleAnswers = survey.questions.reduce((acc, question) => {
      switch (question.type) {
        case 'text':
        case 'textarea':
          acc[question.id] = 'Sample response text';
          break;
        case 'radio':
        case 'select':
          acc[question.id] = question.options?.[0] || '';
          break;
        case 'checkbox':
          acc[question.id] = question.options?.slice(0, 2) || [];
          break;
        case 'rating':
          acc[question.id] = Math.floor(Math.random() * (question.maxRating || 10)) + 1;
          break;
      }
      return acc;
    }, {} as any);

    const sampleResponses = Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => ({
      id: `response-${i}`,
      surveyId: survey.id,
      respondentId: `user-${i}`,
      answers: sampleAnswers,
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));

    const updatedSurvey = { ...survey, responses: sampleResponses };
    onUpdateSurvey(updatedSurvey);
    
    toast({
      title: "Sample Data Generated",
      description: `Generated ${sampleResponses.length} sample responses for analytics.`
    });
  };

  const duplicateSurvey = (survey: Survey) => {
    const duplicatedSurvey: Survey = {
      ...survey,
      id: Date.now().toString(),
      title: `${survey.title} (Copy)`,
      createdAt: new Date().toISOString(),
      status: 'draft',
      responses: []
    };
    onUpdateSurvey(duplicatedSurvey);
    
    toast({
      title: "Survey Duplicated",
      description: "Survey has been copied successfully."
    });
  };

  if (surveys.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Surveys Yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first survey to start collecting valuable feedback.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {surveys.map((survey) => (
        <Card key={survey.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{survey.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {survey.description || 'No description provided'}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(survey.status)}>
                {survey.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{survey.questions.length} questions</span>
                <span>{survey.responses?.length || 0} responses</span>
              </div>
              
              <div className="text-xs text-gray-500">
                Created: {new Date(survey.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(survey)}
                  className="flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateSurvey(survey)}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewAnalytics(survey)}
                  className="flex items-center gap-1"
                >
                  <BarChart3 className="w-3 h-3" />
                  Analytics
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSampleResponses(survey)}
                  className="flex items-center gap-1"
                >
                  <Share className="w-3 h-3" />
                  Generate Data
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(survey.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SurveyList;
