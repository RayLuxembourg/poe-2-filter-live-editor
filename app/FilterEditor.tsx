"use client";
import React, { useState } from 'react';
import { FilterItem } from './interfaces';

interface FilterEditorProps {
  filters: FilterItem[];
  onChange: (filters: FilterItem[]) => void;
}

const FilterEditor: React.FC<FilterEditorProps> = ({ filters, onChange }) => {
    const handleChange = (index: number, field: keyof FilterItem, value: string) => {
      const updatedFilters = filters.map((filter, i) =>
        i === index ? { ...filter, [field]: value } : filter
      );
      onChange(updatedFilters);
    };
  
    return (
      <div className="space-y-4">
        {filters.map((filter, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="font-bold">Filter {index + 1}</h2>
            {Object.entries(filter).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center space-x-4 mb-2">
                <label className="w-1/4">{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(index, key as keyof FilterItem, e.target.value)}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default FilterEditor;
  