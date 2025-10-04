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

  // для мінімізації подій
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
  const nameParts = teacher.full_name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  card.innerHTML = `
    <div class="teacher-card__avatar" style="background-color: ${
      teacher.bg_color
    }">
      ${avatarHTML}
    </div>
    <h3 class="teacher-card__name">
      <span class="teacher-card__first-name">${firstName}</span>
      <span class="teacher-card__last-name">${lastName}</span>
    </h3>
    <p class="teacher-card__specialty">${teacher.course || "N/A"}</p>
    <p class="teacher-card__country">${teacher.country}</p>
  `;

  card.addEventListener("click", () => openTeacherInfoModal(teacher));

  return card;
}

export function getInitials(fullName) {
  return fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function populateStatisticsTable(teachers) {
  const statisticsTableBody = document.getElementById("statistics-table-body");
  if (!statisticsTableBody) return;

  statisticsTableBody.innerHTML = "";

  const fragment = document.createDocumentFragment();

  teachers.forEach((teacher) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${teacher.full_name}</td>
      <td>${teacher.course || "N/A"}</td>
      <td>${teacher.age || "N/A"}</td>
      <td>${teacher.gender || "N/A"}</td>
      <td>${teacher.country || "N/A"}</td>
    `;

    fragment.appendChild(row);
  });

  statisticsTableBody.appendChild(fragment);

  console.log(`Populated statistics table with ${teachers.length} teachers`);
}

export function updateTeacherCardDisplay(teacher) {
  const card = document.querySelector(`[data-teacher-id="${teacher.id}"]`);
  if (card) {
    const isFavorite = teacher.favorite;
    console.log(
      `Updating card for ${teacher.full_name}, favorite: ${isFavorite}`
    );
    if (isFavorite) {
      card.classList.add("teacher-card--favorite");
    } else {
      card.classList.remove("teacher-card--favorite");
    }
  }
}
