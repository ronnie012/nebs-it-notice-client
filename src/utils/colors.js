export const DEPARTMENT_COLORS = {
  "All Departments": "#FF5733",
  "Individual": "#008000",
  "Finance": "#3357FF",
  "Sales Team": "#FF33A1",
  "Web Team": "#B8860B",
  "Database Team": "#A133FF",
  "Admin": "#008B8B",
  "HR": "#FF9633",
};

export function getDepartmentHexColor(departmentName) {
  if (!departmentName) {
    return "#6B7280"; // Default gray-500 color for text
  }
  return DEPARTMENT_COLORS[departmentName] || "#6B7280"; // Fallback to default gray
}