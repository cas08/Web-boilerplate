export function findUser(users, searchField, searchValue) {
  return users.find((user) => {
    const fieldValue = user[searchField];

    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchValue.toLowerCase());
    } else if (typeof fieldValue === "number") {
      return fieldValue === searchValue;
    }

    return false;
  });
}

export function findUsers(users, searchField, searchValue) {
  return users.filter((user) => {
    const fieldValue = user[searchField];

    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchValue.toLowerCase());
    } else if (typeof fieldValue === "number") {
      return fieldValue === searchValue;
    }

    return false;
  });
}
