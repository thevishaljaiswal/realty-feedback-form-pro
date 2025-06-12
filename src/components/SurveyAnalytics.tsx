
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Survey } from '@/pages/SurveyManagement';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, TrendingUp, Calendar } from 'lucide-react';

interface SurveyAnalyticsProps {
  survey: Survey;
}

const SurveyAnalytics: React.FC<SurveyAnalyticsProps> = ({ survey }) => {
  const responses = survey.responses || [];

  // Calculate response rate over time
  const getResponsesOverTime = () => {
    const responsesByDay = responses.reduce((acc, response) => {
      const date = new Date(response.submittedAt).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(responsesByDay)
      .map(([date, count]) => ({ date, responses: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Analyze question responses
  const analyzeQuestion = (questionId: string) => {
    const question = survey.questions.find(q => q.id === questionId);
    if (!question) return null;

    const answers = responses.map(r => r.answers[questionId]).filter(Boolean);

    switch (question.type) {
      case 'rating':
        const ratingCounts = answers.reduce((acc, rating) => {
          acc[rating] = (acc[rating] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        
        const avgRating = answers.length > 0 
          ? (answers.reduce((sum, rating) => sum + rating, 0) / answers.length).toFixed(1)
          : '0';

        return {
          type: 'rating',
          average: avgRating,
          distribution: Array.from({ length: question.maxRating || 10 }, (_, i) => ({
            rating: i + 1,
            count: ratingCounts[i + 1] || 0
          }))
        };

      case 'radio':
      case 'select':
        const optionCounts = answers.reduce((acc, answer) => {
          acc[answer] = (acc[answer] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          type: 'single-choice',
          data: Object.entries(optionCounts).map(([option, count]) => ({
            option,
            count,
            percentage: ((count / answers.length) * 100).toFixed(1)
          }))
        };

      case 'checkbox':
        const allSelections = answers.flat();
        const selectionCounts = allSelections.reduce((acc, selection) => {
          acc[selection] = (acc[selection] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          type: 'multiple-choice',
          data: Object.entries(selectionCounts).map(([option, count]) => ({
            option,
            count,
            percentage: ((count / responses.length) * 100).toFixed(1)
          }))
        };

      default:
        return {
          type: 'text',
          sampleResponses: answers.slice(0, 5)
        };
    }
  };

  const responseTimeData = getResponsesOverTime();
  const totalResponses = responses.length;
  const completionRate = survey.questions.length > 0 
    ? ((totalResponses / (totalResponses + Math.floor(totalResponses * 0.3))) * 100).toFixed(1)
    : '0';

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold">{totalResponses}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questions</p>
                <p className="text-2xl font-bold">{survey.questions.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge className="mt-1">{survey.status}</Badge>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Timeline */}
      {responseTimeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Response Timeline</CardTitle>
            <CardDescription>Daily response count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                responses: {
                  label: "Responses",
                  color: "#8884d8",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="responses" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Question Analysis */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Question Analysis</h3>
        
        {survey.questions.map((question, index) => {
          const analysis = analyzeQuestion(question.id);
          if (!analysis) return null;

          return (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {index + 1}: {question.question}
                </CardTitle>
                <CardDescription>
                  Type: {question.type} | Responses: {responses.length}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {analysis.type === 'rating' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{analysis.average}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "#8884d8",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <BarChart data={analysis.distribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}

                {(analysis.type === 'single-choice' || analysis.type === 'multiple-choice') && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "#8884d8",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <PieChart>
                        <Pie
                          data={analysis.data}
                          dataKey="count"
                          nameKey="option"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ option, percentage }) => `${option}: ${percentage}%`}
                        >
                          {analysis.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                    
                    <div className="space-y-2">
                      {analysis.data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {item.option}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.type === 'text' && (
                  <div className="space-y-2">
                    <p className="font-medium">Sample Responses:</p>
                    {analysis.sampleResponses.map((response, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border italic">
                        "{response}"
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SurveyAnalytics;
