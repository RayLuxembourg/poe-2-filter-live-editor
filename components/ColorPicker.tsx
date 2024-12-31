import React, { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const [rgba, setRgba] = useState<string[]>(value.split(' '));

  const handleColorChange = (index: number, newValue: string) => {
    const updatedRgba = [...rgba];
    updatedRgba[index] = newValue;
    setRgba(updatedRgba);
    onChange(updatedRgba.join(' '));
  };

  const handleHexChange = (hex: string) => {
    // Convert HEX to RGBA
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const updatedRgba = [r.toString(), g.toString(), b.toString(), rgba[3]];
    setRgba(updatedRgba);
    onChange(updatedRgba.join(' '));
  };

  const rgbaToHex = () => {
    const r = parseInt(rgba[0] || '0', 10).toString(16).padStart(2, '0');
    const g = parseInt(rgba[1] || '0', 10).toString(16).padStart(2, '0');
    const b = parseInt(rgba[2] || '0', 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  return (
    <div className='flex flex-row items-center space-x-4'>
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        {/* HEX Color Picker */}
        <input
          type="color"
          value={rgbaToHex()}
          onChange={(e) => handleHexChange(e.target.value)}
          className="w-10 h-10 border-none cursor-pointer bg-transparent"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
