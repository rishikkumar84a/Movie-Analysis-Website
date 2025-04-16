"use client";

import { useState } from 'react';
import { SUPPORTED_REGIONS, DEFAULT_REGION } from '@/lib/api';
import { FiGlobe, FiChevronDown, FiCheck } from 'react-icons/fi';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  className?: string;
  compact?: boolean;
}

export default function RegionSelector({
  selectedRegion = DEFAULT_REGION,
  onRegionChange,
  className = '',
  compact = false
}: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedRegionName = SUPPORTED_REGIONS.find(r => r.code === selectedRegion)?.name || 'Unknown';
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleRegionSelect = (regionCode: string) => {
    onRegionChange(regionCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center ${compact ? 'px-2 py-1 text-sm' : 'px-3 py-2'} border border-gray-300 dark:border-dark-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiGlobe className="mr-2" />
        <span className="mr-1">{compact ? selectedRegion : selectedRegionName}</span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-dark-700 ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {SUPPORTED_REGIONS.map((region) => (
              <button
                key={region.code}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${selectedRegion === region.code ? 'bg-gray-100 dark:bg-dark-600 text-primary-600' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600'}`}
                role="menuitem"
                onClick={() => handleRegionSelect(region.code)}
              >
                <span>{region.name} ({region.code})</span>
                {selectedRegion === region.code && <FiCheck className="text-primary-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}