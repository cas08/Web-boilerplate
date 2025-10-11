export function searchTeachers(teachers, query) {
  if (_.isEmpty(query) || _.trim(query) === "") {
    return teachers;
  }

  const searchTerm = _.toLower(_.trim(query));

  return _.filter(teachers, (teacher) => {
    const searchFields = [
      _.toLower(teacher.full_name),
      _.toLower(teacher.note || ""),
      _.toString(teacher.age || ""),
    ];

    return _.some(searchFields, (field) => _.includes(field, searchTerm));
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
