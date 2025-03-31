
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Item, Category } from '@/types';
import { Apple, ShoppingBag, Calendar, Minus, Plus, Trash2, X, Edit } from 'lucide-react';
import { calculateExpireDateFromDays, validateDateString } from '@/utils/itemUtils';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
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

      setMode('view');
    } else {
      setName('');
      setCategory('food');
      setQuantity(1);
      setDaysUntilExpiry(6);
      const calculatedDate = calculateExpireDateFromDays(6);
      setExpireDate(calculatedDate);
      setPurchaseDate('');
      setMode('edit');
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

  const handleEdit = () => {
    setMode('edit');
  };

  const renderViewMode = () => {
    // Show purchase date if available, otherwise show created date
    const dateToShow = purchaseDate ? 
      format(new Date(purchaseDate), 'MMM d, yyyy') + ` (${t('item.purchased')})` : 
      item?.createdAt ? 
      format(new Date(item.createdAt), 'MMM d, yyyy') + ` (${t('item.added')})` : 
      '';
    
    return (
      <>
        <div className="px-4 py-3">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-muted-foreground text-xs">{dateToShow}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t('item.category')}:</span>
                {category === 'food' ? (
                  <Apple size={18} className="text-food" />
                ) : (
                  <ShoppingBag size={18} className="text-household" />
                )}
              </div>
              
              <div>
                <span className="text-sm font-medium">{t('item.quantity')}:</span> {quantity}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">{t('item.expiryDate')}:</span> {format(new Date(expireDate), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
        
        <DialogFooter className="border-t p-3 gap-2 flex sm:flex-row">
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-1 h-8 text-xs"
                >
                  <Trash2 size={14} /> {t('item.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('dialog.deleteConfirm')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('dialog.deleteDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 flex flex-row">
                  <AlertDialogCancel className="h-8 text-xs">{t('dialog.cancel')}</AlertDialogCancel>
                  <AlertDialogAction 
                    className="h-8 text-xs"
                    onClick={() => {
                      onDelete(item!.id);
                      onClose();
                    }}
                  >
                    {t('dialog.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 h-8 text-xs"
          >
            {t('dialog.cancel')}
          </Button>
          
          <Button 
            onClick={handleEdit}
            size="sm"
            className="flex-1 bg-secondary hover:bg-secondary/90 text-white flex items-center gap-1 h-8 text-xs"
          >
            <Edit size={14} /> {t('item.edit')}
          </Button>
        </DialogFooter>
      </>
    );
  };

  const renderEditMode = () => {
    return (
      <>
        <div className="px-4 py-3">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-medium">
                {t('item.name')} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className={`${errors.name ? "border-red-500" : ""} h-9 text-sm`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Category and Quantity */}
            <div className="flex gap-3">
              {/* Category Field */}
              <div className="space-y-1 flex-1">
                <Label className="text-xs font-medium">{t('item.category')}</Label>
                <div className="flex gap-2">
                  <div 
                    className={`flex-1 flex items-center justify-center p-2 rounded-lg ${category === 'food' ? 'bg-secondary text-white' : 'bg-gray-100 dark:bg-gray-800'} cursor-pointer transition-colors`}
                    onClick={() => setCategory('food')}
                  >
                    <Apple size={18} />
                  </div>
                  <div 
                    className={`flex-1 flex items-center justify-center p-2 rounded-lg ${category === 'household' ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-800'} cursor-pointer transition-colors`}
                    onClick={() => setCategory('household')}
                  >
                    <ShoppingBag size={18} />
                  </div>
                </div>
              </div>

              {/* Quantity Field */}
              <div className="space-y-1 flex-1">
                <Label className="text-xs font-medium">
                  {t('item.quantity')} <span className="text-red-500">*</span>
                </Label>
                <div className={`flex items-center border rounded-lg overflow-hidden ${errors.quantity ? "border-red-500" : "border-input"}`}>
                  <button 
                    type="button"
                    className="flex-none p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <div className="flex-1 text-center text-sm">
                    {quantity}
                  </div>
                  <button 
                    type="button"
                    className="flex-none p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-1">
              <Label htmlFor="expireDate" className="text-xs font-medium">
                {t('item.expiryDate')} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="expireDate"
                  type="date" 
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  className={`pl-2 pr-8 h-9 text-sm ${errors.expireDate ? "border-red-500" : ""}`}
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={14} />
              </div>
              {errors.expireDate && <p className="text-xs text-red-500">{errors.expireDate}</p>}
            </div>

            {/* Purchase Date */}
            <div className="space-y-1">
              <Label htmlFor="purchaseDate" className="text-xs font-medium">
                {t('item.purchaseDate')}
              </Label>
              <div className="relative">
                <Input 
                  id="purchaseDate"
                  type="date" 
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className={`pl-2 pr-8 h-9 text-sm ${errors.purchaseDate ? "border-red-500" : ""}`}
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={14} />
              </div>
              {errors.purchaseDate && <p className="text-xs text-red-500">{errors.purchaseDate}</p>}
            </div>

            {/* Days until expiry */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                {t('item.daysUntilExpiry')}
              </Label>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => handleDaysChange(Math.max(0, daysUntilExpiry - 1))}
                >
                  <Minus size={14} />
                </button>
                <div className="flex-1 px-1">
                  <div className="text-center text-sm mb-0">{daysUntilExpiry}</div>
                </div>
                <button 
                  type="button"
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => handleDaysChange(daysUntilExpiry + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="border-t p-3 gap-2 flex sm:flex-row">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 h-8 text-xs"
          >
            {t('dialog.cancel')}
          </Button>
          
          <Button 
            onClick={handleSave}
            size="sm"
            className="flex-1 bg-secondary hover:bg-secondary/90 text-white h-8 text-xs"
          >
            {t('dialog.save')}
          </Button>
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden w-[90%] max-w-[350px]">
        <div className="p-3 pb-0">
          <DialogHeader className="relative">
            <DialogTitle className="text-base font-bold text-center">
              {!item ? t('item.add') : mode === 'view' ? t('item.details') : t('item.edit')}
            </DialogTitle>
            <X 
              className="absolute right-0 top-0 w-4 h-4 cursor-pointer opacity-70 hover:opacity-100" 
              onClick={onClose}
            />
          </DialogHeader>
        </div>
        
        {mode === 'view' && item ? renderViewMode() : renderEditMode()}
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
