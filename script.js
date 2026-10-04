let today = new Date();
today.setHours(0, 0, 0, 0);
const currentYear = today.getFullYear();
let displayedYear = currentYear;
const minimumYear = 1;
const maximumYear = 9999;
const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const events = {};
const calendarPalette = [
  { value: "yellow", label: "Солнечный" },
  { value: "amber", label: "Янтарный" },
  { value: "peach", label: "Персиковый" },
  { value: "coral", label: "Коралловый" },
  { value: "pink", label: "Розовый" },
  { value: "rose", label: "Пудровый" },
  { value: "violet", label: "Фиолетовый" },
  { value: "indigo", label: "Индиго" },
  { value: "blue", label: "Голубой" },
  { value: "sky", label: "Небесный" },
  { value: "mint", label: "Мятный" },
  { value: "teal", label: "Бирюзовый" },
  { value: "green", label: "Зелёный" },
  { value: "lime", label: "Лаймовый" },
  { value: "sand", label: "Песочный" },
  { value: "slate", label: "Серый" },
];
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
const calendarScroll = document.querySelector(".calendar-scroll");
const yearNavigationButtons = [...document.querySelectorAll("[data-year-nav]")];
const todayButton = document.querySelector("[data-go-today]");
let todayFocusTimer = null;
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
const filtersDialog = document.querySelector("#year-filters");
const filtersButton = document.querySelector("#open-year-filters");
const filterList = document.querySelector("#year-filter-list");
const filterSummary = document.querySelector("#filter-summary");
const resetFiltersButton = document.querySelector("#reset-year-filters");
const selectedEventFilters = new Set();
const thoughtStorageKey = "my-calendar-year-thoughts-v3";
const thoughtColours = ["", ...calendarPalette.map(({ value }) => value)];
const templateStorageKey = "my-calendar-year-templates-v2";
const templateColourNames = Object.fromEntries(calendarPalette.map(({ value, label }) => [toEventColour(value), label]));
const eventColourPalette = document.querySelector("#event-colour-palette");
const thoughtColourPalette = document.querySelector("#thought-colour-palette");
const legacyEventColour = document.querySelector("#event-legacy-colour");
const templateSelect = document.querySelector("#yearly-event-template");
const templateField = document.querySelector("#yearly-event-template-field");
const templateHelp = document.querySelector("#yearly-event-template-help");
const templateNotice = document.querySelector("#event-template-notice");
let savedTemplates = [];
const thoughtDialog = document.querySelector("#thought-dialog");
const thoughtForm = document.querySelector("#thought-form");
const thoughtText = document.querySelector("#thought-text");
const thoughtAddButton = document.querySelector("#add-thought");
const thoughtScroll = document.querySelector("#thought-scroll");
const thoughtTrack = document.querySelector("#thought-track");
const thoughtLoadError = document.querySelector("#thought-load-error");
const thoughtSaveError = document.querySelector("#thought-save-error");
let thoughts = [];
let thoughtStorageSnapshot = null;
let thoughtStorageBlocked = false;
let pendingThought = null;
let activeDialog = null;
let dialogOpener = null;
let creationDate = null;
let listDate = null;
let selectedEvent = null;
let editingEvent = null;
let pendingDeletion = null;
const historyRecords = [];
const historyTimeline = document.querySelector("#history-timeline");
const historyScroll = document.querySelector("#history-scroll");
const historyDeleteDialog = document.querySelector("#history-delete-dialog");
let historyEntryToDelete = null;
const historyStorageKey = "my-calendar-year-history-v2";
const legacyHistoryStorageKey = "my-calendar-year-history-v1";
const historyLoadError = document.querySelector("#history-load-error");
const historyDeleteError = document.querySelector("#history-delete-error");
let historyStorageSnapshot = null;
let legacyHistorySnapshot = null;
let historyUsesLegacy = false;
let historyStorageBlocked = false;
let pendingHistoryRecord = null;
const settingsStorageKey = "my-calendar-settings-v1";
const yearScales = ["compact", "standard", "large"];
const settingsDialog = document.querySelector("#year-settings");
const settingsButton = document.querySelector("#open-year-settings");
const scaleButtons = [...settingsDialog.querySelectorAll("[data-year-scale]")];
const settingsError = document.querySelector("#year-settings-error");
let yearScale = "standard";
let yearScaleDraft = yearScale;
const eventStorageKey = "my-calendar-year-events-v2";
const storedEventRecords = new WeakMap();
const eventLoadError = document.querySelector("#event-load-error");
const eventSaveError = document.querySelector("#event-save-error");
const eventDeleteError = document.querySelector("#event-delete-error");
let eventStorageSnapshot = null;
let eventStorageBlocked = false;

function showEventStorageError(element, message = "") {
  element.textContent = message;
  element.hidden = !message;
}

function isCalendarDate(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function parseYearEvents(raw) {
  if (raw === null) return {};
  const stored = JSON.parse(raw);
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) throw new Error("Invalid events data");
  return Object.fromEntries(Object.entries(stored).map(([date, records]) => {
    if (!isCalendarDate(date) || !Array.isArray(records)) throw new Error("Invalid event date or collection");
    return [date, records.map((record) => {
      if (!Array.isArray(record) || record.length < 2
        || typeof record[0] !== "string" || !record[0].trim()
        || typeof record[1] !== "string" || !Object.hasOwn({ ...colourNames, ...templateColourNames }, record[1])
        || (record.length > 2 && typeof record[2] !== "string")
        || record[3] === "thought") throw new Error("Unsupported event record");
      const event = { title: record[0], colour: record[1], description: record[2] ?? "" };
      // Keep the original tuple, including opaque metadata beyond the visible fields.
      storedEventRecords.set(event, record);
      return event;
    })];
  }));
}

function serializeYearEvents(state) {
  return JSON.stringify(Object.fromEntries(Object.entries(state).map(([date, dayEvents]) => [date,
    dayEvents.map((event) => {
      const record = [...(storedEventRecords.get(event) || ["", "", ""])];
      record[0] = event.title;
      record[1] = event.colour;
      if (record.length > 2 || event.description !== "") record[2] = event.description;
      return record;
    }),
  ])));
}

function loadYearEvents() {
  try {
    eventStorageSnapshot = localStorage.getItem(eventStorageKey);
    Object.assign(events, parseYearEvents(eventStorageSnapshot));
  } catch {
    eventStorageBlocked = true;
    showEventStorageError(eventLoadError, "Не удалось загрузить события: данные повреждены, имеют неподдерживаемый формат или хранилище недоступно. Запись событий заблокирована, исходные данные не изменены. После восстановления данных или доступа перезагрузите страницу.");
  }
}

function saveYearEvents(nextEvents, errorElement) {
  if (eventStorageBlocked) {
    showEventStorageError(errorElement, eventLoadError.textContent);
    return false;
  }
  try {
    if (localStorage.getItem(eventStorageKey) !== eventStorageSnapshot) {
      showEventStorageError(errorElement, "Сохранённые события изменились после загрузки страницы, возможно в другой вкладке. Запись остановлена. Скопируйте несохранённый ввод перед обновлением страницы: он будет потерян при перезагрузке.");
      return false;
    }
    const serialized = serializeYearEvents(nextEvents);
    localStorage.setItem(eventStorageKey, serialized);
    eventStorageSnapshot = serialized;
  } catch {
    showEventStorageError(errorElement, "Не удалось сохранить события. Операция не выполнена: текущие события и несохранённый ввод не изменены. Проверьте доступ к хранилищу и повторите попытку или отмените действие.");
    return false;
  }
  showEventStorageError(errorElement);
  return true;
}

function readYearSettings() {
  const raw = localStorage.getItem(settingsStorageKey);
  if (raw === null) return {};
  const settings = JSON.parse(raw);
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    throw new Error("Invalid settings structure");
  }
  return settings;
}

function showSettingsError(message = "") {
  settingsError.textContent = message;
  settingsError.hidden = !message;
}

function applyYearScale(scale) {
  document.body.dataset.yearScale = scale;
  scaleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.yearScale === scale));
  });
}

function loadYearScale() {
  try {
    const settings = readYearSettings();
    yearScale = yearScales.includes(settings.yearScale) ? settings.yearScale : "standard";
  } catch {
    showSettingsError("Не удалось прочитать настройки. Используется обычный масштаб. Исходные данные не изменены.");
  }
  applyYearScale(yearScale);
}

function openYearSettings() {
  yearScaleDraft = yearScale;
  applyYearScale(yearScaleDraft);
  settingsButton.setAttribute("aria-expanded", "true");
  openDialog(settingsDialog, settingsButton, settingsDialog.querySelector('[aria-pressed="true"]'));
}

function saveYearSettings() {
  if (activeDialog !== settingsDialog) return;
  let settings;
  try {
    settings = readYearSettings();
  } catch {
    showSettingsError("Не удалось прочитать текущие настройки. Сохранение остановлено, чтобы не затереть исходные данные. Можно повторить попытку или отменить выбор.");
    return;
  }
  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify({ ...settings, yearScale: yearScaleDraft }));
  } catch {
    showSettingsError("Не удалось сохранить масштаб. Проверьте доступность хранилища и повторите попытку или отмените выбор.");
    return;
  }
  yearScale = yearScaleDraft;
  showSettingsError();
  closeDialog();
}

function historyTitle(record) {
  return Object.hasOwn(record, "title") ? record.title : record.label;
}

function parseHistory(raw) {
  if (raw === null) return [];
  const records = JSON.parse(raw);
  const ids = new Set();
  if (!Array.isArray(records) || !records.every((record) => {
    if (!record || typeof record !== "object" || Array.isArray(record)
      || typeof record.id !== "string" || !record.id.trim() || ids.has(record.id)
      || typeof record.date !== "string" || !isCalendarDate(record.date)) return false;
    const full = Object.hasOwn(record, "title");
    const title = historyTitle(record);
    if (typeof title !== "string" || !title.trim()
      || ((full || Object.hasOwn(record, "colour")) && typeof record.colour !== "string")
      || ((full || Object.hasOwn(record, "description")) && typeof record.description !== "string")
      || (Object.hasOwn(record, "label") && typeof record.label !== "string")) return false;
    ids.add(record.id);
    return true;
  })) throw new Error("Invalid history data");
  // Preserve legacy records and extra fields without inventing missing snapshot data.
  return records;
}

function loadHistory() {
  try {
    historyStorageSnapshot = localStorage.getItem(historyStorageKey);
    historyUsesLegacy = historyStorageSnapshot === null;
    if (historyUsesLegacy) legacyHistorySnapshot = localStorage.getItem(legacyHistoryStorageKey);
    const records = parseHistory(historyUsesLegacy ? legacyHistorySnapshot : historyStorageSnapshot);
    records.forEach((record) => historyRecords.push(record));
  } catch {
    historyStorageBlocked = true;
    showEventStorageError(historyLoadError, "Не удалось загрузить историю: данные повреждены, имеют неподдерживаемый формат или хранилище недоступно. Запись истории заблокирована, исходные данные не изменены. После восстановления данных или доступа перезагрузите страницу.");
  }
  renderHistory();
}

function saveHistory(nextRecords, errorElement) {
  if (historyStorageBlocked) {
    showEventStorageError(errorElement, historyLoadError.textContent);
    return false;
  }
  try {
    if (localStorage.getItem(historyStorageKey) !== historyStorageSnapshot
      || (historyUsesLegacy && localStorage.getItem(legacyHistoryStorageKey) !== legacyHistorySnapshot)) {
      showEventStorageError(errorElement, "История изменилась после загрузки страницы, возможно в другой вкладке. Запись остановлена, чужие изменения сохранены. Обновите страницу перед повторной попыткой; сначала сохраните несохранённый ввод.");
      return false;
    }
    const serialized = JSON.stringify(nextRecords);
    localStorage.setItem(historyStorageKey, serialized);
    historyStorageSnapshot = serialized;
    historyUsesLegacy = false;
  } catch {
    showEventStorageError(errorElement, "Не удалось сохранить историю. Добавление или удаление не выполнено. Проверьте доступ к хранилищу и повторите попытку или отмените действие.");
    return false;
  }
  showEventStorageError(errorElement);
  return true;
}

function createHistoryCard(record) {
  const card = document.createElement("article");
  card.className = "history-card";
  const copy = document.createElement("div");
  const title = document.createElement("p");
  title.className = "history-title";
  title.textContent = historyTitle(record);
  const date = document.createElement("p");
  date.className = "history-date";
  date.textContent = formatDate(record.date);
  copy.append(title, date);
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "history-delete";
  remove.dataset.historyId = record.id;
  remove.setAttribute("aria-label", `Удалить «${historyTitle(record)}» из истории, ${formatDate(record.date)}`);
  remove.append(cardDialog.querySelector(".settings-close svg").cloneNode(true));
  card.append(copy, remove);
  return card;
}

function renderHistory() {
  const scrollLeft = historyScroll.scrollLeft;
  const entries = [...historyRecords].sort((a, b) => a.date.localeCompare(b.date));
  const fragment = document.createDocumentFragment();
  entries.forEach((record, index) => {
    fragment.append(createHistoryCard(record));
    const line = document.createElement("span");
    line.className = index === entries.length - 1 ? "history-continuation" : "history-connector";
    line.setAttribute("aria-hidden", "true");
    fragment.append(line);
  });
  historyTimeline.replaceChildren(fragment);
  document.querySelector("#history-empty").hidden = entries.length > 0 || historyStorageBlocked;
  historyScroll.scrollLeft = scrollLeft;
}

function addEventHistory() {
  if (!selectedEvent || pendingDeletion || activeDialog !== cardDialog) return;
  const { title, colour, description } = selectedEvent.event;
  if (!pendingHistoryRecord) {
    pendingHistoryRecord = { id: `history-${crypto.randomUUID()}`, date: selectedEvent.key, title, colour, description };
  }
  if (!saveHistory([...historyRecords, pendingHistoryRecord], templateNotice)) return;
  historyRecords.push(pendingHistoryRecord);
  pendingHistoryRecord = null;
  renderHistory();
  templateNotice.textContent = "Снимок события добавлен в историю. Исходное событие осталось без изменений.";
  templateNotice.hidden = false;
}

function openHistoryDelete(button) {
  const record = historyRecords.find((item) => item.id === button.dataset.historyId);
  if (!record) return;
  historyEntryToDelete = record.id;
  showEventStorageError(historyDeleteError);
  document.querySelector("#history-delete-copy").textContent = `Удалить «${historyTitle(record)}» (${formatDate(record.date)})? Будет удалён только этот снимок. Исходное событие останется без изменений.`;
  openDialog(historyDeleteDialog, button, document.querySelector("#cancel-history-delete"));
}

function confirmHistoryDeletion() {
  if (activeDialog !== historyDeleteDialog || !historyEntryToDelete) return;
  const index = historyRecords.findIndex((item) => item.id === historyEntryToDelete);
  if (index < 0) return;
  if (!saveHistory(historyRecords.filter((_, position) => position !== index), historyDeleteError)) return;
  const buttons = [...historyTimeline.querySelectorAll(".history-delete")];
  const position = buttons.findIndex((button) => button.dataset.historyId === historyEntryToDelete);
  const nextId = (buttons[position + 1] || buttons[position - 1])?.dataset.historyId;
  historyRecords.splice(index, 1);
  renderHistory();
  dialogOpener = [...historyTimeline.querySelectorAll(".history-delete")]
    .find((button) => button.dataset.historyId === nextId) || historyScroll;
  closeDialog();
}

function showThoughtError(element, message) {
  element.textContent = message;
  element.hidden = !message;
}

function parseThoughts(raw) {
  if (raw === null) return [];
  const items = JSON.parse(raw);
  const ids = new Set();
  if (!Array.isArray(items) || !items.every((item) => {
    if (!item || typeof item.id !== "string" || !item.id.trim() || ids.has(item.id)
      || typeof item.text !== "string" || !item.text.trim() || !thoughtColours.includes(item.colour)) return false;
    ids.add(item.id);
    return true;
  })) throw new Error("Invalid thoughts data");
  return items.map(({ id, text, colour }) => ({ id, text, colour }));
}

function loadThoughts() {
  try {
    thoughtStorageSnapshot = localStorage.getItem(thoughtStorageKey);
    thoughts = parseThoughts(thoughtStorageSnapshot);
  } catch {
    thoughtStorageBlocked = true;
    showThoughtError(thoughtLoadError, "Не удалось загрузить мысли: сохранённые данные повреждены или хранилище недоступно. Добавление заблокировано, чтобы не потерять сохранения. После восстановления данных или доступа перезагрузите страницу.");
  }
}

function renderThoughts() {
  thoughtTrack.replaceChildren(...thoughts.map((thought) => {
    const card = document.createElement("article");
    card.className = `thought ${thought.colour}`.trim();
    card.dataset.thoughtId = thought.id;
    card.textContent = thought.text;
    return card;
  }));
  document.querySelector("#thought-empty").hidden = thoughts.length > 0 || thoughtStorageBlocked;
}

function openThoughtDialog() {
  thoughtForm.reset();
  setThoughtColour("yellow");
  thoughtText.setCustomValidity("");
  pendingThought = null;
  showThoughtError(thoughtSaveError, thoughtStorageBlocked ? thoughtLoadError.textContent : "");
  openDialog(thoughtDialog, thoughtAddButton, thoughtText);
}

function submitThought(event) {
  event.preventDefault();
  if (activeDialog !== thoughtDialog) return;
  const text = thoughtText.value.trim();
  thoughtText.setCustomValidity(text ? "" : "Введите текст мысли.");
  if (!thoughtForm.reportValidity()) return;
  if (thoughtStorageBlocked) {
    showThoughtError(thoughtSaveError, thoughtLoadError.textContent);
    return;
  }
  try {
    if (localStorage.getItem(thoughtStorageKey) !== thoughtStorageSnapshot) {
      showThoughtError(thoughtSaveError, "Сохранённые мысли изменились после загрузки страницы. Скопируйте введённый текст и перезагрузите страницу, чтобы не затереть изменения.");
      return;
    }
    if (!pendingThought) pendingThought = { id: `thought-${crypto.randomUUID()}`, text, colour: "yellow" };
    pendingThought.text = text;
    pendingThought.colour = thoughtForm.elements.colour.value;
    const nextThoughts = [...thoughts, pendingThought];
    const serialized = JSON.stringify(nextThoughts);
    localStorage.setItem(thoughtStorageKey, serialized);
    thoughts = nextThoughts;
    thoughtStorageSnapshot = serialized;
  } catch {
    showThoughtError(thoughtSaveError, "Не удалось сохранить мысль. Текст остался в форме. Проверьте доступ к хранилищу и свободное место, затем попробуйте сохранить ещё раз.");
    return;
  }
  pendingThought = null;
  renderThoughts();
  closeDialog();
  thoughtScroll.scrollTo({ left: thoughtScroll.scrollWidth, behavior: "instant" });
}

function getEventColourName(colour) {
  return colourNames[colour] || templateColourNames[colour];
}

function readSavedTemplates() {
  const raw = localStorage.getItem(templateStorageKey);
  if (raw === null) return [];
  const items = JSON.parse(raw);
  const ids = new Set();
  if (!Array.isArray(items) || !items.every((item) => {
    if (!item || typeof item.id !== "string" || !item.id.trim() || ids.has(item.id)
      || typeof item.title !== "string" || !item.title.trim() || typeof item.description !== "string"
      || typeof item.type !== "string" || !Object.hasOwn({ ...colourNames, ...templateColourNames }, item.type)) return false;
    ids.add(item.id);
    return true;
  })) throw new Error("Invalid templates data");
  return items;
}

function renderTemplateOptions() {
  let error = "";
  try {
    savedTemplates = readSavedTemplates();
  } catch {
    savedTemplates = [];
    error = "Не удалось загрузить шаблоны: данные повреждены или хранилище недоступно. Сохранения не изменены. Событие можно создать вручную.";
  }
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = error ? "Шаблоны недоступны" : (savedTemplates.length ? "Без шаблона" : "Шаблонов пока нет");
  templateSelect.replaceChildren(empty);
  for (const template of savedTemplates) {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = `${template.title} · ${getEventColourName(template.type)}`;
    templateSelect.append(option);
  }
  templateSelect.disabled = savedTemplates.length === 0;
  templateHelp.textContent = error || (savedTemplates.length
    ? "Шаблон заполнит название, цвет и описание. Дата останется выбранной здесь."
    : "Сначала откройте событие и нажмите «Сохранить как шаблон».");
}

function toEventColour(colour) {
  return `thought-${colour}`;
}

function createColourPalette(container, toValue, onSelect) {
  container.replaceChildren(...calendarPalette.map(({ value, label }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `colour-option ${value}`;
    button.dataset.colour = toValue(value);
    button.setAttribute("aria-label", label);
    button.title = label;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => onSelect(button.dataset.colour));
    return button;
  }));
}

function updateColourPalette(container, colour) {
  container.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.colour === colour));
  });
}

function setThoughtColour(colour) {
  thoughtForm.elements.colour.value = colour;
  updateColourPalette(thoughtColourPalette, colour);
}

function setEventColour(colour) {
  eventForm.elements.colour.value = colour;
  updateColourPalette(eventColourPalette, colour);
  const isLegacy = Object.hasOwn(colourNames, colour);
  legacyEventColour.hidden = !isLegacy;
  legacyEventColour.textContent = isLegacy ? `Текущий цвет: ${colourNames[colour]} (сохранённый). Он останется, пока вы не выберете другой.` : "";
}

function applyEventTemplate() {
  if (editingEvent) return;
  const template = savedTemplates.find((item) => item.id === templateSelect.value);
  if (!template) return;
  nameInput.value = template.title;
  nameInput.setCustomValidity("");
  setEventColour(template.type);
  eventForm.elements.description.value = template.description;
  nameInput.focus({ preventScroll: true });
}

function saveEventTemplate() {
  if (!selectedEvent || pendingDeletion || activeDialog !== cardDialog) return;
  const { title, colour: type, description } = selectedEvent.event;
  templateNotice.hidden = false;
  let templates;
  try {
    templates = readSavedTemplates();
  } catch {
    templateNotice.textContent = "Не удалось прочитать шаблоны: данные повреждены или хранилище недоступно. Сохранение отменено, существующие данные не изменены.";
    return;
  }
  if (templates.some((item) => item.title === title && item.type === type && item.description === description)) {
    templateNotice.textContent = `Шаблон «${title}» уже сохранён.`;
    return;
  }
  try {
    const template = { id: `template-${crypto.randomUUID()}`, title, type, description };
    localStorage.setItem(templateStorageKey, JSON.stringify([...templates, template]));
  } catch {
    templateNotice.textContent = "Не удалось сохранить шаблон. Проверьте доступ к хранилищу и свободное место, затем попробуйте ещё раз.";
    return;
  }
  templateNotice.textContent = `Шаблон «${title}» сохранён. Его можно выбрать при создании следующего события.`;
}

function getDateKey(year, monthIndex, day) {
  return `${String(year).padStart(4, "0")}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return `${day} ${monthNamesGenitive[month - 1]} ${String(year).padStart(4, "0")} · ${getWeekday(year, month - 1, day)}`;
}

function updateEventButton(button, key) {
  const dayEvents = events[key] || [];
  const event = dayEvents[0];
  const hiddenCount = dayEvents.length - 1;
  button.className = event ? `cell-button event ${event.colour}` : "cell-button empty-event";
  button.classList.toggle("has-more", hiddenCount > 0);
  button.replaceChildren();
  updateEventFilter(button, key);
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

function updateEventFilter(button, key) {
  const dayEvents = events[key] || [];
  const matches = dayEvents.filter((event) => selectedEventFilters.has(event.title));
  const label = dayEvents.length > 1
    ? `События дня: ${dayEvents.length}, ${formatDate(key)}`
    : (dayEvents.length === 1
      ? `Открыть событие «${dayEvents[0].title}», ${formatDate(key)}`
      : `Создать событие, ${formatDate(key)}`);
  const matchSummary = selectedEventFilters.size && dayEvents.length
    ? `; совпадений с фильтром: ${matches.length}${matches.length ? ` — ${[...new Set(matches.map((event) => event.title))].join(", ")}` : ""}`
    : "";
  button.setAttribute("aria-label", label + matchSummary);
  button.classList.toggle("is-filtered", matches.length > 0);
  button.closest(".calendar-cell")?.classList.toggle("filter-has-selected", matches.length > 0);
}

function updateYearFilters() {
  const hasFilters = selectedEventFilters.size > 0;
  calendar.classList.toggle("filter-active", hasFilters);
  dayEventList.classList.toggle("filter-active", hasFilters);
  filtersButton.classList.toggle("filter-active", hasFilters);
  filtersButton.setAttribute("aria-label", hasFilters ? `Фильтры: выбрано ${selectedEventFilters.size}` : "Фильтры");
  filterSummary.textContent = `Выбрано: ${selectedEventFilters.size}`;
  resetFiltersButton.disabled = !hasFilters;
  calendar.querySelectorAll('[data-action="open-day"]').forEach((button) => {
    updateEventFilter(button, button.dataset.date);
  });
}

function renderFilterOptions(titles) {
  filterList.replaceChildren();
  document.querySelector("#year-filters-empty").hidden = titles.size > 0;
  for (const title of titles) {
    const option = document.createElement("label");
    option.className = "filter-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = title;
    checkbox.checked = selectedEventFilters.has(title);
    const label = document.createElement("span");
    label.textContent = title;
    option.append(checkbox, label);
    filterList.append(option);
  }
}

function syncYearFilters() {
  const titles = new Set(Object.entries(events)
    .filter(([date]) => Number(date.slice(0, 4)) === displayedYear)
    .flatMap(([, dayEvents]) => dayEvents.map((event) => event.title)));
  for (const title of selectedEventFilters) {
    if (!titles.has(title)) selectedEventFilters.delete(title);
  }
  renderFilterOptions(titles);
  updateYearFilters();
}

function createEventButton(year, monthIndex, day) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.date = getDateKey(year, monthIndex, day);
  button.dataset.action = "open-day";
  updateEventButton(button, button.dataset.date);
  return button;
}

function createLocalDate(year, monthIndex, day) {
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  // setFullYear preserves years 0–99 instead of interpreting them as 1900–1999.
  date.setFullYear(year, monthIndex, day);
  return date;
}

function getDaysInMonth(year, monthIndex) {
  return createLocalDate(year, monthIndex + 1, 0).getDate();
}

function getWeekday(year, monthIndex, day) {
  const date = createLocalDate(year, monthIndex, day);
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
  applyDayState(row, createLocalDate(year, monthIndex, day));

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
  document.querySelector("#calendar-year").textContent = String(year).padStart(4, "0");
  document.querySelectorAll(".month-column").forEach((column, monthIndex) => {
    renderMonth(column, year, monthIndex);
  });
}

function showCalendarYear(year) {
  if (!Number.isInteger(year) || year < minimumYear || year > maximumYear || activeDialog) return;
  clearTodayFocus();
  const scrollLeft = calendarScroll.scrollLeft;
  displayedYear = year;
  renderCalendar(displayedYear);
  // Rows must be attached before applying matching styles to their parent cells.
  syncYearFilters();
  calendarScroll.scrollLeft = Math.min(scrollLeft, Math.max(0, calendarScroll.scrollWidth - calendarScroll.clientWidth));
  yearNavigationButtons.forEach((button) => {
    const atBoundary = button.dataset.yearNav === "previous" ? year === minimumYear : year === maximumYear;
    button.setAttribute("aria-disabled", String(atBoundary));
  });
}

function clearTodayFocus() {
  window.clearTimeout(todayFocusTimer);
  todayFocusTimer = null;
  calendar.querySelector(".today-focus")?.classList.remove("today-focus");
}

function scrollToTodayCell(cell) {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  const cellRect = cell.getBoundingClientRect();
  const scrollRect = calendarScroll.getBoundingClientRect();
  calendarScroll.scrollTo({
    left: calendarScroll.scrollLeft + cellRect.left - scrollRect.left - (calendarScroll.clientWidth - cellRect.width) / 2,
    behavior,
  });
  window.scrollTo({
    top: window.scrollY + cellRect.top - (window.innerHeight - cellRect.height) / 2,
    behavior,
  });
}

function goToToday() {
  if (activeDialog) return;
  today = new Date();
  today.setHours(0, 0, 0, 0);
  showCalendarYear(today.getFullYear());
  const cell = calendar.querySelector(".today");
  if (!cell) return;
  todayButton.focus({ preventScroll: true });
  scrollToTodayCell(cell);
  cell.classList.add("today-focus");
  todayFocusTimer = window.setTimeout(clearTodayFocus, 1800);
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
  if (activeDialog === settingsDialog) {
    applyYearScale(yearScale);
    settingsButton.setAttribute("aria-expanded", "false");
  }
  if (activeDialog === filtersDialog) filtersButton.setAttribute("aria-expanded", "false");
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
  historyEntryToDelete = null;
  pendingHistoryRecord = null;
}

function prepareEventForm(key, event = null) {
  creationDate = key;
  editingEvent = event;
  eventForm.reset();
  showEventStorageError(eventSaveError, eventStorageBlocked ? eventLoadError.textContent : "");
  nameInput.maxLength = Math.max(60, event?.title.length || 0);
  eventForm.elements.description.maxLength = Math.max(240, event?.description.length || 0);
  templateField.hidden = Boolean(event);
  if (!event) renderTemplateOptions();
  setEventColour(event ? event.colour : toEventColour("yellow"));
  nameInput.setCustomValidity("");
  document.querySelector("#yearly-event-title").textContent = event ? "Редактировать событие" : "Новое событие";
  eventForm.querySelector("[type=submit]").textContent = event ? "Сохранить изменения" : "Создать событие";
  if (event) {
    nameInput.value = event.title;
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
  pendingHistoryRecord = null;
  const event = events[key][index];
  selectedEvent = { key, event, fromList };
  templateNotice.hidden = true;
  setDeleteConfirmation(false);
  cardDialog.querySelector("[data-back-to-list]").hidden = !fromList;
  document.querySelector("#event-card-title").textContent = event.title;
  document.querySelector("#event-card-date").textContent = formatDate(key);
  document.querySelector("#event-card-colour").textContent = getEventColourName(event.colour);
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
  showEventStorageError(eventDeleteError);
  pendingDeletion = visible ? selectedEvent : null;
  cardActions.hidden = visible;
  deleteNotice.hidden = !visible;
  deleteConfirm.hidden = !visible;
  cardDialog.querySelector("[data-back-to-list]").hidden = visible || !selectedEvent?.fromList;
}

function requestDeletion() {
  if (!selectedEvent) return;
  templateNotice.hidden = true;
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
  syncYearFilters();
}

function confirmDeletion() {
  if (!pendingDeletion || activeDialog !== cardDialog) return;
  const { key, event } = pendingDeletion;
  const index = events[key]?.indexOf(event) ?? -1;
  if (index < 0) return;
  const remaining = events[key].filter((_, position) => position !== index);
  const nextEvents = { ...events, [key]: remaining };
  if (!remaining.length) delete nextEvents[key];
  if (!saveYearEvents(nextEvents, eventDeleteError)) return;
  setDeleteConfirmation(false);
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
  if (selectedEventFilters.has(event.title)) {
    button.classList.add("is-filtered");
    button.setAttribute("aria-label", `${event.title}, ${event.description || "Без описания"}; совпадает с фильтром`);
  }
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
  const dayEvents = events[creationDate] || [];
  const index = editingEvent ? dayEvents.indexOf(editingEvent) : -1;
  if (editingEvent && index < 0) return;
  if (editingEvent) storedEventRecords.set(changes, storedEventRecords.get(editingEvent));
  const nextDay = editingEvent
    ? dayEvents.map((item, position) => position === index ? changes : item)
    : [...dayEvents, changes];
  if (!saveYearEvents({ ...events, [creationDate]: nextDay }, eventSaveError)) return;
  if (editingEvent) {
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
document.querySelector("#save-event-template").addEventListener("click", saveEventTemplate);
document.querySelector("#add-event-history").addEventListener("click", addEventHistory);
historyTimeline.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-history-id]");
  if (button) openHistoryDelete(button);
});
document.querySelector("#confirm-history-delete").addEventListener("click", confirmHistoryDeletion);
document.querySelectorAll("[data-history-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.historyScroll === "right" ? 1 : -1;
    historyScroll.scrollBy({ left: direction * 376, behavior: "smooth" });
  });
});
templateSelect.addEventListener("change", applyEventTemplate);
deleteButton.addEventListener("click", requestDeletion);
cancelDeleteButton.addEventListener("click", cancelDeletion);
document.querySelector("#confirm-event-delete").addEventListener("click", confirmDeletion);

filtersButton.addEventListener("click", () => {
  syncYearFilters();
  filtersButton.setAttribute("aria-expanded", "true");
  openDialog(filtersDialog, filtersButton, filterList.querySelector("input") || filtersDialog.querySelector("[data-close-dialog]"));
});
filterList.addEventListener("change", (event) => {
  const checkbox = event.target;
  if (!checkbox.matches('input[type="checkbox"]')) return;
  if (checkbox.checked) selectedEventFilters.add(checkbox.value);
  else selectedEventFilters.delete(checkbox.value);
  updateYearFilters();
});
resetFiltersButton.addEventListener("click", () => {
  selectedEventFilters.clear();
  filterList.querySelectorAll("input").forEach((checkbox) => { checkbox.checked = false; });
  updateYearFilters();
  (filterList.querySelector("input") || filtersDialog.querySelector(".filters-done")).focus();
});

thoughtAddButton.addEventListener("click", openThoughtDialog);
thoughtText.addEventListener("input", () => thoughtText.setCustomValidity(""));
thoughtForm.addEventListener("submit", submitThought);
document.querySelectorAll("[data-thought-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.thoughtScroll === "right" ? 1 : -1;
    thoughtScroll.scrollBy({ left: direction * 376, behavior: "smooth" });
  });
});

yearNavigationButtons.forEach((button) => button.addEventListener("click", () => {
  showCalendarYear(displayedYear + (button.dataset.yearNav === "previous" ? -1 : 1));
  button.focus({ preventScroll: true });
}));

settingsButton.addEventListener("click", openYearSettings);
todayButton.addEventListener("click", goToToday);
scaleButtons.forEach((button) => button.addEventListener("click", () => {
  yearScaleDraft = button.dataset.yearScale;
  applyYearScale(yearScaleDraft);
}));
document.querySelector("#save-year-settings").addEventListener("click", saveYearSettings);

for (const dialog of [creationDialog, cardDialog, listDialog, filtersDialog, thoughtDialog, historyDeleteDialog, settingsDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest("[data-close-dialog]")) dismissDialog();
    else if (event.target.closest("[data-back-to-list]")) openDayEvents(listDate);
  });
}
document.addEventListener("keydown", handleDialogKeydown);
nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
eventForm.addEventListener("submit", submitEvent);

createColourPalette(thoughtColourPalette, (colour) => colour, setThoughtColour);
createColourPalette(eventColourPalette, toEventColour, setEventColour);
loadYearScale();
loadYearEvents();
showCalendarYear(currentYear);
loadHistory();
loadThoughts();
renderThoughts();
