import { TagCategory, TagCloudItem } from "@/types/community";

// Mock popular tags
export const mockPopularTags: TagCloudItem[] = [
  { id: '1', name: 'Retinol', count: 458, weight: 100 },
  { id: '2', name: 'Vitamin C', count: 392, weight: 90 },
  { id: '3', name: 'Hyaluronic Acid', count: 385, weight: 85 },
  { id: '4', name: 'Acne', count: 356, weight: 80 },
  { id: '5', name: 'SPF', count: 342, weight: 75 },
  { id: '6', name: 'Anti-Aging', count: 325, weight: 74 },
  { id: '7', name: 'Niacinamide', count: 312, weight: 70 },
  { id: '8', name: 'Moisturizer', count: 298, weight: 68 },
  { id: '9', name: 'Exfoliation', count: 265, weight: 60 },
  { id: '10', name: 'Rosacea', count: 230, weight: 55 },
  { id: '11', name: 'Sensitive Skin', count: 215, weight: 50 },
  { id: '12', name: 'Botox', count: 205, weight: 45 },
  { id: '13', name: 'Dermatologist', count: 195, weight: 44 },
  { id: '14', name: 'Oily Skin', count: 192, weight: 43 },
  { id: '15', name: 'Microneedling', count: 185, weight: 42 },
  { id: '16', name: 'Ceramides', count: 172, weight: 40 },
  { id: '17', name: 'Dry Skin', count: 168, weight: 38 },
  { id: '18', name: 'Hyperpigmentation', count: 164, weight: 37 },
  { id: '19', name: 'Face Mask', count: 155, weight: 35 },
  { id: '20', name: 'Cleansers', count: 148, weight: 32 },
  { id: '21', name: 'Lip Care', count: 135, weight: 30 },
  { id: '22', name: 'Eye Cream', count: 130, weight: 28 },
  { id: '23', name: 'Peptides', count: 125, weight: 25 },
  { id: '24', name: 'Laser Treatment', count: 120, weight: 24 },
  { id: '25', name: 'Chemical Peel', count: 115, weight: 22 },
  { id: '26', name: 'AHA', count: 110, weight: 20 },
  { id: '27', name: 'BHA', count: 102, weight: 18 },
  { id: '28', name: 'Sunscreen', count: 98, weight: 15 },
  { id: '29', name: 'Toner', count: 93, weight: 12 },
  { id: '30', name: 'Korean Skincare', count: 85, weight: 10 },
];

// Mock trending tags
export const mockTrendingTags: TagCloudItem[] = [
  { id: 't1', name: 'Skin Cycling', count: 125, weight: 90 },
  { id: 't2', name: 'Slugging', count: 98, weight: 85 },
  { id: 't3', name: 'Fermented Skincare', count: 76, weight: 80 },
  { id: 't4', name: 'Microbiome', count: 105, weight: 75 },
  { id: 't5', name: 'Bakuchiol', count: 82, weight: 70 },
  { id: 't6', name: 'LED Masks', count: 64, weight: 65 },
  { id: 't7', name: 'Tranexamic Acid', count: 57, weight: 60 },
  { id: 't8', name: 'Skin Barrier', count: 142, weight: 55 },
  { id: 't9', name: 'Gua Sha', count: 48, weight: 50 },
  { id: 't10', name: 'Adapalene', count: 53, weight: 45 },
];

// Mock tag categories
export const mockTagCategories: TagCategory[] = [
  {
    id: 'skincare',
    name: 'Skincare',
    icon: '✨',
    description: 'Products and routines for skin health and appearance',
    count: 1250,
    tags: [
      { id: 's1', name: 'Moisturizers', count: 298 },
      { id: 's2', name: 'Cleansers', count: 252 },
      { id: 's3', name: 'Serums', count: 236 },
      { id: 's4', name: 'Toners', count: 185 },
      { id: 's5', name: 'Masks', count: 173 },
      { id: 's6', name: 'Oils', count: 156 },
      { id: 's7', name: 'Exfoliants', count: 142 },
      { id: 's8', name: 'SPF', count: 134 },
    ]
  },
  {
    id: 'ingredients',
    name: 'Ingredients',
    icon: '🧪',
    description: 'Active components in skincare products',
    count: 980,
    tags: [
      { id: 'i1', name: 'Retinol', count: 187 },
      { id: 'i2', name: 'Vitamin C', count: 165 },
      { id: 'i3', name: 'Hyaluronic Acid', count: 153 },
      { id: 'i4', name: 'Niacinamide', count: 142 },
      { id: 'i5', name: 'AHAs', count: 112 },
      { id: 'i6', name: 'BHAs', count: 98 },
      { id: 'i7', name: 'Peptides', count: 86 },
      { id: 'i8', name: 'Ceramides', count: 78 },
    ]
  },
  {
    id: 'skin-concerns',
    name: 'Skin Concerns',
    icon: '🔍',
    description: 'Common skin issues and conditions',
    count: 820,
    tags: [
      { id: 'c1', name: 'Acne', count: 165 },
      { id: 'c2', name: 'Aging', count: 152 },
      { id: 'c3', name: 'Hyperpigmentation', count: 143 },
      { id: 'c4', name: 'Dryness', count: 125 },
      { id: 'c5', name: 'Rosacea', count: 112 },
      { id: 'c6', name: 'Sensitivity', count: 102 },
      { id: 'c7', name: 'Oiliness', count: 98 },
      { id: 'c8', name: 'Eczema', count: 86 },
    ]
  },
  {
    id: 'treatments',
    name: 'Treatments',
    icon: '💉',
    description: 'Professional skin procedures and services',
    count: 745,
    tags: [
      { id: 'tr1', name: 'Botox', count: 132 },
      { id: 'tr2', name: 'Fillers', count: 124 },
      { id: 'tr3', name: 'Microneedling', count: 112 },
      { id: 'tr4', name: 'Chemical Peels', count: 98 },
      { id: 'tr5', name: 'Laser Therapy', count: 87 },
      { id: 'tr6', name: 'Dermaplaning', count: 78 },
      { id: 'tr7', name: 'Microdermabrasion', count: 65 },
      { id: 'tr8', name: 'LED Therapy', count: 54 },
    ]
  },
  {
    id: 'makeup',
    name: 'Makeup',
    icon: '💄',
    description: 'Cosmetics and beauty products',
    count: 680,
    tags: [
      { id: 'm1', name: 'Foundation', count: 145 },
      { id: 'm2', name: 'Concealer', count: 132 },
      { id: 'm3', name: 'Lipstick', count: 124 },
      { id: 'm4', name: 'Mascara', count: 112 },
      { id: 'm5', name: 'Eyeshadow', count: 98 },
      { id: 'm6', name: 'Blush', count: 78 },
      { id: 'm7', name: 'Highlighter', count: 65 },
      { id: 'm8', name: 'Primer', count: 54 },
    ]
  },
  {
    id: 'tools',
    name: 'Tools & Devices',
    icon: '🔧',
    description: 'Equipment for skincare routines',
    count: 420,
    tags: [
      { id: 'tl1', name: 'Facial Rollers', count: 98 },
      { id: 'tl2', name: 'Gua Sha', count: 87 },
      { id: 'tl3', name: 'Cleansing Devices', count: 76 },
      { id: 'tl4', name: 'Microcurrent', count: 67 },
      { id: 'tl5', name: 'LED Masks', count: 54 },
      { id: 'tl6', name: 'Dermarollers', count: 43 },
      { id: 'tl7', name: 'Extraction Tools', count: 32 },
      { id: 'tl8', name: 'Face Steamers', count: 28 },
    ]
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: '🧘',
    description: 'Holistic approaches to skin health',
    count: 380,
    tags: [
      { id: 'w1', name: 'Nutrition', count: 87 },
      { id: 'w2', name: 'Hydration', count: 76 },
      { id: 'w3', name: 'Sleep', count: 67 },
      { id: 'w4', name: 'Stress Management', count: 54 },
      { id: 'w5', name: 'Supplementation', count: 43 },
      { id: 'w6', name: 'Hormonal Balance', count: 32 },
      { id: 'w7', name: 'Exercise', count: 28 },
      { id: 'w8', name: 'Gut Health', count: 24 },
    ]
  },
]; 