import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Building2 } from 'lucide-react';
import { categories } from '../data/categories';

interface CategorySelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onDropdownStateChange?: (isOpen: boolean) => void;
  isLoading: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  onDropdownStateChange,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Notify parent of dropdown state changes
  React.useEffect(() => {
    onDropdownStateChange?.(isOpen);
  }, [isOpen, onDropdownStateChange]);

  const selectedCategoryData = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)
    : null;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-white/10 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/5 p-4 rounded-lg border border-white/10">
      <label className="block text-sm font-medium text-white/80 mb-2">
        Business Category
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            {selectedCategoryData ? (
              <>
                <span className="text-lg">{selectedCategoryData.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{selectedCategoryData.name}</div>
                  <div className="text-xs text-white/60">{selectedCategoryData.description}</div>
                </div>
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5 text-white/60" />
                <span className="text-white/60">Select a business category</span>
              </>
            )}
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-[9999] w-full mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl max-h-80 overflow-hidden"
            >
              {/* Search Bar */}
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Categories List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCategories.length === 0 ? (
                  <div className="p-4 text-center text-white/60 text-sm">
                    No categories found
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => {
                        onCategorySelect(category.id);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="w-full p-4 text-left hover:bg-white/10 transition-colors duration-200 border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-white">{category.name}</div>
                          <div className="text-xs text-white/60 mt-1">{category.description}</div>
                        </div>
                        {selectedCategory === category.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CategorySelector;