
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Item, SortOption, FilterOption, CategoryFilter } from '@/types';
import { toast } from '@/hooks/use-toast';
import { generateId } from '@/utils/itemUtils';

type ItemContextType = {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filterOption: FilterOption;
  setFilterOption: (option: FilterOption) => void;
  categoryFilter: CategoryFilter;
  setCategoryFilter: (category: CategoryFilter) => void;
  getFilteredAndSortedItems: () => Item[];
  expiringItems: Item[];
  getExpiringItemsCount: () => number;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'household-harbor-items';

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [expiringItems, setExpiringItems] = useState<Item[]>([]);

  // Load items from localStorage on initial render
  useEffect(() => {
    const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Failed to parse saved items:', error);
        setItems([]);
      }
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    
    // Update expiring items
    const expiring = items.filter(item => {
      const expireDate = new Date(item.expireDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const diffTime = expireDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= 4 && diffDays >= 0;
    });
    
    setExpiringItems(expiring);
  }, [items]);

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...itemData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    setItems(prev => [...prev, newItem]);
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to your items.`,
    });
  };

  const updateItem = (id: string, itemData: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...itemData } : item
    ));
    toast({
      title: "Item Updated",
      description: `The item has been updated successfully.`,
    });
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (itemToDelete) {
      toast({
        title: "Item Deleted",
        description: `${itemToDelete.name} has been deleted.`,
      });
    }
  };

  const getFilteredAndSortedItems = (): Item[] => {
    // First apply category filter
    let filteredItems = categoryFilter === 'all' 
      ? items 
      : items.filter(item => item.category === categoryFilter);
    
    // Then apply expiry filter
    if (filterOption === 'expired') {
      filteredItems = filteredItems.filter(item => {
        const expireDate = new Date(item.expireDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return expireDate < today;
      });
    } else if (filterOption === 'expiring') {
      filteredItems = filteredItems.filter(item => {
        const expireDate = new Date(item.expireDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffTime = expireDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays <= 4 && diffDays >= 0;
      });
    }
    
    // Finally, sort the items
    return [...filteredItems].sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'expireDate') {
        return new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime();
      } else if (sortOption === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  };

  const getExpiringItemsCount = (): number => {
    return expiringItems.length;
  };

  const value = {
    items,
    addItem,
    updateItem,
    deleteItem,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    categoryFilter,
    setCategoryFilter,
    getFilteredAndSortedItems,
    expiringItems,
    getExpiringItemsCount,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export const useItems = (): ItemContextType => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};
