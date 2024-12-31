// components/FilterPreview.tsx
import React from 'react';

interface Item {
  id: number;
  name: string;
  rarity: 'Normal' | 'Magic' | 'Rare' | 'Unique';
  baseType: string;
  itemLevel: number;
}

interface FilterPreviewProps {
  items: Item[];
  filter: string;
}

const FilterPreview: React.FC<FilterPreviewProps> = ({ items, filter }) => {
  // Parse the filter string and apply styles accordingly
  // For simplicity, this example applies a basic style based on item rarity
  const getItemStyle = (item: Item) => {
    switch (item.rarity) {
      case 'Unique':
        return 'bg-yellow-500 text-black';
      case 'Rare':
        return 'bg-red-500 text-white';
      case 'Magic':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`p-4 rounded ${getItemStyle(item)}`}
          style={{ fontSize: '16px' }} // Adjust font size as needed
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default FilterPreview;
