const palettes: Record<string, [string, string, string]> = {
  'Web Development': ['#061a45', '#0b3a9e', '#38bdf8'],
  'Data Science': ['#071a3a', '#0e4a8a', '#22d3ee'],
  'UI/UX Design': ['#1a0f4a', '#4c1d95', '#f472b6'],
  'Mobile Development': ['#04203a', '#0369a1', '#34d399'],
  'Cloud & DevOps': ['#0a1a3c', '#1e40af', '#fbbf24'],
  Cybersecurity: ['#12102e', '#312e81', '#a78bfa'],
  Business: ['#0a1f3a', '#075985', '#fb923c'],
  'Artificial Intelligence': ['#0b1546', '#1d4ed8', '#818cf8'],
}

/** Generates a themed course cover as an SVG data URI so thumbnails work offline. */
export function cover(label: string, category: string): string {
  const [a, b, c] = palettes[category] ?? palettes['Web Development']
  const text = label.length > 14 ? label.slice(0, 14) : label
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
<radialGradient id="r" cx="0.75" cy="0.35" r="0.6"><stop offset="0" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="800" height="450" fill="url(#g)"/><rect width="800" height="450" fill="url(#r)"/>
<g fill="${c}" opacity="0.18">${Array.from({ length: 8 }, (_, i) => Array.from({ length: 14 }, (_, j) => `<circle cx="${40 + j * 56}" cy="${34 + i * 56}" r="2"/>`).join('')).join('')}</g>
<g transform="translate(470 70)"><rect width="270" height="190" rx="18" fill="#030a1c" opacity="0.72" stroke="${c}" stroke-opacity="0.5"/>
<circle cx="24" cy="24" r="6" fill="#ef4444"/><circle cx="46" cy="24" r="6" fill="#f59e0b"/><circle cx="68" cy="24" r="6" fill="#22c55e"/>
<rect x="24" y="56" width="130" height="10" rx="5" fill="${c}"/><rect x="24" y="82" width="200" height="10" rx="5" fill="#fff" opacity="0.35"/>
<rect x="44" y="108" width="150" height="10" rx="5" fill="#fff" opacity="0.25"/><rect x="44" y="134" width="180" height="10" rx="5" fill="#fff" opacity="0.25"/>
<rect x="24" y="160" width="90" height="10" rx="5" fill="${c}" opacity="0.8"/></g>
<circle cx="190" cy="205" r="92" fill="none" stroke="${c}" stroke-width="3" opacity="0.7"/><circle cx="190" cy="205" r="70" fill="#030a1c" opacity="0.55"/>
<text x="190" y="${text.length > 9 ? 215 : 224}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="${text.length > 9 ? 26 : 38}" fill="#fff">${text.replace(/&/g, '&amp;')}</text>
<text x="48" y="400" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="22" fill="${c}" letter-spacing="3">${category.toUpperCase().replace(/&/g, '&amp;')}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
