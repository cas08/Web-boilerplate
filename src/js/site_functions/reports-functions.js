let countriesReport = null;
let teachersReport = null;

export function initializeReportsTabs() {
  const reportsTabs = document.querySelectorAll(".statistics__reports-tab");
  const reports = document.querySelectorAll(".statistics__report");

  reportsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const reportType = tab.getAttribute("data-report");

      reportsTabs.forEach((t) =>
        t.classList.remove("statistics__reports-tab--active")
      );
      reports.forEach((r) => r.classList.remove("statistics__report--active"));

      tab.classList.add("statistics__reports-tab--active");
      const targetReport = document.getElementById(`${reportType}-report`);
      if (targetReport) {
        targetReport.classList.add("statistics__report--active");

        if (
          window.currentTeachersData &&
          window.currentTeachersData.length > 0
        ) {
          updateReports(window.currentTeachersData);
        }
      }
    });
  });
}

export function createCountriesReport(teachers) {
  const container = document.getElementById("webdatarocks-countries");
  if (!container) {
    console.error("Countries report container not found");
    return;
  }

  if (!Array.isArray(teachers)) {
    console.error("Teachers data is not an array:", teachers);
    container.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #e74c3c;">No data available</div>';
    return;
  }

  if (teachers.length === 0) {
    console.warn("No teachers data available");
    container.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">No teachers found</div>';
    return;
  }

  const reportData = teachers.map((teacher) => ({
    Country: teacher.country || "Unknown",
    Region: teacher.region || "Unknown",
    Gender: teacher.gender || "Unknown",
    Age: teacher.age || 0,
    Specialty: teacher.specialty || "Unknown",
    Name: teacher.full_name || "Unknown",
    Email: teacher.email || "Unknown",
    Phone: teacher.phone || "Unknown",
  }));

  const report = {
    dataSource: {
      data: reportData,
    },
    slice: {
      rows: [{ uniqueName: "Country" }],
      columns: [{ uniqueName: "Measures" }],
      measures: [
        { uniqueName: "Age", aggregation: "average" },
        { uniqueName: "Name", aggregation: "count" },
      ],
    },
    options: {
      grid: {
        showTotals: "on",
        showGrandTotals: "on",
      },
    },
  };
  if (countriesReport) {
    countriesReport.dispose();
  }
  try {
    countriesReport = new WebDataRocks({
      container: container,
      report: report,
      width: "100%",
      height: "100%",
    });
  } catch (error) {
    console.error("Error creating countries report:", error);
  }
}

export function createTeachersReport(teachers) {
  const container = document.getElementById("webdatarocks-teachers");
  if (!container) {
    console.error("Teachers report container not found");
    return;
  }

  if (!Array.isArray(teachers)) {
    console.error("Teachers data is not an array:", teachers);
    container.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #e74c3c;">No data available</div>';
    return;
  }

  if (teachers.length === 0) {
    console.warn("No teachers data available");
    container.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">No teachers found</div>';
    return;
  }

  const reportData = teachers.map((teacher) => ({
    "Full Name": teacher.full_name || "Unknown",
    Email: teacher.email || "Unknown",
    Phone: teacher.phone || "Unknown",
    Country: teacher.country || "Unknown",
    City: teacher.city || "Unknown",
    Gender: teacher.gender || "Unknown",
    Age: teacher.age || 0,
    Specialty: teacher.course || "Unknown",
    "Birth Date": teacher.b_date || teacher.birth_date || "Unknown",
    Note: teacher.note || "No notes",
    Favorite: teacher.favorite ? "Yes" : "No",
    "Has Photo": teacher.picture_large ? "Yes" : "No",
  }));

  console.log(reportData[0]);

  const report = {
    dataSource: {
      data: reportData,
    },
    slice: {
      rows: [
        { uniqueName: "Full Name" },
        { uniqueName: "Email" },
        { uniqueName: "Phone" },
        { uniqueName: "Country" },
        { uniqueName: "City" },
        { uniqueName: "Gender" },
        { uniqueName: "Age" },
        { uniqueName: "Specialty" },
        { uniqueName: "Birth Date" },
        { uniqueName: "Note" },
        { uniqueName: "Favorite" },
        { uniqueName: "Has Photo" },
      ],
    },
    options: {
      grid: {
        type: "flat",
        showTotals: "off",
        showGrandTotals: "off",
        showHeaders: "on",
        showRowHeaders: "off",
        showColumnHeaders: "on",
      },
    },
  };

  if (teachersReport) {
    teachersReport.dispose();
  }
  try {
    teachersReport = new WebDataRocks({
      container: container,
      report: report,
      width: "100%",
      height: "100%",
    });
  } catch (error) {
    console.error("Error creating teachers report:", error);
    console.error("Error details:", error.message, error.stack);
  }
}

export function updateReports(teachers) {
  if (!Array.isArray(teachers)) {
    console.error("updateReports: Teachers data is not an array:", teachers);
    return;
  }

  if (teachers.length === 0) {
    console.warn("updateReports: No teachers data available");
    return;
  }
  const countriesContainer = document.getElementById("webdatarocks-countries");
  const teachersContainer = document.getElementById("webdatarocks-teachers");

  if (countriesContainer) {
    countriesContainer.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">Loading WebDataRocks...</div>';
  }
  if (teachersContainer) {
    teachersContainer.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">Loading WebDataRocks...</div>';
  }

  createCountriesReport(teachers);
  createTeachersReport(teachers);
}
