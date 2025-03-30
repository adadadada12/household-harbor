
import React from 'react';
import { FilterOption } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Filter, AlertTriangle, Clock } from 'lucide-react';

interface FilterPopupProps {
  selectedOption: FilterOption;
  onSelect: (option: FilterOption) => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ selectedOption, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64 animate-slide-in">
      <h3 className="font-semibold mb-3">Filter Items</h3>
      
      <RadioGroup value={selectedOption} onValueChange={(value) => onSelect(value as FilterOption)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="filter-all" />
            <Label htmlFor="filter-all" className="flex items-center gap-2 cursor-pointer">
              <Filter size={18} /> All Items
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expiring" id="filter-expiring" />
            <Label htmlFor="filter-expiring" className="flex items-center gap-2 cursor-pointer">
              <Clock size={18} /> Expiring Soon
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expired" id="filter-expired" />
            <Label htmlFor="filter-expired" className="flex items-center gap-2 cursor-pointer">
              <AlertTriangle size={18} /> Expired Items
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default FilterPopup;
