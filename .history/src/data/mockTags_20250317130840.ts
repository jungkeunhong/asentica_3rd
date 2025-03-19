import { Tag, TagCategory } from '@/types/community';

export const mockPopularTags: Tag[] = [
  { id: '1', name: 'skincare', count: 856, color: '#f87171' },
  { id: '2', name: 'moisturizer', count: 437, color: '#60a5fa' },
  { id: '3', name: 'acne', count: 321, color: '#4ade80' },
  { id: '4', name: 'tretinoin', count: 289, color: '#facc15' },
  { id: '5', name: 'sunscreen', count: 276, color: '#fb923c' },
  { id: '6', name: 'anti-aging', count: 254, color: '#a78bfa' },
  { id: '7', name: 'vitamin-c', count: 198, color: '#f87171' },
  { id: '8', name: 'niacinamide', count: 186, color: '#38bdf8' },
  { id: '9', name: 'hyperpigmentation', count: 165, color: '#a3e635' },
  { id: '10', name: 'cleansers', count: 149, color: '#fb7185' },
  { id: '11', name: 'sensitive-skin', count: 142, color: '#c084fc' },
  { id: '12', name: 'reviews', count: 134, color: '#fbbf24' },
  { id: '13', name: 'retinol', count: 128, color: '#4ade80' },
  { id: '14', name: 'exfoliation', count: 118, color: '#f472b6' },
  { id: '15', name: 'korean-skincare', count: 112, color: '#60a5fa' },
  { id: '16', name: 'aha-bha', count: 97, color: '#fb923c' },
  { id: '17', name: 'dermatologist', count: 89, color: '#a3e635' },
  { id: '18', name: 'ceramides', count: 82, color: '#fb7185' },
  { id: '19', name: 'product-recommendations', count: 76, color: '#38bdf8' },
  { id: '20', name: 'fungal-acne', count: 71, color: '#a78bfa' },
  { id: '21', name: 'hyaluronic-acid', count: 67, color: '#fbbf24' },
  { id: '22', name: 'oily-skin', count: 63, color: '#4ade80' },
  { id: '23', name: 'dry-skin', count: 60, color: '#f472b6' },
  { id: '24', name: 'rosacea', count: 53, color: '#38bdf8' },
  { id: '25', name: 'chemical-exfoliation', count: 48, color: '#fb923c' },
  { id: '26', name: 'physical-exfoliation', count: 42, color: '#60a5fa' },
  { id: '27', name: 'before-after', count: 39, color: '#f87171' },
  { id: '28', name: 'skincare-routine', count: 36, color: '#38bdf8' },
  { id: '29', name: 'the-ordinary', count: 32, color: '#a78bfa' },
  { id: '30', name: 'success-story', count: 29, color: '#4ade80' }
];

export const mockTagCategories: TagCategory[] = [
  {
    id: '1',
    name: 'Skin Concerns',
    icon: 'AlertCircle',
    description: 'Discuss common skin concerns and conditions',
    tags: [
      { id: '3', name: 'acne', count: 321 },
      { id: '9', name: 'hyperpigmentation', count: 165 },
      { id: '11', name: 'sensitive-skin', count: 142 },
      { id: '20', name: 'fungal-acne', count: 71 },
      { id: '22', name: 'oily-skin', count: 63 },
      { id: '23', name: 'dry-skin', count: 60 },
      { id: '24', name: 'rosacea', count: 53 }
    ],
    count: 875
  },
  {
    id: '2',
    name: 'Ingredients',
    icon: 'Droplet',
    description: 'Explore skincare ingredients and their benefits',
    tags: [
      { id: '7', name: 'vitamin-c', count: 198 },
      { id: '8', name: 'niacinamide', count: 186 },
      { id: '13', name: 'retinol', count: 128 },
      { id: '16', name: 'aha-bha', count: 97 },
      { id: '18', name: 'ceramides', count: 82 },
      { id: '21', name: 'hyaluronic-acid', count: 67 },
      { id: '4', name: 'tretinoin', count: 289 }
    ],
    count: 1047
  },
  {
    id: '3',
    name: 'Product Types',
    icon: 'Package',
    description: 'Discuss different types of skincare products',
    tags: [
      { id: '2', name: 'moisturizer', count: 437 },
      { id: '5', name: 'sunscreen', count: 276 },
      { id: '10', name: 'cleansers', count: 149 },
      { id: '29', name: 'the-ordinary', count: 32 }
    ],
    count: 894
  },
  {
    id: '4',
    name: 'Treatments',
    icon: 'Sparkles',
    description: 'Share experiences with different skincare treatments',
    tags: [
      { id: '14', name: 'exfoliation', count: 118 },
      { id: '25', name: 'chemical-exfoliation', count: 48 },
      { id: '26', name: 'physical-exfoliation', count: 42 },
      { id: '6', name: 'anti-aging', count: 254 }
    ],
    count: 462
  },
  {
    id: '5',
    name: 'Community',
    icon: 'Users',
    description: 'Share your journey and connect with others',
    tags: [
      { id: '12', name: 'reviews', count: 134 },
      { id: '19', name: 'product-recommendations', count: 76 },
      { id: '27', name: 'before-after', count: 39 },
      { id: '28', name: 'skincare-routine', count: 36 },
      { id: '30', name: 'success-story', count: 29 }
    ],
    count: 314
  }
];
