const DB_BASE_URL = "http://localhost:3001";

export async function saveTeacher(teacherData) {
  try {
    const response = await fetch(`${DB_BASE_URL}/teachers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Teacher saved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error saving teacher:", error);
    throw error;
  }
}

export async function getTeachersFromServer() {
  try {
    const response = await fetch(`${DB_BASE_URL}/teachers`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const teachers = await response.json();
    return teachers;
  } catch (error) {
    console.error("Error fetching teachers from server:", error);
    throw error;
  }
}
