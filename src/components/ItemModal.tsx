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
      setExpiryTab('date');
    } else {
      setName('');
      setCategory('food');
      setQuantity(1);
      const today = new Date();
      setExpireDate(format(today, 'yyyy-MM-dd'));
      setPurchaseDate('');
      setDaysUntilExpiry(6);
      setExpiryTab('days');
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
      newErrors.name = 'Name is required';
    }
    
    if (quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
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
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <RadioGroup 
              value={category} 
              onValueChange={value => setCategory(value as Category)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="food" id="food" />
                <Label htmlFor="food" className="flex items-center gap-1 cursor-pointer">
                  <Apple size={18} className="text-food" /> Food
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="household" id="household" />
                <Label htmlFor="household" className="flex items-center gap-1 cursor-pointer">
                  <Pill size={18} className="text-household" /> Household
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
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
            <Label>Expiry Information</Label>
            <Tabs value={expiryTab} onValueChange={handleExpiryTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="days">Days Until Expiry</TabsTrigger>
                <TabsTrigger value="date">Specific Date</TabsTrigger>
              </TabsList>
              
              <TabsContent value="days" className="pt-2">
                <Input 
                  type="number" 
                  min="0" 
                  value={daysUntilExpiry}
                  onChange={(e) => handleDaysChange(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Will expire on {validateDateString(expireDate) ? safelyFormatDate(expireDate) : 'calculating...'}
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
            <Label htmlFor="purchaseDate">Purchase Date (Optional)</Label>
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
                  <Trash2 size={16} /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    onDelete(item.id);
                    onClose();
                  }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
