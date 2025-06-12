
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Survey, SurveyResponse } from '@/pages/SurveyManagement';
import { Customer } from '@/components/CustomerManager';
import { Eye, User, Calendar, FileText } from 'lucide-react';

interface ResponseViewerProps {
  surveys: Survey[];
  customers: Customer[];
  responses: SurveyResponse[];
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({
  surveys,
  customers,
  responses
}) => {
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  const getSurveyResponses = (surveyId: string) => {
    return responses.filter(response => response.surveyId === surveyId);
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getCustomerEmail = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.email || 'Unknown Email';
  };

  const getSurvey = (surveyId: string) => {
    return surveys.find(s => s.id === surveyId);
  };

  const getQuestionText = (questionId: string, surveyId: string) => {
    const survey = getSurvey(surveyId);
    const question = survey?.questions.find(q => q.id === questionId);
    return question?.question || 'Unknown Question';
  };

  const getQuestionType = (questionId: string, surveyId: string) => {
    const survey = getSurvey(surveyId);
    const question = survey?.questions.find(q => q.id === questionId);
    return question?.type || 'text';
  };

  const formatAnswer = (answer: any, questionType: string) => {
    if (answer === null || answer === undefined) return 'No answer';
    
    switch (questionType) {
      case 'checkbox':
        return Array.isArray(answer) ? answer.join(', ') : String(answer);
      case 'rating':
        return `${answer} stars`;
      default:
        return String(answer);
    }
  };

  const surveysWithResponses = surveys.filter(survey => 
    responses.some(response => response.surveyId === survey.id)
  );

  const selectedSurveyResponses = selectedSurvey ? getSurveyResponses(selectedSurvey) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            View Customer Responses
          </CardTitle>
          <CardDescription>
            Select a survey to view individual customer responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Survey</label>
            <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a survey to view responses" />
              </SelectTrigger>
              <SelectContent>
                {surveysWithResponses.map((survey) => (
                  <SelectItem key={survey.id} value={survey.id}>
                    {survey.title} ({getSurveyResponses(survey.id).length} responses)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSurvey && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Responses</CardTitle>
                  <CardDescription>
                    {selectedSurveyResponses.length} responses received
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSurveyResponses.length === 0 ? (
                    <p className="text-gray-600">No responses yet</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedSurveyResponses.map((response) => (
                        <div 
                          key={response.id} 
                          className={`border rounded p-3 cursor-pointer transition-colors ${
                            selectedResponse?.id === response.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedResponse(response)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="font-medium">
                                {getCustomerName(response.respondentId)}
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>{getCustomerEmail(response.respondentId)}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(response.submittedAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Details</CardTitle>
                  {selectedResponse && (
                    <CardDescription>
                      Response from {getCustomerName(selectedResponse.respondentId)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedResponse ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a response to view details</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <h4 className="font-medium">Customer Information</h4>
                        <p className="text-sm text-gray-600">
                          {getCustomerName(selectedResponse.respondentId)} - {getCustomerEmail(selectedResponse.respondentId)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Answers</h4>
                        {Object.entries(selectedResponse.answers).map(([questionId, answer]) => (
                          <div key={questionId} className="border rounded p-3">
                            <p className="font-medium text-sm mb-2">
                              {getQuestionText(questionId, selectedResponse.surveyId)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getQuestionType(questionId, selectedResponse.surveyId)}
                              </Badge>
                              <span className="text-sm">
                                {formatAnswer(answer, getQuestionType(questionId, selectedResponse.surveyId))}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponseViewer;
