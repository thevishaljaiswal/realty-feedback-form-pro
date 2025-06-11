
import React from 'react';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  max?: number;
}

const RatingInput: React.FC<RatingInputProps> = ({ 
  label, 
  value, 
  onChange, 
  max = 10 
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{label}</Label>
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={cn(
              "w-10 h-10 rounded-full border-2 font-semibold transition-all duration-200 hover:scale-110",
              value >= rating
                ? "bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white shadow-lg"
                : "border-gray-300 hover:border-gray-400 text-gray-600"
            )}
          >
            {rating}
          </button>
        ))}
        <div className="flex items-center gap-1 ml-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600">
            {value > 0 ? `${value}/10` : 'Not rated'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RatingInput;
