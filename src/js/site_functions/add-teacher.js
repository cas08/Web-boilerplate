import {
  generateUniqueId,
  getRandomCourse,
  getRandomColor,
} from "../users-functions/format.js";

import { isValidEmail } from "../users-functions/index.js";

export function validateAddTeacherForm(formData, existingTeachers = []) {
  const errors = [];
  const data = {};

  const name = formData.get("name")?.trim();
  if (!name) {
    errors.push("Name is required");
  } else if (name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else {
    data.full_name = name;
  }

  const specialty = formData.get("specialty");
  if (!specialty) {
    errors.push("Specialty is required");
  } else {
    data.course = specialty;
  }

  const country = formData.get("country");
  if (country) {
    data.country = country;
  }

  const city = formData.get("city")?.trim();
  if (city) {
    data.city = city;
  }

  const email = formData.get("email")?.trim();
  if (email) {
    if (!isValidEmail(email)) {
      errors.push("Invalid email format");
    } else {
      const emailExists = existingTeachers.some(
        (teacher) =>
          teacher.email && teacher.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        errors.push("Email already exists");
      } else {
        data.email = email;
      }
    }
  }

  const phone = formData.get("phone")?.trim();
  if (phone) {
    data.phone = phone;
  }

  const dob = formData.get("dob");
  if (dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      errors.push("Teacher must be at least 18 years old");
    } else if (age > 100) {
      errors.push("Invalid birth date");
    } else {
      data.b_date = dob;
      data.age = age;
    }
  }

  const sex = formData.get("sex");
  if (!sex) {
    errors.push("Sex is required");
  } else {
    data.gender = sex;
  }

  const bgcolor = formData.get("bgcolor");
  if (bgcolor) {
    data.bg_color = bgcolor;
  }

  // нотатки
  const notes = formData.get("notes")?.trim();
  if (notes) {
    data.note = notes;
  }

  return {
    isValid: errors.length === 0,
    errors,
    data,
  };
}

export function createNewTeacher(formData) {
  return {
    id: generateUniqueId(),
    gender: formData.gender || "",
    title: "",
    full_name: formData.full_name,
    city: formData.city || "",
    state: "",
    country: formData.country || "",
    postcode: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
    timezone: {
      offset: "",
      description: "",
    },
    email: formData.email || "",
    b_date: formData.b_date || "",
    age: formData.age || 0,
    phone: formData.phone || "",
    picture_large: "",
    picture_thumbnail: "",
    favorite: false,
    course: formData.course || getRandomCourse(),
    bg_color: formData.bg_color || getRandomColor(),
    note: formData.note || null,
  };
}
export function addTeacherToList(newTeacher, teachers) {
  return [...teachers, newTeacher];
}

export function clearAddTeacherForm(form) {
  form.reset();

  const colorInput = form.querySelector("#t-bgcolor");
  if (colorInput) {
    colorInput.value = getRandomColor();
  }
}

export function showFormErrors(errors, container) {
  const existingErrors = container.querySelectorAll(".form-error");
  existingErrors.forEach((error) => error.remove());

  errors.forEach((error) => {
    const errorElement = document.createElement("div");
    errorElement.className = "form-error";
    errorElement.textContent = error;
    errorElement.style.color = "#e74c3c";
    errorElement.style.fontSize = "0.9rem";
    errorElement.style.marginTop = "4px";
    container.appendChild(errorElement);
  });
}

export function showSuccessMessage(message, container) {
  // витдалення попередніх повідомлень
  const existingMessages = container.querySelectorAll(".form-success");
  existingMessages.forEach((msg) => msg.remove());

  const successElement = document.createElement("div");
  successElement.className = "form-success";
  successElement.textContent = message;
  successElement.style.color = "#27ae60";
  successElement.style.fontSize = "0.9rem";
  successElement.style.marginTop = "4px";
  successElement.style.fontWeight = "500";
  container.appendChild(successElement);
}

export function initializeAddTeacherForm(form) {
  const colorInput = form.querySelector("#t-bgcolor");
  if (colorInput) {
    colorInput.value = getRandomColor();
  }
}
