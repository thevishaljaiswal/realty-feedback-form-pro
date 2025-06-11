
import SurveyForm from "@/components/SurveyForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real Estate Customer Survey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us improve our services by sharing your experience and preferences
          </p>
        </div>
        <SurveyForm />
      </div>
    </div>
  );
};

export default Index;
