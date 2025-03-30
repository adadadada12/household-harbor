import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Item, Category } from '@/types';
import { Apple, Pill, Trash2 } from 'lucide-react';
import { calculateExpireDateFromDays, validateDateString } from '@/utils/itemUtils';
import { format, isValid } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<Item, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
  item?: Item;
}

const ItemModal: React.FC<ItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  item
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [quantity, setQuantity] = useState(1);
  const [expiryTab, setExpiryTab] = useState('days');
  const [expireDate, setExpireDate] = useState('');
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(6);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity);
      setExpireDate(item.expireDate);
      setPurchaseDate(item.purchaseDate || '');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(item.expireDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilExpiry(Math.max(0, diffDays));
      
      setExpiryTab('date');
    } else {
      setName('');
      setCategory('food');
      setQuantity(1);
      setDaysUntilExpiry(6);
      setExpiryTab('days');
      const calculatedDate = calculateExpireDateFromDays(6);
      setExpireDate(calculatedDate);
      setPurchaseDate('');
    }
    setErrors({});
  }, [item, isOpen]);

  const handleExpiryTabChange = (value: string) => {
    setExpiryTab(value);
    if (value === 'days') {
      setExpireDate(calculateExpireDateFromDays(daysUntilExpiry));
    }
  };

  const handleDaysChange = (days: number) => {
    setDaysUntilExpiry(days);
    setExpireDate(calculateExpireDateFromDays(days));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = t('item.name') + ' is required';
    }
    
    if (quantity < 1) {
      newErrors.quantity = t('item.quantity') + ' must be at least 1';
    }
    
    if (!validateDateString(expireDate)) {
      newErrors.expireDate = 'Valid expiry date is required';
    }
    
    if (purchaseDate && !validateDateString(purchaseDate)) {
      newErrors.purchaseDate = 'Purchase date must be a valid date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    onSave({
      name,
      category,
      quantity,
      expireDate,
      ...(purchaseDate ? { purchaseDate } : {})
    });
    
    onClose();
  };

  const safelyFormatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? t('item.edit') : t('item.add')}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('item.name')}</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('item.name')}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label>{t('item.category')}</Label>
            <RadioGroup 
              value={category} 
              onValueChange={value => setCategory(value as Category)}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center space-y-1 flex-1">
                <div className={`p-4 rounded-lg ${category === 'food' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'} cursor-pointer flex justify-center`}
                     onClick={() => setCategory('food')}>
                  <Apple size={24} className="text-food" />
                </div>
                <RadioGroupItem value="food" id="food" className="sr-only" />
                <Label htmlFor="food" className="text-sm cursor-pointer">{t('item.food')}</Label>
              </div>
              
              <div className="flex flex-col items-center space-y-1 flex-1">
                <div className={`p-4 rounded-lg ${category === 'household' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'} cursor-pointer flex justify-center`}
                     onClick={() => setCategory('household')}>
                  <Pill size={24} className="text-household" />
                </div>
                <RadioGroupItem value="household" id="household" className="sr-only" />
                <Label htmlFor="household" className="text-sm cursor-pointer">{t('item.household')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>{t('item.expiryInfo')}</Label>
            <Tabs value={expiryTab} onValueChange={handleExpiryTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="days">{t('item.daysUntilExpiry')}</TabsTrigger>
                <TabsTrigger value="date">{t('item.specificDate')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="days" className="pt-2">
                <Input 
                  type="number" 
                  min="0" 
                  value={daysUntilExpiry}
                  onChange={(e) => handleDaysChange(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('item.willExpireOn')} {validateDateString(expireDate) ? safelyFormatDate(expireDate) : 'calculating...'}
                </p>
              </TabsContent>
              
              <TabsContent value="date" className="pt-2">
                <Input 
                  type="date" 
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  className={errors.expireDate ? "border-red-500" : ""}
                />
                {errors.expireDate && <p className="text-xs text-red-500">{errors.expireDate}</p>}
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">{t('item.quantity')}</Label>
            <Input 
              id="quantity"
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="purchaseDate">{t('item.purchaseDate')}</Label>
            <Input 
              id="purchaseDate"
              type="date" 
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className={errors.purchaseDate ? "border-red-500" : ""}
            />
            {errors.purchaseDate && <p className="text-xs text-red-500">{errors.purchaseDate}</p>}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          {item && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-1">
                  <Trash2 size={16} /> {t('item.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('dialog.deleteConfirm')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('dialog.deleteDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    onDelete(item.id);
                    onClose();
                  }}>{t('dialog.delete')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>{t('dialog.cancel')}</Button>
            <Button onClick={handleSave}>{t('dialog.save')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
