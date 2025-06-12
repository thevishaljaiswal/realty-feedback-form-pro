
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SurveyBuilder from '@/components/SurveyBuilder';
import SurveyList from '@/components/SurveyList';
import SurveyAnalytics from '@/components/SurveyAnalytics';
import { PlusCircle, BarChart3, FileText } from 'lucide-react';

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  status: 'draft' | 'active' | 'closed';
  responses: SurveyResponse[];
}

export interface Question {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'rating' | 'select';
  question: string;
  options?: string[];
  required: boolean;
  maxRating?: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  answers: { [questionId: string]: any };
  submittedAt: string;
}

const SurveyManagement = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleCreateSurvey = (survey: Omit<Survey, 'id' | 'createdAt' | 'responses'>) => {
    const newSurvey: Survey = {
      ...survey,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      responses: []
    };
    setSurveys(prev => [...prev, newSurvey]);
    setActiveTab('list');
  };

  const handleUpdateSurvey = (updatedSurvey: Survey) => {
    setSurveys(prev => prev.map(s => s.id === updatedSurvey.id ? updatedSurvey : s));
  };

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveys(prev => prev.filter(s => s.id !== surveyId));
  };

  const handleViewAnalytics = (survey: Survey) => {
    setSelectedSurvey(survey);
    setActiveTab('analytics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Survey Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, manage, and analyze your surveys with powerful insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Surveys
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Survey
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <SurveyList 
              surveys={surveys}
              onEdit={(survey) => {
                setSelectedSurvey(survey);
                setActiveTab('create');
              }}
              onDelete={handleDeleteSurvey}
              onViewAnalytics={handleViewAnalytics}
              onUpdateSurvey={handleUpdateSurvey}
            />
          </TabsContent>

          <TabsContent value="create">
            <SurveyBuilder 
              onSave={handleCreateSurvey}
              editingSurvey={selectedSurvey}
              onUpdate={handleUpdateSurvey}
              onCancel={() => {
                setSelectedSurvey(null);
                setActiveTab('list');
              }}
            />
          </TabsContent>

          <TabsContent value="analytics">
            {selectedSurvey ? (
              <SurveyAnalytics survey={selectedSurvey} />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Survey to Analyze
                  </h3>
                  <p className="text-gray-600">
                    Choose a survey from the list to view detailed analytics and insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SurveyManagement;
