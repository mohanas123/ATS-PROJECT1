export interface AdzunaCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  popularCities: string[];
}

export const SUPPORTED_COUNTRIES: AdzunaCountry[] = [
  { code: 'in', name: 'India', flag: '🇮🇳', currency: '₹', popularCities: ['Coimbatore', 'Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi NCR'] },
  { code: 'us', name: 'United States', flag: '🇺🇸', currency: '$', popularCities: ['New York', 'San Francisco', 'Austin', 'Seattle', 'Chicago', 'Boston'] },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', currency: '£', popularCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol'] },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', currency: 'S$', popularCities: ['Singapore'] },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', currency: 'C$', popularCities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'] },
  { code: 'au', name: 'Australia', flag: '🇦🇺', currency: 'A$', popularCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
  { code: 'de', name: 'Germany', flag: '🇩🇪', currency: '€', popularCities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'] },
  { code: 'fr', name: 'France', flag: '🇫🇷', currency: '€', popularCities: ['Paris', 'Lyon', 'Marseille', 'Toulouse'] },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', currency: '€', popularCities: ['Amsterdam', 'Rotterdam', 'Utrecht'] },
  { code: 'za', name: 'South Africa', flag: '🇿🇦', currency: 'R', popularCities: ['Johannesburg', 'Cape Town', 'Durban'] },
  { code: 'br', name: 'Brazil', flag: '🇧🇷', currency: 'R$', popularCities: ['São Paulo', 'Rio de Janeiro'] },
  { code: 'pl', name: 'Poland', flag: '🇵🇱', currency: 'zł', popularCities: ['Warsaw', 'Krakow', 'Wroclaw'] },
  { code: 'nz', name: 'New Zealand', flag: '🇳🇿', currency: 'NZ$', popularCities: ['Auckland', 'Wellington', 'Christchurch'] },
  { code: 'it', name: 'Italy', flag: '🇮🇹', currency: '€', popularCities: ['Milan', 'Rome', 'Turin'] },
  { code: 'es', name: 'Spain', flag: '🇪🇸', currency: '€', popularCities: ['Madrid', 'Barcelona', 'Valencia'] },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', popularCities: ['Zurich', 'Geneva', 'Basel'] },
  { code: 'at', name: 'Austria', flag: '🇦🇹', currency: '€', popularCities: ['Vienna', 'Salzburg', 'Graz'] },
  { code: 'be', name: 'Belgium', flag: '🇧🇪', currency: '€', popularCities: ['Brussels', 'Antwerp', 'Ghent'] },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽', currency: 'Mex$', popularCities: ['Mexico City', 'Guadalajara', 'Monterrey'] },
  { code: 'all', name: 'All Locations / Worldwide', flag: '🌐', currency: '', popularCities: ['Remote', 'London', 'Singapore', 'New York', 'Bengaluru', 'Coimbatore'] },
];

/**
 * Normalizes spelling variations and whitespace for location queries.
 * Examples:
 * - coimbatore / combatore -> Coimbatore
 * - tamilnadu / tamil nad -> Tamil Nadu
 * - chennai / madras -> Chennai
 * - bangalore -> Bengaluru
 * - hyderabad -> Hyderabad
 * - mumbai -> Mumbai
 * Does NOT replace the user's requested location with Coimbatore or Tamil Nadu if something else was specified.
 */
export function normalizeLocationInput(raw: string): string {
  if (!raw) return '';
  let trimmed = raw.trim().replace(/\s+/g, ' ');

  // Normalize comma spacing: "City,State" -> "City, State"
  trimmed = trimmed.replace(/\s*,\s*/g, ', ');

  // Replace common spelling variations case-insensitively
  const replacements: Array<[RegExp, string]> = [
    [/\bcombatore\b/gi, 'Coimbatore'],
    [/\bcoimbator\b/gi, 'Coimbatore'],
    [/\bkovai\b/gi, 'Coimbatore'],
    [/\bcoimbatore\b/gi, 'Coimbatore'],

    [/\btamil\s*nadu\b/gi, 'Tamil Nadu'],
    [/\btamil\s*nad\b/gi, 'Tamil Nadu'],
    [/\btamilnadu\b/gi, 'Tamil Nadu'],

    [/\bchennai\b/gi, 'Chennai'],
    [/\bmadras\b/gi, 'Chennai'],

    [/\bbangalore\b/gi, 'Bengaluru'],
    [/\bbengaluru\b/gi, 'Bengaluru'],

    [/\bhyderabad\b/gi, 'Hyderabad'],
    [/\bhyd\b/gi, 'Hyderabad'],

    [/\bmumbai\b/gi, 'Mumbai'],
    [/\bbombay\b/gi, 'Mumbai'],

    [/\bpune\b/gi, 'Pune'],

    [/\bnew\s*delhi\b/gi, 'New Delhi'],
    [/\bdelhi\b/gi, 'Delhi'],
    [/\bnoida\b/gi, 'Noida'],
    [/\bgurgaon\b/gi, 'Gurugram'],
    [/\bgurugram\b/gi, 'Gurugram'],

    [/\bkolkata\b/gi, 'Kolkata'],
    [/\bcalcutta\b/gi, 'Kolkata'],

    [/\bkochi\b/gi, 'Kochi'],
    [/\bcochin\b/gi, 'Kochi'],
    [/\btrivandrum\b/gi, 'Thiruvananthapuram'],
    [/\bthiruvananthapuram\b/gi, 'Thiruvananthapuram'],
    [/\bmadurai\b/gi, 'Madurai'],
    [/\btiruchirappalli\b/gi, 'Tiruchirappalli'],
    [/\btrichy\b/gi, 'Tiruchirappalli'],
    [/\bsalem\b/gi, 'Salem'],
    [/\btirupur\b/gi, 'Tirupur'],
    [/\btiruppur\b/gi, 'Tirupur'],
    [/\bmysore\b/gi, 'Mysuru'],
    [/\bmysuru\b/gi, 'Mysuru'],

    [/\bkerala\b/gi, 'Kerala'],
    [/\bkarnataka\b/gi, 'Karnataka'],
    [/\btelangana\b/gi, 'Telangana'],
    [/\bmaharashtra\b/gi, 'Maharashtra'],
    [/\bandhra\s*pradesh\b/gi, 'Andhra Pradesh'],

    [/\blondon\b/gi, 'London'],
    [/\bmanchester\b/gi, 'Manchester'],
    [/\bbirmingham\b/gi, 'Birmingham'],
    [/\bedinburgh\b/gi, 'Edinburgh'],

    [/\bsingapore\b/gi, 'Singapore'],

    [/\bnew\s*york\b/gi, 'New York'],
    [/\bnyc\b/gi, 'New York'],
    [/\bsan\s*francisco\b/gi, 'San Francisco'],
    [/\baustin\b/gi, 'Austin'],
    [/\bseattle\b/gi, 'Seattle'],
    [/\bchicago\b/gi, 'Chicago'],
    [/\bboston\b/gi, 'Boston'],

    [/\btoronto\b/gi, 'Toronto'],
    [/\bvancouver\b/gi, 'Vancouver'],
    [/\bsydney\b/gi, 'Sydney'],
    [/\bmelbourne\b/gi, 'Melbourne'],
    [/\bberlin\b/gi, 'Berlin'],
    [/\bparis\b/gi, 'Paris'],
    [/\bamsterdam\b/gi, 'Amsterdam'],

    [/\bunited\s*states\b/gi, 'United States'],
    [/\busa\b/gi, 'United States'],
    [/\bunited\s*kingdom\b/gi, 'United Kingdom'],
    [/\buk\b/gi, 'United Kingdom'],
    [/\bindia\b/gi, 'India'],
    [/\bbharat\b/gi, 'India'],
  ];

  for (const [pattern, replacement] of replacements) {
    trimmed = trimmed.replace(pattern, replacement);
  }

  return trimmed;
}

export interface CountryDetectionResult {
  detectedCountryCode: string | null;
  isSupported: boolean;
  countryName?: string;
  unsupportedMessage?: string;
}

/**
 * Detects if a location query strongly points to an Adzuna-supported country or an unsupported country.
 */
export function detectCountryFromLocation(location: string): CountryDetectionResult {
  if (!location) {
    return { detectedCountryCode: null, isSupported: true };
  }

  const lower = location.toLowerCase();

  // Unsupported countries check
  const unsupportedList: Array<{ name: string; regex: RegExp }> = [
    { name: 'Japan', regex: /\b(japan|tokyo|osaka|kyoto)\b/i },
    { name: 'United Arab Emirates', regex: /\b(uae|dubai|abu dhabi|emirates)\b/i },
    { name: 'China', regex: /\b(china|beijing|shanghai|shenzhen)\b/i },
    { name: 'South Korea', regex: /\b(korea|seoul|busan)\b/i },
    { name: 'Saudi Arabia', regex: /\b(saudi|riyadh|jeddah)\b/i },
    { name: 'Egypt', regex: /\b(egypt|cairo)\b/i },
    { name: 'Nigeria', regex: /\b(nigeria|lagos|abuja)\b/i },
    { name: 'Philippines', regex: /\b(philippines|manila|cebu)\b/i },
    { name: 'Ireland', regex: /\b(ireland|dublin|cork)\b/i },
    { name: 'Israel', regex: /\b(israel|tel aviv|jerusalem)\b/i },
  ];

  for (const item of unsupportedList) {
    if (item.regex.test(lower)) {
      return {
        detectedCountryCode: null,
        isSupported: false,
        countryName: item.name,
        unsupportedMessage: `Adzuna job search is currently not available for ${item.name}. Supported markets include India, United States, United Kingdom, Singapore, Canada, Australia, Germany, France, Netherlands, and 10+ more.`,
      };
    }
  }

  // India
  if (
    /\b(india|bharat|coimbatore|chennai|tamil nadu|bengaluru|bangalore|hyderabad|mumbai|bombay|pune|delhi|noida|gurgaon|gurugram|kolkata|calcutta|kerala|karnataka|telangana|maharashtra|andhra|madurai|salem|trichy|tirupur|mysuru|mysore|ahmedabad|jaipur|chandigarh)\b/i.test(lower)
  ) {
    return { detectedCountryCode: 'in', isSupported: true, countryName: 'India' };
  }

  // United Kingdom
  if (
    /\b(united kingdom|uk|great britain|england|scotland|wales|london|manchester|birmingham|edinburgh|glasgow|bristol|leeds|liverpool|cambridge|oxford)\b/i.test(lower)
  ) {
    return { detectedCountryCode: 'gb', isSupported: true, countryName: 'United Kingdom' };
  }

  // United States
  if (
    /\b(united states|usa|us|america|new york|nyc|san francisco|california|austin|texas|seattle|washington|chicago|illinois|boston|massachusetts|los angeles|atlanta|denver|miami|florida)\b/i.test(lower)
  ) {
    return { detectedCountryCode: 'us', isSupported: true, countryName: 'United States' };
  }

  // Singapore
  if (/\b(singapore|sg)\b/i.test(lower)) {
    return { detectedCountryCode: 'sg', isSupported: true, countryName: 'Singapore' };
  }

  // Canada
  if (/\b(canada|toronto|vancouver|montreal|ottawa|ontario|quebec|alberta|calgary)\b/i.test(lower)) {
    return { detectedCountryCode: 'ca', isSupported: true, countryName: 'Canada' };
  }

  // Australia
  if (/\b(australia|sydney|melbourne|brisbane|perth|adelaide|queensland|new south wales)\b/i.test(lower)) {
    return { detectedCountryCode: 'au', isSupported: true, countryName: 'Australia' };
  }

  // Germany
  if (/\b(germany|deutschland|berlin|munich|frankfurt|hamburg|cologne|stuttgart)\b/i.test(lower)) {
    return { detectedCountryCode: 'de', isSupported: true, countryName: 'Germany' };
  }

  // France
  if (/\b(france|paris|lyon|marseille|toulouse|bordeaux|nice)\b/i.test(lower)) {
    return { detectedCountryCode: 'fr', isSupported: true, countryName: 'France' };
  }

  // Netherlands
  if (/\b(netherlands|holland|amsterdam|rotterdam|utrecht|the hague)\b/i.test(lower)) {
    return { detectedCountryCode: 'nl', isSupported: true, countryName: 'Netherlands' };
  }

  // Brazil
  if (/\b(brazil|brasil|sao paulo|são paulo|rio de janeiro)\b/i.test(lower)) {
    return { detectedCountryCode: 'br', isSupported: true, countryName: 'Brazil' };
  }

  // South Africa
  if (/\b(south africa|johannesburg|cape town|durban|pretoria)\b/i.test(lower)) {
    return { detectedCountryCode: 'za', isSupported: true, countryName: 'South Africa' };
  }

  // Poland
  if (/\b(poland|polska|warsaw|krakow|wroclaw)\b/i.test(lower)) {
    return { detectedCountryCode: 'pl', isSupported: true, countryName: 'Poland' };
  }

  // New Zealand
  if (/\b(new zealand|auckland|wellington|christchurch)\b/i.test(lower)) {
    return { detectedCountryCode: 'nz', isSupported: true, countryName: 'New Zealand' };
  }

  // Italy
  if (/\b(italy|italia|milan|rome|turin|florence|naples)\b/i.test(lower)) {
    return { detectedCountryCode: 'it', isSupported: true, countryName: 'Italy' };
  }

  // Spain
  if (/\b(spain|españa|madrid|barcelona|valencia|seville)\b/i.test(lower)) {
    return { detectedCountryCode: 'es', isSupported: true, countryName: 'Spain' };
  }

  // Switzerland
  if (/\b(switzerland|schweiz|suisse|zurich|geneva|basel|bern)\b/i.test(lower)) {
    return { detectedCountryCode: 'ch', isSupported: true, countryName: 'Switzerland' };
  }

  // Austria
  if (/\b(austria|österreich|vienna|salzburg|graz|innsbruck)\b/i.test(lower)) {
    return { detectedCountryCode: 'at', isSupported: true, countryName: 'Austria' };
  }

  // Belgium
  if (/\b(belgium|belgique|brussels|antwerp|ghent)\b/i.test(lower)) {
    return { detectedCountryCode: 'be', isSupported: true, countryName: 'Belgium' };
  }

  // Mexico
  if (/\b(mexico|méxico|mexico city|guadalajara|monterrey)\b/i.test(lower)) {
    return { detectedCountryCode: 'mx', isSupported: true, countryName: 'Mexico' };
  }

  return { detectedCountryCode: null, isSupported: true };
}

/**
 * Returns a human-friendly country name.
 */
export function getCountryName(countryCode: string): string {
  const found = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode.toLowerCase());
  if (found) return found.name;
  if (countryCode === 'all') return 'Worldwide';
  return countryCode.toUpperCase();
}

/**
 * Constructs the exact result headline per requirement 7:
 * "Showing 50 jobs loaded of 1,200 found in Coimbatore, Tamil Nadu"
 * or "Showing 50 jobs loaded of 29,167 found in India"
 * or "Showing 50 jobs loaded of 4,525 found in London, United Kingdom"
 */
export function buildResultSummaryText(
  loadedCount: number,
  totalFound: number,
  location: string,
  countryCode: string
): string {
  const formattedTotal = totalFound > 0 ? totalFound.toLocaleString() : loadedCount.toLocaleString();
  const cName = getCountryName(countryCode);

  let locationSuffix = '';
  if (countryCode === 'all') {
    locationSuffix = location ? `in ${location} (Worldwide)` : 'Worldwide';
  } else if (!location || location.trim().toLowerCase() === cName.toLowerCase()) {
    locationSuffix = `in ${cName}`;
  } else if (location.toLowerCase().includes(cName.toLowerCase())) {
    locationSuffix = `in ${location}`;
  } else {
    locationSuffix = `in ${location}, ${cName}`;
  }

  return `Showing ${loadedCount} jobs loaded of ${formattedTotal} found ${locationSuffix}`;
}
