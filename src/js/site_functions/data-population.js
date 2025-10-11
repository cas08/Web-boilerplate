import { getRandomColor, getRandomCourse } from "../users-functions/format.js";

export function displayTeachers(teachersToDisplay, createTeacherCard) {
  const teachersGrid = document.querySelector(".teachers__grid");
  if (!teachersGrid) return;

  teachersGrid.innerHTML = "";

  if (teachersToDisplay.length === 0) {
    const noResultsMessage = document.getElementById("no-results-message");
    if (noResultsMessage) {
      noResultsMessage.style.display = "block";
    }
    return;
  }

  const noResultsMessage = document.getElementById("no-results-message");
  if (noResultsMessage) {
    noResultsMessage.style.display = "none";
  }
  const fragment = document.createDocumentFragment();

  teachersToDisplay.forEach((teacher) => {
    const teacherCard = createTeacherCard(teacher);
    fragment.appendChild(teacherCard);
  });

  teachersGrid.appendChild(fragment);
}

export function createTeacherCard(teacher, getInitials, openTeacherInfoModal) {
  const card = document.createElement("div");
  card.className = `teacher-card ${
    teacher.favorite ? "teacher-card--favorite" : ""
  }`;
  card.dataset.teacherId = teacher.id;

  let avatarHTML = "";
  if (teacher.picture_large) {
    avatarHTML = `<img src="${teacher.picture_large}" alt="${teacher.full_name}" class="teacher-card__image" />`;
  } else {
    const initials = getInitials(teacher.full_name);
    avatarHTML = `<div class="teacher-card__initials">${initials}</div>`;
  }

  // Розділ ім'я на частини
  const nameParts = (teacher.full_name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const bgColor = teacher.bg_color || getRandomColor();

  card.innerHTML = `
    <div class="teacher-card__avatar" style="background-color: ${bgColor}">
      ${avatarHTML}
    </div>
    <h3 class="teacher-card__name">
      <span class="teacher-card__first-name">${firstName}</span>
      <span class="teacher-card__last-name">${lastName}</span>
    </h3>
    <p class="teacher-card__specialty">${
      teacher.course || getRandomCourse()
    }</p>
    <p class="teacher-card__country">${teacher.country || "N/A"}</p>
  `;

  return card;
}

export function getInitials(fullName) {
  if (!fullName || typeof fullName !== "string") {
    return "??";
  }

  return fullName
    .split(" ")
    .filter((name) => name.length > 0)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

let currentStatisticsPage = 1;
const ITEMS_PER_PAGE = 10;

export function populateStatisticsTable(teachers, page = 1) {
  const statisticsTableBody = document.getElementById("statistics-table-body");
  if (!statisticsTableBody) return;

  currentStatisticsPage = page;
  statisticsTableBody.innerHTML = "";

  if (teachers.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
        No users found
      </td>
    `;
    statisticsTableBody.appendChild(row);
    return;
  }

  // Розрахунок пагінації
  const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const teachersForPage = teachers.slice(startIndex, endIndex);

  const fragment = document.createDocumentFragment();

  _.forEach(teachersForPage, (teacher) => {
    const row = document.createElement("tr");

    const teacherData = _.pick(teacher, [
      "full_name",
      "course",
      "age",
      "gender",
      "country",
    ]);
    const rowData = _.mapValues(teacherData, (value) => value || "N/A");

    row.innerHTML = `
      <td>${rowData.full_name}</td>
      <td>${rowData.course}</td>
      <td>${rowData.age}</td>
      <td>${rowData.gender}</td>
      <td>${rowData.country}</td>
    `;

    fragment.appendChild(row);
  });

  statisticsTableBody.appendChild(fragment);

  // оновлення пагінації
  updateStatisticsPagination(page, totalPages);
}

export function updateStatisticsPagination(currentPage, totalPages) {
  const paginationList = document.querySelector(".pagination__list");
  if (!paginationList) return;

  // якщо одна сторінка, не показуємо пагінацію
  if (totalPages <= 1) {
    paginationList.innerHTML = "";
    return;
  }

  paginationList.innerHTML = "";

  if (currentPage > 1) {
    const prevItem = document.createElement("li");
    prevItem.className = "pagination__item";
    prevItem.innerHTML = `<a class="pagination__link" href="#" data-page="${
      currentPage - 1
    }">←</a>`;
    paginationList.appendChild(prevItem);
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    const firstItem = document.createElement("li");
    firstItem.className = "pagination__item";
    firstItem.innerHTML = `<a class="pagination__link" href="#" data-page="1">1</a>`;
    paginationList.appendChild(firstItem);

    if (startPage > 2) {
      const dotsItem = document.createElement("li");
      dotsItem.className = "pagination__item";
      dotsItem.innerHTML = `<span class="pagination__dots">...</span>`;
      paginationList.appendChild(dotsItem);
    }
  }

  // Номери сторінок
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `pagination__item ${
      i === currentPage ? "is-current" : ""
    }`;
    pageItem.innerHTML = `<a class="pagination__link" href="#" data-page="${i}">${i}</a>`;
    paginationList.appendChild(pageItem);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dotsItem = document.createElement("li");
      dotsItem.className = "pagination__item";
      dotsItem.innerHTML = `<span class="pagination__dots">...</span>`;
      paginationList.appendChild(dotsItem);
    }

    const lastItem = document.createElement("li");
    lastItem.className = "pagination__item";
    lastItem.innerHTML = `<a class="pagination__link" href="#" data-page="${totalPages}">${totalPages}</a>`;
    paginationList.appendChild(lastItem);
  }

  if (currentPage < totalPages) {
    const nextItem = document.createElement("li");
    nextItem.className = "pagination__item";
    nextItem.innerHTML = `<a class="pagination__link" href="#" data-page="${
      currentPage + 1
    }">→</a>`;
    paginationList.appendChild(nextItem);
  }

  addStatisticsPaginationEventListeners();
}

function addStatisticsPaginationEventListeners() {
  const paginationLinks = document.querySelectorAll(
    ".pagination__link[data-page]"
  );
  paginationLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(e.target.dataset.page);
      if (page && page !== currentStatisticsPage) {
        goToStatisticsPage(page);
      }
    });
  });
}

function goToStatisticsPage(page) {
  if (window.currentTeachersData) {
    populateStatisticsTable(window.currentTeachersData, page);
  }
}

export function updateTeacherCardDisplay(teacher) {
  const card = document.querySelector(`[data-teacher-id="${teacher.id}"]`);
  if (card) {
    const isFavorite = teacher.favorite;
    if (isFavorite) {
      card.classList.add("teacher-card--favorite");
    } else {
      card.classList.remove("teacher-card--favorite");
    }
  }
}
