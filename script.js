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
const listDialog = document.querySelector("#day-events-dialog");
const dayEventList = document.querySelector("#day-event-list");
const createFromList = document.querySelector("#create-event-from-list");
const eventForm = document.querySelector("#yearly-event-form");
const nameInput = document.querySelector("#yearly-event-name");
const editButton = document.querySelector("#edit-event");
const deleteButton = document.querySelector("#delete-event");
const cardActions = document.querySelector("#event-card-actions");
const deleteNotice = document.querySelector("#event-delete-notice");
const deleteConfirm = document.querySelector("#event-delete-confirm");
const cancelDeleteButton = document.querySelector("#cancel-event-delete");
let activeDialog = null;
let dialogOpener = null;
let creationDate = null;
let listDate = null;
let selectedEvent = null;
let editingEvent = null;
let pendingDeletion = null;

function getDateKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return `${day} ${monthNamesGenitive[month - 1]} ${year} · ${getWeekday(year, month - 1, day)}`;
}

function updateEventButton(button, key) {
  const dayEvents = events[key] || [];
  const event = dayEvents[0];
  const hiddenCount = dayEvents.length - 1;
  button.className = event ? `cell-button event ${event.colour}` : "cell-button empty-event";
  button.classList.toggle("has-more", hiddenCount > 0);
  button.replaceChildren();
  button.setAttribute("aria-label", event
    ? (hiddenCount > 0
      ? `События дня: ${dayEvents.length}, ${formatDate(key)}`
      : `Открыть событие «${event.title}», ${formatDate(key)}`)
    : `Создать событие, ${formatDate(key)}`);
  if (event) {
    const label = document.createElement("span");
    label.className = "event-label";
    label.textContent = event.title;
    button.append(label);
    if (hiddenCount > 0) {
      const corner = document.createElement("span");
      corner.className = "more-corner";
      corner.setAttribute("aria-hidden", "true");
      const count = document.createElement("span");
      count.textContent = `+${hiddenCount}`;
      corner.append(count);
      button.append(corner);
    }
  }
}

function createEventButton(year, monthIndex, day) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.date = getDateKey(year, monthIndex, day);
  button.dataset.action = "open-day";
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

  const weekday = document.createElement("button");
  weekday.type = "button";
  weekday.className = "cell-weekday";
  weekday.dataset.date = getDateKey(year, monthIndex, day);
  weekday.dataset.action = "create-event";
  weekday.setAttribute("aria-label", `Создать ещё одно событие, ${formatDate(weekday.dataset.date)}`);
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
  if (activeDialog) activeDialog.hidden = true;
  else dialogOpener = opener;
  activeDialog = dialog;
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
  listDate = null;
  selectedEvent = null;
  editingEvent = null;
  pendingDeletion = null;
}

function prepareEventForm(key, event = null) {
  creationDate = key;
  editingEvent = event;
  eventForm.reset();
  nameInput.setCustomValidity("");
  document.querySelector("#yearly-event-title").textContent = event ? "Редактировать событие" : "Новое событие";
  eventForm.querySelector("[type=submit]").textContent = event ? "Сохранить изменения" : "Создать событие";
  if (event) {
    nameInput.value = event.title;
    eventForm.elements.colour.value = event.colour;
    eventForm.elements.description.value = event.description;
  }
  document.querySelector("#yearly-event-date").textContent = `Дата: ${formatDate(creationDate)}`;
}

function openCreationForm(key, opener = null, fromList = false) {
  prepareEventForm(key);
  creationDialog.querySelector("[data-back-to-list]").hidden = !fromList;
  openDialog(creationDialog, opener, nameInput);
}

function openEventCard(key, index, opener = null, fromList = false) {
  const event = events[key][index];
  selectedEvent = { key, event, fromList };
  setDeleteConfirmation(false);
  cardDialog.querySelector("[data-back-to-list]").hidden = !fromList;
  document.querySelector("#event-card-title").textContent = event.title;
  document.querySelector("#event-card-date").textContent = formatDate(key);
  document.querySelector("#event-card-colour").textContent = colourNames[event.colour];
  document.querySelector("#event-card-description").textContent = event.description || "Без описания";
  openDialog(cardDialog, opener, cardDialog.querySelector("[data-close-dialog]"));
}

function openEventEditor() {
  if (!selectedEvent) return;
  prepareEventForm(selectedEvent.key, selectedEvent.event);
  creationDialog.querySelector("[data-back-to-list]").hidden = true;
  openDialog(creationDialog, null, nameInput);
}

function cancelEditing() {
  const { key, event, fromList } = selectedEvent;
  editingEvent = null;
  creationDate = null;
  openEventCard(key, events[key].indexOf(event), null, fromList);
  editButton.focus({ preventScroll: true });
}

function setDeleteConfirmation(visible) {
  pendingDeletion = visible ? selectedEvent : null;
  cardActions.hidden = visible;
  deleteNotice.hidden = !visible;
  deleteConfirm.hidden = !visible;
  cardDialog.querySelector("[data-back-to-list]").hidden = visible || !selectedEvent?.fromList;
}

function requestDeletion() {
  if (!selectedEvent) return;
  deleteNotice.textContent = `Удалить событие «${selectedEvent.event.title}»?`;
  setDeleteConfirmation(true);
  cancelDeleteButton.focus({ preventScroll: true });
}

function cancelDeletion() {
  setDeleteConfirmation(false);
  deleteButton.focus({ preventScroll: true });
}

function refreshDate(key) {
  const button = calendar.querySelector(`[data-action="open-day"][data-date="${key}"]`);
  updateEventButton(button, key);
}

function confirmDeletion() {
  if (!pendingDeletion || activeDialog !== cardDialog) return;
  const { key, event } = pendingDeletion;
  setDeleteConfirmation(false);
  const index = events[key]?.indexOf(event) ?? -1;
  if (index < 0) return;
  events[key].splice(index, 1);
  if (events[key].length === 0) delete events[key];
  refreshDate(key);
  if (events[key]?.length) openDayEvents(key);
  else closeDialog();
}

function dismissDialog() {
  if (activeDialog === creationDialog && editingEvent) cancelEditing();
  else if (activeDialog === cardDialog && pendingDeletion) cancelDeletion();
  else closeDialog();
}

function createListEvent(event, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "day-event-row";
  button.dataset.eventIndex = index;
  const dot = document.createElement("span");
  dot.className = `day-event-dot ${event.colour}`;
  dot.setAttribute("aria-hidden", "true");
  const copy = document.createElement("span");
  copy.className = "day-event-copy";
  const name = document.createElement("span");
  name.className = "day-event-name";
  name.textContent = event.title;
  const description = document.createElement("span");
  description.className = "day-event-description";
  description.textContent = event.description || "Без описания";
  copy.append(name, description);
  button.append(dot, copy);
  return button;
}

function openDayEvents(key, opener = null) {
  selectedEvent = null;
  listDate = key;
  document.querySelector("#day-events-date").textContent = formatDate(key);
  dayEventList.replaceChildren(...(events[key] || []).map(createListEvent));
  openDialog(listDialog, opener, dayEventList.querySelector("button") || createFromList);
}

function submitEvent(event) {
  event.preventDefault();
  const title = nameInput.value.trim();
  nameInput.setCustomValidity(title ? "" : "Введите название события.");
  if (!eventForm.reportValidity()) return;
  if (!creationDate) return;

  const changes = {
    title,
    colour: eventForm.elements.colour.value,
    description: eventForm.elements.description.value.trim(),
  };
  if (editingEvent) {
    if (!events[creationDate]?.includes(editingEvent)) return;
    Object.assign(editingEvent, changes);
  } else {
    if (!events[creationDate]) events[creationDate] = [];
    events[creationDate].push(changes);
  }
  refreshDate(creationDate);
  closeDialog();
}

function handleDialogKeydown(event) {
  if (!activeDialog) return;
  if (event.key === "Escape") {
    event.preventDefault();
    dismissDialog();
  } else if (event.key === "Tab") {
    const controls = [...activeDialog.querySelectorAll("button, input, select, textarea")]
      .filter((control) => !control.hidden && !control.disabled && control.getClientRects().length > 0);
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
  const key = button.dataset.date;
  const count = events[key]?.length || 0;
  if (button.dataset.action === "create-event" || count === 0) openCreationForm(key, button);
  else if (count === 1) openEventCard(key, 0, button);
  else openDayEvents(key, button);
});

dayEventList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-event-index]");
  if (button) openEventCard(listDate, Number(button.dataset.eventIndex), null, true);
});
createFromList.addEventListener("click", () => openCreationForm(listDate, null, true));
editButton.addEventListener("click", openEventEditor);
deleteButton.addEventListener("click", requestDeletion);
cancelDeleteButton.addEventListener("click", cancelDeletion);
document.querySelector("#confirm-event-delete").addEventListener("click", confirmDeletion);

for (const dialog of [creationDialog, cardDialog, listDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest("[data-close-dialog]")) dismissDialog();
    else if (event.target.closest("[data-back-to-list]")) openDayEvents(listDate);
  });
}
document.addEventListener("keydown", handleDialogKeydown);
nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
eventForm.addEventListener("submit", submitEvent);

renderCalendar(currentYear);
