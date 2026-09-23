const today = new Date();
today.setHours(0, 0, 0, 0);
const currentYear = today.getFullYear();
const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const events = {};
const colourNames = {
  study: "Синий",
  work: "Зелёный",
  project: "Жёлтый",
  personal: "Розовый",
  finance: "Бирюзовый",
};
const monthNamesGenitive = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const calendar = document.querySelector(".year-columns");
const app = document.querySelector(".app");
const creationDialog = document.querySelector("#yearly-event-dialog");
const cardDialog = document.querySelector("#event-card-dialog");
const eventForm = document.querySelector("#yearly-event-form");
const nameInput = document.querySelector("#yearly-event-name");
let activeDialog = null;
let dialogOpener = null;
let creationDate = null;

function getDateKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return `${day} ${monthNamesGenitive[month - 1]} ${year} · ${getWeekday(year, month - 1, day)}`;
}

function updateEventButton(button, key) {
  const event = events[key];
  button.className = event ? `cell-button event ${event.colour}` : "cell-button empty-event";
  button.replaceChildren();
  button.setAttribute("aria-label", event
    ? `Открыть событие «${event.title}», ${formatDate(key)}`
    : `Создать событие, ${formatDate(key)}`);
  if (event) {
    const label = document.createElement("span");
    label.className = "event-label";
    label.textContent = event.title;
    button.append(label);
  }
}

function createEventButton(year, monthIndex, day) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.date = getDateKey(year, monthIndex, day);
  updateEventButton(button, button.dataset.date);
  return button;
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getWeekday(year, monthIndex, day) {
  const date = new Date(year, monthIndex, day);
  return weekDays[(date.getDay() + 6) % 7];
}

function applyDayState(row, date) {
  const weekday = date.getDay();
  if (weekday === 0 || weekday === 6) {
    row.classList.add("weekend");
  }

  if (date.getTime() === today.getTime()) {
    row.classList.add("today");
    row.setAttribute("aria-current", "date");
  } else if (date < today) {
    row.classList.add("past");
  }
}

function createDayRow(year, monthIndex, day) {
  const row = document.createElement("div");
  row.className = "calendar-cell";
  applyDayState(row, new Date(year, monthIndex, day));

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

  line.append(number, weekday, createEventButton(year, monthIndex, day));
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

  column.replaceChildren(column.querySelector(".month-name"), rows);
}

function renderCalendar(year) {
  document.querySelector("#calendar-year").textContent = year;
  document.querySelectorAll(".month-column").forEach((column, monthIndex) => {
    renderMonth(column, year, monthIndex);
  });
}

function openDialog(dialog, opener, focusTarget) {
  activeDialog = dialog;
  dialogOpener = opener;
  app.inert = true;
  dialog.hidden = false;
  focusTarget.focus({ preventScroll: true });
}

function closeDialog() {
  if (!activeDialog) return;
  activeDialog.hidden = true;
  app.inert = false;
  dialogOpener.focus({ preventScroll: true });
  activeDialog = null;
  dialogOpener = null;
  creationDate = null;
}

function openCreationForm(button) {
  creationDate = button.dataset.date;
  eventForm.reset();
  nameInput.setCustomValidity("");
  document.querySelector("#yearly-event-date").textContent = `Дата: ${formatDate(creationDate)}`;
  openDialog(creationDialog, button, nameInput);
}

function openEventCard(button) {
  const key = button.dataset.date;
  const event = events[key];
  document.querySelector("#event-card-title").textContent = event.title;
  document.querySelector("#event-card-date").textContent = formatDate(key);
  document.querySelector("#event-card-colour").textContent = colourNames[event.colour];
  document.querySelector("#event-card-description").textContent = event.description || "Без описания";
  openDialog(cardDialog, button, cardDialog.querySelector("[data-close-dialog]"));
}

function submitEvent(event) {
  event.preventDefault();
  const title = nameInput.value.trim();
  nameInput.setCustomValidity(title ? "" : "Введите название события.");
  if (!eventForm.reportValidity()) return;
  if (!creationDate || events[creationDate]) return;

  events[creationDate] = {
    title,
    colour: eventForm.elements.colour.value,
    description: eventForm.elements.description.value.trim(),
  };
  updateEventButton(dialogOpener, creationDate);
  closeDialog();
}

function handleDialogKeydown(event) {
  if (!activeDialog) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeDialog();
  } else if (event.key === "Tab") {
    const controls = activeDialog.querySelectorAll("button, input, select, textarea");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

calendar.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-date]");
  if (!button || !calendar.contains(button)) return;
  if (events[button.dataset.date]) openEventCard(button);
  else openCreationForm(button);
});

for (const dialog of [creationDialog, cardDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest("[data-close-dialog]")) closeDialog();
  });
}
document.addEventListener("keydown", handleDialogKeydown);
nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
eventForm.addEventListener("submit", submitEvent);

renderCalendar(currentYear);
