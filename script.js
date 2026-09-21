const currentYear = new Date().getFullYear();
const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getWeekday(year, monthIndex, day) {
  const date = new Date(year, monthIndex, day);
  return weekDays[(date.getDay() + 6) % 7];
}

function createDayRow(year, monthIndex, day) {
  const row = document.createElement("div");
  row.className = "calendar-cell";

  const line = document.createElement("div");
  line.className = "day-line";

  const number = document.createElement("span");
  number.className = "date-number";
  number.textContent = day;

  const weekday = document.createElement("span");
  weekday.className = "cell-weekday";
  const label = document.createElement("span");
  label.className = "weekday-label";
  label.textContent = getWeekday(year, monthIndex, day);
  weekday.append(label);

  line.append(number, weekday);
  row.append(line);
  return row;
}

function createBlankRow() {
  const row = document.createElement("div");
  row.className = "calendar-cell blank";
  row.setAttribute("aria-hidden", "true");
  return row;
}

function renderMonth(column, year, monthIndex) {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const rows = document.createDocumentFragment();

  for (let day = 1; day <= 31; day += 1) {
    rows.append(
      day <= daysInMonth
        ? createDayRow(year, monthIndex, day)
        : createBlankRow(),
    );
  }

  column.append(rows);
}

function renderCalendar(year) {
  document.querySelector("#calendar-year").textContent = year;
  document.querySelectorAll(".month-column").forEach((column, monthIndex) => {
    renderMonth(column, year, monthIndex);
  });
}

renderCalendar(currentYear);
