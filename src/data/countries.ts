export type Country = {
  code: string; // iTunes store country code (ISO 3166-1 alpha-2, lowercase)
  name: string;
  flag: string;
};

export const COUNTRIES: Country[] = [
  { code: "us", name: "Global / USA",  flag: "🌍" },
  { code: "ge", name: "Georgia",       flag: "🇬🇪" },
  { code: "gb", name: "United Kingdom",flag: "🇬🇧" },
  { code: "fr", name: "France",        flag: "🇫🇷" },
  { code: "de", name: "Germany",       flag: "🇩🇪" },
  { code: "it", name: "Italy",         flag: "🇮🇹" },
  { code: "es", name: "Spain",         flag: "🇪🇸" },
  { code: "ru", name: "Russia",        flag: "🇷🇺" },
  { code: "tr", name: "Turkey",        flag: "🇹🇷" },
  { code: "ua", name: "Ukraine",       flag: "🇺🇦" },
  { code: "br", name: "Brazil",        flag: "🇧🇷" },
  { code: "mx", name: "Mexico",        flag: "🇲🇽" },
  { code: "ar", name: "Argentina",     flag: "🇦🇷" },
  { code: "jp", name: "Japan",         flag: "🇯🇵" },
  { code: "kr", name: "South Korea",   flag: "🇰🇷" },
  { code: "cn", name: "China",         flag: "🇨🇳" },
  { code: "in", name: "India",         flag: "🇮🇳" },
  { code: "id", name: "Indonesia",     flag: "🇮🇩" },
  { code: "ca", name: "Canada",        flag: "🇨🇦" },
  { code: "au", name: "Australia",     flag: "🇦🇺" },
  { code: "nl", name: "Netherlands",   flag: "🇳🇱" },
  { code: "se", name: "Sweden",        flag: "🇸🇪" },
  { code: "no", name: "Norway",        flag: "🇳🇴" },
  { code: "pl", name: "Poland",        flag: "🇵🇱" },
  { code: "pt", name: "Portugal",      flag: "🇵🇹" },
  { code: "gr", name: "Greece",        flag: "🇬🇷" },
  { code: "il", name: "Israel",        flag: "🇮🇱" },
  { code: "ae", name: "UAE",           flag: "🇦🇪" },
  { code: "sa", name: "Saudi Arabia",  flag: "🇸🇦" },
  { code: "eg", name: "Egypt",         flag: "🇪🇬" },
  { code: "ng", name: "Nigeria",       flag: "🇳🇬" },
  { code: "za", name: "South Africa",  flag: "🇿🇦" },
];

export const getCountry = (code: string) =>
  COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
