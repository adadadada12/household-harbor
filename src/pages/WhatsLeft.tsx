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
    <div className="min-h-screen bg-primary pb-28 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              className="pl-10 py-6 bg-white dark:bg-gray-800 rounded-xl"
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
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">{t("search.noResults")}</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                {t("search.clearSearch")}
              </Button>
            </div>
          ) : (
            <EmptyState onAddItem={() => setShowAddModal(true)} />
          )
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6">
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
        className="h-12 w-12 rounded-full fixed bottom-24 right-6 shadow-lg z-10 flex items-center justify-center"
      >
        <Plus size={20} />
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
