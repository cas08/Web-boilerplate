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

export function updateStatisticsTable(sortedTeachers) {
  const statisticsTableBody = document.getElementById("statistics-table-body");
  if (!statisticsTableBody) return;

  statisticsTableBody.innerHTML = "";

  sortedTeachers.forEach((teacher) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${teacher.full_name}</td>
      <td>${teacher.course || "N/A"}</td>
      <td>${teacher.age || "N/A"}</td>
      <td>${teacher.gender || "N/A"}</td>
      <td>${teacher.country || "N/A"}</td>
    `;

    statisticsTableBody.appendChild(row);
  });
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
