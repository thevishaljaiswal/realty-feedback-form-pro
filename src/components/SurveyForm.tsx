
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import RatingInput from './RatingInput';
import { CheckCircle, Home, Star, MessageSquare } from 'lucide-react';

interface SurveyData {
  name: string;
  email: string;
  propertyType: string;
  budget: string;
  locations: string[];
  overallSatisfaction: number;
  serviceQuality: number;
  agentRating: number;
  features: string[];
  experience: string;
  recommendations: string;
}

const SurveyForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SurveyData>({
    name: '',
    email: '',
    propertyType: '',
    budget: '',
    locations: [],
    overallSatisfaction: 0,
    serviceQuality: 0,
    agentRating: 0,
    features: [],
    experience: '',
    recommendations: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial Property' }
  ];

  const budgetRanges = [
    { value: 'under-200k', label: 'Under $200,000' },
    { value: '200k-500k', label: '$200,000 - $500,000' },
    { value: '500k-1m', label: '$500,000 - $1,000,000' },
    { value: '1m-2m', label: '$1,000,000 - $2,000,000' },
    { value: 'over-2m', label: 'Over $2,000,000' }
  ];

  const locations = [
    'Downtown',
    'Suburbs',
    'Waterfront',
    'Near Schools',
    'Near Transportation',
    'Quiet Neighborhood'
  ];

  const features = [
    'Modern Kitchen',
    'Swimming Pool',
    'Garage',
    'Garden/Yard',
    'Fireplace',
    'Walk-in Closet',
    'Home Office',
    'Gym/Fitness Room'
  ];

  const handleLocationChange = (location: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      locations: checked 
        ? [...prev.locations, location]
        : prev.locations.filter(l => l !== location)
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const handleRatingChange = (field: keyof SurveyData, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: rating
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey Data:', formData);
    
    toast({
      title: "Survey Submitted Successfully!",
      description: "Thank you for your valuable feedback.",
    });
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your survey has been submitted successfully.</p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Submit Another Survey
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Personal Information */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Please provide your basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Preferences */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Property Preferences</CardTitle>
          <CardDescription>
            Tell us about your property requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">What type of property are you looking for? *</Label>
            <RadioGroup 
              value={formData.propertyType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {propertyTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="cursor-pointer flex-1">{type.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Budget Range *</Label>
            <RadioGroup 
              value={formData.budget} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {budgetRanges.map((range) => (
                <div key={range.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={range.value} id={range.value} />
                  <Label htmlFor={range.value} className="cursor-pointer flex-1">{range.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Preferred Locations (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={location}
                    checked={formData.locations.includes(location)}
                    onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                  />
                  <Label htmlFor={location} className="cursor-pointer text-sm">{location}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Important Features (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                  />
                  <Label htmlFor={feature} className="cursor-pointer text-sm">{feature}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Service Ratings
          </CardTitle>
          <CardDescription>
            Please rate your experience with our services (1-10 scale)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RatingInput
            label="Overall Satisfaction"
            value={formData.overallSatisfaction}
            onChange={(rating) => handleRatingChange('overallSatisfaction', rating)}
          />
          <RatingInput
            label="Service Quality"
            value={formData.serviceQuality}
            onChange={(rating) => handleRatingChange('serviceQuality', rating)}
          />
          <RatingInput
            label="Agent Performance"
            value={formData.agentRating}
            onChange={(rating) => handleRatingChange('agentRating', rating)}
          />
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Additional Feedback
          </CardTitle>
          <CardDescription>
            Share your thoughts and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="experience">Describe your overall experience</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Tell us about your experience working with our team..."
              className="min-h-[100px] transition-all duration-200 focus:scale-[1.02]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recommendations">Any recommendations or suggestions?</Label>
            <Textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
              placeholder="How can we improve our services?"
              className="min-h-[100px] transition-all duration-200 focus:scale-[1.02]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          type="submit" 
          size="lg" 
          className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
        >
          Submit Survey
        </Button>
      </div>
    </form>
  );
};

export default SurveyForm;
