import { getTeachersFromServer } from "./db-api.js";
import { formatRandomUserMock } from "../users-functions/format.js";
const USERS_PER_PAGE = 10;

export async function getUsers() {
  try {
    const response = await fetch(
      `https://randomuser.me/api?results=${USERS_PER_PAGE}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.status}`);
    }

    const data = await response.json();
    const apiUsers = data.results || [];

    return apiUsers.map(formatRandomUserMock);
  } catch (error) {
    console.error("Error loading users page:", error);
    throw error;
  }
}

export async function loadTeachersFromServer() {
  try {
    const serverTeachers = await getTeachersFromServer();
    return serverTeachers;
  } catch (error) {
    console.error("Error loading teachers from server:", error);
    return [];
  }
}

export async function loadInitialData() {
  try {
    const [apiUsers, serverTeachers] = await Promise.all([
      getUsers(),
      loadTeachersFromServer(),
    ]);

    return {
      apiUsers,
      serverTeachers,
      totalCount: apiUsers.length + serverTeachers.length,
    };
  } catch (error) {
    console.error("Error loading initial data:", error);
    throw error;
  }
}

export async function loadMoreData(existingTeachers) {
  try {
    const newUsers = await getUsers();

    const serverTeachers = await loadTeachersFromServer();

    const existingIds = existingTeachers.map((teacher) => teacher.id);
    const newServerTeachers = serverTeachers.filter(
      (teacher) => !existingIds.includes(teacher.id)
    );

    return {
      newUsers,
      newServerTeachers,
    };
  } catch (error) {
    console.error("Error loading more data:", error);
    throw error;
  }
}
