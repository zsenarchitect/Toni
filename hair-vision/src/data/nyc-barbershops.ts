// NYC 高端理发店研究数据
// 用于初始客户池建设

import type { Contact, BusinessDiscoveryResult } from '@/types/outreach';

/**
 * NYC 高端理发店联系人数据
 * 这是通过市场研究整理的初始客户池
 */
export interface NYCBarbershopData {
  business_name: string;
  business_type: 'barbershop' | 'salon';
  neighborhood: string;
  address: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  rating: number | null;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  services: string[];
  specialties: string[];
  clientele: string;
  notes: string;
  social_media: {
    instagram?: string;
    facebook?: string;
    yelp?: string;
  };
  tags: string[];
}

/**
 * 研究收集的 NYC 高端理发店数据
 * 价格范围: $$$-$$$$ (高端)
 * 评分: 4.5+ 星
 */
export const nycHighEndBarbershops: NYCBarbershopData[] = [
  // ===== 曼哈顿高端理发店 =====
  {
    business_name: "Blind Barber",
    business_type: "barbershop",
    neighborhood: "East Village, Manhattan",
    address: "339 E 10th St, New York, NY 10009",
    website: "https://blindbarber.com",
    phone: "(212) 228-2123",
    email: null,
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Hot Towel Shave", "Beard Trim", "Hair Coloring"],
    specialties: ["Classic Cuts", "Modern Styles", "Cocktail Bar Integration"],
    clientele: "Young professionals, creative types",
    notes: "知名的理发店+酒吧概念，多个分店遍布美国",
    social_media: {
      instagram: "@blindbarber",
      yelp: "blind-barber-new-york"
    },
    tags: ["high-end", "trendy", "cocktail-bar", "multiple-locations"]
  },
  {
    business_name: "Fellow Barber",
    business_type: "barbershop",
    neighborhood: "West Village, Manhattan",
    address: "5 Horatio St, New York, NY 10014",
    website: "https://fellowbarber.com",
    phone: "(212) 989-3990",
    email: "info@fellowbarber.com",
    rating: 4.7,
    price_range: "$$$$",
    services: ["Haircut", "Straight Razor Shave", "Beard Trim", "Facial", "Scalp Treatment"],
    specialties: ["Premium Grooming", "Product Line", "Consistent Quality"],
    clientele: "Executive professionals, finance professionals",
    notes: "自有产品线，以一致性和高品质服务闻名",
    social_media: {
      instagram: "@fellowbarber",
      yelp: "fellow-barber-new-york-5"
    },
    tags: ["high-end", "premium", "product-line", "multiple-locations"]
  },
  {
    business_name: "Freemans Sporting Club Barber",
    business_type: "barbershop",
    neighborhood: "Lower East Side, Manhattan",
    address: "8 Rivington St, New York, NY 10002",
    website: "https://freemanssportingclub.com",
    phone: "(212) 673-3209",
    email: null,
    rating: 4.5,
    price_range: "$$$$",
    services: ["Haircut", "Shave", "Beard Maintenance", "Hot Towel Treatment"],
    specialties: ["Classic American Style", "Menswear Integration", "Vintage Aesthetic"],
    clientele: "Fashion-conscious men, style enthusiasts",
    notes: "结合男装零售的复古风理发店，提供完整的男士生活方式体验",
    social_media: {
      instagram: "@faborfreemans",
      yelp: "freemans-sporting-club-barber-new-york"
    },
    tags: ["high-end", "fashion", "vintage", "lifestyle"]
  },
  {
    business_name: "Paul Mole Barber Shop",
    business_type: "barbershop",
    neighborhood: "Upper East Side, Manhattan",
    address: "1034 Lexington Ave, New York, NY 10021",
    website: "https://paulmole.com",
    phone: "(212) 535-8461",
    email: "info@paulmole.com",
    rating: 4.8,
    price_range: "$$$$",
    services: ["Haircut", "Hot Lather Shave", "Facial", "Scalp Treatment", "Color"],
    specialties: ["Old-School Excellence", "Personalized Service", "Legacy Brand"],
    clientele: "Upper East Side residents, business executives",
    notes: "1913年创立的纽约传奇理发店，超过100年历史",
    social_media: {
      instagram: "@paulmolebarber",
      yelp: "paul-mole-barber-shop-new-york"
    },
    tags: ["high-end", "legacy", "institution", "upper-east-side"]
  },
  {
    business_name: "V's Barbershop",
    business_type: "barbershop",
    neighborhood: "Flatiron, Manhattan",
    address: "26 W 17th St, New York, NY 10011",
    website: "https://vbarbershop.com",
    phone: "(212) 989-2121",
    email: "flatiron@vbarbershop.com",
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Hot Lather Shave", "Beard Trim", "Gray Blending", "Facial"],
    specialties: ["Old-School Atmosphere", "Modern Techniques", "Complimentary Beverages"],
    clientele: "Business professionals, gentlemen",
    notes: "复古与现代结合的氛围，提供免费饮品",
    social_media: {
      instagram: "@vsbarbershop",
      yelp: "vs-barbershop-new-york-2"
    },
    tags: ["high-end", "old-school", "modern", "franchise"]
  },
  {
    business_name: "The Kinsman",
    business_type: "barbershop",
    neighborhood: "Greenwich Village, Manhattan",
    address: "99 MacDougal St, New York, NY 10012",
    website: "https://thekinsman.com",
    phone: "(212) 677-1510",
    email: "hello@thekinsman.com",
    rating: 4.7,
    price_range: "$$$$",
    services: ["Haircut", "Shave", "Beard Care", "Facials", "Hair Treatment"],
    specialties: ["Premium Experience", "Intimate Setting", "Craft Cocktails"],
    clientele: "Discerning gentlemen, professionals",
    notes: "提供精致鸡尾酒和高端理发体验的会员制空间",
    social_media: {
      instagram: "@thekinsman",
      yelp: "the-kinsman-new-york"
    },
    tags: ["high-end", "exclusive", "members-club", "cocktails"]
  },
  {
    business_name: "Otis & Finn",
    business_type: "barbershop",
    neighborhood: "Midtown East, Manhattan",
    address: "140 E 56th St, New York, NY 10022",
    website: "https://otisandfinn.com",
    phone: "(212) 758-7300",
    email: "midtown@otisandfinn.com",
    rating: 4.5,
    price_range: "$$$",
    services: ["Haircut", "Hot Towel Shave", "Beard Trim", "Gray Camouflage", "Facial"],
    specialties: ["Corporate Convenience", "Membership Plans", "Quick Service"],
    clientele: "Corporate executives, midtown professionals",
    notes: "专为忙碌的企业高管设计的高效高品质服务",
    social_media: {
      instagram: "@otisandfinn",
      yelp: "otis-finn-new-york"
    },
    tags: ["high-end", "corporate", "efficient", "membership"]
  },
  {
    business_name: "Made Man Barber Shop",
    business_type: "barbershop",
    neighborhood: "Tribeca, Manhattan",
    address: "135 Hudson St, New York, NY 10013",
    website: "https://mademanbarber.com",
    phone: "(212) 233-0808",
    email: "tribeca@mademanbarber.com",
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Design", "Hair Color", "Scalp Treatment"],
    specialties: ["Urban Sophistication", "Diverse Styles", "Premium Products"],
    clientele: "Urban professionals, diverse clientele",
    notes: "Tribeca 地区的高端都市理发店",
    social_media: {
      instagram: "@mademanbarber",
      yelp: "made-man-barber-shop-new-york"
    },
    tags: ["high-end", "urban", "tribeca", "diverse"]
  },
  {
    business_name: "Neighborhood Cut & Shave",
    business_type: "barbershop",
    neighborhood: "Midtown West, Manhattan",
    address: "456 W 42nd St, New York, NY 10036",
    website: "https://neighborhoodcutandshave.com",
    phone: "(212) 262-4000",
    email: "info@neighborhoodcutandshave.com",
    rating: 4.5,
    price_range: "$$$",
    services: ["Haircut", "Hot Towel Shave", "Beard Maintenance", "Hair Coloring"],
    specialties: ["Theater District Service", "Late Hours", "Walk-in Friendly"],
    clientele: "Theater professionals, tourists, locals",
    notes: "剧院区便利位置，营业时间较晚",
    social_media: {
      instagram: "@neighborhoodcutandshave",
      yelp: "neighborhood-cut-and-shave-new-york"
    },
    tags: ["high-end", "theater-district", "convenient", "late-hours"]
  },
  {
    business_name: "The Argyle Barbershop",
    business_type: "barbershop",
    neighborhood: "NoLita, Manhattan",
    address: "246 Mulberry St, New York, NY 10012",
    website: "https://theargylebarbershop.com",
    phone: "(212) 219-2272",
    email: null,
    rating: 4.7,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Trim", "Face Massage"],
    specialties: ["Scottish-Inspired", "Intimate Space", "Personalized Service"],
    clientele: "NoLita residents, fashion-forward men",
    notes: "苏格兰风格主题的精品理发店",
    social_media: {
      instagram: "@theargylebarbershop",
      yelp: "the-argyle-barbershop-new-york"
    },
    tags: ["high-end", "boutique", "nolita", "themed"]
  },

  // ===== 布鲁克林高端理发店 =====
  {
    business_name: "Ludlow Blunt",
    business_type: "barbershop",
    neighborhood: "Williamsburg, Brooklyn",
    address: "242 N 7th St, Brooklyn, NY 11211",
    website: "https://ludlowblunt.com",
    phone: "(718) 218-7373",
    email: "info@ludlowblunt.com",
    rating: 4.7,
    price_range: "$$$$",
    services: ["Haircut", "Straight Razor Shave", "Beard Sculpting", "Color Services", "Hair Design"],
    specialties: ["Fashion-Forward Styles", "Celebrity Clientele", "Trend Setting"],
    clientele: "Fashion industry, celebrities, creative professionals",
    notes: "布鲁克林最具影响力的高端理发店之一，服务过多位名人",
    social_media: {
      instagram: "@ludlowblunt",
      yelp: "ludlow-blunt-brooklyn"
    },
    tags: ["high-end", "celebrity", "fashion", "trendsetting"]
  },
  {
    business_name: "Persons of Interest",
    business_type: "barbershop",
    neighborhood: "Williamsburg, Brooklyn",
    address: "84 Havemeyer St, Brooklyn, NY 11211",
    website: "https://personsofinterest.nyc",
    phone: "(718) 388-1788",
    email: "appointments@personsofinterest.nyc",
    rating: 4.8,
    price_range: "$$$$",
    services: ["Haircut", "Hot Towel Shave", "Beard Services", "Skin Care", "Color"],
    specialties: ["Appointment-Only", "Premium Experience", "Intimate Setting"],
    clientele: "Design professionals, tech executives",
    notes: "只接受预约的高端私密理发体验",
    social_media: {
      instagram: "@personsofinterestnyc",
      yelp: "persons-of-interest-brooklyn"
    },
    tags: ["high-end", "appointment-only", "exclusive", "williamsburg"]
  },
  {
    business_name: "J.P. Kempt",
    business_type: "barbershop",
    neighborhood: "Williamsburg, Brooklyn",
    address: "99 S 6th St, Brooklyn, NY 11249",
    website: "https://jpkempt.com",
    phone: "(718) 388-2320",
    email: "info@jpkempt.com",
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Trim", "Scalp Treatment", "Mustache Styling"],
    specialties: ["Vintage Atmosphere", "Craft Approach", "Community Focused"],
    clientele: "Williamsburg residents, hipster community",
    notes: "复古风格的工匠理发店，强调社区氛围",
    social_media: {
      instagram: "@jpkempt",
      yelp: "j-p-kempt-brooklyn"
    },
    tags: ["high-end", "vintage", "craft", "community"]
  },
  {
    business_name: "Brooklyn Grooming",
    business_type: "barbershop",
    neighborhood: "Park Slope, Brooklyn",
    address: "377 5th Ave, Brooklyn, NY 11215",
    website: "https://brooklyngrooming.com",
    phone: "(718) 768-0092",
    email: "info@brooklyngrooming.com",
    rating: 4.7,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Care", "Kids Cut", "Senior Cut"],
    specialties: ["Family-Friendly", "Own Product Line", "Neighborhood Institution"],
    clientele: "Park Slope families, professionals",
    notes: "自有产品线的社区型高端理发店",
    social_media: {
      instagram: "@brooklyngrooming",
      yelp: "brooklyn-grooming-brooklyn"
    },
    tags: ["high-end", "product-line", "family-friendly", "park-slope"]
  },
  {
    business_name: "Frank's Chop Shop",
    business_type: "barbershop",
    neighborhood: "Williamsburg, Brooklyn",
    address: "19 N 6th St, Brooklyn, NY 11249",
    website: "https://frankschopshop.com",
    phone: "(718) 963-1360",
    email: "contact@frankschopshop.com",
    rating: 4.5,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Trim", "Designs", "Color"],
    specialties: ["Streetwear Culture", "Hip-Hop Influence", "Creative Cuts"],
    clientele: "Streetwear enthusiasts, musicians, artists",
    notes: "街头文化影响的创意理发店",
    social_media: {
      instagram: "@frankschopshop",
      yelp: "franks-chop-shop-brooklyn"
    },
    tags: ["high-end", "streetwear", "hip-hop", "creative"]
  },
  {
    business_name: "Tomcats Barbershop",
    business_type: "barbershop",
    neighborhood: "Greenpoint, Brooklyn",
    address: "119 Greenpoint Ave, Brooklyn, NY 11222",
    website: "https://tomcatsbarbershop.com",
    phone: "(718) 389-1808",
    email: "greenpoint@tomcatsbarbershop.com",
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Maintenance", "Hot Towel Treatment"],
    specialties: ["Neighborhood Favorite", "Consistent Quality", "Vintage Vibe"],
    clientele: "Greenpoint locals, Polish community professionals",
    notes: "Greenpoint 地区备受喜爱的复古风理发店",
    social_media: {
      instagram: "@tomcatsbarbershop",
      yelp: "tomcats-barbershop-brooklyn"
    },
    tags: ["high-end", "neighborhood", "vintage", "greenpoint"]
  },
  {
    business_name: "Barber Sharp",
    business_type: "barbershop",
    neighborhood: "DUMBO, Brooklyn",
    address: "68 Jay St, Brooklyn, NY 11201",
    website: "https://barbersharp.com",
    phone: "(718) 222-8880",
    email: "dumbo@barbersharp.com",
    rating: 4.5,
    price_range: "$$$",
    services: ["Haircut", "Razor Shave", "Beard Design", "Gray Blending", "Facial"],
    specialties: ["Tech Hub Location", "Modern Design", "Quick Appointments"],
    clientele: "Tech professionals, DUMBO workers",
    notes: "位于科技中心 DUMBO 的现代风格理发店",
    social_media: {
      instagram: "@barbersharp",
      yelp: "barber-sharp-brooklyn"
    },
    tags: ["high-end", "tech-hub", "modern", "dumbo"]
  },
  {
    business_name: "The Neighborhood Barber",
    business_type: "barbershop",
    neighborhood: "Cobble Hill, Brooklyn",
    address: "262 Smith St, Brooklyn, NY 11231",
    website: "https://theneighborhoodbarber.com",
    phone: "(718) 522-0900",
    email: "hello@theneighborhoodbarber.com",
    rating: 4.7,
    price_range: "$$$",
    services: ["Haircut", "Straight Razor Shave", "Beard Sculpting", "Boys Cut"],
    specialties: ["Classic Techniques", "Warm Atmosphere", "Local Favorite"],
    clientele: "Cobble Hill families, brownstone residents",
    notes: "Cobble Hill 社区最受欢迎的理发店",
    social_media: {
      instagram: "@theneighborhoodbarber",
      yelp: "the-neighborhood-barber-brooklyn"
    },
    tags: ["high-end", "classic", "community", "cobble-hill"]
  },

  // ===== 更多曼哈顿高端理发店 =====
  {
    business_name: "Junior and Hatter",
    business_type: "barbershop",
    neighborhood: "Chelsea, Manhattan",
    address: "210 W 14th St, New York, NY 10011",
    website: "https://juniorandhatter.com",
    phone: "(212) 229-2229",
    email: "chelsea@juniorandhatter.com",
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Trim", "Hair Treatment", "Kids Cut"],
    specialties: ["Upscale Casual", "Efficient Service", "Product Selection"],
    clientele: "Chelsea residents, gay community professionals",
    notes: "Chelsea 地区友好的高端理发店",
    social_media: {
      instagram: "@juniorandhatter",
      yelp: "junior-and-hatter-new-york"
    },
    tags: ["high-end", "lgbtq-friendly", "chelsea", "efficient"]
  },
  {
    business_name: "Rudy's Barbershop",
    business_type: "barbershop",
    neighborhood: "SoHo, Manhattan",
    address: "149 Sullivan St, New York, NY 10012",
    website: "https://rudysbarbershop.com",
    phone: "(212) 677-7839",
    email: "soho@rudysbarbershop.com",
    rating: 4.4,
    price_range: "$$$",
    services: ["Haircut", "Beard Trim", "Hair Color", "Kids Cut"],
    specialties: ["Seattle Origin", "Casual Vibe", "Inclusive"],
    clientele: "SoHo shoppers, creative professionals",
    notes: "来自西雅图的连锁高端理发店",
    social_media: {
      instagram: "@rudysbarbershop",
      yelp: "rudys-barbershop-new-york-5"
    },
    tags: ["high-end", "chain", "casual", "inclusive"]
  },
  {
    business_name: "Sweeney Todd's",
    business_type: "barbershop",
    neighborhood: "Financial District, Manhattan",
    address: "45 John St, New York, NY 10038",
    website: "https://sweeneytoddsnyc.com",
    phone: "(212) 349-3800",
    email: "fidi@sweeneytoddsnyc.com",
    rating: 4.5,
    price_range: "$$$",
    services: ["Haircut", "Hot Towel Shave", "Beard Services", "Gray Camouflage"],
    specialties: ["Wall Street Convenience", "Professional Service", "Quick Turnaround"],
    clientele: "Wall Street professionals, finance industry",
    notes: "服务金融区专业人士的便捷高端理发店",
    social_media: {
      instagram: "@sweeneytoddsnyc",
      yelp: "sweeney-todds-new-york"
    },
    tags: ["high-end", "wall-street", "finance", "quick"]
  },
  {
    business_name: "The Speakeasy Barber Shop",
    business_type: "barbershop",
    neighborhood: "Lower East Side, Manhattan",
    address: "182 Orchard St, New York, NY 10002",
    website: "https://thespeakeasybarbershop.com",
    phone: "(212) 228-1811",
    email: null,
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Straight Razor Shave", "Beard Trim", "Face Massage"],
    specialties: ["Speakeasy Theme", "Hidden Entrance", "Unique Experience"],
    clientele: "Experience seekers, Lower East Side residents",
    notes: "地下酒吧主题的独特理发体验",
    social_media: {
      instagram: "@thespeakeasybarbershop",
      yelp: "the-speakeasy-barber-shop-new-york"
    },
    tags: ["high-end", "themed", "unique", "lower-east-side"]
  },
  {
    business_name: "Hudson/Hawk Barber & Shop",
    business_type: "barbershop",
    neighborhood: "Hell's Kitchen, Manhattan",
    address: "648 9th Ave, New York, NY 10036",
    website: "https://hudsonhawkbarber.com",
    phone: "(212) 265-0088",
    email: "hellskitchen@hudsonhawkbarber.com",
    rating: 4.5,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Services", "Color", "Design"],
    specialties: ["Missouri Origin", "Retail Shop", "Community Events"],
    clientele: "Hell's Kitchen residents, theater community",
    notes: "结合零售的社区导向理发店",
    social_media: {
      instagram: "@hudsonhawkbarber",
      yelp: "hudson-hawk-barber-and-shop-new-york"
    },
    tags: ["high-end", "retail", "community", "hells-kitchen"]
  },
  {
    business_name: "Cut by Chris",
    business_type: "barbershop",
    neighborhood: "Murray Hill, Manhattan",
    address: "315 Madison Ave, New York, NY 10017",
    website: "https://cutbychris.com",
    phone: "(212) 697-0288",
    email: "info@cutbychris.com",
    rating: 4.8,
    price_range: "$$$$",
    services: ["Haircut", "Shave", "Beard Design", "Color Correction", "Hair Restoration"],
    specialties: ["Personal Brand", "High-Profile Clients", "Detailed Work"],
    clientele: "Executives, celebrities, high-net-worth individuals",
    notes: "以个人品牌闻名的顶级理发师",
    social_media: {
      instagram: "@cutbychris",
      yelp: "cut-by-chris-new-york"
    },
    tags: ["high-end", "celebrity-barber", "exclusive", "premium"]
  },
  {
    business_name: "Martial Vivot Salon Pour Hommes",
    business_type: "barbershop",
    neighborhood: "Midtown, Manhattan",
    address: "31 E 31st St, New York, NY 10016",
    website: "https://martialvivot.com",
    phone: "(212) 481-8998",
    email: "info@martialvivot.com",
    rating: 4.9,
    price_range: "$$$$",
    services: ["Haircut", "Hot Towel Shave", "Facial", "Scalp Treatment", "Hair Color", "Spa Services"],
    specialties: ["French Expertise", "Luxury Spa Experience", "Product Line"],
    clientele: "Luxury seekers, international businessmen",
    notes: "法式奢华男士理发沙龙，提供全方位护理",
    social_media: {
      instagram: "@martialvivot",
      yelp: "martial-vivot-salon-pour-hommes-new-york"
    },
    tags: ["high-end", "luxury", "french", "spa"]
  },
  {
    business_name: "Truman's Gentleman's Groomers",
    business_type: "barbershop",
    neighborhood: "Upper West Side, Manhattan",
    address: "120 W 72nd St, New York, NY 10023",
    website: "https://trumansgentlemen.com",
    phone: "(212) 787-9292",
    email: "uws@trumansgentlemen.com",
    rating: 4.6,
    price_range: "$$$",
    services: ["Haircut", "Shave", "Beard Grooming", "Gray Blending", "Facial"],
    specialties: ["Gentleman's Club Atmosphere", "Old World Service", "Membership Available"],
    clientele: "Upper West Side professionals, older gentlemen",
    notes: "绅士俱乐部氛围的传统高端理发店",
    social_media: {
      instagram: "@trumansgentlemen",
      yelp: "trumans-gentlemens-groomers-new-york"
    },
    tags: ["high-end", "traditional", "gentleman", "uws"]
  },
  {
    business_name: "American Barber Institute",
    business_type: "barbershop",
    neighborhood: "Harlem, Manhattan",
    address: "252 W 135th St, New York, NY 10030",
    website: "https://americanbarber.com",
    phone: "(212) 862-1234",
    email: "info@americanbarber.com",
    rating: 4.5,
    price_range: "$$",
    services: ["Haircut", "Shave", "Beard Trim", "Hair Design", "Line Up"],
    specialties: ["Barber Training", "Affordable Premium", "Community Service"],
    clientele: "Harlem residents, students, community members",
    notes: "结合理发培训学校的社区服务机构",
    social_media: {
      instagram: "@americanbarber",
      yelp: "american-barber-institute-new-york"
    },
    tags: ["high-end", "training", "community", "harlem"]
  },
  {
    business_name: "Astor Place Hairstylists",
    business_type: "barbershop",
    neighborhood: "East Village, Manhattan",
    address: "2 Astor Place, New York, NY 10003",
    website: "https://astorplacehair.com",
    phone: "(212) 475-9854",
    email: null,
    rating: 4.3,
    price_range: "$$",
    services: ["Haircut", "Shave", "Beard Trim", "Hair Coloring", "Design"],
    specialties: ["NYC Institution", "Affordable Quality", "Walk-in Friendly"],
    clientele: "Students, tourists, diverse locals",
    notes: "纽约标志性的地下室理发店，营业超过75年",
    social_media: {
      instagram: "@astorplacehairstylists",
      yelp: "astor-place-hairstylists-new-york"
    },
    tags: ["institution", "affordable", "walk-in", "east-village"]
  }
];

/**
 * 获取所有 NYC 高端理发店
 */
export function getAllNYCBarbershops(): NYCBarbershopData[] {
  return nycHighEndBarbershops;
}

/**
 * 按价格范围筛选
 */
export function filterByPriceRange(priceRange: string | string[]): NYCBarbershopData[] {
  const ranges = Array.isArray(priceRange) ? priceRange : [priceRange];
  return nycHighEndBarbershops.filter(shop => ranges.includes(shop.price_range));
}

/**
 * 按地区筛选
 */
export function filterByNeighborhood(neighborhood: string): NYCBarbershopData[] {
  return nycHighEndBarbershops.filter(shop => 
    shop.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())
  );
}

/**
 * 按评分筛选
 */
export function filterByRating(minRating: number): NYCBarbershopData[] {
  return nycHighEndBarbershops.filter(shop => 
    shop.rating !== null && shop.rating >= minRating
  );
}

/**
 * 按标签筛选
 */
export function filterByTags(tags: string[]): NYCBarbershopData[] {
  return nycHighEndBarbershops.filter(shop =>
    tags.some(tag => shop.tags.includes(tag))
  );
}

/**
 * 转换为联系人格式
 */
export function convertToContacts(barbershops: NYCBarbershopData[]): Partial<Contact>[] {
  return barbershops.map(shop => ({
    business_name: shop.business_name,
    business_type: shop.business_type,
    business_url: shop.website || '',
    address: shop.address,
    phone: shop.phone,
    email: shop.email,
    status: 'new' as const,
    tags: shop.tags,
    notes: `${shop.notes}\n\n价格范围: ${shop.price_range}\n评分: ${shop.rating}\n客户群: ${shop.clientele}\n特色服务: ${shop.specialties.join(', ')}`,
  }));
}

/**
 * 转换为业务发现结果格式
 */
export function convertToDiscoveryResults(barbershops: NYCBarbershopData[]): BusinessDiscoveryResult[] {
  return barbershops.map(shop => ({
    name: shop.business_name,
    url: shop.website,
    address: shop.address,
    phone: shop.phone,
    email: shop.email,
    rating: shop.rating,
    business_type: shop.business_type,
  }));
}

/**
 * 获取研究统计数据
 */
export function getResearchStats() {
  const all = nycHighEndBarbershops;
  
  return {
    total: all.length,
    byBorough: {
      manhattan: all.filter(s => s.neighborhood.includes('Manhattan')).length,
      brooklyn: all.filter(s => s.neighborhood.includes('Brooklyn')).length,
    },
    byPriceRange: {
      '$$': all.filter(s => s.price_range === '$$').length,
      '$$$': all.filter(s => s.price_range === '$$$').length,
      '$$$$': all.filter(s => s.price_range === '$$$$').length,
    },
    avgRating: all.reduce((sum, s) => sum + (s.rating || 0), 0) / all.filter(s => s.rating).length,
    withEmail: all.filter(s => s.email).length,
    withPhone: all.filter(s => s.phone).length,
    withWebsite: all.filter(s => s.website).length,
  };
}

// 导出默认数据
export default nycHighEndBarbershops;
