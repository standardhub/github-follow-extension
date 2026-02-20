// North America regions
const NORTH_AMERICA_REGIONS = [
  // United States
  'united states', 'usa', 'us', 'america', 'american',
  // US States
  'alabama', 'al', 'alaska', 'ak', 'arizona', 'az', 'arkansas', 'ar',
  'california', 'ca', 'colorado', 'co', 'connecticut', 'ct',
  'delaware', 'de', 'florida', 'fl', 'georgia', 'ga',
  'hawaii', 'hi', 'idaho', 'id', 'illinois', 'il', 'indiana', 'in',
  'iowa', 'ia', 'kansas', 'ks', 'kentucky', 'ky', 'louisiana', 'la',
  'maine', 'me', 'maryland', 'md', 'massachusetts', 'ma', 'michigan', 'mi',
  'minnesota', 'mn', 'mississippi', 'ms', 'missouri', 'mo', 'montana', 'mt',
  'nebraska', 'ne', 'nevada', 'nv', 'new hampshire', 'nh', 'new jersey', 'nj',
  'new mexico', 'nm', 'new york', 'ny', 'north carolina', 'nc', 'north dakota', 'nd',
  'ohio', 'oh', 'oklahoma', 'ok', 'oregon', 'or', 'pennsylvania', 'pa',
  'rhode island', 'ri', 'south carolina', 'sc', 'south dakota', 'sd',
  'tennessee', 'tn', 'texas', 'tx', 'utah', 'ut', 'vermont', 'vt',
  'virginia', 'va', 'washington', 'wa', 'west virginia', 'wv',
  'wisconsin', 'wi', 'wyoming', 'wy',
  // US Cities
  'new york city', 'nyc', 'los angeles', 'chicago', 'houston', 'phoenix',
  'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose', 'austin',
  'jacksonville', 'fort worth', 'columbus', 'charlotte', 'san francisco',
  'indianapolis', 'seattle', 'denver', 'boston', 'nashville', 'detroit',
  'portland', 'las vegas', 'miami', 'atlanta', 'oakland', 'minneapolis',
  'tampa', 'orlando', 'cleveland', 'pittsburgh', 'sacramento', 'kansas city',
  'raleigh', 'baltimore', 'milwaukee', 'salt lake city', 'silicon valley',
  'bay area', 'palo alto', 'mountain view', 'sunnyvale', 'santa clara',
  // Canada
  'canada', 'canadian',
  'ontario', 'on', 'quebec', 'qc', 'british columbia', 'bc', 'alberta', 'ab',
  'manitoba', 'mb', 'saskatchewan', 'sk', 'nova scotia', 'ns',
  'new brunswick', 'nb', 'newfoundland', 'nf', 'prince edward island', 'pei',
  'toronto', 'montreal', 'vancouver', 'calgary', 'edmonton', 'ottawa',
  'winnipeg', 'quebec city', 'hamilton', 'kitchener', 'halifax',
  // Mexico
  'mexico', 'mexican', 'méxico',
  'aguascalientes', 'baja california', 'chihuahua', 'jalisco', 'nuevo león',
  'mexico city', 'cdmx', 'guadalajara', 'monterrey', 'tijuana', 'cancún'
];

// South America regions
const SOUTH_AMERICA_REGIONS = [
  'brazil', 'brazilian', 'brasil', 'são paulo', 'rio de janeiro',
  'argentina', 'argentinian', 'buenos aires', 'córdoba',
  'colombia', 'colombian', 'bogotá', 'medellín',
  'peru', 'peruvian', 'lima', 'cusco',
  'venezuela', 'venezuelan', 'caracas',
  'chile', 'chilean', 'santiago',
  'ecuador', 'ecuadorian', 'quito', 'guayaquil',
  'bolivia', 'bolivian', 'la paz',
  'paraguay', 'paraguayan', 'asunción',
  'uruguay', 'uruguayan', 'montevideo',
  'guyana', 'suriname', 'french guiana'
];

// Europe regions
const EUROPE_REGIONS = [
  // Western Europe
  'uk', 'united kingdom', 'great britain', 'britain', 'british',
  'england', 'scotland', 'wales', 'northern ireland',
  'london', 'manchester', 'birmingham', 'liverpool', 'edinburgh', 'glasgow', 'belfast',
  'ireland', 'irish', 'dublin', 'cork',
  'france', 'french', 'paris', 'marseille', 'lyon',
  'germany', 'german', 'deutschland', 'berlin', 'munich', 'hamburg', 'frankfurt',
  'netherlands', 'dutch', 'holland', 'amsterdam', 'rotterdam',
  'belgium', 'belgian', 'brussels', 'antwerp',
  'switzerland', 'swiss', 'zurich', 'geneva',
  'austria', 'austrian', 'vienna',
  'luxembourg',
  // Southern Europe
  'spain', 'spanish', 'españa', 'madrid', 'barcelona', 'valencia',
  'portugal', 'portuguese', 'lisbon', 'porto',
  'italy', 'italian', 'italia', 'rome', 'milan', 'naples', 'florence',
  'greece', 'greek', 'athens', 'thessaloniki',
  'malta', 'cyprus', 'andorra', 'monaco', 'san marino', 'vatican',
  // Northern Europe
  'sweden', 'swedish', 'stockholm', 'gothenburg',
  'norway', 'norwegian', 'oslo', 'bergen',
  'denmark', 'danish', 'copenhagen',
  'finland', 'finnish', 'helsinki',
  'iceland', 'icelandic', 'reykjavik',
  // Eastern Europe
  'poland', 'polish', 'warsaw', 'kraków',
  'czech republic', 'czech', 'czechia', 'prague',
  'slovakia', 'slovak', 'bratislava',
  'hungary', 'hungarian', 'budapest',
  'romania', 'romanian', 'bucharest',
  'bulgaria', 'bulgarian', 'sofia',
  'croatia', 'croatian', 'zagreb',
  'slovenia', 'slovenian', 'ljubljana',
  'serbia', 'serbian', 'belgrade',
  'bosnia', 'herzegovina', 'montenegro', 'albania', 'kosovo', 'macedonia',
  'estonia', 'estonian', 'tallinn',
  'latvia', 'latvian', 'riga',
  'lithuania', 'lithuanian', 'vilnius'
];

// Asia regions
const ASIA_REGIONS = [
  'china', 'chinese', 'beijing', 'shanghai', 'hong kong', 'macau',
  'japan', 'japanese', 'tokyo', 'osaka', 'kyoto',
  'korea', 'korean', 'south korea', 'seoul', 'busan',
  'india', 'indian', 'delhi', 'mumbai', 'bangalore', 'chennai',
  'pakistan', 'pakistani', 'karachi', 'lahore',
  'bangladesh', 'bengali', 'dhaka',
  'indonesia', 'indonesian', 'jakarta', 'bali',
  'philippines', 'filipino', 'manila',
  'vietnam', 'vietnamese', 'hanoi', 'ho chi minh',
  'thailand', 'thai', 'bangkok',
  'singapore', 'singaporean',
  'malaysia', 'malaysian', 'kuala lumpur',
  'taiwan', 'taiwanese', 'taipei',
  'myanmar', 'burma', 'cambodia', 'laos', 'mongolia',
  'nepal', 'nepalese', 'kathmandu',
  'sri lanka', 'colombo',
  'afghanistan', 'iran', 'iranian', 'tehran',
  'iraq', 'iraqi', 'baghdad',
  'saudi arabia', 'saudi', 'riyadh',
  'israel', 'israeli', 'tel aviv', 'jerusalem',
  'palestine', 'palestinian',
  'jordan', 'lebanon', 'syria', 'yemen',
  'uae', 'dubai', 'abu dhabi', 'qatar', 'kuwait', 'bahrain', 'oman',
  'turkey', 'turkish', 'istanbul', 'ankara',
  'uzbekistan', 'kazakhstan', 'azerbaijan', 'armenia'
];

// Africa regions
const AFRICA_REGIONS = [
  'nigeria', 'nigerian', 'lagos',
  'egypt', 'egyptian', 'cairo',
  'ethiopia', 'ethiopian', 'addis ababa',
  'south africa', 'cape town', 'johannesburg',
  'kenya', 'kenyan', 'nairobi',
  'tanzania', 'dar es salaam',
  'uganda', 'kampala',
  'algeria', 'algiers',
  'morocco', 'moroccan', 'casablanca',
  'ghana', 'ghanaian', 'accra',
  'mozambique', 'madagascar', 'cameroon', 'ivory coast',
  'niger', 'burkina faso', 'mali', 'malawi', 'zambia',
  'senegal', 'somalia', 'chad', 'zimbabwe', 'guinea', 'rwanda',
  'benin', 'tunisia', 'tunisian', 'libya', 'libyan', 'sudan', 'angola',
  'togo', 'sierra leone', 'congo', 'liberia', 'mauritania', 'eritrea'
];

// Oceania regions
const OCEANIA_REGIONS = [
  'australia', 'australian', 'sydney', 'melbourne', 'brisbane', 'perth',
  'new zealand', 'auckland', 'wellington',
  'fiji', 'papua new guinea', 'samoa', 'tonga', 'vanuatu', 'solomon islands'
];

// Invalid/Generic locations
const INVALID_LOCATIONS = [
  'internet', 'online', 'web', 'worldwide', 'global', 'earth', 'world',
  'remote', 'nomad', 'digital nomad', 'everywhere', 'anywhere', 'nowhere',
  'cyberspace', 'cloud', 'virtual', 'metaverse', 'universe', 'galaxy',
  'home', 'here', 'there', 'somewhere', 'localhost',
  'n/a', 'na', 'none', 'null', 'undefined', 'unknown', 'tbd', 'tba'
];
