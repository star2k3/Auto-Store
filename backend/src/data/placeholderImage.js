const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="Auto-Store car">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect x="160" y="420" width="880" height="180" rx="48" fill="#94a3b8"/>
  <rect x="260" y="360" width="520" height="120" rx="36" fill="#cbd5f5"/>
  <circle cx="360" cy="620" r="70" fill="#0f172a"/>
  <circle cx="360" cy="620" r="36" fill="#e2e8f0"/>
  <circle cx="820" cy="620" r="70" fill="#0f172a"/>
  <circle cx="820" cy="620" r="36" fill="#e2e8f0"/>
  <text x="600" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" fill="#f8fafc">Auto-Store</text>
  <text x="600" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#cbd5f5">Car preview</text>
</svg>
`;

export const placeholderImage = {
  contentType: 'image/svg+xml',
  data: Buffer.from(svg.trim())
};
