export { searchTeachers, clearSearch, initializeSearch } from "./search.js";

export { initializeFilters, applyFilters } from "./filtering.js";

export {
  initializeSorting,
  sortStatisticsTable,
  updateStatisticsTable,
  updateSortIndicators,
} from "./sorting.js";

export {
  displayTeachers,
  createTeacherCard,
  getInitials,
  populateStatisticsTable,
  updateTeacherCardDisplay,
} from "./data-population.js";

export {
  toggleFavorite,
  updateFavoritesDisplay,
  saveFavorites,
  loadFavorites,
  clearFavorites,
  updateTeacherInfoModal,
  openTeacherInfoModal,
  nextCarouselPage,
  prevCarouselPage,
  handleResize,
} from "./favorites.js";

export {
  validateAddTeacherForm,
  createNewTeacher,
  addTeacherToList,
  clearAddTeacherForm,
  showFormErrors,
  showSuccessMessage,
  initializeAddTeacherForm,
} from "./add-teacher.js";
