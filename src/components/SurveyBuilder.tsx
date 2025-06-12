
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Survey, Question } from '@/pages/SurveyManagement';
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react';

interface SurveyBuilderProps {
  onSave: (survey: Omit<Survey, 'id' | 'createdAt' | 'responses'>) => void;
  onUpdate?: (survey: Survey) => void;
  onCancel: () => void;
  editingSurvey?: Survey | null;
}

const SurveyBuilder: React.FC<SurveyBuilderProps> = ({ onSave, onUpdate, onCancel, editingSurvey }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<'draft' | 'active' | 'closed'>('draft');

  useEffect(() => {
    if (editingSurvey) {
      setTitle(editingSurvey.title);
      setDescription(editingSurvey.description);
      setQuestions(editingSurvey.questions);
      setStatus(editingSurvey.status);
    }
  }, [editingSurvey]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'text',
      question: '',
      required: false,
      options: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: [...(q.options || []), ''] }
        : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt) 
          }
        : q
    ));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options?.filter((_, idx) => idx !== optionIndex) 
          }
        : q
    ));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a survey title.",
        variant: "destructive"
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question.",
        variant: "destructive"
      });
      return;
    }

    const surveyData = {
      title: title.trim(),
      description: description.trim(),
      questions,
      status
    };

    if (editingSurvey && onUpdate) {
      onUpdate({
        ...editingSurvey,
        ...surveyData
      });
      toast({
        title: "Success",
        description: "Survey updated successfully!"
      });
    } else {
      onSave(surveyData);
      toast({
        title: "Success",
        description: "Survey created successfully!"
      });
    }
  };

  const questionTypeOptions = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'radio', label: 'Multiple Choice (Single)' },
    { value: 'checkbox', label: 'Multiple Choice (Multiple)' },
    { value: 'select', label: 'Dropdown' },
    { value: 'rating', label: 'Rating Scale' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingSurvey ? 'Edit Survey' : 'Create New Survey'}
          </CardTitle>
          <CardDescription>
            Build your survey by adding questions with different input types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Survey Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter survey title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'draft' | 'active' | 'closed') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter survey description"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Questions</h3>
          <Button onClick={addQuestion} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>

        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <GripVertical className="w-5 h-5 text-gray-400 mt-2" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Question {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select 
                        value={question.type} 
                        onValueChange={(value: Question['type']) => updateQuestion(question.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {question.type === 'rating' && (
                      <div className="space-y-2">
                        <Label>Max Rating</Label>
                        <Select 
                          value={question.maxRating?.toString() || '10'} 
                          onValueChange={(value) => updateQuestion(question.id, 'maxRating', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">1-5</SelectItem>
                            <SelectItem value="10">1-10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text *</Label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      placeholder="Enter your question"
                    />
                  </div>

                  {['radio', 'checkbox', 'select'].includes(question.type) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(question.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${question.id}`}
                      checked={question.required}
                      onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                    />
                    <Label htmlFor={`required-${question.id}`}>Required question</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {editingSurvey ? 'Update Survey' : 'Save Survey'}
        </Button>
      </div>
    </div>
  );
};

export default SurveyBuilder;
