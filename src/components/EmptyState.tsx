
import React from 'react';
import { Button } from "@/components/ui/button";
import { PackageOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddItem: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddItem }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <PackageOpen size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No items yet</h3>
      <p className="text-muted-foreground mb-6 max-w-xs">
        Start tracking your items by adding your first grocery or household item.
      </p>
      <Button onClick={onAddItem} className="flex items-center gap-2">
        <Plus size={18} /> Add Your First Item
      </Button>
    </div>
  );
};

export default EmptyState;
