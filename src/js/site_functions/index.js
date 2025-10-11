export { searchTeachers, initializeSearch } from "./search.js";

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

export { toggleMap } from "./map-functions.js";

export {
  initializeStatisticsTabs,
  createStatisticsPieChart,
  updateStatisticsChart,
} from "./chart-functions.js";

export {
  getDaysUntilBirthday,
  formatBirthdayCountdown,
  getTeacherBirthdayCountdown,
} from "./birthday-functions.js";

export {
  initializeReportsTabs,
  createCountriesReport,
  createTeachersReport,
  updateReports,
} from "./reports-functions.js";
