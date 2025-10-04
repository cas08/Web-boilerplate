import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";
import {
  mergeAndFormatUsers,
  validateUsers,
  filterUsers,
  sortUsers,
  findUser,
  findUsers,
  calculatePercentage,
  getUniqueCountries,
  getUniqueCourses,
} from "./users-functions/index.js";

import {
  // Пошук
  searchTeachers,
  clearSearch,
  initializeSearch,

  // Фільтрування
  initializeFilters,
  applyFilters as applyFiltersModule,

  // Сортування
  initializeSorting,
  sortStatisticsTable as sortStatisticsTableModule,
  updateStatisticsTable,
  updateSortIndicators,

  // Заповнення даних
  displayTeachers,
  createTeacherCard,
  getInitials,
  populateStatisticsTable,
  updateTeacherCardDisplay,

  // Улюблені викладачі
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

  // Додавання викладача
  validateAddTeacherForm,
  createNewTeacher,
  addTeacherToList,
  clearAddTeacherForm,
  showFormErrors,
  showSuccessMessage,
  initializeAddTeacherForm,
} from "./site_functions/index.js";

// Глобальні змінні
let teachers = [];
let favorites = [];
let currentFilters = {};
let currentSort = { field: null, direction: "asc" };
let currentSearchQuery = "";

// DOM
const teachersGrid = document.querySelector(".teachers__grid");
const favoritesList = document.querySelector(".favorites__list");
const teacherInfoModal = document.getElementById("teacher-info-modal");
const addTeacherModal = document.getElementById("add-teacher-modal");
const addTeacherForm = document.getElementById("add-teacher-form");
const noResultsMessage = document.getElementById("no-results-message");
const statisticsTableBody = document.getElementById("statistics-table-body");

function updateTeacherInfoModalWrapper(teacher) {
  return updateTeacherInfoModal(teacher, getInitials, (teacher) =>
    toggleFavorite(
      teacher,
      teachers,
      updateTeacherCardDisplay,
      () =>
        updateFavoritesDisplay(teachers, (teacher) =>
          createTeacherCard(teacher, getInitials, (teacher) =>
            openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
          )
        ),
      () => saveFavorites(teachers),
      updateTeacherInfoModalWrapper
    )
  );
}

function initApp() {
  teachers = mergeAndFormatUsers(randomUserMock, additionalUsers);

  loadFavorites(teachers, () =>
    updateFavoritesDisplay(teachers, (teacher) =>
      createTeacherCard(teacher, getInitials, (teacher) =>
        openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
      )
    )
  );

  displayTeachers(teachers, (teacher) =>
    createTeacherCard(teacher, getInitials, (teacher) =>
      openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
    )
  );

  initializeFilters(teachers, applyFilters);

  initializeStatistics();

  initializeSearch(applyFilters);

  addEventListeners();
}

function applyFilters() {
  const searchInput = document.querySelector(".header__input-search");
  const searchQuery = searchInput ? searchInput.value : "";
  currentSearchQuery = searchQuery;

  const result = applyFiltersModule(teachers, searchQuery, searchTeachers);

  currentFilters = result.filters;

  displayTeachers(result.filteredTeachers, (teacher) =>
    createTeacherCard(teacher, getInitials, (teacher) =>
      openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
    )
  );
}

function initializeStatistics() {
  populateStatisticsTable(teachers);

  initializeSorting(sortStatisticsTable);
}

function sortStatisticsTable(field) {
  currentSort = sortStatisticsTableModule(
    teachers,
    field,
    currentSort,
    updateStatisticsTable,
    updateSortIndicators
  );
}

function handleAddTeacherForm(event) {
  event.preventDefault();

  const formData = new FormData(addTeacherForm);
  const validation = validateAddTeacherForm(formData, teachers);

  const formFooter = addTeacherForm.querySelector(".add-modal__footer");

  if (!validation.isValid) {
    showFormErrors(validation.errors, formFooter);
    return;
  }

  const newTeacher = createNewTeacher(validation.data);

  teachers = addTeacherToList(newTeacher, teachers);

  clearAddTeacherForm(addTeacherForm);

  showSuccessMessage("Teacher added successfully!", formFooter);

  displayTeachers(teachers, (teacher) =>
    createTeacherCard(teacher, getInitials, (teacher) =>
      openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
    )
  );

  populateStatisticsTable(teachers);

  initializeFilters(teachers, applyFilters);

  setTimeout(() => {
    closeModals();
    const successMessage = formFooter.querySelector(".form-success");
    if (successMessage) {
      successMessage.remove();
    }
  }, 500);
}

function addEventListeners() {
  const closeButtons = document.querySelectorAll(
    "[data-modal-close], .info-modal__close"
  );
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModals);
  });

  const backdrops = document.querySelectorAll(
    ".info-modal__backdrop, .add-modal__backdrop"
  );
  backdrops.forEach((backdrop) => {
    backdrop.addEventListener("click", closeModals);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModals();
    }
  });

  const addTeacherBtns = document.querySelectorAll(".navigation__add-btn");
  addTeacherBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (addTeacherModal) {
        addTeacherModal.style.display = "block";
        document.body.style.overflow = "hidden";
        if (addTeacherForm) {
          clearAddTeacherForm(addTeacherForm);
          initializeAddTeacherForm(addTeacherForm);
          const formFooter = addTeacherForm.querySelector(".add-modal__footer");
          const existingMessages = formFooter.querySelectorAll(
            ".form-error, .form-success"
          );
          existingMessages.forEach((msg) => msg.remove());
        }
      }
    });
  });

  if (addTeacherForm) {
    addTeacherForm.addEventListener("submit", handleAddTeacherForm);
  }

  const prevArrow = document.querySelector(".favorites__arrow--prev");
  const nextArrow = document.querySelector(".favorites__arrow--next");

  if (prevArrow) {
    prevArrow.addEventListener("click", () => {
      prevCarouselPage(teachers, (teacher) =>
        createTeacherCard(teacher, getInitials, (teacher) =>
          openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
        )
      );
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", () => {
      nextCarouselPage(teachers, (teacher) =>
        createTeacherCard(teacher, getInitials, (teacher) =>
          openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
        )
      );
    });
  }

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleResize(teachers, (teacher) =>
        createTeacherCard(teacher, getInitials, (teacher) =>
          openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
        )
      );
    }, 250);
  });
}

function closeModals() {
  if (teacherInfoModal) {
    teacherInfoModal.style.display = "none";
  }
  if (addTeacherModal) {
    addTeacherModal.style.display = "none";
  }
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", initApp);
