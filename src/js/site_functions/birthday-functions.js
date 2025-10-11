export function getDaysUntilBirthday(birthDate) {
  if (!birthDate) {
    return null;
  }

  const today = dayjs();
  const birthday = dayjs(birthDate);

  if (!birthday.isValid()) {
    return null;
  }

  let thisYearBirthday = birthday.year(today.year());

  // якщо день народження вже пройшов, то беремо наступний рік
  if (thisYearBirthday.isBefore(today, "day")) {
    thisYearBirthday = thisYearBirthday.add(1, "year");
  }
  const daysUntil = thisYearBirthday.diff(today, "day");

  return daysUntil;
}

export function formatBirthdayCountdown(daysUntil, birthDate) {
  if (daysUntil === null) {
    return "Birthday unknown";
  }

  const today = dayjs();
  const birthday = dayjs(birthDate);
  let nextBirthday = birthday.year(today.year());

  if (nextBirthday.isBefore(today, "day")) {
    nextBirthday = nextBirthday.add(1, "year");
  }

  const birthdayDateStr = nextBirthday.format("DD.MM.YYYY");

  if (daysUntil === 0) {
    return `Happy Birthday! (${birthdayDateStr})`;
  }

  if (daysUntil === 1) {
    return `Birthday tomorrow! (${birthdayDateStr})`;
  }

  return `${daysUntil} days until birthday (${birthdayDateStr})`;
}

export function getTeacherBirthdayCountdown(teacher) {
  const birthDate = teacher.b_date || teacher.birth_date;
  const daysUntil = getDaysUntilBirthday(birthDate);
  return formatBirthdayCountdown(daysUntil, birthDate);
}
