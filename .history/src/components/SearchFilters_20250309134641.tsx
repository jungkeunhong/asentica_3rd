'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import FilterModal from './FilterModal';

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

// 샘플 지역 목록 (실제로는 데이터베이스에서 가져와야 함)
const sampleVillages = [
  'Jung-Gu',
  'Myeong-dong',
  'Dongjak-Gu',
  'Hongdae',
  'Gangnam',
  'Itaewon',
  'Sinchon',
  'Apgujeong'
];

// SearchFilters 컴포넌트 Props 타입
interface SearchFiltersProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onApplyAdvancedFilters?: (filters: FilterState) => void;
}

export default function SearchFilters({ selectedFilter, onFilterChange, onApplyAdvancedFilters }: SearchFiltersProps) {
  // 필터 모달 상태
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    googleStars: [],
    yelpStars: [],
    villages: [],
    facilities: []
  });

  // 필터 선택 핸들러
  const handleFilterClick = (filter: FilterType) => {
    // 이미 선택된 필터를 다시 클릭하면 선택 해제
    if (selectedFilter === filter) {
      onFilterChange(null);
    } else {
      onFilterChange(filter);
    }
  };

  // 고급 필터 적용 핸들러
  const handleApplyFilters = (filters: FilterState) => {
    setAdvancedFilters(filters);
    if (onApplyAdvancedFilters) {
      onApplyAdvancedFilters(filters);
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
            onClick={() => setIsFilterModalOpen(true)}
            className="whitespace-nowrap rounded-full px-3 text-sm font-medium transition-all h-8 bg-white text-gray-700 border-black hover:bg-gray-100 hover:border-gray-400"
          >
            <Sliders size={14} className="mr-1" />
            Filters
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
                  : 'bg-white text-gray-700 border-black hover:bg-gray-100 hover:border-gray-400'}
              `}
            >
              {filter.icon && <span className="mr-1">{filter.icon}</span>}
              {filter.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* 필터 모달 */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        availableVillages={sampleVillages}
        initialFilters={advancedFilters}
      />
    </div>
  );
}
