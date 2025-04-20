import React, { useState } from 'react';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import { DEFAULT_REGION } from '@/lib/api';

// Common regions for movie data
const REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'IN', name: 'India' },
];

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ 
  selectedRegion = DEFAULT_REGION, 
  onRegionChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleRegionSelect = (regionCode: string) => {
    onRegionChange(regionCode);
    setIsOpen(false);
  };
  
  // Find the selected region name
  const selectedRegionName = REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion;
  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-4 py-2 border border-gray-300 dark:border-dark-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiGlobe className="mr-2" />
        <span className="mr-1">{selectedRegionName}</span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-dark-700 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {REGIONS.map((region) => (
              <button
                key={region.code}
                onClick={() => handleRegionSelect(region.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedRegion === region.code 
                    ? 'bg-gray-100 dark:bg-dark-600 text-primary-600' 
                    : 'hover:bg-gray-50 dark:hover:bg-dark-600'
                }`}
                role="menuitem"
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;