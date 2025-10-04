export function searchTeachers(teachers, query) {
  if (!query || query.trim() === "") {
    return teachers;
  }

  const searchTerm = query.toLowerCase().trim();

  return teachers.filter((teacher) => {
    // Пошук по імені
    const nameMatch = teacher.full_name.toLowerCase().includes(searchTerm);

    // Пошук по коментарю
    const noteMatch =
      teacher.note && teacher.note.toLowerCase().includes(searchTerm);

    // Пошук по віку
    const ageMatch = teacher.age && teacher.age.toString().includes(searchTerm);

    return nameMatch || noteMatch || ageMatch;
  });
}

export function clearSearch(searchInput, applyFilters) {
  if (searchInput) {
    searchInput.value = "";
    applyFilters();
  }
}

export function initializeSearch(applyFilters) {
  const searchButton = document.querySelector(".header__button-search");
  if (searchButton) {
    searchButton.addEventListener("click", applyFilters);
  }

  // Пошук по Enter
  const searchInput = document.querySelector(".header__input-search");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        applyFilters();
      }
    });
  }

  return searchInput;
}
