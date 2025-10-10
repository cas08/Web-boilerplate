export function initializeSorting(sortStatisticsTable) {
  addStatisticsEventListeners(sortStatisticsTable);
}

function addStatisticsEventListeners(sortStatisticsTable) {
  const sortableHeaders = document.querySelectorAll(".sortable");

  sortableHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const sortField = header.dataset.sort;
      sortStatisticsTable(sortField);
    });
  });
}

export function sortStatisticsTable(
  teachers,
  field,
  currentSort,
  updateStatisticsTable,
  updateSortIndicators
) {
  let newSort = { ...currentSort };
  if (newSort.field === field) {
    newSort.direction = newSort.direction === "asc" ? "desc" : "asc";
  } else {
    newSort.field = field;
    newSort.direction = "asc";
  }

  const sortedTeachers = [...teachers].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    if (field === "age") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    } else {
      aValue = String(aValue || "").toLowerCase();
      bValue = String(bValue || "").toLowerCase();
    }

    if (newSort.direction === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  updateStatisticsTable(sortedTeachers);

  updateSortIndicators(field, newSort.direction);

  return newSort;
}

import { populateStatisticsTable } from "./data-population.js";

export function updateStatisticsTable(sortedTeachers) {
  window.currentTeachersData = sortedTeachers;

  // оновлення таблиці з пагінацією з першої сторінки
  populateStatisticsTable(sortedTeachers, 1);
}

export function updateSortIndicators(field, direction) {
  const allHeaders = document.querySelectorAll(".sortable");
  allHeaders.forEach((header) => {
    header.classList.remove("sort-asc", "sort-desc");
  });

  const currentHeader = document.querySelector(`[data-sort="${field}"]`);
  if (currentHeader) {
    currentHeader.classList.add(direction === "asc" ? "sort-asc" : "sort-desc");
  }
}
