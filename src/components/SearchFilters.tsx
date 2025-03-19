'use client';

import { Button } from '@/components/ui/button/button';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';

// 필터 타입 정의 - 원래 있던 구체적인 필터 타입으로 복원
export type FilterType = 'Price' | 'google_star' | 'google_review' | 'yelp_star' | 'yelp_review' | 'Distance' | 'Free consultation' | null;

// 필터 아이템 인터페이스
interface FilterItem {
  label: string;
  value: FilterType;
  icon?: React.ReactNode;
}

// 필터 상태 인터페이스
export interface FilterState {
  priceRange: [number, number];
  googleStars: number[];
  yelpStars: number[];
  villages: string[];
  facilities: string[];
  distance: number | null;
  treatmentCategories: string[];
  efficacies: string[];
}

// 필터 목록 - 원래 있던 구체적인 필터 목록으로 복원
const filters: FilterItem[] = [
  { label: 'Price', value: 'Price' },
  { label: 'Distance', value: 'Distance' },
  { label: 'Google Rating', value: 'google_star' },
  { label: 'Google Reviews', value: 'google_review' },
  { label: 'Yelp Rating', value: 'yelp_star' },
  { label: 'Yelp Reviews', value: 'yelp_review' },
  { label: 'Free consultation', value: 'Free consultation' },
];

// SearchFilters 컴포넌트 Props 타입
interface SearchFiltersProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onOpenFilterModal?: () => void;
}

export default function SearchFilters({ selectedFilter, onFilterChange, onOpenFilterModal }: SearchFiltersProps) {
  // 필터 선택 핸들러
  const handleFilterClick = (filter: FilterType) => {
    // 이미 선택된 필터를 다시 클릭하면 선택 해제
    if (selectedFilter === filter) {
      onFilterChange(null);
    } else {
      onFilterChange(filter);
    }
  };

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex space-x-2 min-w-max items-center">
        {/* 필터 버튼 */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenFilterModal?.()}
            className="whitespace-nowrap rounded-full px-3 text-sm font-medium transition-all h-8 bg-white text-gray-700 border-gray-400 hover:bg-gray-100 hover:border-gray-400"
          >
            <Sliders size={14} className="mr-1" />
          </Button>
        </motion.div>
        
        {/* 기존 필터 버튼들 */}
        {filters.map((filter) => (
          <motion.div
            key={filter.value}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(filter.value)}
              className={`
                whitespace-nowrap rounded-full px-3 text-sm font-medium transition-all h-8
                ${selectedFilter === filter.value 
                  ? 'bg-black text-white hover:bg-gray-800 shadow-sm' 
                  : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100 hover:border-gray-400'}
              `}
            >
              {filter.icon && <span className="mr-1">{filter.icon}</span>}
              {filter.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
