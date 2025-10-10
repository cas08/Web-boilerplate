export function toggleFavorite(
  teacher,
  teachers,
  updateTeacherCardDisplay,
  updateFavoritesDisplay,
  saveFavorites
) {
  teacher.favorite = !teacher.favorite;

  const teacherIndex = teachers.findIndex((t) => t.id === teacher.id);
  if (teacherIndex !== -1) {
    teachers[teacherIndex].favorite = teacher.favorite;
  }

  updateTeacherCardDisplay(teacher);

  updateFavoritesDisplay();

  saveFavorites();

  const teacherInfoModal = document.getElementById("teacher-info-modal");
  const favoriteBtn = teacherInfoModal?.querySelector(".favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.className = `favorite-btn ${
      teacher.favorite ? "is-active" : ""
    }`;
    favoriteBtn.title = teacher.favorite
      ? "Remove from favorites"
      : "Add to favorites";
  }
}

let currentCarouselIndex = 0;

// визначення кількості елементів за розміром екрану
function getItemsPerPage() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 480) {
    return 1;
  } else if (screenWidth <= 600) {
    return 2;
  } else if (screenWidth <= 768) {
    return 3;
  } else if (screenWidth <= 900) {
    return 4;
  } else {
    return 5;
  }
}

export function updateFavoritesDisplay(teachers, createTeacherCard) {
  const favoritesList = document.querySelector(".favorites__list");
  if (!favoritesList) return;

  const favoriteTeachers = teachers.filter((teacher) =>
    Boolean(teacher.favorite)
  );

  favoritesList.innerHTML = "";

  const itemsPerPage = getItemsPerPage();

  const teachersToShow = favoriteTeachers.slice(
    currentCarouselIndex,
    currentCarouselIndex + itemsPerPage
  );

  const fragment = document.createDocumentFragment();

  teachersToShow.forEach((teacher) => {
    const listItem = document.createElement("li");
    listItem.className = "favorites__item";

    const card = createTeacherCard(teacher);
    listItem.appendChild(card);
    fragment.appendChild(listItem);
  });

  favoritesList.appendChild(fragment);

  updateCarouselArrows(favoriteTeachers.length);
}

function updateCarouselArrows(totalItems) {
  const prevArrow = document.querySelector(".favorites__arrow--prev");
  const nextArrow = document.querySelector(".favorites__arrow--next");
  const itemsPerPage = getItemsPerPage();

  if (prevArrow) {
    prevArrow.style.display = "block";
    if (currentCarouselIndex <= 0) {
      prevArrow.style.opacity = "0.3";
      prevArrow.style.pointerEvents = "none";
    } else {
      prevArrow.style.opacity = "1";
      prevArrow.style.pointerEvents = "auto";
    }
  }

  if (nextArrow) {
    nextArrow.style.display = "block";
    if (currentCarouselIndex + itemsPerPage >= totalItems) {
      nextArrow.style.opacity = "0.3";
      nextArrow.style.pointerEvents = "none";
    } else {
      nextArrow.style.opacity = "1";
      nextArrow.style.pointerEvents = "auto";
    }
  }
}

export function nextCarouselPage(teachers, createTeacherCard) {
  const favoriteTeachers = teachers.filter((teacher) =>
    Boolean(teacher.favorite)
  );
  const itemsPerPage = getItemsPerPage();

  if (currentCarouselIndex + itemsPerPage < favoriteTeachers.length) {
    currentCarouselIndex += 1;
    updateFavoritesDisplay(teachers, createTeacherCard);
  }
}

export function prevCarouselPage(teachers, createTeacherCard) {
  if (currentCarouselIndex > 0) {
    currentCarouselIndex -= 1;
    updateFavoritesDisplay(teachers, createTeacherCard);
  }
}

export function saveFavorites(teachers) {
  const favoriteIds = teachers
    .filter((teacher) => Boolean(teacher.favorite))
    .map((teacher) => teacher.id);
  localStorage.setItem("teacherFavorites", JSON.stringify(favoriteIds));
}

export function loadFavorites(teachers, updateFavoritesDisplay) {
  const savedFavorites = localStorage.getItem("teacherFavorites");
  if (savedFavorites) {
    const favoriteIds = JSON.parse(savedFavorites);
    console.log("Loading favorites from localStorage:", favoriteIds);
    teachers.forEach((teacher) => {
      teacher.favorite = favoriteIds.includes(teacher.id);
    });
  } else {
    const initialFavorites = teachers.filter(
      (teacher) => teacher.favorite === true
    );
    if (initialFavorites.length > 0) {
      console.log(
        `Found ${initialFavorites.length} teachers marked as favorites in initial data:`
      );
      initialFavorites.forEach((teacher) => {
        console.log(`- ${teacher.full_name} (ID: ${teacher.id})`);
      });
    } else {
      console.log("No favorites found in initial data");
    }
  }
  updateFavoritesDisplay();
}

export function clearFavorites() {
  localStorage.removeItem("teacherFavorites");
  console.log("Favorites cleared from localStorage");
  location.reload();
}

export function updateTeacherInfoModal(teacher, getInitials, toggleFavorite) {
  const teacherInfoModal = document.getElementById("teacher-info-modal");
  if (!teacherInfoModal) {
    console.error("Teacher info modal not found");
    return;
  }

  const title = document.getElementById("teacher-info-title");
  const favoriteBtn = teacherInfoModal.querySelector(".favorite-btn");
  const avatar = teacherInfoModal.querySelector(".teacher-info__avatar");
  const name = teacherInfoModal.querySelector(".teacher-info__name");
  const specialty = teacherInfoModal.querySelector(".teacher-info__specialty");
  const meta = teacherInfoModal.querySelector(".teacher-info__meta");
  const bio = teacherInfoModal.querySelector(".teacher-info__bio");

  if (title) title.textContent = teacher.full_name;

  if (favoriteBtn) {
    favoriteBtn.className = `favorite-btn ${
      teacher.favorite ? "is-active" : ""
    }`;
    favoriteBtn.title = teacher.favorite
      ? "Remove from favorites"
      : "Add to favorites";
    favoriteBtn.onclick = () => toggleFavorite(teacher);
  }

  // Фото
  if (avatar) {
    avatar.style.backgroundColor = teacher.bg_color;
    if (teacher.picture_large) {
      avatar.innerHTML = `<img src="${teacher.picture_large}" alt="${teacher.full_name}" class="teacher-info__image" />`;
    } else {
      const initials = getInitials(teacher.full_name);
      avatar.innerHTML = `<div class="teacher-info__initials">${initials}</div>`;
    }
  }

  // Інформація
  if (name) name.textContent = teacher.full_name;
  if (specialty)
    specialty.innerHTML = `<strong>${teacher.course || "N/A"}</strong>`;

  if (meta) {
    meta.innerHTML = `
      <li>${teacher.city}, ${teacher.country}</li>
      <li>${teacher.age}, ${teacher.gender}</li>
      <li><a href="mailto:${teacher.email}">${teacher.email}</a></li>
      <li>${teacher.phone}</li>
    `;
  }

  if (bio) {
    bio.textContent =
      teacher.note ||
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab autem consectetur culpa cumque, distinctio dolor dolore dolorem doloremque ea explicabo facilis nam necessitatibus nisi pariatur perspiciatis porro quis similique temporibus velitam veritatis? Ab ad, aliquam amet consectetur cupiditate debitis deserunt doloribus dolorum earum eius eos minus nostrum odio omnis perferendis...";
  }
}

export function openTeacherInfoModal(teacher, updateTeacherInfoModal) {
  const teacherInfoModal = document.getElementById("teacher-info-modal");
  if (!teacherInfoModal) {
    console.error("Teacher info modal not found");
    return;
  }

  updateTeacherInfoModal(teacher);

  teacherInfoModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

export function handleResize(teachers, createTeacherCard) {
  currentCarouselIndex = 0;
  updateFavoritesDisplay(teachers, createTeacherCard);
}
