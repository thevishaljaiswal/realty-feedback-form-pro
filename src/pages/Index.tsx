
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import SurveyForm from "@/components/SurveyForm";
import { BarChart3, PlusCircle, Users, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Survey Management Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create, manage, and analyze surveys with powerful insights and beautiful analytics
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Link to="/surveys">
              <Button size="lg" className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Manage Surveys
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <PlusCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Create Surveys</CardTitle>
              <CardDescription>
                Build custom surveys with multiple question types including ratings, checkboxes, and text fields
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Collect Responses</CardTitle>
              <CardDescription>
                Share your surveys and collect responses from your target audience with real-time updates
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Analyze Results</CardTitle>
              <CardDescription>
                Get detailed analytics with charts, graphs, and insights to make data-driven decisions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sample Survey */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sample Real Estate Survey
            </h2>
            <p className="text-lg text-gray-600">
              Try out our survey functionality with this sample real estate customer survey
            </p>
          </div>
          <SurveyForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
