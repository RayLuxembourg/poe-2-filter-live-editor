"use client";
import React, { useEffect, useState } from 'react';
import FilterBlock from './FilterBlock';

interface FilterItem {
  Show: string;
  Rarity: string;
  BaseType: string[];
  ItemLevel: string;
  SetFontSize: string;
  SetTextColor: string;
  SetBorderColor: string;
  SetBackgroundColor: string;
  PlayAlertSound: string;
  PlayEffect: string;
  MinimapIcon: string;
  Quality: string;
}

const FilterList: React.FC = () => {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/filter');
        const data = await response.json();
        if (data.success) {
          setFilters(data.filters);
        } else {
          setError('Failed to load filters.');
        }
      } catch (err) {
        setError('An error occurred while fetching filters.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleFilterChange = (index: number, updatedFilter: FilterItem) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  };

  const saveFilters = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      if (data.success) {
        alert('Filters saved successfully!');
      } else {
        throw new Error(data.error || 'Failed to save filters.');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const duplicateFilter = (index: number) => {
    const duplicatedFilter = { ...filters[index] };
    setFilters([...filters.slice(0, index + 1), duplicatedFilter, ...filters.slice(index + 1)]);
  };

  const addNewFilter = () => {
    const newFilter: FilterItem = {
      Show: 'Show',
      Rarity: 'Normal',
      BaseType: [],
      ItemLevel: '>= 1',
      SetFontSize: '32',
      SetTextColor: '255 255 255 255',
      SetBorderColor: '255 255 255 255',
      SetBackgroundColor: '0 0 0 255',
      PlayAlertSound: '0 300',
      PlayEffect: 'None',
      MinimapIcon: '0 None None',
      Quality: ">= 0"

    };
    setFilters([...filters, newFilter]);
  };
  const removeFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <header className='sticky top-0 z-10  shadow-md p-4 flex space-x-4'>
        {/* Floating Save Button */}
        <button
          onClick={saveFilters}
          disabled={saving}
          className=" bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Filters'}
        </button>
        {/* Add New Block Button */}
        <button
          className=" bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
          onClick={addNewFilter}
        >
          Add New Block
        </button>



      </header>
      <div className="relative">
        {/* Filter List */}
        <div className="container mx-auto space-y-4 w-[600px]">
          {filters.map((filter, index) => (
            <div className='flex flex-col space-y-2 border rounded my-4 p-2' key={index}>
              <div className="flex space-x-4">
                {/* Duplicate Button */}
                <button
                  className=" bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => duplicateFilter(index)}
                >
                  Duplicate
                </button>
                <button
                  className=" bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => removeFilter(index)}
                >
                  Remove
                </button>

              </div>
              <FilterBlock
                key={index}
                filter={filter}
                onFilterChange={(updatedFilter) => handleFilterChange(index, updatedFilter)}
              />
            </div>
          ))}
        </div>


      </div >
    </>
  );
};

export default FilterList;
