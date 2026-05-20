const companies = [
  { company: 'Toyota', basePrice: 6800000, models: ['Corolla Altis', 'Yaris ATIV', 'Camry', 'Fortuner', 'Hilux Revo', 'Prius', 'Land Cruiser Prado', 'Raize', 'C-HR', 'Veloz'] },
  { company: 'Honda', basePrice: 6500000, models: ['Civic RS', 'City Aspire', 'Accord', 'HR-V', 'BR-V', 'CR-V', 'Vezel', 'Passport', 'Pilot', 'Odyssey'] },
  { company: 'Suzuki', basePrice: 3800000, models: ['Alto', 'Wagon R', 'Cultus VXL', 'Swift GLX', 'Baleno', 'Ciaz', 'Vitara', 'Jimny', 'Ertiga', 'Every'] },
  { company: 'Hyundai', basePrice: 5200000, models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Venue', 'Kona EV', 'Palisade', 'Staria', 'Ioniq 5'] },
  { company: 'Kia', basePrice: 5400000, models: ['Picanto', 'Stonic', 'Sportage', 'Sorento', 'Cerato', 'Carnival', 'Seltos', 'Telluride', 'EV6', 'Niro'] },
  { company: 'BMW', basePrice: 15500000, models: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'i4', 'iX', 'M2', 'Z4'] },
  { company: 'Mercedes-Benz', basePrice: 17000000, models: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'G-Class', 'EQE', 'AMG GT'] },
  { company: 'Audi', basePrice: 16500000, models: ['A3', 'A4', 'A6', 'A8', 'Q2', 'Q5', 'Q7', 'e-tron GT', 'RS5', 'TT'] },
  { company: 'Nissan', basePrice: 4700000, models: ['Dayz', 'Note', 'Sunny', 'Sentra', 'Altima', 'X-Trail', 'Juke', 'Patrol', 'Navara', 'Leaf'] },
  { company: 'MG', basePrice: 6000000, models: ['MG3', 'MG5', 'HS', 'ZS', 'RX8', 'Marvel R', 'Cyberster', 'MG4 EV', 'Hector', 'Gloster'] }
];

const specs = [
  { fuelType: 'Petrol', transmission: 'Automatic', horsepower: 150, topSpeedKph: 205 },
  { fuelType: 'Hybrid', transmission: 'CVT', horsepower: 138, topSpeedKph: 190 },
  { fuelType: 'Petrol', transmission: 'Manual', horsepower: 128, topSpeedKph: 185 },
  { fuelType: 'Diesel', transmission: 'Automatic', horsepower: 175, topSpeedKph: 210 },
  { fuelType: 'Electric', transmission: 'Single-Speed', horsepower: 220, topSpeedKph: 195 }
];

const colors = [
  ['Pearl White', 'Graphite Gray'],
  ['Jet Black', 'Crimson Red'],
  ['Ocean Blue', 'Silver Frost'],
  ['Matte Gray', 'Ivory White'],
  ['Sunset Orange', 'Midnight Blue']
];

export const carsSeed = companies.flatMap((brand, brandIndex) =>
  brand.models.map((model, modelIndex) => {
    const spec = specs[(brandIndex + modelIndex) % specs.length];
    const colorSet = colors[(brandIndex + modelIndex) % colors.length];
    const year = 2020 + (modelIndex % 6);
    const pricePkr = brand.basePrice + modelIndex * 425000 + (brandIndex % 3) * 150000;

    // Create a precise search query for the specific car to feed into the image engine
    const searchQuery = encodeURIComponent(`${brand.company} ${model} car exterior`);

    return {
      productCode: `${brand.company.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${String(modelIndex + 1).padStart(2, '0')}`,
      company: brand.company,
      model,
      name: `${brand.company} ${model}`,
      pricePkr,
      year,
      stock: 5 + ((brandIndex + modelIndex) % 16),
      
      // FIXED: Using Bing's Image Search thumbnail endpoint to dynamically pull real car photos
      imageUrl: `https://tse2.mm.bing.net/th?q=${searchQuery}&w=1200&h=800&c=7&rs=1&p=0`,
      
      summary: `${model} by ${brand.company} offers premium road comfort, city agility, and reliable performance for Pakistan roads.`,
      fuelType: spec.fuelType,
      transmission: spec.transmission,
      horsepower: spec.horsepower + modelIndex * 3,
      topSpeedKph: spec.topSpeedKph + (modelIndex % 4) * 5,
      colors: colorSet,
      category: modelIndex < 4 ? 'Sedan' : modelIndex < 7 ? 'SUV' : 'Crossover'
    };
  })
);
