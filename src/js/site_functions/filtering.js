import { filterUsers } from "../users-functions/index.js";

export function initializeFilters(teachers, applyFilters) {
  // заповнення селекту регіонів країнами
  populateRegionFilter(teachers);

  addFilterEventListeners(applyFilters);
}

function populateRegionFilter(teachers) {
  const regionSelect = document.getElementById("filter-region");
  if (!regionSelect) return;

  const anyOption = regionSelect.querySelector('option[value=""]');
  regionSelect.innerHTML = "";
  if (anyOption) {
    regionSelect.appendChild(anyOption);
  }

  const uniqueCountries = getUniqueCountries(teachers);

  uniqueCountries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    regionSelect.appendChild(option);
  });

  console.log(
    `Populated region filter with ${uniqueCountries.length} countries:`,
    uniqueCountries
  );
}

function getUniqueCountries(teachers) {
  const countries = teachers.map((teacher) => teacher.country);
  return [...new Set(countries)].filter(Boolean).sort();
}

function addFilterEventListeners(applyFilters) {
  const ageFilter = document.getElementById("filter-age");
  if (ageFilter) {
    ageFilter.addEventListener("change", applyFilters);
  }

  const regionFilter = document.getElementById("filter-region");
  if (regionFilter) {
    regionFilter.addEventListener("change", applyFilters);
  }

  const sexFilter = document.getElementById("filter-sex");
  if (sexFilter) {
    sexFilter.addEventListener("change", applyFilters);
  }

  const photoFilter = document.getElementById("filter-photo");
  if (photoFilter) {
    photoFilter.addEventListener("change", applyFilters);
  }

  const favoritesFilter = document.getElementById("filter-favorites");
  if (favoritesFilter) {
    favoritesFilter.addEventListener("change", applyFilters);
  }
}

export function applyFilters(teachers, searchQuery, searchTeachers) {
  // пошук
  let filteredTeachers = searchTeachers(teachers, searchQuery);

  const filters = {};

  const ageFilter = document.getElementById("filter-age");
  if (ageFilter && ageFilter.value) {
    filters.age = ageFilter.value;
  }

  const regionFilter = document.getElementById("filter-region");
  if (regionFilter && regionFilter.value) {
    filters.region = regionFilter.value;
  }

  const sexFilter = document.getElementById("filter-sex");
  if (sexFilter && sexFilter.value) {
    filters.sex = sexFilter.value;
  }

  const photoFilter = document.getElementById("filter-photo");
  if (photoFilter && photoFilter.checked) {
    filters.photo = true;
  }

  const favoritesFilter = document.getElementById("filter-favorites");
  if (favoritesFilter && favoritesFilter.checked) {
    filters.favorites = true;
  }

  if (Object.keys(filters).length > 0) {
    filteredTeachers = filterUsers(filteredTeachers, filters);
  }

  return {
    filteredTeachers,
    filters,
  };
}
