
import React from 'react';
import { Button } from "@/components/ui/button";
import { CategoryFilter } from '@/types';
import { LayoutGrid, Apple, Pill } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

const CategoryFilterComponent: React.FC<CategoryFilterProps> = ({ selectedCategory, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-3 my-6">
      <Button
        variant={selectedCategory === 'all' ? "secondary" : "outline"}
        onClick={() => onChange('all')}
        className="flex items-center justify-center w-full py-6"
      >
        <LayoutGrid size={20} className="mr-2" />
        <span className="font-medium">All</span>
      </Button>
      
      <Button
        variant={selectedCategory === 'food' ? "secondary" : "outline"}
        onClick={() => onChange('food')}
        className="flex items-center justify-center w-full py-6"
      >
        <Apple size={20} className="text-food mr-2" />
        <span className="font-medium">Food</span>
      </Button>
      
      <Button
        variant={selectedCategory === 'household' ? "secondary" : "outline"}
        onClick={() => onChange('household')}
        className="flex items-center justify-center w-full py-6"
      >
        <Pill size={20} className="text-household mr-2" />
        <span className="font-medium">Household</span>
      </Button>
    </div>
  );
};

export default CategoryFilterComponent;
