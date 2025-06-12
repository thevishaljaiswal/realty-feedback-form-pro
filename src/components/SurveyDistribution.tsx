import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Survey } from '@/pages/SurveyManagement';
import { Customer } from '@/components/CustomerManager';
import { Send, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface SurveyDistributionData {
  id: string;
  surveyId: string;
  customerIds: string[];
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed';
}

interface SurveyDistributionProps {
  surveys: Survey[];
  customers: Customer[];
  selectedCustomers: string[];
  onSendSurvey: (surveyId: string, customerIds: string[]) => void;
  distributions: SurveyDistributionData[];
}

const SurveyDistribution: React.FC<SurveyDistributionProps> = ({
  surveys,
  customers,
  selectedCustomers,
  onSendSurvey,
  distributions
}) => {
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const { toast } = useToast();

  const activeSurveys = surveys.filter(survey => survey.status === 'active');
  const selectedCustomerData = customers.filter(c => selectedCustomers.includes(c.id));

  const handleSendSurvey = () => {
    if (!selectedSurvey) {
      toast({
        title: "Error",
        description: "Please select a survey to send",
        variant: "destructive"
      });
      return;
    }

    if (selectedCustomers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one customer",
        variant: "destructive"
      });
      return;
    }

    onSendSurvey(selectedSurvey, selectedCustomers);
    setSelectedSurvey('');
    
    toast({
      title: "Survey Sent",
      description: `Survey sent to ${selectedCustomers.length} customers successfully`
    });
  };

  const getSurveyTitle = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    return survey?.title || 'Unknown Survey';
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Survey to Customers
          </CardTitle>
          <CardDescription>
            Select a survey and send it to selected customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Survey</label>
            <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a survey to send" />
              </SelectTrigger>
              <SelectContent>
                {activeSurveys.map((survey) => (
                  <SelectItem key={survey.id} value={survey.id}>
                    {survey.title} ({survey.questions.length} questions)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Selected Customers ({selectedCustomers.length})</label>
            {selectedCustomers.length === 0 ? (
              <p className="text-gray-600 text-sm">No customers selected. Go to Customer Management to select customers.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedCustomerData.map((customer) => (
                  <Badge key={customer.id} variant="secondary">
                    {customer.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={handleSendSurvey}
            disabled={!selectedSurvey || selectedCustomers.length === 0}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Survey to {selectedCustomers.length} Customers
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Survey Distribution History
          </CardTitle>
          <CardDescription>
            Track sent surveys and their delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {distributions.length === 0 ? (
            <div className="text-center py-8">
              <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No surveys sent yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {distributions.map((distribution) => (
                <div key={distribution.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{getSurveyTitle(distribution.surveyId)}</h4>
                    <Badge variant={distribution.status === 'sent' ? 'default' : distribution.status === 'failed' ? 'destructive' : 'secondary'}>
                      {distribution.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Sent to {distribution.customerIds.length} customers</p>
                    <p>Date: {new Date(distribution.sentAt).toLocaleString()}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Customers: {distribution.customerIds.map(id => getCustomerName(id)).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyDistribution;
