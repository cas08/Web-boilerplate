export function filterUsers(users, filters = {}) {
  return users.filter((user) => {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        switch (key) {
          case "country":
          case "region":
            if (user.country.toLowerCase() !== value.toLowerCase()) {
              return false;
            }
            break;

          case "gender":
          case "sex":
            if (user.gender.toLowerCase() !== value.toLowerCase()) {
              return false;
            }
            break;

          case "age":
            if (!checkAgeRange(user.age, value)) {
              return false;
            }
            break;

          case "favorite":
          case "favorites":
            if (Boolean(user.favorite) !== Boolean(value)) {
              return false;
            }
            break;

          case "photo":
            if (Boolean(user.picture_large) !== Boolean(value)) {
              return false;
            }
            break;

          default:
            if (user[key] !== value) {
              return false;
            }
        }
      }
    }
    return true;
  });
}

// чи потрапляє вік користувача в заданий діапазон
function checkAgeRange(age, ageRange) {
  if (typeof age !== "number") {
    return false;
  }

  switch (ageRange) {
    case "18-30":
      return age >= 18 && age <= 30;
    case "31-45":
      return age >= 31 && age <= 45;
    case "46-60":
      return age >= 46 && age <= 60;
    case "61+":
      return age >= 61;
    default:
      return true;
  }
}
