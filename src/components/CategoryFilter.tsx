
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
    <div className="grid grid-cols-3 gap-2 my-4">
      <Button
        variant={selectedCategory === 'all' ? "secondary" : "outline"}
        onClick={() => onChange('all')}
        className="flex items-center justify-center w-full"
      >
        <LayoutGrid size={18} className="mr-1" />
        <span>All</span>
      </Button>
      
      <Button
        variant={selectedCategory === 'food' ? "secondary" : "outline"}
        onClick={() => onChange('food')}
        className="flex items-center justify-center w-full"
      >
        <Apple size={18} className="text-food mr-1" />
        <span>Food</span>
      </Button>
      
      <Button
        variant={selectedCategory === 'household' ? "secondary" : "outline"}
        onClick={() => onChange('household')}
        className="flex items-center justify-center w-full"
      >
        <Pill size={18} className="text-household mr-1" />
        <span>Household</span>
      </Button>
    </div>
  );
};

export default CategoryFilterComponent;
