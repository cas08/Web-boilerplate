export function filterUsers(users, filters = {}) {
  return _.filter(users, (user) => {
    return _.every(_.pickBy(filters, _.identity), (value, key) => {
      // console.log(
      //   `Checking filter ${key}: ${value} for user ${user.full_name}`
      // );
      switch (key) {
        case "country":
        case "region":
          return _.toLower(user.country) === _.toLower(value);

        case "gender":
        case "sex":
          return _.toLower(user.gender) === _.toLower(value);

        case "age":
          return checkAgeRange(user.age, value);

        case "favorite":
        case "favorites":
          const favoriteMatch = Boolean(user.favorite) === value;
          return favoriteMatch;

        case "photo":
          const photoMatch = Boolean(user.picture_large) === value;
          return photoMatch;

        default:
          return _.get(user, key) === value;
      }
    });
  });
}

function checkAgeRange(age, ageRange) {
  if (!_.isNumber(age)) {
    return false;
  }

  const ageRanges = {
    "18-30": [18, 30],
    "31-45": [31, 45],
    "46-60": [46, 60],
    "61+": [61, Infinity],
  };

  const range = ageRanges[ageRange];
  if (!range) {
    return true;
  }

  return _.inRange(age, range[0], range[1] + 1);
}
