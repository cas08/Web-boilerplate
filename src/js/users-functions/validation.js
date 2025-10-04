import { countryPhonePatterns } from "./variables.js";

function startsWithCapital(value) {
  if (!value) return false;
  return value[0] === value[0].toUpperCase();
}

function validateCapitalizedString(value) {
  return typeof value === "string" && !!value && startsWithCapital(value);
}

export function isValidEmail(email) {
  return /^.+@.+\..+$/.test(email);
}

function isValidPhoneNumber(phone, country) {
  const pattern =
    countryPhonePatterns[country] || countryPhonePatterns["default"];
  return pattern.test(phone);
}

export function validateUser(user) {
  const capitalizedFields = ["full_name", "gender", "state", "city", "country"];

  for (const field of capitalizedFields) {
    if (!validateCapitalizedString(user[field])) return false;
  }

  if (user.note !== null && !validateCapitalizedString(user.note)) return false;

  if (typeof user.age !== "number" || isNaN(user.age)) return false;
  if (!isValidEmail(user.email)) return false;
  if (!isValidPhoneNumber(user.phone, user.country)) return false;

  return true;
}

export function validateUsers(users) {
  const valid = [];
  const invalid = [];

  for (const user of users) {
    if (validateUser(user)) {
      valid.push(user);
    } else {
      invalid.push(user);
    }
  }

  return { valid, invalid };
}
