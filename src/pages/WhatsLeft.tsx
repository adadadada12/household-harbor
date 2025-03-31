
import React, { useState, useEffect } from 'react';
import { useItems } from '@/context/ItemContext';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import Navbar from '@/components/Navbar';
import CategoryFilterComponent from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';
import { Item } from '@/types';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const WhatsLeft: React.FC = () => {
  const { 
    addItem, 
    updateItem, 
    deleteItem, 
    categoryFilter, 
    setCategoryFilter,
    getFilteredAndSortedItems
  } = useItems();
  
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const handleOpenAddModal = () => {
      setSelectedItem(undefined);
      setShowAddModal(true);
    };
    
    const handleOpenItemDetail = (event: CustomEvent) => {
      const item = event.detail;
      setSelectedItem(item);
      setShowAddModal(true);
    };
    
    document.addEventListener('openAddItemModal', handleOpenAddModal);
    document.addEventListener('openItemDetail', handleOpenItemDetail as EventListener);
    
    return () => {
      document.removeEventListener('openAddItemModal', handleOpenAddModal);
      document.removeEventListener('openItemDetail', handleOpenItemDetail as EventListener);
    };
  }, []);
  
  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setShowAddModal(true);
  };
  
  const handleDeleteItem = (id: string) => {
    deleteItem(id);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedItem(undefined);
  };
  
  const handleSaveItem = (itemData: Omit<Item, 'id' | 'createdAt'>) => {
    if (selectedItem) {
      updateItem(selectedItem.id, itemData);
    } else {
      addItem(itemData);
    }
  };
  
  const items = getFilteredAndSortedItems();
  
  const filteredItems = searchQuery.trim() ? 
    items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    items;
  
  return (
    <div className="min-h-screen bg-primary pb-20 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-3 py-4">
        {/* Search and Filter Section */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              className="pl-9 py-5 h-10 bg-white dark:bg-gray-800 rounded-lg text-sm"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <CategoryFilterComponent 
            selectedCategory={categoryFilter} 
            onChange={setCategoryFilter} 
          />
        </div>
        
        {filteredItems.length === 0 ? (
          searchQuery ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-base text-muted-foreground mb-3">{t("search.noResults")}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                {t("search.clearSearch")}
              </Button>
            </div>
          ) : (
            <EmptyState onAddItem={() => setShowAddModal(true)} />
          )
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {filteredItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onEdit={() => handleEditItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </main>
      
      <Button
        onClick={() => setShowAddModal(true)}
        variant="secondary"
        size="icon"
        className="h-10 w-10 rounded-full fixed bottom-20 right-4 shadow-lg z-10 flex items-center justify-center"
      >
        <Plus size={18} />
      </Button>
      
      <ItemModal 
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        onDelete={selectedItem ? deleteItem : undefined}
        item={selectedItem}
      />
    </div>
  );
};

export default WhatsLeft;
