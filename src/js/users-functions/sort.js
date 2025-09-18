export function sortUsers(users, field, order = "asc") {
  if (isStringField(field)) {
    return sortUsersByStringField(users, field, order);
  } else if (isNumField(field)) {
    return sortUsersByNumField(users, field, order);
  } else if (isDateField(field)) {
    return sortUsersByDateField(users, field, order);
  } else {
    throw new Error(`Unsupported field for sorting: ${field}`);
  }
}

function isStringField(field) {
  return field === "full_name" || field === "country";
}

function isNumField(field) {
  return field === "age";
}

function isDateField(field) {
  return field === "b_day";
}

function sortUsersByStringField(users, field, order = "asc") {
  return users.sort((a, b) => {
    const fieldA = a[field] || "";
    const fieldB = b[field] || "";
    return order === "asc"
      ? fieldA.localeCompare(fieldB)
      : fieldB.localeCompare(fieldA);
  });
}

function sortUsersByNumField(users, field, order = "asc") {
  return users.sort((a, b) => {
    const fieldA = a[field] || 0;
    const fieldB = b[field] || 0;
    return order === "asc" ? fieldA - fieldB : fieldB - fieldA;
  });
}

function sortUsersByDateField(users, field, order = "asc") {
  return users.sort((a, b) => {
    const fieldA = new Date(a[field] || 0);
    const fieldB = new Date(b[field] || 0);
    return order === "asc"
      ? fieldA.getTime() - fieldB.getTime()
      : fieldB.getTime() - fieldA.getTime();
  });
}
