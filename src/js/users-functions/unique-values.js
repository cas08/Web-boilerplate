export function getUniqueCountries(users) {
  if (!Array.isArray(users)) {
    return [];
  }

  const countries = users
    .map((user) => user.country)
    .filter((country) => country && country.trim() !== "")
    .map((country) => country.trim());

  const uniqueCountries = [...new Set(countries)].sort();

  return uniqueCountries;
}

export function getUniqueCourses(users) {
  if (!Array.isArray(users)) {
    return [];
  }

  const courses = users
    .map((user) => user.course)
    .filter((course) => course && course.trim() !== "")
    .map((course) => course.trim());

  const uniqueCourses = [...new Set(courses)].sort();

  return uniqueCourses;
}
