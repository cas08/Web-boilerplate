export function filterUsers(users, filters = {}) {
  return users.filter((user) => {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        switch (key) {
          case "country":
          case "gender":
            if (user[key].toLowerCase() !== value.toLowerCase()) {
              return false;
            }
            break;

          case "age":
            if (user[key] !== value) {
              return false;
            }
            break;

          case "favorite":
            if (user[key] !== value) {
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
