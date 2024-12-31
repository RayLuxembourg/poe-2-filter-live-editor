import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import dropdownData from './items.json'; // Adjust the path to your JSON file

interface FilterItem {
    Show: string;
    Rarity: string;
    BaseType: string[];
    ItemLevel: string;
    SetFontSize: string;
    SetTextColor: string;
    SetBorderColor: string;
    SetBackgroundColor: string;
    PlayAlertSound: string; // 1 to 9 0 - 300 (3 2500)
    PlayEffect: string;
    MinimapIcon: string;
    Quality: string;
}

interface FilterBlockProps {
    filter: FilterItem;
    onFilterChange: (updatedFilter: FilterItem) => void;
}

const FilterBlock: React.FC<FilterBlockProps> = ({ filter, onFilterChange }) => {
    const [localFilter, setLocalFilter] = useState<FilterItem>(filter);
    const [userInput, setUserInput] = useState<string>(''); // User's input text
    const [selectedOption, setSelectedOption] = useState<string | null>(null); // Selected dropdown option
    const [hideDropdown, setHideDropdown] = useState<boolean>(true);
    const dontShowFilters = (key: string) => key !== 'Show' && key !== 'Rarity' && key !== 'BaseType' && key !== 'SetTextColor' && key !== 'SetBorderColor' && key !== 'SetBackgroundColor' && key !== 'SetFontSize';
    const parseRGBA = (rgbaString: string) => {
        try {
            const parts = rgbaString.split(' ').map(Number);
            return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3] / 255})`;
        } catch (error) {
            return 'rgba(0, 0, 0, 0)';

        }
    };

    const handleChange = (field: keyof FilterItem, value: string | string[] | boolean) => {
        const updatedFilter = {
            ...localFilter,
            [field]: field === 'Show' ? (value === true ? 'Show' : 'Hide') : value,
        };
        setLocalFilter(updatedFilter);
        onFilterChange(updatedFilter);
    };

    const handleBaseTypeChange = (newBaseType: string[]) => {
        const updatedFilter = { ...localFilter, BaseType: newBaseType };
        setLocalFilter(updatedFilter);
        onFilterChange(updatedFilter);
    };
    const calculateFontSize = (textSize: number): number => {
        return (2 / 3) * textSize;
    };
    return (
        <div>
            {/* Visual Preview */}
            <div className="preview-window w-full p-4  flex items-center space-x-4 drop-preview">
                <div className='flex flex-col'>
                    {localFilter.SetTextColor && <ColorPicker
                        label="TX"
                        value={localFilter.SetTextColor}
                        onChange={(newValue) => handleChange('SetTextColor', newValue)}
                    />}
                    {localFilter.SetBorderColor &&
                        <ColorPicker
                            label="BD"
                            value={localFilter.SetBorderColor}
                            onChange={(newValue) => handleChange('SetBorderColor', newValue)}
                        />
                    }

                    {localFilter.SetBackgroundColor && <ColorPicker
                        label="BG"
                        value={localFilter.SetBackgroundColor}
                        onChange={(newValue) => handleChange('SetBackgroundColor', newValue)}
                    />}

                </div>
                <div className='flex flex-col  '>
                    <strong>{localFilter.SetFontSize}</strong>
                    <input
                        type="range"
                        min="18"
                        max="45"
                        value={localFilter.SetFontSize}
                        onChange={(e) => handleChange('SetFontSize', e.target.value)}
                        className="border rounded p-1"
                    />
                    <div
                        className="p-4 border rounded shadow-md  w-[70%]]"
                        style={{
                            backgroundColor: parseRGBA(localFilter.SetBackgroundColor),
                            borderColor: parseRGBA(localFilter.SetBorderColor),
                            borderWidth: '2px',
                            color: parseRGBA(localFilter.SetTextColor),
                            fontSize: `${calculateFontSize(Number(filter.SetFontSize))}px`,
                            minHeight: '50px',
                            textAlign: 'center',
                        }}
                    >
                        {localFilter.BaseType.length > 0 ? localFilter.BaseType[0] : 'Item Name'}
                    </div>
                </div>

            </div>
            {/* <h2 className="text-lg font-bold mb-2">Filter Block</h2> */}
            <div className="flex space-x-4 items-start">
                {/* Editable Filter Details */}
                <ul className="list-disc list-inside space-y-1 flex-1">
                    {/* Show Field as Dropdown */}
                    <li>
                        <strong>Show:</strong>{' '}
                        <select
                            value={Object.hasOwn(localFilter, 'Show') ? 'true' : 'false'}
                            onChange={(e) => handleChange('Show', e.target.value === 'true')}
                            className="border rounded p-1"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </li>
                    {/* Rarity Field as Dropdown */}
                    <li>
                        <strong>Rarity:</strong>{' '}
                        <select
                            value={localFilter.Rarity}
                            onChange={(e) => handleChange('Rarity', e.target.value)}
                            className="border rounded p-1"
                        >
                            <option value="Normal">Normal</option>
                            <option value="Magic">Magic</option>
                            <option value="Rare">Rare</option>
                            <option value="Unique">Unique</option>
                        </select>
                    </li>
                    {/* BaseType Field */}
                    <li>
                        <strong>BaseType:</strong>
                        <div className="flex flex-wrap gap-2 border rounded p-2">
                            {localFilter.BaseType && localFilter.BaseType.map((type, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
                                >
                                    <span>{type}</span>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => {
                                            const updatedBaseType = localFilter.BaseType.filter((_, i) => i !== idx);
                                            handleChange('BaseType', updatedBaseType);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 space-y-2 flex flex-row items-center">
                            {/* Add New BaseType */}
                            {/* User Input */}
                            <input
                                type="text"
                                placeholder="Type to search..."
                                className="border rounded p-2 w-full"
                                value={userInput}
                                onChange={(e) => {
                                    setUserInput(e.target.value)
                                    setHideDropdown(false)
                                }}
                            />

                      
                            {/* Add Button */}
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                                onClick={() => {
                                    if ((selectedOption) && !localFilter.BaseType.includes(selectedOption)) {
                                        handleBaseTypeChange([...localFilter.BaseType, selectedOption]);
                                        setUserInput(''); // Clear input
                                        setSelectedOption(null); // Clear selected option
                                    }else if(userInput && !localFilter.BaseType.includes(userInput)){
                                        handleBaseTypeChange([...localFilter.BaseType, userInput]);
                                        setUserInput(''); // Clear input
                                        setSelectedOption(null); // Clear selected option
                                    }
                                }}
                                disabled={!selectedOption && !userInput}
                            >
                                Add
                            </button>


                            {/* Render BaseType as Chips */}

                        </div>
                              {/* Dropdown Matching User Input */}
                              {
                                !hideDropdown &&
                                userInput && (
                                    <div className="border rounded shadow-md max-h-48 overflow-y-auto">
                                        {dropdownData.options
                                            .filter((option) =>
                                                option.toLowerCase().includes(userInput.toLowerCase())
                                            )
                                            .map((option, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 hover:bg-blue-100 cursor-pointer"
                                                    onClick={() => {
                                                        setUserInput(option);
                                                        setSelectedOption(option)
                                                        setHideDropdown(true);
                                                    }}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                    </div>
                                )}

                    </li>

                    {/* Color Fields */}


                    {/* Other Fields */}
                    {Object.entries(localFilter)
                        .filter(([key]) => dontShowFilters(key))
                        .map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong>{' '}
                                {Array.isArray(value) ? (
                                    <input
                                        type="text"
                                        value={value.join(', ')}
                                        onChange={(e) =>
                                            handleChange(key as keyof FilterItem, e.target.value.split(', '))
                                        }
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={value as string}
                                        onChange={(e) => handleChange(key as keyof FilterItem, e.target.value)}
                                        className="border rounded p-1 w-full"
                                    />
                                )}
                            </li>
                        ))}
                </ul>


            </div>
        </div>
    );
};

export default FilterBlock;
