
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowDownWideNarrow, Clock } from 'lucide-react';
import { SortOption } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SortingPopupProps {
  selectedOption: SortOption;
  onSelect: (option: SortOption) => void;
}

const SortingPopup: React.FC<SortingPopupProps> = ({ selectedOption, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64 animate-slide-in">
      <h3 className="font-semibold mb-3">Sort Items</h3>
      
      <RadioGroup value={selectedOption} onValueChange={(value) => onSelect(value as SortOption)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="sort-name" />
            <Label htmlFor="sort-name" className="flex items-center gap-2 cursor-pointer">
              <ArrowDownAZ size={18} /> By Name
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expireDate" id="sort-expire" />
            <Label htmlFor="sort-expire" className="flex items-center gap-2 cursor-pointer">
              <ArrowDownWideNarrow size={18} /> By Expire Date
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="createdAt" id="sort-created" />
            <Label htmlFor="sort-created" className="flex items-center gap-2 cursor-pointer">
              <Clock size={18} /> Recently Added
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SortingPopup;
