export interface Treatment {
  name: string;
  description: string;
  time: string;
  price: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  clinic: string;
  rating: number;
  reviews: string;
  image: string;
  expertise: string[];
  education: string[];
  intro: string;
  languages: string[];
  location: string;
  website: string;
  treatments: Treatment[];
}

export const doctors = {
  botox: [
    {
      id: 'dr-marotta',
      name: "Dr. James C. Marotta, MD",
      title: "Board Certified Facial Plastic Surgeon",
      clinic: "Marotta Facial Plastic Surgery",
      rating: 4.9,
      reviews: '282 reviews',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREofNWqHa3Yj0_h_FE7O1PkVdYTNIwd3u8cw&s",
      expertise: ["Botox", "Active FX", "Laser"],
      education: [
        "BA, Columbia University, New York, NY",
        "MD, SUNY Stony Brook, School of Medicine",
        "Fellowship: Facial Plastic and Reconstructive Surgery, Quatela Center"
      ],
      intro: "Expertise. Innovation. Compassionate care. The primary reasons Dr. Marotta has been consistently named Best Cosmetic Surgeon on Long Island can be found in his commitment to his patients. Combined with his dual-board certification, his Ivy League education and his impeccable credentials.",
      languages: ["English"],
      location: "37.7749,-122.4194",
      website: "https://marottamd.com/",
      treatments: [
        {
          name: "Botox",
          description: "A treatment that temporarily relaxes muscles to reduce wrinkles and refresh the face naturally",
          time: "10–15 minutes",
          price: "$15 per unit (20-40 units)\nFirst-time patients: $200 per area"
        }
      ]
    },
    {
      id: 'dr-smith',
      name: "Dr. Sarah Smith, MD",
      title: "Aesthetic Medicine Specialist",
      clinic: "Pure Aesthetics",
      rating: 4.8,
      reviews: '193 reviews',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREofNWqHa3Yj0_h_FE7O1PkVdYTNIwd3u8cw&s",
      expertise: ["Botox", "Dermal Fillers", "Chemical Peels"],
      education: [
        "MD, Stanford University School of Medicine",
        "Residency: Dermatology, UCSF"
      ],
      intro: "Dr. Smith specializes in non-surgical facial rejuvenation and has over 15 years of experience in aesthetic medicine.",
      languages: ["English", "Spanish"],
      location: "37.7833,-122.4167",
      website: "https://pureaesthetics.com/",
      treatments: [
        {
          name: "Botox",
          description: "Premium Botox treatment for wrinkle reduction",
          time: "15-30 minutes",
          price: "$12 per unit"
        }
      ]
    }
  ],
  filler: [],
  microneedling: []
};
