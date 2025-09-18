import { courseList } from "./variables.js";

function getRandomColor() {
  let hexCode = "#";

  while (hexCode.length < 7) {
    hexCode += Math.round(Math.random() * 15).toString(16);
  }

  return hexCode;
}

export function getRandomCourse() {
  return courseList[Math.floor(Math.random() * courseList.length)];
}

export function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function formatRandomUserMock(user) {
  return {
    gender: user.gender || "",
    title: user.name?.title || "",
    full_name: `${user.name?.first || ""} ${user.name?.last || ""}`.trim(),
    city: user.location?.city || "",
    state: user.location?.state || "",
    country: user.location?.country || "",
    postcode: user.location?.postcode || "",
    coordinates: {
      latitude: user.location?.coordinates?.latitude || "",
      longitude: user.location?.coordinates?.longitude || "",
    },
    timezone: {
      offset: user.location?.timezone?.offset || "",
      description: user.location?.timezone?.description || "",
    },
    email: user.email || "",
    b_date: user.dob?.date || "",
    age: user.dob?.age || 0,
    phone: user.phone || "",
    picture_large: user.picture?.large || "",
    picture_thumbnail: user.picture?.thumbnail || "",
    id: user.login?.uuid || generateUniqueId(),
    favorite: false,
    course: getRandomCourse(),
    bg_color: getRandomColor(),
    note: null,
  };
}

export function formatAdditionalUser(user) {
  return {
    gender: user.gender || "",
    title: user.title || "",
    full_name: user.full_name || "",
    city: user.city || "",
    state: user.state || "",
    country: user.country || "",
    postcode: user.postcode || "",
    coordinates: user.coordinates || { latitude: "", longitude: "" },
    timezone: user.timezone || { offset: "", description: "" },
    email: user.email || "",
    b_date: user.b_day || user.b_date || "",
    age: user.age !== undefined ? user.age : 0,
    phone: user.phone || "",
    picture_large: user.picture_large || "",
    picture_thumbnail: user.picture_thumbnail || "",
    id: user.id || generateUniqueId(),
    favorite: !!user.favorite,
    course: user.course || getRandomCourse(),
    bg_color: user.bg_color || getRandomColor(),
    note: user.note || null,
  };
}

export function mergeAndFormatUsers(randomUserMock, additionalUsers) {
  const formattedRandomUsers = randomUserMock.map(formatRandomUserMock);
  const formattedAdditionalUsers = additionalUsers.map(formatAdditionalUser);

  const all = [...formattedRandomUsers, ...formattedAdditionalUsers];
  const seen = new Set();
  const result = [];

  for (const user of all) {
    if (!seen.has(user.email)) {
      seen.add(user.email);
      result.push(user);
    }
  }

  return result;
}
