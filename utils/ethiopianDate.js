// --- Offline Ethiopian Date Converter ---
// Returns a string like "መስከረም 15, 2018 ዓ.ም"

const amharicMonths = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"
];

// Convert Gregorian date to Ethiopian
function toEthiopian(date = new Date()) {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  // Convert to Julian Day Number
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  const jd = gd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
           - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Convert JD to Ethiopian
  const r = jd - 1723856;
  const era = Math.floor(r / 1461);
  const remain = r % 1461;
  const year = era * 4 + Math.floor(remain / 365) - (remain >= 1460 ? 1 : 0);
  const newYearJD = 1723856 + 365 * year + Math.floor(year / 4);
  const dayOfYear = jd - newYearJD + 1;
  const month = Math.floor((dayOfYear - 1) / 30) + 1;
  const day = ((dayOfYear - 1) % 30) + 1;

  return { year, month, day };
}

function getEthiopianDateString() {
  const { year, month, day } = toEthiopian(new Date());
  const monthName = amharicMonths[month - 1] || "መስከረም";
  return `${monthName} ${day}, ${year} ዓ.ም`;
}

window.getEthiopianDateString = getEthiopianDateString;
