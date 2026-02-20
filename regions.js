// Allowed regions - North America and Europe
const ALLOWED_REGIONS = [
  // === NORTH AMERICA ===
  
  // United States
  'united states', 'usa', 'us', 'america', 'american',
  
  // US States (full names and abbreviations)
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
  
  // Major US Cities
  'new york city', 'nyc', 'los angeles', 'chicago', 'houston', 'phoenix',
  'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose', 'austin',
  'jacksonville', 'fort worth', 'columbus', 'charlotte', 'san francisco',
  'indianapolis', 'seattle', 'denver', 'boston', 'nashville', 'detroit',
  'portland', 'las vegas', 'miami', 'atlanta', 'oakland', 'minneapolis',
  'tampa', 'orlando', 'cleveland', 'pittsburgh', 'sacramento', 'kansas city',
  'raleigh', 'baltimore', 'milwaukee', 'salt lake city', 'silicon valley',
  'bay area', 'palo alto', 'mountain view', 'sunnyvale', 'santa clara',
  'memphis', 'louisville', 'richmond', 'tucson', 'albuquerque', 'fresno',
  'mesa', 'omaha', 'long beach', 'virginia beach', 'cincinnati',
  
  // Canada
  'canada', 'canadian',
  
  // Canadian Provinces/Territories
  'ontario', 'on', 'quebec', 'qc', 'british columbia', 'bc', 'alberta', 'ab',
  'manitoba', 'mb', 'saskatchewan', 'sk', 'nova scotia', 'ns',
  'new brunswick', 'nb', 'newfoundland', 'nf', 'prince edward island', 'pei',
  'northwest territories', 'nt', 'yukon', 'yt', 'nunavut', 'nu',
  
  // Major Canadian Cities
  'toronto', 'montreal', 'vancouver', 'calgary', 'edmonton', 'ottawa',
  'winnipeg', 'quebec city', 'hamilton', 'kitchener', 'london', 'victoria',
  'halifax', 'oshawa', 'windsor', 'saskatoon', 'regina', 'waterloo',
  'st. catharines', 'barrie', 'kelowna', 'abbotsford', 'kingston',
  'trois-rivières', 'sherbrooke', 'moncton', 'thunder bay',
  
  // Mexico
  'mexico', 'mexican', 'méxico',
  
  // Mexican States
  'aguascalientes', 'baja california', 'baja california sur', 'campeche',
  'chiapas', 'chihuahua', 'coahuila', 'colima', 'durango', 'guanajuato',
  'guerrero', 'hidalgo', 'jalisco', 'michoacán', 'michoacan', 'morelos',
  'nayarit', 'nuevo león', 'nuevo leon', 'oaxaca', 'puebla', 'querétaro',
  'queretaro', 'quintana roo', 'san luis potosí', 'san luis potosi',
  'sinaloa', 'sonora', 'tabasco', 'tamaulipas', 'tlaxcala', 'veracruz',
  'yucatán', 'yucatan', 'zacatecas', 'ciudad de méxico', 'estado de méxico',
  
  // Major Mexican Cities
  'mexico city', 'cdmx', 'guadalajara', 'monterrey', 'puebla', 'tijuana',
  'león', 'leon', 'juárez', 'juarez', 'zapopan', 'mérida', 'merida',
  'san luis potosí', 'aguascalientes', 'hermosillo', 'saltillo', 'mexicali',
  'culiacán', 'culiacan', 'cancún', 'cancun', 'querétaro', 'queretaro',
  'toluca', 'morelia', 'chihuahua', 'tampico', 'veracruz', 'acapulco',
  'mazatlán', 'mazatlan', 'tuxtla gutiérrez', 'playa del carmen',
  
  // === EUROPE ===
  
  // Western Europe
  'uk', 'united kingdom', 'great britain', 'britain', 'british',
  'england', 'scotland', 'wales', 'northern ireland',
  'ireland', 'irish', 'republic of ireland',
  'france', 'french', 'germany', 'german', 'deutschland',
  'netherlands', 'dutch', 'holland', 'belgium', 'belgian',
  'switzerland', 'swiss', 'austria', 'austrian', 'österreich',
  'luxembourg', 'luxembourgish',
  
  // Southern Europe
  'spain', 'spanish', 'españa', 'portugal', 'portuguese',
  'italy', 'italian', 'italia', 'greece', 'greek', 'hellas',
  'malta', 'maltese', 'cyprus', 'cypriot',
  'andorra', 'monaco', 'san marino', 'vatican',
  
  // Northern Europe
  'sweden', 'swedish', 'sverige', 'norway', 'norwegian', 'norge',
  'denmark', 'danish', 'danmark', 'finland', 'finnish', 'suomi',
  'iceland', 'icelandic', 'ísland',
  
  // Eastern Europe
  'poland', 'polish', 'polska', 'czech republic', 'czech', 'czechia',
  'slovakia', 'slovak', 'hungary', 'hungarian', 'magyarország',
  'romania', 'romanian', 'românia', 'bulgaria', 'bulgarian',
  'croatia', 'croatian', 'hrvatska', 'slovenia', 'slovenian',
  'serbia', 'serbian', 'bosnia', 'herzegovina', 'montenegro',
  'albania', 'albanian', 'kosovo', 'north macedonia', 'macedonia',
  
  // Baltic States
  'estonia', 'estonian', 'eesti', 'latvia', 'latvian',
  'lithuania', 'lithuanian', 'lietuva',
  
  // Major UK Cities
  'london', 'manchester', 'birmingham', 'liverpool', 'leeds', 'glasgow',
  'edinburgh', 'bristol', 'cardiff', 'belfast', 'sheffield', 'newcastle',
  'nottingham', 'leicester', 'southampton', 'brighton', 'aberdeen',
  'cambridge', 'oxford', 'york', 'bath', 'exeter', 'plymouth',
  
  // Major Irish Cities
  'dublin', 'cork', 'galway', 'limerick', 'waterford', 'drogheda',
  
  // Major German Cities
  'berlin', 'munich', 'münchen', 'hamburg', 'frankfurt', 'cologne', 'köln',
  'stuttgart', 'düsseldorf', 'dusseldorf', 'dortmund', 'essen', 'leipzig',
  'bremen', 'dresden', 'hannover', 'nuremberg', 'nürnberg', 'duisburg',
  
  // Major French Cities
  'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg',
  'montpellier', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon',
  
  // Major Italian Cities
  'rome', 'roma', 'milan', 'milano', 'naples', 'napoli', 'turin', 'torino',
  'palermo', 'genoa', 'genova', 'bologna', 'florence', 'firenze',
  'bari', 'catania', 'venice', 'venezia', 'verona', 'messina',
  
  // Major Spanish Cities
  'madrid', 'barcelona', 'valencia', 'seville', 'sevilla', 'zaragoza',
  'málaga', 'malaga', 'murcia', 'palma', 'las palmas', 'bilbao',
  'alicante', 'córdoba', 'cordoba', 'valladolid', 'vigo', 'gijón',
  
  // Major Portuguese Cities
  'lisbon', 'lisboa', 'porto', 'braga', 'coimbra', 'funchal', 'amadora',
  
  // Major Dutch Cities
  'amsterdam', 'rotterdam', 'the hague', 'den haag', 'utrecht', 'eindhoven',
  'tilburg', 'groningen', 'almere', 'breda', 'nijmegen', 'haarlem',
  
  // Major Belgian Cities
  'brussels', 'bruxelles', 'antwerp', 'antwerpen', 'ghent', 'gent',
  'charleroi', 'liège', 'liege', 'bruges', 'brugge', 'namur', 'leuven',
  
  // Major Swiss Cities
  'zurich', 'zürich', 'geneva', 'genève', 'basel', 'bern', 'lausanne',
  'lucerne', 'luzern', 'lugano', 'biel', 'thun', 'winterthur',
  
  // Major Austrian Cities
  'vienna', 'wien', 'graz', 'linz', 'salzburg', 'innsbruck', 'klagenfurt',
  
  // Major Nordic Cities
  'stockholm', 'gothenburg', 'göteborg', 'malmö', 'malmo', 'uppsala',
  'oslo', 'bergen', 'trondheim', 'stavanger',
  'copenhagen', 'københavn', 'aarhus', 'odense', 'aalborg',
  'helsinki', 'espoo', 'tampere', 'vantaa', 'turku', 'oulu',
  'reykjavik', 'reykjavík',
  
  // Major Eastern European Cities
  'warsaw', 'warszawa', 'kraków', 'krakow', 'łódź', 'lodz', 'wrocław',
  'prague', 'praha', 'brno', 'ostrava',
  'budapest', 'debrecen', 'szeged', 'miskolc',
  'bucharest', 'bucurești', 'cluj-napoca', 'timișoara', 'timisoara',
  'sofia', 'plovdiv', 'varna', 'burgas',
  'zagreb', 'split', 'rijeka',
  'athens', 'athina', 'thessaloniki', 'patras', 'heraklion'
];

// Excluded regions - Countries NOT in North America or Europe
const EXCLUDED_COUNTRIES = [
  // Asia
  'china', 'chinese', 'japan', 'japanese', 'korea', 'korean', 'south korea', 'north korea',
  'india', 'indian', 'pakistan', 'pakistani', 'bangladesh', 'bengali',
  'indonesia', 'indonesian', 'philippines', 'filipino', 'vietnam', 'vietnamese',
  'thailand', 'thai', 'myanmar', 'burma', 'singapore', 'singaporean',
  'malaysia', 'malaysian', 'taiwan', 'taiwanese', 'hong kong', 'macau',
  'nepal', 'nepalese', 'sri lanka', 'cambodia', 'laos', 'mongolia',
  'afghanistan', 'iran', 'iranian', 'iraq', 'iraqi', 'saudi arabia', 'saudi',
  'israel', 'israeli', 'palestine', 'palestinian', 'jordan', 'lebanon',
  'syria', 'yemen', 'uae', 'dubai', 'qatar', 'kuwait', 'bahrain', 'oman',
  'turkey', 'turkish', 'uzbekistan', 'kazakhstan', 'azerbaijan', 'armenia',
  
  // Africa
  'nigeria', 'nigerian', 'egypt', 'egyptian', 'ethiopia', 'ethiopian',
  'south africa', 'kenya', 'kenyan', 'tanzania', 'uganda', 'algeria',
  'morocco', 'moroccan', 'ghana', 'ghanaian', 'mozambique', 'madagascar',
  'cameroon', 'ivory coast', 'niger', 'burkina faso', 'mali', 'malawi',
  'zambia', 'senegal', 'somalia', 'chad', 'zimbabwe', 'guinea', 'rwanda',
  'benin', 'tunisia', 'tunisian', 'libya', 'libyan', 'sudan', 'angola',
  'togo', 'sierra leone', 'congo', 'liberia', 'mauritania', 'eritrea',
  
  // South America
  'brazil', 'brazilian', 'argentina', 'argentinian', 'colombia', 'colombian',
  'peru', 'peruvian', 'venezuela', 'venezuelan', 'chile', 'chilean',
  'ecuador', 'ecuadorian', 'bolivia', 'bolivian', 'paraguay', 'uruguayan',
  'uruguay', 'guyana', 'suriname', 'french guiana',
  
  // Central America & Caribbean (excluding Mexico)
  'guatemala', 'honduran', 'honduras', 'el salvador', 'nicaragua',
  'costa rica', 'panama', 'belize', 'cuba', 'cuban', 'jamaica', 'jamaican',
  'haiti', 'haitian', 'dominican republic', 'puerto rico', 'trinidad',
  'bahamas', 'barbados', 'grenada',
  
  // Oceania
  'australia', 'australian', 'new zealand', 'fiji', 'papua new guinea',
  'samoa', 'tonga', 'vanuatu', 'solomon islands',
  
  // Russia (transcontinental but mostly Asian)
  'russia', 'russian', 'moscow', 'saint petersburg', 'petersburg'
];

// Invalid/Generic locations that should be excluded
const INVALID_LOCATIONS = [
  'internet', 'online', 'web', 'worldwide', 'global', 'earth', 'world',
  'remote', 'nomad', 'digital nomad', 'everywhere', 'anywhere', 'nowhere',
  'cyberspace', 'cloud', 'virtual', 'metaverse', 'universe', 'galaxy',
  'home', 'here', 'there', 'somewhere', 'localhost', '127.0.0.1',
  'n/a', 'na', 'none', 'null', 'undefined', 'unknown', 'tbd', 'tba'
];

