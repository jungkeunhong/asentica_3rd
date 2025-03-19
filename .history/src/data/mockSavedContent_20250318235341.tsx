import { SavedContent } from '@/types/user';

// Create mock saved content data with the proper types needed for the SavedContent page
export const mockSavedContent: SavedContent[] = [
  {
    id: "saved-1",
    contentId: "post-external-3",
    savedAt: "2023-06-10T18:32:00Z",
    type: "post",
    content: {
      title: "The Ultimate Guide to Treating Hyperpigmentation",
      excerpt: "A comprehensive guide to different types of hyperpigmentation and the most effective ingredients and treatments for each type.",
      author: "DermaExpert",
      tags: [
        { id: "tag-7", name: "Hyperpigmentation" },
        { id: "tag-8", name: "Melasma" },
        { id: "tag-9", name: "Dark Spots" }
      ]
    }
  },
  {
    id: "saved-2",
    contentId: "post-external-4",
    // savedAt: "2023-06-08T21:15:00Z",
    type: "post",
    content: {
      title: "My Experience with Tretinoin: 6 Month Update",
      excerpt: "Six months into my tretinoin journey. See the before and after results, how I managed side effects, and my complete routine.",
      author: "RetinolQueen",
      tags: [
        { id: "tag-10", name: "Tretinoin" },
        { id: "tag-11", name: "Retinoids" },
        { id: "tag-12", name: "Anti-Aging" }
      ]
    }
  },
  {
    id: "saved-3",
    contentId: "product-123",
    savedAt: "2023-06-05T12:43:00Z",
    type: "product",
    content: {
      title: "Gentle Hydrating Cleanser",
      excerpt: "A non-stripping cleanser that maintains the skin's natural moisture barrier",
      author: "CeraVe",
      tags: [
        { id: "tag-16", name: "Cleanser" },
        { id: "tag-17", name: "Sensitive Skin" },
        { id: "tag-18", name: "Budget-Friendly" }
      ]
    }
  },
  {
    id: "saved-4",
    contentId: "review-456",
    savedAt: "2023-06-03T14:09:00Z",
    type: "review",
    content: {
      title: "Review: The Ordinary Niacinamide 10% + Zinc 1%",
      excerpt: "An in-depth review of this popular serum and how it helped with my oily skin and enlarged pores",
      author: "PorePerfector",
      tags: [
        { id: "tag-19", name: "Niacinamide" },
        { id: "tag-20", name: "The Ordinary" },
        { id: "tag-21", name: "Oily Skin" }
      ]
    }
  },
  {
    id: "saved-5",
    contentId: "routine-789",
    savedAt: "2023-05-29T09:25:00Z",
    type: "routine",
    content: {
      title: "Winter Morning Routine for Dry Skin",
      excerpt: "A complete step-by-step morning skincare routine focused on hydration for dry skin in cold weather",
      author: "HydrationHero",
      tags: [
        { id: "tag-22", name: "Routine" },
        { id: "tag-23", name: "Dry Skin" },
        { id: "tag-24", name: "Winter Skincare" }
      ]
    }
  },
  {
    id: "saved-6",
    contentId: "post-external-5",
    savedAt: "2023-05-20T16:37:00Z",
    type: "post",
    content: {
      title: "Japanese vs. Korean Sunscreens: Comprehensive Comparison",
      excerpt: "Detailed comparison of popular Japanese and Korean sunscreens, focusing on formulation, texture, finish, and protection level.",
      author: "SPF_Enthusiast",
      tags: [
        { id: "tag-13", name: "Sunscreen" },
        { id: "tag-14", name: "Korean Beauty" },
        { id: "tag-15", name: "Japanese Beauty" }
      ]
    }
  }
]; 