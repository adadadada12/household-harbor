
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Item, Category } from '@/types';
import { Apple, ShoppingBag, Calendar, Minus, Plus, Trash2, X } from 'lucide-react';
import { calculateExpireDateFromDays, validateDateString } from '@/utils/itemUtils';
import { format, isValid } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Slider } from "@/components/ui/slider";
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
    } else {
      setName('');
      setCategory('food');
      setQuantity(1);
      setDaysUntilExpiry(6);
      const calculatedDate = calculateExpireDateFromDays(6);
      setExpireDate(calculatedDate);
      setPurchaseDate('');
    }
    setErrors({});
  }, [item, isOpen]);

  const handleDaysChange = (days: number) => {
    setDaysUntilExpiry(days);
    setExpireDate(calculateExpireDateFromDays(days));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader className="relative">
            <DialogTitle className="text-xl font-bold text-center">
              {item ? t('item.edit') : t('item.add')}
            </DialogTitle>
            <X 
              className="absolute right-0 top-0 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100" 
              onClick={onClose}
            />
          </DialogHeader>
        </div>
        
        <div className="px-6 py-4">
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                {t('item.name')} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className={`text-base py-6 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Category and Quantity */}
            <div className="flex gap-4">
              {/* Category Field */}
              <div className="space-y-2 flex-1">
                <Label className="text-base font-medium">{t('item.category')}</Label>
                <div className="flex gap-2">
                  <div 
                    className={`flex-1 flex items-center justify-center p-4 rounded-lg ${category === 'food' ? 'bg-orange-400 text-white' : 'bg-gray-100 dark:bg-gray-800'} cursor-pointer transition-colors`}
                    onClick={() => setCategory('food')}
                  >
                    <Apple size={24} />
                  </div>
                  <div 
                    className={`flex-1 flex items-center justify-center p-4 rounded-lg ${category === 'household' ? 'bg-orange-400 text-white' : 'bg-gray-100 dark:bg-gray-800'} cursor-pointer transition-colors`}
                    onClick={() => setCategory('household')}
                  >
                    <ShoppingBag size={24} />
                  </div>
                </div>
              </div>

              {/* Quantity Field */}
              <div className="space-y-2 flex-1">
                <Label className="text-base font-medium">
                  {t('item.quantity')} <span className="text-red-500">*</span>
                </Label>
                <div className={`flex items-center border rounded-lg overflow-hidden ${errors.quantity ? "border-red-500" : "border-input"}`}>
                  <button 
                    type="button"
                    className="flex-none p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 text-center text-lg">
                    {quantity}
                  </div>
                  <button 
                    type="button"
                    className="flex-none p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expireDate" className="text-base font-medium">
                {t('item.expiryDate')} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="expireDate"
                  type="date" 
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  className={`text-base py-6 pl-3 pr-10 ${errors.expireDate ? "border-red-500" : ""}`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              </div>
              {errors.expireDate && <p className="text-xs text-red-500">{errors.expireDate}</p>}
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className="text-base font-medium">
                {t('item.purchaseDate')}
              </Label>
              <div className="relative">
                <Input 
                  id="purchaseDate"
                  type="date" 
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className={`text-base py-6 pl-3 pr-10 ${errors.purchaseDate ? "border-red-500" : ""}`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              </div>
              {errors.purchaseDate && <p className="text-xs text-red-500">{errors.purchaseDate}</p>}
            </div>

            {/* Days until expiry */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {t('item.daysUntilExpiry')}
              </Label>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => handleDaysChange(Math.max(0, daysUntilExpiry - 1))}
                >
                  <Minus size={18} />
                </button>
                <div className="flex-1 px-2">
                  <div className="text-center text-lg mb-2">{daysUntilExpiry}</div>
                </div>
                <button 
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => handleDaysChange(daysUntilExpiry + 1)}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:flex-row p-0 border-t">
          {item && onDelete ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="flex-1 m-2 py-6"
                >
                  {t('item.delete')}
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
          ) : (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 m-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 py-6"
            >
              {t('dialog.cancel')}
            </Button>
          )}
          
          <Button 
            onClick={handleSave}
            className="flex-1 m-2 bg-orange-400 hover:bg-orange-500 text-white py-6"
          >
            {t('dialog.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
