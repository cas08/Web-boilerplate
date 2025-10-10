import {
  saveTeacher,
  getTeachersFromServer,
  loadInitialData,
  loadMoreData,
} from "./api-functions/index.js";

import {
  // Пошук
  searchTeachers,
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
let currentFilters = {};
let currentSort = { field: null, direction: "asc" };
let currentSearchQuery = "";

// DOM
const teachersGrid = document.querySelector(".teachers__grid");
const favoritesList = document.querySelector(".favorites__list");
const teacherInfoModal = document.getElementById("teacher-info-modal");
const addTeacherModal = document.getElementById("add-teacher-modal");
const addTeacherForm = document.getElementById("add-teacher-form");

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

async function initApp() {
  try {
    showLoadingIndicator();

    // дані з обох джерел
    const { apiUsers, serverTeachers } = await loadInitialData();
    teachers = [...apiUsers, ...serverTeachers];

    hideLoadingIndicator();

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

    toggleLoadMoreButton(teachers);

    addEventListeners();
  } catch (error) {
    console.error("Error initializing app:", error);
    hideLoadingIndicator();
    showErrorMessage("Failed to load users. Please try again later.");
  }
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

  toggleLoadMoreButton(result.filteredTeachers);

  updateStatisticsWithFilteredData(result.filteredTeachers);
}

function initializeStatistics() {
  window.currentTeachersData = teachers;
  populateStatisticsTable(teachers);

  initializeSorting(sortStatisticsTable);
}

function updateStatisticsWithFilteredData(filteredTeachers) {
  window.currentTeachersData = filteredTeachers;

  populateStatisticsTable(filteredTeachers, 1);

  updateUserCountIndicators(filteredTeachers.length, teachers.length);
}

function updateUserCountIndicators(filteredCount, totalCount) {
  const teachersSectionTitle = document.querySelector(".teachers__title");
  if (teachersSectionTitle) {
    teachersSectionTitle.textContent = `Teachers (${filteredCount} of ${totalCount})`;
  }
}

function sortStatisticsTable(field) {
  const currentData = window.currentTeachersData || teachers;

  currentSort = sortStatisticsTableModule(
    currentData,
    field,
    currentSort,
    updateStatisticsTable,
    updateSortIndicators
  );
}

async function handleAddTeacherForm(event) {
  event.preventDefault();

  const formData = new FormData(addTeacherForm);
  const validation = validateAddTeacherForm(formData, teachers);

  const formFooter = addTeacherForm.querySelector(".add-modal__footer");

  if (!validation.isValid) {
    showFormErrors(validation.errors, formFooter);
    return;
  }

  const newTeacher = createNewTeacher(validation.data);

  try {
    // індикатор завантаження
    const submitBtn = formFooter.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Збереження...";

    const savedTeacher = await saveTeacher(newTeacher);

    // додавання вчителя до локального списку
    teachers = addTeacherToList(savedTeacher, teachers);

    clearAddTeacherForm(addTeacherForm);

    showSuccessMessage("Teacher added successfully!", formFooter);

    displayTeachers(teachers, (teacher) =>
      createTeacherCard(teacher, getInitials, (teacher) =>
        openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
      )
    );

    populateStatisticsTable(teachers);

    updateUserCountIndicators(teachers.length, teachers.length);

    initializeFilters(teachers, applyFilters);

    setTimeout(() => {
      closeModals();
      const successMessage = formFooter.querySelector(".form-success");
      if (successMessage) {
        successMessage.remove();
      }
    }, 500);
  } catch (error) {
    console.error("Error saving teacher:", error);

    showFormErrors(
      [{ field: "general", message: "Помилка збереження. Спробуйте ще раз." }],
      formFooter
    );

    const submitBtn = formFooter.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = "Add";
  }
}

function handleTeacherCardClick(event) {
  // знаходження найближчої картки вчителя
  const teacherCard = event.target.closest(".teacher-card");
  if (!teacherCard) return;

  const teacherId = teacherCard.dataset.teacherId;
  if (!teacherId) return;

  // знаходження вчителя за ID
  const teacher = teachers.find((t) => t.id === teacherId);
  if (!teacher) return;

  openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper);
}

function addEventListeners() {
  if (teachersGrid) {
    teachersGrid.addEventListener("click", handleTeacherCardClick);
  }

  if (favoritesList) {
    favoritesList.addEventListener("click", handleTeacherCardClick);
  }

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

  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreUsers);
  }
}

function showErrorMessage(message) {
  const teachersGrid = document.querySelector(".teachers__grid");
  if (teachersGrid) {
    teachersGrid.innerHTML = `<div class="error-message">${message}</div>`;
  }
}

function toggleLoadMoreButton(filteredTeachers) {
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (!loadMoreBtn) return;

  // чи є активні фільтри
  const hasActiveFilters =
    Object.keys(currentFilters).length > 0 || currentSearchQuery.trim() !== "";

  if (hasActiveFilters) {
    // при фільтрації не відображаю
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
  }
}

function showLoadingIndicator() {
  const teachersGrid = document.querySelector(".teachers__grid");
  if (teachersGrid) {
    teachersGrid.innerHTML =
      '<div class="loading-indicator">Loading users...</div>';
  }
}

function hideLoadingIndicator() {
  const teachersGrid = document.querySelector(".teachers__grid");
  if (teachersGrid) {
    const loadingIndicator = teachersGrid.querySelector(".loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }
}

async function loadMoreUsers() {
  try {
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = "Завантаження...";
    }

    const { newUsers, newServerTeachers } = await loadMoreData(teachers);

    teachers = [...teachers, ...newUsers, ...newServerTeachers];

    displayTeachers(teachers, (teacher) =>
      createTeacherCard(teacher, getInitials, (teacher) =>
        openTeacherInfoModal(teacher, updateTeacherInfoModalWrapper)
      )
    );

    window.currentTeachersData = teachers;
    populateStatisticsTable(teachers, 1);

    updateUserCountIndicators(teachers.length, teachers.length);

    initializeFilters(teachers, applyFilters);

    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = "Завантажити більше";
    }
  } catch (error) {
    console.error("Error loading more users:", error);

    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = "Завантажити більше";
    }

    showErrorMessage("Помилка завантаження користувачів. Спробуйте ще раз.");
  }
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
