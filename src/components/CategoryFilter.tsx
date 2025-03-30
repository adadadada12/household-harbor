
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
    <div className="flex justify-center gap-4 my-4">
      <Button
        variant={selectedCategory === 'all' ? "secondary" : "outline"}
        size="sm"
        onClick={() => onChange('all')}
        className="flex items-center gap-1"
      >
        <LayoutGrid size={16} />
        <span className="hidden sm:inline">All</span>
      </Button>
      
      <Button
        variant={selectedCategory === 'food' ? "secondary" : "outline"}
        size="sm"
        onClick={() => onChange('food')}
        className="flex items-center gap-1"
      >
        <Apple size={16} className="text-food" />
        <span className="hidden sm:inline">Food</span>
      </Button>
      
      <Button
        variant={selectedCategory === 'household' ? "secondary" : "outline"}
        size="sm"
        onClick={() => onChange('household')}
        className="flex items-center gap-1"
      >
        <Pill size={16} className="text-household" />
        <span className="hidden sm:inline">Household</span>
      </Button>
    </div>
  );
};

export default CategoryFilterComponent;
