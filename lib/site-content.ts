/** Editorial collections, never represented as live property listings. */
export interface Collection {
  id: string;
  number: string;
  name: string;
  location: string;
  image: string;
  alt: string;
  category: string;
  description: string;
  detail: string;
  interests: string[];
}

export const contact = {
  phone: '+971555172530',
  phoneDisplay: '+971 55 517 2530',
  whatsapp: 'https://wa.me/971555172530',
  email: 'info@tutmey.com',
  address: '901-A63, Iris Bay, Business Bay, Dubai, UAE',
  maps: 'https://www.google.com/maps/search/?api=1&query=Iris%20Bay%2C%20Business%20Bay%2C%20Dubai%2C%20UAE',
} as const;

export const collections: Collection[] = [
  { id:'palm', number:'01', name:'A life by the water', location:'Palm Jumeirah', image:'palm', alt:'The villa-lined fronds and waterfront residences of Palm Jumeirah', category:'Waterfront living', description:'Space to unwind. A different horizon every day.', detail:'Explore a brief for waterfront villas and residences on Palm Jumeirah. Tell us whether a private outdoor space, a sea view, or the scale of the home matters most. We will discuss current options around your priorities.', interests:['Waterfront villas','Sea-view residences','Outdoor living'] },
  { id:'downtown', number:'02', name:'At the heart of it all', location:'Downtown Dubai', image:'hero', alt:'Burj Khalifa and the Downtown Dubai skyline in the evening light', category:'City residences', description:'An extraordinary skyline. Your own point of view.', detail:'Consider a city residence around Downtown Dubai. Shape your search around the view, the building, the floor plan and how you want to spend your time. We will help you compare the details that matter.', interests:['Skyline apartments','Penthouses','City living'] },
  { id:'marina', number:'03', name:'The waterfront rhythm', location:'Dubai Marina', image:'marina', alt:'Dubai Marina residences overlooking moored yachts and the water', category:'Marina addresses', description:'The energy of the city. The calm of the water.', detail:'Discover the possibilities of a residence in Dubai Marina. From a place for everyday living to a second home, start with your preferred outlook, space and pace of life. Your brief guides the search.', interests:['Marina-view apartments','Penthouses','Second homes'] },
];

export const processSteps = [
  { number:'01', title:'We listen.', text:'Your lifestyle, your priorities, your plans. We start with a conversation, so the search starts in the right place.' },
  { number:'02', title:'We curate.', text:'A considered selection of properties, with the context you need to compare them. Fewer distractions. More clarity.' },
  { number:'03', title:'You choose.', text:'Explore the homes that feel right. We help coordinate viewings and guide the next steps when you are ready.' },
];

export const faqs = [
  { question:'Where does my property search begin?', answer:'Start with the short property brief below, or speak with us directly. Share your preferred setting, property type and budget. We will use those preferences to discuss a suitable search with you.' },
  { question:'Can I start my search from outside Dubai?', answer:'Yes. Start the conversation by WhatsApp, phone or email from wherever you are. Tell us your location and plans to visit, so we can discuss the most practical way to move your search forward.' },
  { question:'Do you help with both a home and an investment purchase?', answer:'Tell us whether you are looking for a primary home, a second home or an investment property. That purpose shapes the search. For any investment decision, we can discuss the property details you need to assess with your own financial and legal advisers.' },
  { question:'Are the collections on this website available properties?', answer:'The collections introduce neighbourhoods and lifestyles. The photographs show the areas, rather than individual homes currently for sale. Contact us for current availability, property specifications and pricing.' },
];
