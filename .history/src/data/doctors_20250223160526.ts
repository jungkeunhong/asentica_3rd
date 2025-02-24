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
  location: string;
  highlights?: string[];
  intro?: string;
  education?: string[];
  treatments?: Treatment[];
}

export const doctors: { [key: string]: Doctor[] } = {
  botox: [
    {
      id: 'dr-marotta',
      name: "Dr. James C. Marotta",
      title: "Board Certified Facial Plastic Surgeon",
      clinic: "Marotta Facial Plastic Surgery",
      rating: 4.9,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Marotta+Facial+Plastic+Surgery+Smithtown+NY',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREofNWqHa3Yj0_h_FE7O1PkVdYTNIwd3u8cw&s",
      expertise: ["Botox", "Active FX", "Laser"],
      location: "Upper East Side",
      intro: "Expertise. Innovation. Compassionate care. The primary reasons Dr. Marotta has been consistently named Best Cosmetic Surgeon on Long Island can be found in his commitment to his patients. Combined with his dual-board certification, his Ivy League education and his impeccable credentials.",
      education: [
        "BA, Columbia University, New York, NY",
        "MD, SUNY Stony Brook, School of Medicine",
        "Fellowship: Facial Plastic and Reconstructive Surgery, Quatela Center"
      ],
      website: "https://marottamd.com/",
      treatments: [
        {
          name: "Botox",
          description: "A treatment that temporarily relaxes muscles to reduce wrinkles and refresh the face naturally",
          time: "10–15 minutes",
          price: "$15 per unit (20-40 units)\nFirst-time patients: $200 per area"
        }
      ],
      highlights: ["Dual-Board Certified", "Ivy League Education", "Best Cosmetic Surgeon on Long Island", "Compassionate Care"]
    },
    {
      id: 'dr-schwarzburg',
      name: "Dmitriy Schwarzburg, MD",
      title: "Board-Certified Expert in Minimally Invasive Cosmetic & Laser Medicine",
      clinic: "Skinly Aesthetics",
      rating: 4.6,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Skinly+Aesthetics+New+York',
      image: "https://skinlyaesthetics.com/wp-content/uploads/2024/03/Dr.-Schwarzburg-MD-best-cosmetic-dermatologist.jpg",
      expertise: ["Botox", "Juvederm", "Active FX"],
      intro: "Dr. Schwarzburg is a top cosmetic expert in NYC, specializing in minimally invasive treatments to enhance natural beauty.",
      education: [
        "Bachelor's in Molecular Biology, Magna Cum Laude, University of Texas at Dallas",
        "Medical Degree, McGovern Medical School, Houston",
        "Surgical Training, North Shore LIJ Hospital, New York"
      ],      
      location: "Midtown Manhattan",
      website: "https://skinlyaesthetics.com/",
      treatments: [
        {
          name: "Botox",
          description: "Precise muscle relaxation for natural wrinkle reduction and prevention",
          time: "15–20 minutes",
          price: "$15 per unit (20-40 units)\nFirst-time patients: $200 per area"
        }
      ],
      highlights: ["Top Cosmetic Expert in NYC", "Minimally Invasive Treatments", "Natural Beauty Enhancement", "Advanced Training"]
    },
    {
      id: 'dr-ferzli',
      name: "Dr. Georgina Ferzli",
      title: "Board-Certified Dermatologist",
      clinic: "Tribeca MedSpa",
      rating: 4.8,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Tribeca+MedSpa+New+York',
      image: "https://www.tribecamedspa.com/wp-content/uploads/2023/12/Dr-Georgina-Ferzli-MD-MS-FAAD-Director-of-Cosmetic-Dermatology.jpeg",
      expertise: ["Botox", "Laser Resurfacing", "Acne Scar Treatment", "Skin Tightening"],
      intro: "Dr. Ferzli is a top dermatologist in NYC, specializing in cosmetic and laser dermatology.",
      education: [
        "B.S., Georgetown University (2008)",
        "M.S., Georgetown University (2009)",
        "M.D., SUNY Downstate Medical Center (2013)"
      ],
      location: "Tribeca, Manhattan",
      website: "https://www.tribecamedspa.com/",
      treatments: [
        {
          name: "Botox",
          description: "A treatment that temporarily relaxes muscles to reduce wrinkles and refresh the face naturally",
          time: "10–15 minutes",
          price: "$1260 ($18 per unit, 70 units)\nFirst-time offer: $50 discount"
        }
      ],
      highlights: ["Top Dermatologist in NYC", "Cosmetic and Laser Dermatology", "Advanced Education", "Personalized Care"]
    }
  ],
  filler: [
    {
      id: 'james-christian',
      name: "James Christian",
      title: "Authorized Vampire Facelift® Professional, Injectable Expert & Certified Galderma Trainer",
      clinic: "James Christian Cosmetics",
      rating: 4.8,
      reviews: 'https://www.google.com/maps/search/?api=1&query=James+Christian+Cosmetics',
      image: "https://jameschristiancosmetics.com/wp-content/uploads/jcc-img-profile.jpg",
      expertise: ["Injections", "Botox", "Filler"],
      intro: "James Christian is the Director of Operations and founder of James Christian Cosmetics, specializing in injectable fillers, muscle relaxants, and advanced aesthetic techniques.",
      education: [
        "B.S., Florida Atlantic University",
        "Allied Health Sciences, Touro College",
        "Physician Assistant License",
        "Advanced training under top plastic surgeons in NYC"
      ],
      location: "Manhattan",
      website: "https://jameschristiancosmetics.com/",
      treatments: [
        {
          name: "Sculptra Filler",
          description: "Help replenish facial volume that has been lost due to aging with a Sculptra 1cc filler treatment.",
          time: "30–60 minutes",
          price: "$900 - 1 Vial\n$1700- 2 Vials\n$2400- 3 Vials\n$2600- 4 Vials"
        }
      ],
      highlights: ["Authorized Vampire Facelift Professional", "Injectable Expert", "Certified Galderma Trainer", "Advanced Aesthetic Techniques"]
    },
    {
      id: 'julija-dimante',
      name: "Julija DiMante, RN, BSN",
      title: "Founder & CEO of Diamond Advanced Aesthetics, Board-Certified Registered Nurse",
      clinic: "Diamond Advanced Aesthetics",
      rating: 5.0,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Diamond+Advanced+Aesthetics',
      image: "https://diamondadvancedaesthetics.com/storage/2024/04/julija-dimante-by-diamond-advanced-aesthetics-in-new-york-ny.webp",
      expertise: ["Injectable Fillers", "Botox", "Natural Aesthetic Enhancements", "Skin Rejuvenation"],
      intro: "Julija DiMante is a skilled injector and aesthetic expert, known for delivering natural and transformative results. She is the founder of Diamond Advanced Aesthetics and an educator in the aesthetics industry.",
      education: [
        "Board-Certified Registered Nurse (RN, BSN)",
        "Founder & CEO of Diamond Advanced Aesthetics",
        "Master Trainer for Suneva Medical",
        "Speaker for Candela"
      ],
      location: "Lower Manhattan",
      website: "https://diamondadvancedaesthetics.com/",
      treatments: [
        {
          name: "Restylane Contour",
          description: "It is ideal for enhancing cheek volume and correcting deficiencies in midface contour.",
          time: "30–60 minutes",
          price: "$900 (per syringe)"
        }
      ],
      highlights: ["Skilled Injector", "Aesthetic Expert", "Natural Results", "Educator in Aesthetics Industry"]
    },
    {
      id: 'dr-vivian-chin',
      name: "Dr. Vivian Chin, MD, MPH",
      title: "Cosmetic Physician, Skin & Wellness Expert",
      clinic: "Vivian Chin MD",
      rating: 4.9,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Vivian+Chin+MD',
      image: "https://korunyc.com/wp-content/uploads/2017/06/chin.jpg",
      expertise: ["Skin Rejuvenation", "Holistic Medicine", "Personalized Skincare"],
      intro: "Dr. Vivian Chin is a cosmetic physician specializing in skin care, wellness aesthetics, and holistic beauty. She combines medical expertise with aesthetic training to provide personalized skin care regimens.",
      education: [
        "B.A., Vassar College",
        "MPH, Columbia University Mailman School of Public Health",
        "M.D., New York University School of Medicine"
      ],
      location: "Midtown Manhattan",
      website: "https://vivianchinmd.com/",
      treatments: [
        {
          name: "Dermal Filler",
          description: "Dermal fillers restore volume, smooth wrinkles, and enhance facial contours with results lasting 6–18 months.",
          time: "30–60 minutes",
          price: "Syringe Price: $800 – $1,000 each\nPartial Syringe: $595"
        }
      ],
      highlights: ["Cosmetic Physician", "Skin & Wellness Expert", "Holistic Approach", "Personalized Care"]
    }
  ],
  microneedling: [
    {
      id: 'samantha-danesi',
      name: "Samantha Danesi, RPA-C, LMT",
      title: "Certified Physician Assistant (RPA-C)",
      clinic: "Samantha Danesi Aesthetics",
      rating: 4.7,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Samantha+Danesi+Aesthetics',
      image: "https://www.beyondbeautifulaesthetics.com/assets/silver_websites/beyond-beautiful-aesthetics/staff/samantha-danesi.jpg",
      expertise: ["Advanced cosmetic injectables", "Tear trough treatments", "Liquid facelifts"],
      intro: "Samantha Danesi is a certified Physician Assistant and Licensed Massage Therapist with over a decade of experience in aesthetics and plastic surgery. She specializes in advanced cosmetic injectables, including tear trough treatments, liquid facelifts, and non-surgical Brazilian Butt Lifts (BBL).",
      education: [
        "Certified Physician Assistant (RPA-C)",
        "Licensed Massage Therapist (LMT)"
      ],
      location: "Upper East Side",
      website: "https://samanthadanesiaesthetics.com/",
      treatments: [
        {
          name: "SkinFix: Microneedling",
          description: "SkinPen (Microneedling) is designed to stimulate your skin's natural ability to produce new collagen formation creating healthier, younger-looking skin. Get smoother more toned skin, hassle-free",
          time: "60 minutes",
          price: "$300.00"
        }
      ],
      highlights: ["Certified Physician Assistant", "Licensed Massage Therapist", "Advanced Cosmetic Injectables", "Non-Surgical Treatments"]
    },
    {
      id: 'shannon-lee',
      name: "Shannon Lee",
      title: "Founder & Lead Esthetician of Shannon Lee Esthetics",
      clinic: "Shannon Lee Esthetics",
      rating: 4.6,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Shannon+Lee+Esthetics',
      image: "https://images.squarespace-cdn.com/content/v1/63e146735db8872a79265dc0/6fb7b053-086c-4c8f-be26-916f52f77749/Untitled+design+%282%29.jpg",
      expertise: ["Acne Treatments", "Hyperpigmentation Correction", "Skin Rejuvenation", "Custom Facials"],
      intro: "Shannon Lee is a skincare expert specializing in acne and hyperpigmentation treatments. Her journey began with her own skin struggles, leading her to build a thriving esthetics business in New York City.",
      education: ["Licensed Esthetician"],
      languages: ["English"],
      location: "Midtown",
      website: "https://shannonleeesthetics.com/",
      treatments: [
        {
          name: "MD Pen MicroNeedling",
          description: "A medical-grade microneedling treatment that creates 15,000 micro-channels per square inch to stimulate collagen production, improve skin texture, and reduce scars, fine lines, and hyperpigmentation.",
          time: "30–60 minutes",
          price: "$350"
        }
      ],
      highlights: ["Skincare Expert", "Acne and Hyperpigmentation Treatments", "Custom Facials", "Personalized Care"]
    },
    {
      id: 'diana-seo',
      name: "Diana Seo",
      title: "Founder & President of Collagen Bar",
      clinic: "Collagen Bar",
      rating: 4.9,
      reviews: 'https://www.google.com/maps/search/?api=1&query=Collagen+Bar',
      image: "https://collagenbar.nyc/cdn/shop/files/dianacc.jpg?v=1658939997&width=1500",
      expertise: ["Medical Aesthetics", "Skin Rejuvenation", "Facial Electrical Treatments", "Collagen Stimulation"],
      intro: "Diana Seo is the founder of Collagen Bar, a premier medical aesthetic and skincare clinic with locations in Westchester and NYC. With over 15 years of experience in health, medical, and beauty fields, she specializes in advanced skincare solutions.",
      education: [
        "B.S. in Biophysics, Minor in Chemistry & Mathematics, University of Connecticut",
        "Licensed Esthetician, Atelier Esthétique Institute of Esthetics"
      ],
      location: "Midtown",
      website: "https://collagenbar.com/",
      treatments: [
        {
          name: "Morpheus8 RF Microneedling",
          description: "A fractional radiofrequency (RF) microneedling treatment that stimulates collagen production, remodels skin, and contours the face and body by penetrating up to 4mm deep for superior skin tightening and fat reduction.",
          time: "30–60 minutes",
          price: "$1,150.00"
        }
      ],
      highlights: ["Founder & President of Collagen Bar", "Advanced Skincare Solutions", "Medical Aesthetics Expert", "Personalized Care"]
    }
  ]
}