export function calculatePercentage(users, searchCriteria) {
  if (users.length === 0) return 0;

  let matchingCount = 0;

  users.forEach((user) => {
    let matches = true;

    for (const [field, criteria] of Object.entries(searchCriteria)) {
      const userValue = user[field];

      if (criteria.operator && criteria.value !== undefined) {
        switch (criteria.operator) {
          case ">":
            if (!(userValue > criteria.value)) matches = false;
            break;
          case "<":
            if (!(userValue < criteria.value)) matches = false;
            break;
          case ">=":
            if (!(userValue >= criteria.value)) matches = false;
            break;
          case "<=":
            if (!(userValue <= criteria.value)) matches = false;
            break;
          case "=":
            if (userValue !== criteria.value) matches = false;
            break;
          default:
            return false;
        }
      } else {
        if (userValue !== criteria) matches = false;
      }
    }

    if (matches) matchingCount++;
  });

  return Math.round((matchingCount / users.length) * 100);
}
