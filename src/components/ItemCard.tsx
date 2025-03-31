
import React from 'react';
import { Item } from '@/types';
import { calculateDaysUntilExpiry, getExpirySeverity } from '@/utils/itemUtils';
import { Apple, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { t } = useLanguage();
  
  const daysUntilExpiry = calculateDaysUntilExpiry(item.expireDate);
  const severity = getExpirySeverity(daysUntilExpiry);
  
  const handleClick = () => {
    // Dispatch custom event to open item detail in modal
    const event = new CustomEvent('openItemDetail', { detail: item });
    document.dispatchEvent(event);
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all border-2 expire-border-${severity} h-full`}
      onClick={handleClick}
    >
      <CardContent className="p-3 flex flex-col h-full">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-medium text-sm truncate pr-1 flex-grow">{item.name}</h3>
          {item.category === 'food' ? (
            <Apple size={16} className="text-food flex-shrink-0" />
          ) : (
            <ShoppingBag size={16} className="text-household flex-shrink-0" />
          )}
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <span className={`expire-text-${severity} text-xs`}>
            {daysUntilExpiry < 0 ? 
              t("item.expiredDaysAgo").replace('{days}', Math.abs(daysUntilExpiry).toString()) :
              daysUntilExpiry === 0 ? 
              t("item.expiresToday") :
              daysUntilExpiry === 1 ?
              t("item.expiresTomorrow") :
              t("item.expiresXDays").replace('{days}', daysUntilExpiry.toString())
            }
          </span>
          <span className="text-xs font-medium">{item.quantity}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
