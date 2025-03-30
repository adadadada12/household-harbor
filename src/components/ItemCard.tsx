
import React from 'react';
import { Item } from '@/types';
import { calculateDaysUntilExpiry, getExpirySeverity, getExpiryText } from '@/utils/itemUtils';
import { Apple, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const daysUntilExpiry = calculateDaysUntilExpiry(item.expireDate);
  const severity = getExpirySeverity(daysUntilExpiry);
  const expiryText = getExpiryText(daysUntilExpiry);

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all expire-border-${severity} h-full`}
      onClick={onClick}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg truncate pr-2">{item.name}</h3>
          {item.category === 'food' ? (
            <Apple size={20} className="text-food flex-shrink-0" />
          ) : (
            <Pill size={20} className="text-household flex-shrink-0" />
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Qty: {item.quantity}</span>
          <span className={`expire-text-${severity} text-sm`}>{expiryText}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
