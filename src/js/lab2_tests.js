import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";
import {
  mergeAndFormatUsers,
  validateUsers,
  filterUsers,
  sortUsers,
  findUser,
  findUsers,
  calculatePercentage,
} from "./users-functions/index.js";

export function processUsers(randomUserMock, additionalUsers) {
  const mergedUsers = mergeAndFormatUsers(randomUserMock, additionalUsers);
  const validationResults = validateUsers(mergedUsers);

  // console.log("Validation Results:", validationResults);

  // Task 3
  // const filteredUsers = filterUsers(mergedUsers, {
  //   country: "France",
  //   age: 73,
  //   favorite: false,
  // });
  // console.log("Filtered Users:", filteredUsers);

  // // Task 4
  // const sortedByName = sortUsers(mergedUsers, "full_name", "asc");

  // const sortedByAge = sortUsers(mergedUsers, "age", "desc");
  // const sortedByBirthday = sortUsers(mergedUsers, "b_day", "asc");
  // const sortedByCountry = sortUsers(mergedUsers, "country", "desc");

  // console.log(sortedByName);

  // Task 5
  // const foundUser = findUser(mergedUsers, "full_name", "Claude Payne");
  // console.log(foundUser);

  // const foundUsers = findUsers(mergedUsers, "country", "Germany");
  // console.log(foundUsers);

  // Task 6:
  const percentageOver = calculatePercentage(mergedUsers, {
    age: { operator: ">", value: 30 },
  });
  console.log(`Percentage of users over 30: ${percentageOver}%`);

  const percentageFrom = calculatePercentage(mergedUsers, {
    country: { operator: "=", value: "Germany" },
  });
  console.log(`Percentage of users from Germany: ${percentageFrom}%`);
}

processUsers(randomUserMock, additionalUsers);
