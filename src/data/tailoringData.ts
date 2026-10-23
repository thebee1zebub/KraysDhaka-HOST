export interface Product {
  id: string;
  name: string;
  collection: 'Essential' | 'Signature' | 'Bespoke';
  category: 'Suit' | 'Double-Breasted' | 'Formalwear' | 'Separates';
  startingPrice: number | null; // null if consultation quotation only
  priceNote?: string;
  shortDescription: string;
  description: string;
  silhouette: string;
  fabricDetails: string;
  lapelStyle: string;
  construction: string;
  vents: string;
  buttons: string;
  image: string;
  galleryImages: string[];
  features: string[];
}

export interface BrandConfig {
  name: string;
  tagline: string;
  location: string;
  city: string;
  country: string;
  whatsappNumber: string; // international format without +
  displayPhone: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  consultationHours: string;
  addressNote: string;
}

export const BRAND_CONFIG: BrandConfig = {
  name: 'KRAYS DHAKA',
  tagline: 'Creating Icons, Not Suits.',
  location: '37, Avenue-1, Mirpur-10, Dhaka, Bangladesh',
  city: 'Dhaka',
  country: 'Bangladesh',
  whatsappNumber: '8801700000000', // Central placeholder configured for instant WhatsApp redirect
  displayPhone: '+880 1700-000000',
  email: 'atelier@kraysdhaka.com',
  instagramHandle: '@kraysdhaka',
  instagramUrl: 'https://instagram.com/kraysdhaka',
  consultationHours: 'Saturday – Thursday: By Private Appointment',
  addressNote: '37, Avenue-1, Mirpur-10, Dhaka. Private atelier fittings by prior appointment.',
};

// Verified generated imagery paths
export const IMAGES = {
  hero: '/src/assets/images/hero_bespoke_suit_1792678536872.jpg',
  craft: '/src/assets/images/tailor_craft_hands_1792678538745.jpg',
  essential: '/src/assets/images/collection_essential_1792678538242.jpg',
  signature: '/src/assets/images/collection_signature_1792678539721.jpg',
  fitting: '/src/assets/images/lookbook_atelier_fitting_1792678539475.jpg',
};

export const PRODUCTS: Product[] = [
  {
    id: 'grey-flannel-suit',
    name: 'Grey Flannel Suit',
    collection: 'Essential',
    category: 'Suit',
    startingPrice: 6000,
    priceNote: 'Starting price for Essential tailoring. Final quotation reflects selected cloth mill and customisation.',
    shortDescription: 'Subtle melange grey wool flannel with a soft natural shoulder and timeless two-button silhouette.',
    description: 'Constructed from premium mid-weight wool flannel with an understated brushed surface. Designed with a clean single-breasted two-button stance, gentle waist suppression, and natural shoulder pads for balanced proportions that transition effortlessly from business boardroom to evening reception.',
    silhouette: 'Single-breasted, 2-button front, regular tapered drape',
    fabricDetails: 'Pure wool flannel, 310g/m, matte brushed texture',
    lapelStyle: 'Classic notch lapel (8.5 cm width)',
    construction: 'Half-canvas structure with natural horsehair chest piece',
    vents: 'Dual side vents',
    buttons: 'Genuine dark horn buttons, hand-shanked',
    image: IMAGES.essential,
    galleryImages: [IMAGES.essential, IMAGES.craft, IMAGES.hero],
    features: [
      'Hand-finished interior lining with interior cigar and pen pockets',
      'Flat-front trousers with concealed waistband adjusters',
      'Breathable Bemberg cupro interior lining',
      'Hand-tacked stress points at pockets and vents'
    ]
  },
  {
    id: 'tropical-beige-suit',
    name: 'Tropical Beige Suit',
    collection: 'Essential',
    category: 'Suit',
    startingPrice: 6000,
    priceNote: 'Starting price for Essential tailoring. Made-to-measure according to individual posture.',
    shortDescription: 'Refined open-weave summer wool-linen blend engineered specifically for the South Asian climate.',
    description: 'A light-toned sartorial essential tailored to withstand high humidity with grace. Cut with a relaxed yet crisp drape, providing thermal comfort through open-weave Italian hopsack wool and flax linen without sacrificing structured elegance.',
    silhouette: 'Single-breasted 2-button, lightly structured shoulder',
    fabricDetails: '55% High-twist wool, 45% natural linen, breathable open weave',
    lapelStyle: 'Notch lapel with subtle AMF edge pick stitching',
    construction: 'Lightweight half-canvas with unlined back for maximum aeration',
    vents: 'Dual side vents',
    buttons: 'Natural blonde corozo nut buttons',
    image: IMAGES.hero,
    galleryImages: [IMAGES.hero, IMAGES.craft, IMAGES.fitting],
    features: [
      'Quarter-lined jacket back for tropical heat circulation',
      'Slanted flap pockets with ticket pocket option',
      'Trousers with extended waistband tab closure',
      'Reinforced crotch lining and heel guard tape'
    ]
  },
  {
    id: 'navy-double-breasted-suit',
    name: 'Navy Double-Breasted Suit',
    collection: 'Signature',
    category: 'Double-Breasted',
    startingPrice: 8500,
    priceNote: 'Starting price for Signature tailoring. Incorporates full custom silhouette and hand-finishing.',
    shortDescription: 'Commanding six-on-two button stance with sweeping peak lapels in deep midnight navy serge.',
    description: 'An authoritative silhouette cut with classical proportions. The sweeping bellied peak lapels frame the chest while the roped shoulder construction lends architectural presence. Crafted from crease-resisting 4-ply English navy wool serge.',
    silhouette: 'Double-breasted 6x2 button stance, roped shoulder line',
    fabricDetails: '100% Super 120s virgin wool serge, 290g/m, year-round weight',
    lapelStyle: 'Dramatic peak lapel (10 cm width) with milanese buttonhole option',
    construction: 'Structured floating canvas with hand-padded chest',
    vents: 'Deep dual side vents (24 cm)',
    buttons: 'Polished smoked mother-of-pearl or dark matte horn',
    image: IMAGES.signature,
    galleryImages: [IMAGES.signature, IMAGES.fitting, IMAGES.hero],
    features: [
      'Hand-rolled lapel roll ensuring dimensional depth',
      'Side waist adjusters on trousers with buckle closures',
      'Functional 4-button working surgeon cuffs',
      'Generous turn-up cuff hem (4.5 cm) on trousers'
    ]
  },
  {
    id: 'grey-double-breasted-suit',
    name: 'Grey Double-Breasted Suit',
    collection: 'Signature',
    category: 'Double-Breasted',
    startingPrice: 8500,
    priceNote: 'Starting price for Signature tailoring.',
    shortDescription: 'Medium charcoal sharkskin weave offering dimensional micro-texture and sharp angular lapels.',
    description: 'Constructed for gentlemen who appreciate clean geometry and tailored discipline. The sharkskin wool catches directional light subtly, showcasing the precision of the tailored waist suppression and tailored sleeve pitch.',
    silhouette: 'Double-breasted 6x2 or 4x2 button configuration, structured chest',
    fabricDetails: '100% Worsted wool sharkskin weave, 280g/m',
    lapelStyle: 'Extended peak lapel with hand-sewn boutonnière loop',
    construction: 'Signature canvas chest with floating felt undercollar',
    vents: 'Side vents',
    buttons: 'Solid charcoal horn buttons',
    image: IMAGES.signature,
    galleryImages: [IMAGES.signature, IMAGES.craft],
    features: [
      'Tailored sleeve pitch adjusted to your natural arm hang',
      'Barchetta-shaped curved breast pocket',
      'Hand-stitched interior seams and pick stitching along edge',
      'Side tab trouser waist with internal shirt-gripping waistband'
    ]
  },
  {
    id: 'classic-chocolate-brown-suit',
    name: 'Classic Chocolate Brown Suit',
    collection: 'Essential',
    category: 'Suit',
    startingPrice: 6000,
    priceNote: 'Starting price for Essential tailoring.',
    shortDescription: 'Rich espresso tone in twill wool, providing a sophisticated alternative to traditional navy and grey.',
    description: 'A warm, understated hue that speaks to refined discernment. The chocolate twill reflects subtle tones of cocoa and earth, offering unparalleled versatility when paired with pale blue, cream, or crisp white shirts.',
    silhouette: 'Single-breasted 2-button, softly roped shoulder',
    fabricDetails: '100% Pure wool twill, 275g/m',
    lapelStyle: 'Medium notch lapel (8.5 cm)',
    construction: 'Half-canvas with soft chest felt',
    vents: 'Dual side vents',
    buttons: 'Mottled dark brown buffalo horn',
    image: IMAGES.essential,
    galleryImages: [IMAGES.essential, IMAGES.craft],
    features: [
      'Natural drape cut with moderate suppression',
      'Slanted flap pockets',
      'Double pleat or flat-front trouser options',
      'Signature contrast interior piping'
    ]
  },
  {
    id: 'navy-pinstripe-suit',
    name: 'Navy Pinstripe Suit',
    collection: 'Signature',
    category: 'Suit',
    startingPrice: 8500,
    priceNote: 'Starting price for Signature tailoring.',
    shortDescription: 'Subtle chalk stripe running through dark navy wool, tailored for high-stakes executive presence.',
    description: 'A quintessential power suit reimagined through contemporary proportions. The subtle chalk stripe is meticulously matched across the shoulder seams, pocket flaps, and lapel gorges, demonstrating high-precision pattern drafting.',
    silhouette: 'Single-breasted 2-button or 3-roll-2 stance, clean architectural shoulder',
    fabricDetails: 'Super 130s English wool chalk stripe, 300g/m',
    lapelStyle: 'Refined notch or peak lapel with pick-stitched perimeter',
    construction: 'Full canvas internal construction for lifelong contouring',
    vents: 'Dual vents',
    buttons: 'Engraved dark horn buttons',
    image: IMAGES.signature,
    galleryImages: [IMAGES.signature, IMAGES.hero, IMAGES.craft],
    features: [
      'Exact stripe alignment across lapel and collar notch',
      'Full floating horsehair canvas body',
      'Surgeon cuffs with functioning buttonholes',
      'High-waisted trousers with double forward pleats'
    ]
  },
  {
    id: 'charcoal-pinstripe-suit',
    name: 'Charcoal Pinstripe Suit',
    collection: 'Signature',
    category: 'Suit',
    startingPrice: 8500,
    priceNote: 'Starting price for Signature tailoring.',
    shortDescription: 'Slate charcoal ground with fine rope stripe, offering discreet distinction and elongated posture.',
    description: 'The verticality of the micro-stripe elongates the torso while the tailored waist creates an athletic V-taper. Cut to your bespoke measurements to guarantee zero pulling at the chest button.',
    silhouette: 'Single-breasted 2-button stance, structured chest',
    fabricDetails: 'Worsted wool with fine rope stripe, 285g/m',
    lapelStyle: 'Steep notch lapel with 7.5 cm gorge height',
    construction: 'Signature canvas chest with hand-padded canvas',
    vents: 'Side vents',
    buttons: 'Charcoal horn buttons',
    image: IMAGES.hero,
    galleryImages: [IMAGES.hero, IMAGES.signature],
    features: [
      'Hand-stitched armhole linings for frictionless movement',
      'Slanted jet pockets with ticket pocket option',
      'Side waist adjusters with solid brass sliders',
      'Hand-finished hem with protective kick tape'
    ]
  },
  {
    id: 'plaid-navy-suit',
    name: 'Plaid Navy Suit',
    collection: 'Signature',
    category: 'Suit',
    startingPrice: 8500,
    priceNote: 'Starting price for Signature tailoring.',
    shortDescription: 'Tonal glen check overcheck on rich navy, delivering texture and depth that reveals itself on close inspection.',
    description: 'For the gentleman desiring visual intrigue without overt flamboyance. The tonal windowpane overcheck sits gracefully within the navy field, balancing personality with sartorial respectability.',
    silhouette: 'Single-breasted 2-button, Neapolitan spalla camicia or roped shoulder',
    fabricDetails: '100% Super 110s wool glen plaid, 290g/m',
    lapelStyle: 'Notch lapel with generous belly and clean collar line',
    construction: 'Lightweight canvas for effortless drape',
    vents: 'Dual side vents',
    buttons: 'Matte dark horn buttons',
    image: IMAGES.signature,
    galleryImages: [IMAGES.signature, IMAGES.craft, IMAGES.fitting],
    features: [
      'Flawless windowpane matching across chest, sleeves, and pockets',
      'Curved welt chest pocket (barchetta)',
      'Side tabs and buttoned rear jetted pockets on trousers',
      'Bespoke monogram embroidery on interior facing'
    ]
  },
  {
    id: 'bespoke-full-canvas-garment',
    name: 'Hand-Cut Bespoke Suit',
    collection: 'Bespoke',
    category: 'Suit',
    startingPrice: null, // Consultation quotation
    priceNote: 'Individual quotation upon fabric selection, personal pattern draft, and fitting schedule.',
    shortDescription: 'Drafted from an individual paper pattern created exclusively for your body shape and posture.',
    description: 'The pinnacle of sartorial art at KRAYS DHAKA. No pre-existing block is used. Our master tailor takes more than 30 anatomical measurements, assessing your shoulder slope, spine curvature, and stance. Cut entirely by hand and built with a full floating horsehair canvas that molds to your physique over years of wear.',
    silhouette: 'Completely customized silhouette (Savile Row structured, Neapolitan soft, or contemporary architectural)',
    fabricDetails: 'Finest hand-selected wools, cashmeres, and silks from renowned international mills',
    lapelStyle: 'Fully custom width, gorge, and curvature shaped to your chest dimensions',
    construction: '100% Full floating horsehair canvas, hand-padded lapels and collar',
    vents: 'Custom specification (dual side vents, single center, or ventless)',
    buttons: 'Custom selection of horn, bone, corozo, or covered silk',
    image: IMAGES.craft,
    galleryImages: [IMAGES.craft, IMAGES.fitting, IMAGES.hero],
    features: [
      'Individual paper pattern drafted and retained for all future commissions',
      'Multiple interim basted fittings (toile / muslin test if required)',
      'Hand-sewn milanese lapel buttonhole',
      'Hand-set sleeves with individual balance adjustments',
      'Silk thread hand-stitching throughout all visible perimeters'
    ]
  }
];

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'CONSULTATION',
    subtitle: 'The Initial Dialogue',
    description: 'Every commission begins with a private conversation. We discuss the intended occasions, your style preferences, climate considerations, and silhouette aspirations. You are welcome to share visual references or explore our archive.',
    details: [
      'Style exploration and occasion profiling',
      'Silhouette consultation (single vs. double breasted, shoulder softness)',
      'Service recommendation: Essential, Signature, or Bespoke',
      'Transparent initial pricing and timing estimation'
    ]
  },
  {
    number: '02',
    title: 'FABRIC & DESIGN',
    subtitle: 'The Material Foundation',
    description: 'We guide you through curated swatch bunches spanning fine wools, seasonal flannels, tropical blends, and luxurious linens. Every detail is selected—from lapel width and pocket angles to horn buttons and interior linings.',
    details: [
      'Hands-on fabric drape, weight, and texture evaluation',
      'Lapel architecture (notch, peak, or shawl) and gorge height',
      'Lining choice: full, half, or unlined for tropical breathability',
      'Button selection: genuine horn, corozo, or mother-of-pearl'
    ]
  },
  {
    number: '03',
    title: 'MEASUREMENTS & FIT',
    subtitle: 'Anatomical Precision',
    description: 'We take comprehensive anatomical measurements, noting shoulder slope, posture, neck inclination, and natural arm hang. For bespoke orders, a personal 2D pattern is drafted by hand.',
    details: [
      'Over 25 precise physiological measurement points',
      'Stance, arm pitch, and shoulder drop observation',
      'Trouser rise, break preference, and waist closure configuration',
      'Preparation for interim basted fitting where applicable'
    ]
  },
  {
    number: '04',
    title: 'FINAL FIT & COMPLETION',
    subtitle: 'Refinement & Delivery',
    description: 'Once the garment is constructed, you attend a final fitting at our Dhaka salon. Minor nuances are calibrated to ensure the garment moves with effortless grace before it is pressed and handed over.',
    details: [
      'Comprehensive mirror assessment under natural light',
      'Sleeve cuff length, collar cling, and trouser break inspection',
      'Final hand-pressing and garment grooming',
      'Garment bag, bespoke wooden hanger, and care guidance provided'
    ]
  }
];

export const CRAFT_DETAILS = [
  {
    title: 'Fabric & Texture',
    summary: 'Sourced for longevity, breathability, and natural drape.',
    description: 'We prioritize natural fibers—pure virgin wool, breathable hopsacks, Irish linens, and silk-wool blends. In Dhaka’s climate, fabric weight and weave breathability are paramount to all-day elegance.'
  },
  {
    title: 'Lapel Architecture',
    summary: 'The visual anchor of every tailored jacket.',
    description: 'Whether a generous 9.5 cm peak lapel with classic belly or a clean 8 cm notch with high gorge, each lapel is hand-rolled with internal canvas to prevent stiffness and ensure timeless dimension.'
  },
  {
    title: 'Floating Canvas Structure',
    summary: 'The internal foundation that breathes and molds.',
    description: 'Unlike mass-market fused suits that bubble and stiffen, our garments incorporate genuine canvas chest pieces. Over time, heat and wear mold the canvas directly to your torso contours.'
  },
  {
    title: 'Hand-Finishing & Horn',
    summary: 'Details appreciated by the discerning eye.',
    description: 'Hand-shanked natural horn buttons allow the button to pivot smoothly without pulling fabric. Hand-finished buttonholes and subtle pick stitching showcase authentic tailoring artistry.'
  },
  {
    title: 'Trouser Tailoring',
    summary: 'Balance, rise, and clean trouser breaks.',
    description: 'Tailored trousers should hang cleanly from the hips without pulling. We offer clean waistband side-adjusters, tailored curtain waistbands with rubber grip strips, and custom cuffs.'
  },
  {
    title: 'Individual Proportions',
    summary: 'Designed for your posture, not a mannequin.',
    description: 'Every human body is asymmetrical—one shoulder slightly lower, a gentle spinal curve, or a distinctive stride. Our patterns harmonize these nuances into an upright, flattering silhouette.'
  }
];

export const LOOKBOOK_THEMES = [
  {
    title: 'Contemporary Executive',
    context: 'Understated single-breasted flannels and fine worsteds tailored for quiet leadership.',
    image: IMAGES.essential
  },
  {
    title: 'Double-Breasted Distinction',
    context: 'Architectural peak lapels and sweeping button stances that project poise.',
    image: IMAGES.signature
  },
  {
    title: 'The Atelier Fitting',
    context: 'A private environment dedicated to precision, dialogue, and personal fit.',
    image: IMAGES.fitting
  },
  {
    title: 'The Bespoke Craft',
    context: 'Hand-stitched canvas, artisan shears, and the discipline of classical menswear.',
    image: IMAGES.craft
  }
];

export const FAQS = [
  {
    question: 'What is the difference between bespoke and made-to-measure tailoring?',
    answer: 'At KRAYS DHAKA, Made-to-Measure (our Essential and Signature collections) utilizes established house silhouettes adjusted in pattern dimensions, sleeve lengths, waist drops, and posture corrections to your measurements. Bespoke is created completely from scratch without a standard block: an individual 2D paper pattern is hand-drafted exclusively for your anatomy, followed by multiple basted fitting stages and extensive hand-finishing.'
  },
  {
    question: 'Which collection should I choose?',
    answer: 'If you are looking for dependable, versatile wardrobe foundations with clean lines at accessible starting pricing, our Essential Collection (from ৳6,000) is the ideal starting point. If you desire stronger sartorial silhouettes—such as double-breasted suits, peak lapels, pinstripes, or expressive cloths—our Signature Collection (from ৳8,500) provides distinct character. For unique commissions requiring bespoke pattern creation, choose Bespoke.'
  },
  {
    question: 'Can I bring a reference photograph or specific style idea?',
    answer: 'Yes, absolutely. Many of our clients arrive with reference images, vintage menswear cuts, or wedding moodboards. During the initial consultation, we review your references and determine how to translate that aesthetic to flatter your unique height, shoulder structure, and skin tone.'
  },
  {
    question: 'How do I choose the right fabric for Dhaka’s climate?',
    answer: 'We provide dedicated consultation on fabric weight and weave. For Dhaka’s warmer and humid months, we recommend high-twist tropical wools (220–260g/m), open-weave hopsacks, and wool-linen blends that allow airflow. For winter evenings and formal galas, mid-weight flannels (290–330g/m) and wool serges provide warmth and crisp structure.'
  },
  {
    question: 'How long does the tailoring process take?',
    answer: 'Turnaround schedules depend on the service and fabric availability. Essential and Signature made-to-measure garments typically require approximately 2 to 3 weeks including intermediate fitting. Bespoke commissions, which require individual pattern drafting and basted trials, typically require 3 to 5 weeks. We advise booking consultations well in advance of weddings or key events.'
  },
  {
    question: 'How is the final price determined?',
    answer: 'Starting prices for our made-to-measure collections are clearly published (Essential from ৳6,000; Signature from ৳8,500). The final quotation is transparently confirmed during your fabric and design consultation based on your selected fabric mill, internal construction (half vs. full canvas), and specific customisation choices. No surprises or hidden charges.'
  },
  {
    question: 'How do I arrange a private consultation?',
    answer: 'You can reserve a consultation directly through the booking form on this website or reach out to us via WhatsApp. Once submitted, our team confirms your preferred appointment time and salon location in Dhaka.'
  }
];
