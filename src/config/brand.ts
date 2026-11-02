// ==============================================================================
// MAHAKALI PRODUCTION - Brand Configuration & Verified Catalog Details
// ==============================================================================

export interface StudioPackage {
  id: string;
  name: string;
  category: 'Wedding' | 'Pre-Wedding';
  tierName: string;
  tagline: string;
  priceEstimate: string;
  priceNumeric: number;
  deliveryDays: number;
  deliveryLabel: string;
  flagship?: boolean;
  popular?: boolean;
  summary: string;
  deliverables: {
    coverage: string;
    videoFormat: string;
    drone: string;
    album: string;
    frames: string;
    storage: string;
    extras?: string[];
  };
  features: string[];
}

export const BRAND_CONFIG = {
  brandName: 'MAHAKALI PRODUCTION',
  tagline: 'Creating Visuals. Crafting Emotions. Telling Stories.',
  heroTagline: 'Beyond Ordinary. Beyond Imagination.',
  founder: 'Vishal Giri',
  role: 'Founder & Creative Director',
  disclaimer:
    'Package prices are customized. Travel, drone permissions, and delivery timeline confirmed in writing before booking.',
  location: {
    address: 'Soni Plaza, Near by Railway Station',
    city: 'Shujalpur',
    state: 'Madhya Pradesh',
    pincode: '465333',
    country: 'India',
    fullFormatted: 'Soni Plaza, Near by Railway Station, Shujalpur, Madhya Pradesh - 465333',
  },
  contact: {
    phone: '+91 8719878719',
    phoneRaw: '8719878719',
    whatsapp: 'https://wa.me/918719878719',
    email: 'mahakaliproduction69@gmail.com',
    instagram: '@mahakali_productionstudio',
    instagramUrl: 'https://instagram.com/mahakali_productionstudio',
  },
  packages: [
    {
      id: 'mahakali-plus-full-hd',
      name: 'MAHAKALI PLUS FULL HD',
      category: 'Wedding',
      tierName: 'Classic Wedding Coverage',
      tagline: 'Traditional & Candid Full HD Wedding Film',
      priceEstimate: '₹75,000*',
      priceNumeric: 75000,
      deliveryDays: 75,
      deliveryLabel: 'Est. Delivery: 75 days',
      popular: false,
      flagship: false,
      summary:
        'Complete essential wedding coverage featuring synchronized photo & video, aerial drone sweeps, and custom physical prints.',
      deliverables: {
        coverage: 'Photo & Video (Traditional + Candid)',
        videoFormat: 'Full HD 1080p 60fps Master',
        drone: 'Cinematic Drone Coverage Included',
        album: '150-photo handcrafted wedding album',
        frames: '2 Custom wall display frames',
        storage: '1 High-speed Master USB Flash Drive',
        extras: ['Traditional wedding documentary', '3-5 min highlight teaser'],
      },
      features: [
        'Photo & Video dual-team coverage',
        'Drone aerial perspective sweeps',
        '150-photo custom designed wedding album',
        '2 Premium wall portrait frames',
        '1 Master USB Flash Drive with digital cut',
        'Est. Delivery: 75 days',
      ],
    },
    {
      id: 'mahakali-pro-4k',
      name: 'MAHAKALI PRO 4K',
      category: 'Wedding',
      tierName: 'Essential 4K Coverage',
      tagline: 'High-Fidelity 4K Photography & Cinematic Video',
      priceEstimate: '₹1,25,000*',
      priceNumeric: 125000,
      deliveryDays: 80,
      deliveryLabel: 'Est. Delivery: 80 days',
      popular: true,
      flagship: false,
      summary:
        'Professional 4K dual-rig coverage with prime optics, dedicated ring highlight reel, and premium embossed photo album.',
      deliverables: {
        coverage: 'Photography, Traditional & Cinematic Video',
        videoFormat: 'Ultra HD 4K Master Film',
        drone: 'Drone Aerial Perspectives Included',
        album: '150-photo premium velvet album',
        frames: '1 Large custom master frame',
        storage: 'High-speed USB Flash Drive',
        extras: ['Ring Ceremony Highlight 4K Cut', 'Teaser Reel for Instagram'],
      },
      features: [
        'Comprehensive Photography & Traditional Video',
        'Cinematic 4K Wedding Film & Ring highlight 4K',
        '150-photo premium velvet album',
        '1 Large custom master wall frame',
        'High-speed USB delivery',
        'Est. Delivery: 80 days',
      ],
    },
    {
      id: 'mahakali-max-asli-4k',
      name: 'MAHAKALI MAX ASLI 4K',
      category: 'Wedding',
      tierName: 'Luxury Cinematic Asli 4K',
      tagline: 'Uncompressed 4K, Reel-graphy & Same-Day Edit',
      priceEstimate: '₹1,85,000*',
      priceNumeric: 185000,
      deliveryDays: 50,
      deliveryLabel: 'Est. Delivery: 50 days',
      popular: false,
      flagship: false,
      summary:
        'High-end multi-cam luxury production with dedicated Reel-graphy crew, 4K DJI Drone, same-day reception edit, and double albums.',
      deliverables: {
        coverage: '4K Cinematic, Candid, Traditional, Reel-graphy',
        videoFormat: 'True Asli 4K 10-Bit Color Graded',
        drone: '4K DJI Drone with licensed pilot',
        album: '400 photos luxury double albums (Bride & Groom sets)',
        frames: '4 Premium custom frames (Assorted sizes)',
        storage: 'Type-C high-speed SSD / Flash Storage',
        extras: ['Same-day edit premiere for Reception night', 'Dedicated Reel-graphy for Instagram'],
      },
      features: [
        '4K Cinematic, Candid, Traditional & Reel-graphy',
        '4K DJI Drone aerial coverage',
        'Same-day edit premiere for wedding reception',
        '400 photos luxury double albums',
        '4 Premium custom frames',
        'Type-C high-speed storage delivery',
        'Est. Delivery: 50 days expedited',
      ],
    },
    {
      id: 'mahakali-ultra-asli-4k',
      name: 'MAHAKALI ULTRA ASLI 4K',
      category: 'Wedding',
      tierName: 'Signature Director Masterpiece',
      tagline: 'Personal Direction by Vishal Giri with Rapid Turnaround',
      priceEstimate: '₹3,50,000*',
      priceNumeric: 350000,
      deliveryDays: 40,
      deliveryLabel: 'Est. Delivery: 40 days',
      popular: false,
      flagship: true,
      summary:
        'The ultimate studio flagship. Directed personally by Vishal Giri with RED/Sony FX3 rigs, mini album, 3 all-size frames, and online cloud delivery.',
      deliverables: {
        coverage: 'Cinematic Asli 4K, Candid, Reel-graphy, Jimmy Jib Crane',
        videoFormat: 'Flagship Asli 4K DCI Master',
        drone: 'Dual Drone Team (FPV & 4K Cinema)',
        album: '300-photo luxury master album + Parent mini album',
        frames: '3 Custom frames in all sizes (Grand, Medium, Accent)',
        storage: 'Type-C High-Speed Storage & Private Online Cloud Portal',
        extras: [
          'Directed personally by Vishal Giri',
          'Same-day reception highlight premiere',
          'Online private cloud streaming gallery',
        ],
      },
      features: [
        'Cinematic Asli 4K, Candid & dedicated Reel-graphy',
        'Directed personally by Vishal Giri',
        '300-photo luxury album + mini album',
        '3 Custom frames in all sizes',
        'Type-C storage & Private Online Cloud delivery',
        'Est. Delivery: 40 days priority timeline',
      ],
    },
    {
      id: 'pre-wedding-max-4k',
      name: 'MAHAKALI PRE-WEDDING MAX-4K',
      category: 'Pre-Wedding',
      tierName: 'Cinematic Narrative Pre-Wedding',
      tagline: 'Story-Driven Destination Pre-Wedding Shoot',
      priceEstimate: '₹65,000*',
      priceNumeric: 65000,
      deliveryDays: 20,
      deliveryLabel: 'Est. Delivery: 20 days',
      popular: false,
      flagship: false,
      summary:
        'Story-driven pre-wedding film with save-the-date teaser, 7-day countdown Instagram stories, personalized calendar, and custom frames.',
      deliverables: {
        coverage: '2-Day Location Destination Shoot',
        videoFormat: '4K Cinema 60fps Narrative',
        drone: 'DJI Drone Aerial Landscape Perspectives',
        album: 'Personalized Pre-Wedding Photo Calendar',
        frames: '2 Custom romantic portrait frames',
        storage: 'Digital Cloud & Type-C delivery',
        extras: [
          'Save-The-Date Cinematic Video Teaser',
          '7-Day countdown Instagram stories package',
          'Custom calendar for wedding venue display',
        ],
      },
      features: [
        '4K Cinematic Narrative Story Film',
        'Save-The-Date Teaser Video',
        '7-day countdown stories package',
        'Personalized wedding date calendar',
        '2 Custom frames',
        'Est. Delivery: 20 days',
      ],
    },
    {
      id: 'pre-wedding-ultra-asli-4k',
      name: 'MAHAKALI PRE-WEDDING ULTRA ASLI 4K',
      category: 'Pre-Wedding',
      tierName: 'Director Flagship Pre-Wedding',
      tagline: 'Pure Uncompressed Asli 4K Slow-Motion Poetry',
      priceEstimate: '₹95,000*',
      priceNumeric: 95000,
      deliveryDays: 15,
      deliveryLabel: 'Est. Delivery: 15 days',
      popular: true,
      flagship: true,
      summary:
        'Director-level destination production with uncompressed Asli 4K 120fps slow-motion, save-the-date teaser, 7-day countdown stories, custom calendar, and luxury frames.',
      deliverables: {
        coverage: '3-Day Multi-Location Destination Shoot',
        videoFormat: 'True Asli 4K 120fps Slow-Motion',
        drone: 'FPV Cinematic Drone + Aerial Landscape',
        album: 'Luxury Heirloom Photo Book & Custom Calendar',
        frames: '3 Custom frames in all sizes',
        storage: 'Type-C High-Speed Delivery & Online Portal',
        extras: [
          'Save-The-Date Cinematic Video Teaser',
          '7-Day countdown Instagram stories package',
          'Personalized wedding date calendar & prints',
          'Wardrobe & concept curation by Vishal Giri',
        ],
      },
      features: [
        'True Asli 4K 120fps Slow-Motion Cinema',
        'Save-The-Date Teaser & 7-day countdown stories',
        'Personalized calendar + 3 custom frames',
        'Concept & location direction by Vishal Giri',
        'Type-C & Online Cloud portal delivery',
        'Est. Delivery: 15 days priority turnaround',
      ],
    },
  ] as StudioPackage[],
};
