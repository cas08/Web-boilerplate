let teacherMap = null;
let mapMarker = null;

export function initializeMap(teacher) {
  const mapContainer = document.getElementById("teacher-map");
  if (!mapContainer) {
    console.error("Map container not found");
    return;
  }

  if (
    !teacher.coordinates ||
    !teacher.coordinates.latitude ||
    !teacher.coordinates.longitude
  ) {
    console.log("No coordinates available for teacher:", teacher.full_name);
    return;
  }

  const lat = parseFloat(teacher.coordinates.latitude);
  const lng = parseFloat(teacher.coordinates.longitude);

  if (isNaN(lat) || isNaN(lng)) {
    console.log("Invalid coordinates for teacher:", teacher.full_name);
    return;
  }

  // очищення попередньої карти
  if (teacherMap) {
    teacherMap.remove();
    teacherMap = null;
    mapMarker = null;
  }

  teacherMap = L.map("teacher-map").setView([lat, lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      ' <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(teacherMap);

  // додавання маркера
  mapMarker = L.marker([lat, lng]).addTo(teacherMap);

  // popup з інформацією про викладача
  mapMarker.bindPopup(`
    <div class="map-popup">
      <h4>${teacher.full_name}</h4>
      <p><strong>${teacher.course || "N/A"}</strong></p>
      <p>${teacher.city}, ${teacher.country}</p>
    </div>
  `);

  mapMarker.openPopup();
}

export function toggleMap() {
  const mapContainer = document.getElementById("teacher-map");
  const toggleButton = document.querySelector(".teacher-info__map-toggle");

  if (!mapContainer || !toggleButton) {
    console.error("Map container or toggle button not found");
    return;
  }

  const isVisible = mapContainer.style.display !== "none";

  if (isVisible) {
    // приховування карти та очищення
    mapContainer.style.display = "none";

    if (teacherMap) {
      teacherMap.remove();
      teacherMap = null;
      mapMarker = null;
    }
  } else {
    mapContainer.style.display = "block";
    const teacher = getCurrentTeacher();
    initializeMap(teacher);
  }
}

function getCurrentTeacher() {
  return window.currentTeacher || null;
}
