import React, { useState, useEffect } from 'react';
import FilterEditor from './FilterEditor';
import { FilterItem } from './interfaces';

const FileLoader: React.FC = () => {
  const [filters, setFilters] = useState<FilterItem[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        const parsedFilters = parseFilterFile(fileContent);
        setFilters(parsedFilters);
      };
      reader.readAsText(file);
    }
  };

  const parseFilterFile = (content: string): FilterItem[] => {
    const startMarker = '####### EDITOR SECTION #######';
    const endMarker = '####### EDITOR SECTION END #######';
    const editorSection = content.split(startMarker)[1]?.split(endMarker)[0]?.trim();

    if (!editorSection) return [];

    const filterSections = editorSection.split('\n\n'); // Separate by blank lines between filters
    return filterSections.map((section) => {
      const lines = section.split('\n');
      const filterData: any = {};

      lines.forEach((line) => {
        const [key, value] = line.split(' ');
        if (key && value) {
          filterData[key] = value;
        }
      });

      return filterData;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <input type="file" onChange={handleFileUpload} className="mb-4" />
      {filters.length > 0 && <FilterEditor filters={filters} onChange={setFilters} />}
    </div>
  );
};

export default FileLoader;
