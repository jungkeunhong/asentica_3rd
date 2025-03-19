'use client';

import { Button } from '@/components/ui/button';

// 필터 타입 정의 - 원래 있던 구체적인 필터 타입으로 복원
export type FilterType = 'Price' | 'google_star' | 'google_review' | 'yelp_star' | 'yelp_review' | 'Distance' | 'Free consultation' | null;

// 필터 아이템 인터페이스
interface FilterItem {
  label: string;
  value: FilterType;
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
}

export default function SearchFilters({ selectedFilter, onFilterChange }: SearchFiltersProps) {
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
      <div className="flex space-x-2 min-w-max">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick(filter.value)}
            className={`
              whitespace-nowrap rounded-full px-4 py-1 text-sm font-medium transition-colors
              ${selectedFilter === filter.value 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
            `}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
