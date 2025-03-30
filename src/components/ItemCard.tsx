
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
      className={`cursor-pointer hover:shadow-md transition-all expire-border-${severity}`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg truncate">{item.name}</h3>
          {item.category === 'food' ? (
            <Apple size={20} className="text-food" />
          ) : (
            <Pill size={20} className="text-household" />
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span>Qty: {item.quantity}</span>
          <span className={`expire-text-${severity}`}>{expiryText}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
