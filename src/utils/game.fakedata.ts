import { IGame } from '../modules/games.model';

export const games: IGame[] = [
  {
    name: 'FC26',
    slug: 'fc26',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    banner:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1400&auto=format&fit=crop',
    genre: 'Football Simulation',
    category: 'Sports',
    description:
      'Experience the thrill of football with realistic gameplay, stunning graphics, and immersive stadium atmospheres in FC26.',
    shortDescription: 'Next-gen football simulation with realistic gameplay.',
    version: '1.0.0',
    publisher: 'Electronic Arts',
    releaseDate: new Date('2025-03-15'),
    multiplayer: true,
    rating: 4.9,
    features: [
      'Realistic Physics',
      'Ultimate Team',
      'Career Mode',
      'Online Multiplayer',
      '4K Graphics',
    ],
    tags: ['Football', 'Sports', 'Multiplayer', 'Competitive'],
    available: true,
    trending: true,
    featured: true,
    price: 59.99,
    discount: 15,
    currency: 'USD',
  },

  {
    name: 'Forza Horizon 5',
    slug: 'forza-horizon-5',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    banner:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1400&auto=format&fit=crop',
    genre: 'Open World Racing',
    category: 'Racing',
    description:
      'Explore breathtaking open-world racing environments with hundreds of customizable cars and dynamic weather systems.',
    shortDescription: 'Open-world racing adventure with realistic driving.',
    version: '2.5.1',
    publisher: 'Xbox Game Studios',
    releaseDate: new Date('2025-03-15'),
    multiplayer: true,
    rating: 4.8,
    features: [
      'Dynamic Seasons',
      'Realistic Cars',
      'Online Races',
      'Open World',
      'Photo Mode',
    ],
    tags: ['Cars', 'Racing', 'Open World', 'Driving'],
    available: true,
    trending: true,
    featured: true,
    price: 69.99,
    discount: 10,
    currency: 'USD',
  },

  {
    name: 'WWE 2026',
    slug: 'wwe-2026',
    image:
      'https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200&auto=format&fit=crop',
    banner:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1400&auto=format&fit=crop',
    genre: 'Sports Fighting',
    category: 'Fighting',
    description:
      'Step into the ring with legendary superstars, cinematic entrances, and action-packed wrestling gameplay.',
    shortDescription: 'Ultimate wrestling action with WWE superstars.',
    version: '1.2.0',
    publisher: '2K',
    multiplayer: true,
    releaseDate: new Date('2025-03-15'),
    rating: 4.6,
    features: [
      'Career Mode',
      'Tag Team Battles',
      'Custom Wrestlers',
      'Online Arena',
    ],
    tags: ['Wrestling', 'Action', 'Sports', 'Multiplayer'],
    available: true,
    trending: false,
    featured: true,
    price: 49.99,
    discount: 20,
    currency: 'USD',
  },

  {
    name: 'GTA-V',
    slug: 'gta-v',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    banner:
      'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=1400&auto=format&fit=crop',
    genre: 'Open World Action',
    category: 'Adventure',
    description:
      'Enter the chaotic open world of Los Santos with thrilling missions, action-packed gameplay, and endless exploration.',
    shortDescription: 'Massive open-world crime adventure experience.',
    version: '3.0.0',
    publisher: 'Rockstar',
    releaseDate: new Date('2025-03-15'),
    multiplayer: true,
    rating: 4.9,
    features: [
      'Open World',
      'Online Multiplayer',
      'Heists',
      'Vehicle Customization',
    ],
    tags: ['Open World', 'Action', 'Adventure', 'Crime'],
    available: true,
    trending: true,
    featured: true,
    price: 39.99,
    discount: 35,
    currency: 'USD',
  },

  {
    name: 'Ghost Of Yotei',
    slug: 'ghost-of-yotei',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    banner:
      'https://images.unsplash.com/photo-1520034475321-cbe63696469a?q=80&w=1400&auto=format&fit=crop',
    genre: 'Samurai Adventure',
    category: 'Adventure',
    description:
      'Embark on an epic samurai journey filled with sword combat, stealth missions, and breathtaking landscapes.',
    shortDescription: 'Epic samurai adventure with cinematic combat.',
    version: '1.0.5',
    publisher: 'Sony Interactive',
    releaseDate: new Date('2025-03-15'),
    multiplayer: false,
    rating: 4.8,
    features: ['Open World', 'Stealth Combat', 'Story Mode', 'Dynamic Weather'],
    tags: ['Samurai', 'Adventure', 'Story Rich', 'Single Player'],
    available: true,
    trending: true,
    featured: false,
    price: 69.99,
    discount: 5,
    currency: 'USD',
  },

  {
    name: 'Spiderman 2',
    slug: 'spiderman-2',
    image:
      'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1200&auto=format&fit=crop',
    banner:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1400&auto=format&fit=crop',
    genre: 'Superhero Action',
    category: 'Action',
    description:
      'Swing through New York City with breathtaking visuals, fast-paced combat, and cinematic superhero storytelling.',
    shortDescription: 'Action-packed superhero experience in NYC.',
    version: '2.0.0',
    publisher: 'Sony Interactive',
    multiplayer: false,
    releaseDate: new Date('2025-03-15'),
    rating: 4.9,
    features: ['Open World', 'Story Mode', 'Advanced Combat', '4K Graphics'],
    tags: ['Marvel', 'Superhero', 'Action', 'Story Rich'],
    available: true,
    trending: true,
    featured: true,
    price: 59.99,
    discount: 12,
    currency: 'USD',
  },
];
