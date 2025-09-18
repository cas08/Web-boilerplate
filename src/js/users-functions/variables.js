export const courseList = [
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Dancing",
  "Chess",
  "Biology",
  "Chemistry",
  "Law",
  "Art",
  "Medicine",
  "Statistics",
];

export const countryPhonePatterns = {
  Germany: /^\d{4}-\d{7}$/, // 1234-1234567
  USA: /^\(\d{3}\) \d{3}-\d{4}$/, // (123) 456-7890
  UK: /^\+44 \d{4} \d{6}$/, // +44 1234 567890
  UA: /^\+380 \d{2} \d{3} \d{2} \d{2}$/, // +380 123 456 789
  // інші країни
  default: /.+/,
};
