
import React, { useState } from 'react';
import { Item } from '@/types';
import { calculateDaysUntilExpiry, getExpirySeverity } from '@/utils/itemUtils';
import { Apple, Edit, Pill, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [showOptions, setShowOptions] = useState(false);
  
  const daysUntilExpiry = calculateDaysUntilExpiry(item.expireDate);
  const severity = getExpirySeverity(daysUntilExpiry);
  
  // Create expiry text based on days left
  const getExpiryText = () => {
    if (daysUntilExpiry < 0) {
      return t("item.expiredDaysAgo").replace('{days}', Math.abs(daysUntilExpiry).toString());
    } else if (daysUntilExpiry === 0) {
      return t("item.expiresToday");
    } else if (daysUntilExpiry === 1) {
      return t("item.expiresTomorrow");
    } else {
      return t("item.expiresXDays").replace('{days}', daysUntilExpiry.toString());
    }
  };

  const handleClose = () => {
    setShowOptions(false);
  };

  return (
    <>
      <Card 
        className={`cursor-pointer hover:shadow-md transition-all border-2 expire-border-${severity} h-full`}
        onClick={() => setShowOptions(true)}
      >
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-lg truncate pr-2 flex-grow">{item.name}</h3>
            {item.category === 'food' ? (
              <Apple size={20} className="text-food flex-shrink-0" />
            ) : (
              <Pill size={20} className="text-household flex-shrink-0" />
            )}
          </div>
          
          <div className="mt-auto flex justify-between items-end">
            <span className={`expire-text-${severity} text-sm font-medium`}>{getExpiryText()}</span>
            <span className="text-sm">{item.quantity}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className={`expire-text-${severity} mb-4`}>{getExpiryText()}</p>
            <p className="mb-1">
              <span className="font-medium">{t("item.category")}:</span> {item.category === 'food' ? t("item.food") : t("item.household")}
            </p>
            <p>
              <span className="font-medium">{t("item.quantity")}:</span> {item.quantity}
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              {t("dialog.cancel")}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { handleClose(); onEdit(); }}
              className="w-full flex items-center justify-center gap-2 sm:w-auto"
            >
              <Edit size={16} /> {t("item.edit")}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => { handleClose(); onDelete(); }}
              className="w-full flex items-center justify-center gap-2 sm:w-auto"
            >
              <Trash2 size={16} /> {t("item.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemCard;
