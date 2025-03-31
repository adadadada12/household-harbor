
import React from 'react';
import { Item } from '@/types';
import { calculateDaysUntilExpiry, getExpiryText, getExpirySeverity } from '@/utils/itemUtils';
import { Apple, ShoppingBag } from 'lucide-react';

interface NotificationPopupProps {
  items: Item[];
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ items }) => {
  const handleItemClick = (item: Item) => {
    // Dispatch custom event to open item detail in modal
    const event = new CustomEvent('openItemDetail', { detail: item });
    document.dispatchEvent(event);
  };
  
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72 animate-slide-in">
        <h3 className="font-semibold mb-2">No items expiring soon</h3>
        <p className="text-sm text-muted-foreground">
          All your items are good for now!
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72 max-h-96 overflow-y-auto animate-slide-in">
      <h3 className="font-semibold mb-3">Items Expiring Soon</h3>
      
      <div className="space-y-2">
        {items.map(item => {
          const daysUntilExpiry = calculateDaysUntilExpiry(item.expireDate);
          const severity = getExpirySeverity(daysUntilExpiry);
          const expiryText = getExpiryText(daysUntilExpiry);
          
          return (
            <div 
              key={item.id} 
              className={`p-2 rounded-md border expire-border-${severity} bg-opacity-10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.name}</span>
                {item.category === 'food' ? (
                  <Apple size={16} className="text-food" />
                ) : (
                  <ShoppingBag size={16} className="text-household" />
                )}
              </div>
              <div className={`text-sm expire-text-${severity} mt-1`}>
                {expiryText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPopup;
