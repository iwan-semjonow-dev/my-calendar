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
const dayMarkStorageKey = "my-calendar-year-day-marks-v2";
const dayMarkError = document.querySelector("#day-mark-error");
const dayMarkPalette = document.querySelector("#day-mark-palette");
const dayEraseDialog = document.querySelector("#day-mark-erase-dialog");
const dayEraseActions = document.querySelector("#day-mark-erase-actions");
const dayEraseHelp = document.querySelector("#day-mark-erase-help");
const dayEraseError = document.querySelector("#day-mark-erase-error");
const dayEraseConfirm = document.querySelector("#confirm-day-erase");
const dayEraseCancel = document.querySelector("#cancel-day-erase");
let pendingDayErase = null;
const calendarToolButtons = [...document.querySelectorAll("[data-calendar-tool]")];
let dayMarks = {};
let dayMarkStorageSnapshot = null;
let dayMarkStorageBlocked = false;
let activeCalendarTool = null;
let activeCalendarToolColour = "yellow";
let ringLayoutFrame = null;
const dayMarkColours = {
  yellow: { fill: "#ffe39a", ring: "#bd8400" }, amber: { fill: "#ffd08a", ring: "#be7100" },
  peach: { fill: "#ffd5bb", ring: "#bb6841" }, coral: { fill: "#ffb9a8", ring: "#c85239" },
  pink: { fill: "#ffcac9", ring: "#c54f63" }, rose: { fill: "#f5c6d4", ring: "#aa526d" },
  violet: { fill: "#e3d2fa", ring: "#7653bd" }, indigo: { fill: "#c9cdf9", ring: "#4e59ba" },
  blue: { fill: "#cfe0fb", ring: "#3f73bc" }, sky: { fill: "#c9e7f7", ring: "#4286a8" },
  mint: { fill: "#c8f0ee", ring: "#328e88" }, teal: { fill: "#bfe8df", ring: "#218276" },
  green: { fill: "#cdf0ad", ring: "#5b9432" }, lime: { fill: "#d9ed9a", ring: "#799923" },
  sand: { fill: "#eadcbf", ring: "#9b7651" }, slate: { fill: "#d9dfe7", ring: "#667386" },
};
const ringShapes = [
  { x: -8, y: -7, main: "M7 11 C15 1 37 1 45 12 C50 22 40 38 28 42 C14 45 2 35 3 22 C2 18 4 13 7 11 Z", echo: "M11 10 C20 5 35 5 42 12 C44 14 45 17 46 20" },
  { x: -7, y: -6, main: "M6 12 C13 2 36 1 44 10 C49 19 42 36 29 41 C16 45 3 37 3 24 C2 19 3 15 6 12 Z", echo: "M9 11 C18 6 34 5 41 11 C44 14 46 17 46 21" },
  { x: -9, y: -7, main: "M8 10 C19 2 39 3 46 13 C49 24 39 39 25 42 C12 43 2 33 4 20 C3 16 5 12 8 10 Z", echo: "M12 10 C22 6 37 6 43 13 C45 16 46 19 46 22" },
  { x: -7, y: -6, main: "M5 13 C13 3 35 1 44 11 C48 22 40 37 27 41 C13 44 3 35 3 23 C2 19 3 16 5 13 Z", echo: "M10 12 C18 7 34 6 41 12 C44 15 45 18 46 21" },
];
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
const placedThoughtText = document.querySelector("#yearly-placed-thought-text");
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
const placementStorageKey = "my-calendar-year-thought-placements-v2";
let thoughtPlacements = [];
let placementStorageSnapshot = null;
let placementStorageBlocked = false;
const placedEvents = new WeakMap();
const thoughtColours = ["", ...calendarPalette.map(({ value }) => value)];
const templateStorageKey = "my-calendar-year-templates-v2";
const templateColourNames = Object.fromEntries(calendarPalette.map(({ value, label }) => [toEventColour(value), label]));
templateColourNames["thought-"] = "Без цвета";
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
const thoughtOrderError = document.querySelector("#thought-order-error");
const thoughtUndoToast = document.querySelector("#thought-undo-toast");
const thoughtUndoMessage = document.querySelector("#thought-undo-message");
const returnThoughtButton = document.querySelector("#return-thought");
const thoughtReturnError = document.querySelector("#event-return-error");
let undoThoughtPlacementId = null;
let undoThoughtTimer = null;
let draggedThoughtId = null;
let suppressThoughtClick = false;
const thoughtDeleteButton = document.querySelector("#delete-thought");
const thoughtDeleteDialog = document.querySelector("#thought-delete-dialog");
const thoughtDeleteError = document.querySelector("#thought-delete-error");
let activeThoughtId = null;
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

function loadDayMarks() {
  try {
    dayMarkStorageSnapshot = localStorage.getItem(dayMarkStorageKey);
    const stored = dayMarkStorageSnapshot === null ? {} : JSON.parse(dayMarkStorageSnapshot);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)
      || !Object.entries(stored).every(([date, mark]) => isCalendarDate(date)
        && mark && typeof mark === "object" && !Array.isArray(mark)
        && ["fill", "ring"].every((part) => !Object.hasOwn(mark, part) || mark[part] === ""
          || calendarPalette.some(({ value }) => value === mark[part])))) throw new Error("Invalid day marks");
    dayMarks = stored;
  } catch {
    dayMarkStorageBlocked = true;
    showEventStorageError(dayMarkError, "Не удалось загрузить отметки дней: данные повреждены или хранилище недоступно. Запись отметок заблокирована, исходные данные не изменены. После восстановления перезагрузите страницу.");
  }
}

function setCalendarTool(tool) {
  activeCalendarTool = activeCalendarTool === tool ? null : tool;
  calendarToolButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.calendarTool === activeCalendarTool)));
  calendar.classList.toggle("day-tool-active", Boolean(activeCalendarTool));
}

function setCalendarToolColour(colour) {
  activeCalendarToolColour = colour;
  updateColourPalette(dayMarkPalette, colour);
}

function applyDayMark(cell) {
  const mark = dayMarks[cell.dataset.date] || {};
  cell.classList.toggle("day-has-fill", Boolean(mark.fill));
  cell.classList.toggle("day-has-ring", Boolean(mark.ring));
  cell.style.setProperty("--day-fill-colour", mark.fill ? dayMarkColours[mark.fill].fill : "");
}

function saveDayMark(cell) {
  if (dayMarkStorageBlocked) return;
  const date = cell.dataset.date;
  if (!isCalendarDate(date) || Number(date.slice(0, 4)) !== displayedYear) return;
  try {
    if (localStorage.getItem(dayMarkStorageKey) !== dayMarkStorageSnapshot) {
      showEventStorageError(dayMarkError, "Отметки изменились в другой вкладке. Запись остановлена: перезагрузите страницу, чтобы не затереть изменения.");
      return;
    }
    if (dayMarks[date]?.[activeCalendarTool] === activeCalendarToolColour) return;
    const next = { ...dayMarks, [date]: { ...dayMarks[date], [activeCalendarTool]: activeCalendarToolColour } };
    const serialized = JSON.stringify(next);
    localStorage.setItem(dayMarkStorageKey, serialized);
    dayMarkStorageSnapshot = serialized;
    dayMarks = next;
  } catch {
    showEventStorageError(dayMarkError, "Не удалось сохранить отметку дня. Отметки не изменены. Проверьте доступ к хранилищу и повторите попытку.");
    return;
  }
  showEventStorageError(dayMarkError);
  applyDayMark(cell);
  scheduleDayRings();
}

function openDayErase(cell) {
  const key = cell.dataset.date;
  if (!isCalendarDate(key)) return;
  const mark = dayMarks[key] || {};
  const count = events[key]?.length || 0;
  const choices = [
    mark.fill && ["fill", "Только заливку"],
    mark.ring && ["ring", "Только обводку"],
    count && ["events", count === 1 ? "Событие" : "Все события дня"],
  ].filter(Boolean);
  pendingDayErase = { key, part: null, completed: [] };
  document.querySelector("#day-mark-erase-title").textContent = "Что удалить?";
  document.querySelector("#day-mark-erase-date").textContent = formatDate(key);
  dayEraseHelp.textContent = `В этой ячейке: ${[mark.fill && "заливка", mark.ring && "обводка", count && `записей: ${count}`].filter(Boolean).join(", ") || "нет доступных слоёв"}.`;
  dayEraseActions.replaceChildren();
  if (choices.length > 1) choices.push(["all", "Удалить всё"]);
  for (const [part, label] of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = part === "all" ? "day-primary" : "day-secondary";
    button.dataset.eraseDayMark = part;
    button.textContent = label;
    dayEraseActions.append(button);
  }
  dayEraseActions.hidden = false;
  dayEraseConfirm.hidden = true;
  dayEraseConfirm.textContent = "Удалить";
  showEventStorageError(dayEraseError);
  openDialog(dayEraseDialog, cell.querySelector("button[data-date]"), dayEraseCancel);
}

function chooseDayErase(part) {
  if (!pendingDayErase || pendingDayErase.part) return;
  pendingDayErase.part = part;
  dayEraseActions.hidden = true;
  dayEraseConfirm.hidden = false;
  const { key } = pendingDayErase;
  const count = events[key]?.length || 0;
  const mark = dayMarks[key] || {};
  const layers = [
    (part === "fill" || part === "all") && mark.fill && "заливка",
    (part === "ring" || part === "all") && mark.ring && "обводка",
    (part === "events" || part === "all") && count && `события и размещённые мысли — записей: ${count}`,
  ].filter(Boolean);
  dayEraseHelp.textContent = `Будут удалены: ${layers.join(", ")}. Размещённые мысли не возвращаются в ленту.`;
  if ((part === "events" || part === "all") && count) {
    document.querySelector("#day-mark-erase-title").textContent = "Подтвердите удаление";
    dayEraseCancel.focus({ preventScroll: true });
  } else executeDayErase();
}

function checkDayEraseStorage(part) {
  const stores = [];
  if (part !== "events") stores.push([dayMarkStorageKey, dayMarkStorageSnapshot, dayMarkStorageBlocked]);
  if (part === "events" || part === "all") {
    stores.push([eventStorageKey, eventStorageSnapshot, eventStorageBlocked],
      [placementStorageKey, placementStorageSnapshot, placementStorageBlocked],
      [thoughtStorageKey, thoughtStorageSnapshot, thoughtStorageBlocked]);
  }
  for (const [key, snapshot, blocked] of stores) {
    if (blocked) throw new Error("Хранилище повреждено или недоступно. Восстановите данные и перезагрузите страницу.");
    if (localStorage.getItem(key) !== snapshot) throw new Error("Данные изменились в другой вкладке. Перезагрузите страницу перед повторной попыткой.");
  }
}

function executeDayErase() {
  if (activeDialog !== dayEraseDialog || !pendingDayErase?.part) return;
  const operation = pendingDayErase;
  const { key, part, completed } = operation;
  let step = "проверка хранилищ";
  // Each successful write is committed to memory independently. Never roll back
  // over another tab. A retry derives only the remaining work from this state.
  const write = (label, storageKey, value, commit) => {
    step = label;
    checkDayEraseStorage(part);
    const raw = JSON.stringify(value);
    localStorage.setItem(storageKey, raw);
    commit(raw);
    completed.push(label);
  };
  try {
    checkDayEraseStorage(part);
    if (part === "events" || part === "all") {
      const removed = thoughtPlacements.filter((item) => item.date === key);
      const ids = new Set(removed.map((item) => item.id));
      const thoughtIds = new Set(removed.map((item) => item.thoughtId));
      const inbox = parseThoughts(thoughtStorageSnapshot);
      const remainingInbox = inbox.filter((item) => !thoughtIds.has(item.id));
      // Remove only these placements' recovery copies BEFORE deleting placements.
      // If the next write fails, the placement remains authoritative after reload.
      if (remainingInbox.length !== inbox.length) {
        write("удаление резервных копий выбранных мыслей", thoughtStorageKey, remainingInbox, (raw) => {
          thoughtStorageSnapshot = raw;
          thoughts = undatedThoughts(remainingInbox);
        });
      }
      if (removed.length) {
        write(`удаление размещённых мыслей: ${removed.length}`, placementStorageKey,
          thoughtPlacements.filter((item) => !ids.has(item.id)), (raw) => {
            placementStorageSnapshot = raw;
            thoughtPlacements = thoughtPlacements.filter((item) => !ids.has(item.id));
            events[key] = (events[key] || []).filter((event) => !ids.has(placedEvents.get(event)));
            if (ids.has(undoThoughtPlacementId)) hideThoughtUndo();
          });
      }
      const normalCount = (events[key] || []).filter((event) => !placedEvents.has(event)).length;
      if (normalCount) {
        const next = JSON.parse(eventStorageSnapshot);
        delete next[key];
        write(`удаление обычных событий: ${normalCount}`, eventStorageKey, next, (raw) => {
          eventStorageSnapshot = raw;
          events[key] = (events[key] || []).filter((event) => placedEvents.has(event));
        });
      }
    }
    const mark = dayMarks[key] || {};
    const parts = ["fill", "ring"].filter((layer) => (part === layer || part === "all") && mark[layer]);
    if (parts.length) {
      const nextMark = { ...mark };
      parts.forEach((layer) => { nextMark[layer] = ""; });
      write(`удаление отметок: ${parts.map((layer) => layer === "fill" ? "заливка" : "обводка").join(", ")}`,
        dayMarkStorageKey, { ...dayMarks, [key]: nextMark }, (raw) => {
          dayMarkStorageSnapshot = raw;
          dayMarks = { ...dayMarks, [key]: nextMark };
        });
    }
  } catch (error) {
    showEventStorageError(dayEraseError, `${completed.length ? `Выполнено: ${completed.join("; ")}.` : "Ничего не удалено."} Не выполнено: ${step}; оставшаяся часть операции остановлена. ${error.message} После устранения проблемы нажмите «Повторить оставшееся». Выполненные шаги при закрытии окна не отменяются.`);
    dayEraseConfirm.textContent = "Повторить оставшееся";
    dayEraseCancel.focus({ preventScroll: true });
    return;
  } finally {
    if (events[key]?.length === 0) delete events[key];
    refreshDate(key);
    applyDayMark(calendar.querySelector(`.calendar-cell[data-date="${key}"]`));
    scheduleDayRings();
  }
  pendingDayErase = null;
  closeDialog();
}

function scheduleDayRings() {
  window.cancelAnimationFrame(ringLayoutFrame);
  ringLayoutFrame = window.requestAnimationFrame(renderDayRings);
}

function renderDayRings() {
  ringLayoutFrame = null;
  calendar.querySelector(".day-ring-layer")?.remove();
  const layer = document.createElement("div");
  layer.className = "day-ring-layer";
  layer.setAttribute("aria-hidden", "true");
  calendar.append(layer);
  const origin = layer.getBoundingClientRect();
  for (const cell of calendar.querySelectorAll(".day-has-ring[data-date]")) {
    const shape = ringShapes[Number(cell.dataset.date.slice(-2)) % ringShapes.length];
    const rect = cell.getBoundingClientRect();
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("day-ring");
    svg.dataset.date = cell.dataset.date;
    svg.setAttribute("viewBox", "0 0 50 44");
    svg.style.left = `${rect.left - origin.left + shape.x}px`;
    svg.style.top = `${rect.top - origin.top + shape.y}px`;
    svg.style.setProperty("--day-ring-colour", dayMarkColours[dayMarks[cell.dataset.date].ring].ring);
    for (const part of ["main", "echo"]) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add(`${part}-stroke`);
      path.setAttribute("d", shape[part]);
      svg.append(path);
    }
    layer.append(svg);
  }
}

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
    dayEvents.filter((event) => !placedEvents.has(event)).map((event) => {
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
  scheduleDayRings();
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
  return items.map((item) => ({ ...item }));
}

function loadThoughts() {
  try {
    thoughtStorageSnapshot = localStorage.getItem(thoughtStorageKey);
    thoughts = undatedThoughts(parseThoughts(thoughtStorageSnapshot));
  } catch {
    thoughtStorageBlocked = true;
    showThoughtError(thoughtLoadError, "Не удалось загрузить мысли: сохранённые данные повреждены или хранилище недоступно. Добавление заблокировано, чтобы не потерять сохранения. После восстановления данных или доступа перезагрузите страницу.");
  }
}

function undatedThoughts(items) {
  return items.filter((thought) => !thoughtPlacements.some((placement) => placement.thoughtId === thought.id));
}

function loadThoughtPlacements() {
  try {
    placementStorageSnapshot = localStorage.getItem(placementStorageKey);
    const items = placementStorageSnapshot === null ? [] : JSON.parse(placementStorageSnapshot);
    const ids = new Set();
    if (!Array.isArray(items) || !items.every((item) => {
      if (!item || typeof item.id !== "string" || !item.id.trim() || ids.has(item.id)
        || typeof item.thoughtId !== "string" || !item.thoughtId.trim()
        || !isCalendarDate(item.date) || typeof item.title !== "string" || !item.title.trim()
        || !thoughtColours.includes(item.colour) || item.type !== toEventColour(item.colour)
        || typeof item.description !== "string") return false;
      ids.add(item.id);
      return true;
    })) throw new Error("Invalid thought placements");
    thoughtPlacements = items;
    for (const placement of thoughtPlacements) attachThoughtPlacement(placement);
  } catch {
    placementStorageBlocked = true;
    showThoughtError(thoughtOrderError, "Не удалось загрузить размещения мыслей. Данные не изменены; перенос и изменение мыслей заблокированы до восстановления данных и перезагрузки страницы.");
  }
}

function attachThoughtPlacement(placement) {
  const event = { title: placement.title, colour: placement.type, description: placement.description };
  placedEvents.set(event, placement.id);
  (events[placement.date] ||= []).push(event);
}

function checkThoughtStorage() {
  if (thoughtStorageBlocked || placementStorageBlocked) throw new Error("Storage unavailable");
  if (localStorage.getItem(thoughtStorageKey) !== thoughtStorageSnapshot
    || localStorage.getItem(placementStorageKey) !== placementStorageSnapshot) {
    throw new Error("Thoughts changed in another tab");
  }
}

function saveThoughtPlacements(nextPlacements, errorElement) {
  try {
    checkThoughtStorage();
    const serialized = JSON.stringify(nextPlacements);
    localStorage.setItem(placementStorageKey, serialized);
    placementStorageSnapshot = serialized;
    thoughtPlacements = nextPlacements;
    showThoughtError(errorElement, "");
    return true;
  } catch {
    showThoughtError(errorElement, "Не удалось сохранить размещение мысли. Хранилище недоступно, повреждено или изменилось в другой вкладке. Исходные записи и ввод сохранены. При конфликте перезагрузите страницу; иначе повторите попытку.");
    return false;
  }
}

function savePlacedEvent(event, changes, errorElement) {
  const id = placedEvents.get(event);
  if (thoughtStorageBlocked || placementStorageBlocked) {
    showThoughtError(errorElement, "Изменение размещения заблокировано: сначала восстановите данные мыслей и перезагрузите страницу.");
    return false;
  }
  // Finish an interrupted inbox cleanup before editing or deleting its placement.
  // Otherwise deleting the placement could make the old inbox copy reappear.
  if (parseThoughts(thoughtStorageSnapshot).some((thought) =>
    thoughtPlacements.some((placement) => placement.thoughtId === thought.id))) {
    if (!saveThoughts(thoughts, errorElement)) return false;
  }
  const next = changes
    ? thoughtPlacements.map((item) => item.id === id
      ? { ...item, title: changes.title, colour: changes.colour.slice("thought-".length), type: changes.colour, description: changes.description }
      : item)
    : thoughtPlacements.filter((item) => item.id !== id);
  return saveThoughtPlacements(next, errorElement);
}

function clearCalendarDropTarget() {
  calendar.querySelectorAll(".thought-drop-target").forEach((cell) => cell.classList.remove("thought-drop-target"));
}

function hideThoughtUndo() {
  window.clearTimeout(undoThoughtTimer);
  undoThoughtTimer = null;
  if (thoughtUndoToast.contains(document.activeElement)) {
    const placement = thoughtPlacements.find((item) => item.id === undoThoughtPlacementId);
    const target = placement && calendar.querySelector(`[data-action="open-day"][data-date="${placement.date}"]`);
    (target || thoughtAddButton).focus({ preventScroll: true });
  }
  undoThoughtPlacementId = null;
  thoughtUndoToast.hidden = true;
}

function showThoughtUndo(placement) {
  window.clearTimeout(undoThoughtTimer);
  undoThoughtPlacementId = placement.id;
  thoughtUndoMessage.textContent = `Мысль перенесена на ${formatDate(placement.date)}.`;
  thoughtUndoToast.hidden = false;
  undoThoughtTimer = window.setTimeout(() => {
    if (undoThoughtPlacementId === placement.id) hideThoughtUndo();
  }, 9000);
}

function returnPlacedThought(id, errorElement) {
  const placement = thoughtPlacements.find((item) => item.id === id);
  if (!placement) return false;
  let nextThoughts;
  try {
    checkThoughtStorage();
    if (thoughtPlacements.some((item) => item.id !== id && item.thoughtId === placement.thoughtId)) {
      showThoughtError(errorElement, "У этой мысли несколько размещений. Возврат остановлен, чтобы не создать копию в ленте одновременно с другим размещением.");
      return false;
    }
    const source = placement.sourceThought || parseThoughts(thoughtStorageSnapshot).find((item) => item.id === placement.thoughtId) || {};
    const { id: placementId, thoughtId, date, title, colour, type, description, sourceThought, ...extra } = placement;
    const returned = {
      ...source, id: thoughtId, text: title, colour,
      scheduledDescription: description,
      placementMetadata: { ...source.placementMetadata, ...extra },
    };
    nextThoughts = [returned, ...thoughts.filter((item) => item.id !== thoughtId)];
  } catch {
    showThoughtError(errorElement, "Не удалось вернуть мысль: хранилище недоступно, повреждено или изменилось в другой вкладке. Данные не изменены. При конфликте перезагрузите страницу, иначе повторите попытку.");
    return false;
  }
  // Prepare the inbox copy first. While the placement exists, load/saveThoughts
  // keep this copy out of the visible inbox, including after an interrupted return.
  if (!saveThoughts(nextThoughts, errorElement)) return false;
  if (!saveThoughtPlacements(thoughtPlacements.filter((item) => item.id !== id), errorElement)) {
    showThoughtError(errorElement, "Возврат не завершён: копия мысли сохранена, но удалить размещение не удалось. Мысль остаётся на дате, в том числе после перезагрузки. Повторите возврат; при конфликте сначала перезагрузите страницу.");
    return false;
  }
  thoughts = nextThoughts;
  const remaining = (events[placement.date] || []).filter((event) => placedEvents.get(event) !== id);
  if (remaining.length) events[placement.date] = remaining;
  else delete events[placement.date];
  renderThoughts();
  const button = calendar.querySelector(`[data-action="open-day"][data-date="${placement.date}"]`);
  if (button) updateEventButton(button, placement.date);
  syncYearFilters();
  showThoughtError(thoughtOrderError, "");
  if (undoThoughtPlacementId === id) hideThoughtUndo();
  if (activeDialog === cardDialog) {
    if (remaining.length) openDayEvents(placement.date);
    else {
      dialogOpener = getThoughtCard(placement.thoughtId) || thoughtAddButton;
      closeDialog();
    }
  } else {
    (getThoughtCard(placement.thoughtId) || thoughtAddButton).focus({ preventScroll: true });
  }
  return true;
}

function previewCalendarDrop(event) {
  if (draggedThoughtId === null) return;
  clearCalendarDropTarget();
  const cell = event.target.closest(".calendar-cell[data-date]");
  if (!cell || !calendar.contains(cell) || !isCalendarDate(cell.dataset.date)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  cell.classList.add("thought-drop-target");
}

function dropThoughtOnDate(event) {
  const cell = event.target.closest(".calendar-cell[data-date]");
  const index = thoughts.findIndex((thought) => thought.id === draggedThoughtId);
  if (!cell || !calendar.contains(cell) || index < 0 || !isCalendarDate(cell.dataset.date)) return;
  event.preventDefault();
  const thought = thoughts[index];
  const focusId = thoughts[index + 1]?.id || thoughts[index - 1]?.id;
  endThoughtDrag();
  if (thoughtPlacements.some((item) => item.thoughtId === thought.id)) return;
  const placement = {
    ...thought.placementMetadata,
    id: `placed-thought-${crypto.randomUUID()}`, thoughtId: thought.id,
    date: cell.dataset.date, title: thought.text, colour: thought.colour,
    type: toEventColour(thought.colour), description: typeof thought.scheduledDescription === "string" ? thought.scheduledDescription : "Мысль добавлена из верхней ленты",
    sourceThought: { ...thought },
  };
  // The placement write is the commit point. Inbox removal is recoverable cleanup:
  // on reload, an existing placement always takes precedence over an inbox copy.
  if (!saveThoughtPlacements([...thoughtPlacements, placement], thoughtOrderError)) return;
  const nextThoughts = undatedThoughts(thoughts);
  if (!saveThoughts(nextThoughts, thoughtOrderError)) {
    thoughts = nextThoughts;
    showThoughtError(thoughtOrderError, "Мысль сохранена на дате, но резервную запись в хранилище ленты удалить не удалось. После перезагрузки она останется только на дате. Очистка повторится при следующем сохранении мыслей.");
  }
  attachThoughtPlacement(placement);
  renderThoughts();
  refreshDate(placement.date);
  (getThoughtCard(focusId) || thoughtAddButton).focus({ preventScroll: true });
  showThoughtUndo(placement);
}

function renderThoughts() {
  const scrollLeft = thoughtScroll.scrollLeft;
  thoughtTrack.replaceChildren(...thoughts.map((thought) => {
    const card = document.createElement("article");
    card.className = `thought ${thought.colour}`.trim();
    card.dataset.thoughtId = thought.id;
    card.draggable = true;
    card.title = "Нажмите, чтобы отредактировать. Перетащите внутри ленты или на дату календаря.";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Редактировать мысль: ${thought.text}`);
    card.setAttribute("aria-haspopup", "dialog");
    card.textContent = thought.text;
    return card;
  }));
  document.querySelector("#thought-empty").hidden = thoughts.length > 0 || thoughtStorageBlocked;
  thoughtScroll.scrollLeft = Math.min(scrollLeft, Math.max(0, thoughtScroll.scrollWidth - thoughtScroll.clientWidth));
}

function getThoughtCard(id) {
  return [...thoughtTrack.querySelectorAll("[data-thought-id]")].find((card) => card.dataset.thoughtId === id);
}

function clearThoughtDropTarget() {
  thoughtTrack.querySelectorAll(".drag-over").forEach((card) => card.classList.remove("drag-over", "drop-after"));
}

function endThoughtDrag() {
  draggedThoughtId = null;
  thoughtTrack.querySelector(".dragging")?.classList.remove("dragging");
  clearThoughtDropTarget();
  clearCalendarDropTarget();
}

function getThoughtDropTarget(clientX) {
  const cards = [...thoughtTrack.querySelectorAll("[data-thought-id]")]
    .filter((card) => card.dataset.thoughtId !== draggedThoughtId);
  const before = cards.find((card) => {
    const rect = card.getBoundingClientRect();
    return clientX < rect.left + rect.width / 2;
  });
  return { card: before || cards.at(-1), after: !before };
}

function startThoughtDrag(event) {
  const card = event.target.closest("[data-thought-id]");
  if (!card || activeDialog) return;
  draggedThoughtId = card.dataset.thoughtId;
  suppressThoughtClick = true;
  event.dataTransfer.setData("text/plain", draggedThoughtId);
  event.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
  showThoughtError(thoughtOrderError, "");
}

function previewThoughtDrop(event) {
  if (draggedThoughtId === null) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  clearThoughtDropTarget();
  const { card, after } = getThoughtDropTarget(event.clientX);
  if (card) {
    card.classList.add("drag-over");
    card.classList.toggle("drop-after", after);
  }
}

function dropThought(event) {
  if (draggedThoughtId === null) return;
  event.preventDefault();
  const id = draggedThoughtId;
  const moved = thoughts.find((thought) => thought.id === id);
  const { card, after } = getThoughtDropTarget(event.clientX);
  endThoughtDrag();
  if (!moved || !card) return;
  const nextThoughts = thoughts.filter((thought) => thought.id !== id);
  const index = nextThoughts.findIndex((thought) => thought.id === card.dataset.thoughtId);
  if (index < 0) return;
  nextThoughts.splice(index + Number(after), 0, moved);
  if (nextThoughts.every((thought, position) => thought.id === thoughts[position].id)) return;
  if (!saveThoughts(nextThoughts, thoughtOrderError)) return;
  renderThoughts();
  getThoughtCard(id)?.focus({ preventScroll: true });
}

function openThoughtDialog(id = null) {
  const thought = thoughts.find((item) => item.id === id);
  if (id !== null && !thought) return;
  activeThoughtId = thought?.id ?? null;
  thoughtForm.reset();
  thoughtText.maxLength = Math.max(240, thought?.text.length || 0);
  thoughtText.value = thought?.text ?? "";
  setThoughtColour(thought?.colour ?? "yellow");
  document.querySelector("#thought-dialog-title").textContent = thought ? "Редактировать мысль" : "Новая мысль";
  document.querySelector("#thought-dialog-help").textContent = thought
    ? "Измените текст и цвет или удалите мысль. Её место в ленте сохраняется."
    : "Мысль сохраняется в этом браузере без даты, времени и приоритета — только в верхней ленте.";
  thoughtForm.querySelector('[type="submit"]').textContent = thought ? "Сохранить изменения" : "Сохранить мысль";
  thoughtDeleteButton.hidden = !thought;
  thoughtText.setCustomValidity("");
  pendingThought = null;
  showThoughtError(thoughtSaveError, thoughtStorageBlocked ? thoughtLoadError.textContent : "");
  openDialog(thoughtDialog, getThoughtCard(activeThoughtId) || thoughtAddButton, thoughtText);
}

function saveThoughts(nextThoughts, errorElement) {
  if (thoughtStorageBlocked) {
    showThoughtError(errorElement, thoughtLoadError.textContent);
    return false;
  }
  try {
    checkThoughtStorage();
    const serialized = JSON.stringify(nextThoughts);
    localStorage.setItem(thoughtStorageKey, serialized);
    thoughts = undatedThoughts(nextThoughts);
    thoughtStorageSnapshot = serialized;
  } catch {
    showThoughtError(errorElement, "Не удалось сохранить изменения мыслей. Исходные записи не изменены. Проверьте доступ к хранилищу и свободное место. Если данные изменены в другой вкладке, скопируйте ввод и перезагрузите страницу.");
    return false;
  }
  return true;
}

function finishThoughtChange(focusId) {
  renderThoughts();
  dialogOpener = getThoughtCard(focusId) || thoughtAddButton;
  closeDialog();
}

function submitThought(event) {
  event.preventDefault();
  if (activeDialog !== thoughtDialog) return;
  const text = thoughtText.value.trim();
  thoughtText.setCustomValidity(text ? "" : "Введите текст мысли.");
  if (!thoughtForm.reportValidity()) return;
  const colour = thoughtForm.elements.colour.value;
  const isEditing = activeThoughtId !== null;
  let nextThoughts;
  if (isEditing) {
    if (!thoughts.some((item) => item.id === activeThoughtId)) return;
    nextThoughts = thoughts.map((item) => item.id === activeThoughtId ? { ...item, text, colour } : item);
  } else {
    if (!pendingThought) pendingThought = { id: `thought-${crypto.randomUUID()}` };
    nextThoughts = [...thoughts, { ...pendingThought, text, colour }];
  }
  if (!saveThoughts(nextThoughts, thoughtSaveError)) return;
  finishThoughtChange(activeThoughtId);
  if (!isEditing) thoughtScroll.scrollTo({ left: thoughtScroll.scrollWidth, behavior: "instant" });
}

function requestThoughtDeletion() {
  const thought = thoughts.find((item) => item.id === activeThoughtId);
  if (!thought || activeDialog !== thoughtDialog) return;
  document.querySelector("#thought-delete-copy").textContent = `Удалить мысль «${thought.text}»?`;
  showThoughtError(thoughtDeleteError, "");
  openDialog(thoughtDeleteDialog, null, document.querySelector("#cancel-thought-delete"));
}

function cancelThoughtDeletion() {
  openDialog(thoughtDialog, null, thoughtDeleteButton);
}

function confirmThoughtDeletion() {
  if (activeDialog !== thoughtDeleteDialog) return;
  const index = thoughts.findIndex((item) => item.id === activeThoughtId);
  if (index < 0) return;
  const nextId = thoughts[index + 1]?.id ?? thoughts[index - 1]?.id;
  const nextThoughts = thoughts.filter((item) => item.id !== activeThoughtId);
  if (!saveThoughts(nextThoughts, thoughtDeleteError)) return;
  finishThoughtChange(nextId);
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
  nameInput.maxLength = Math.max(60, template.title.length);
  nameInput.setCustomValidity("");
  setEventColour(template.type);
  eventForm.elements.description.value = template.description;
  eventForm.elements.description.maxLength = Math.max(240, template.description.length);
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
  row.dataset.date = getDateKey(year, monthIndex, day);
  applyDayState(row, createLocalDate(year, monthIndex, day));
  applyDayMark(row);

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
  scheduleDayRings();
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
  activeThoughtId = null;
  pendingThought = null;
  pendingDayErase = null;
}

function getEventTitleInput() {
  return placedEvents.has(editingEvent) ? placedThoughtText : nameInput;
}

function prepareEventForm(key, event = null) {
  creationDate = key;
  editingEvent = event;
  eventForm.reset();
  const isPlacedThought = placedEvents.has(event);
  nameInput.closest("label").hidden = isPlacedThought;
  nameInput.disabled = isPlacedThought;
  placedThoughtText.closest("label").hidden = !isPlacedThought;
  placedThoughtText.disabled = !isPlacedThought;
  showEventStorageError(eventSaveError, eventStorageBlocked ? eventLoadError.textContent : "");
  nameInput.maxLength = Math.max(60, event?.title.length || 0);
  placedThoughtText.maxLength = Math.max(240, event?.title.length || 0);
  eventForm.elements.description.maxLength = Math.max(240, event?.description.length || 0);
  templateField.hidden = Boolean(event);
  if (!event) renderTemplateOptions();
  setEventColour(event ? event.colour : toEventColour("yellow"));
  nameInput.setCustomValidity("");
  placedThoughtText.setCustomValidity("");
  document.querySelector("#yearly-event-title").textContent = event ? "Редактировать событие" : "Новое событие";
  eventForm.querySelector("[type=submit]").textContent = event ? "Сохранить изменения" : "Создать событие";
  if (event) {
    getEventTitleInput().value = event.title;
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
  returnThoughtButton.hidden = !placedEvents.has(event);
  showThoughtError(thoughtReturnError, "");
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
  openDialog(creationDialog, null, getEventTitleInput());
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
  showThoughtError(thoughtReturnError, "");
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
  if (placedEvents.has(event)) {
    if (!savePlacedEvent(event, null, eventDeleteError)) return;
  } else if (!saveYearEvents(nextEvents, eventDeleteError)) return;
  if (undoThoughtPlacementId === placedEvents.get(event)) hideThoughtUndo();
  setDeleteConfirmation(false);
  events[key].splice(index, 1);
  if (events[key].length === 0) delete events[key];
  refreshDate(key);
  if (events[key]?.length) openDayEvents(key);
  else closeDialog();
}

function dismissDialog() {
  if (activeDialog === thoughtDeleteDialog) cancelThoughtDeletion();
  else if (activeDialog === creationDialog && editingEvent) cancelEditing();
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
  const titleInput = getEventTitleInput();
  const title = titleInput.value.trim();
  titleInput.setCustomValidity(title ? "" : (placedEvents.has(editingEvent) ? "Введите текст мысли." : "Введите название события."));
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
  if (placedEvents.has(editingEvent)) {
    if (!savePlacedEvent(editingEvent, changes, eventSaveError)) return;
  } else if (!saveYearEvents({ ...events, [creationDate]: nextDay }, eventSaveError)) return;
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
  if (suppressThoughtClick && event.detail !== 0) return;
  const cell = event.target.closest(".calendar-cell[data-date]");
  if (activeCalendarTool && cell) {
    if (activeCalendarTool === "erase") openDayErase(cell);
    else saveDayMark(cell);
    return;
  }
  const button = event.target.closest("button[data-date]");
  if (!button || !calendar.contains(button)) return;
  const key = button.dataset.date;
  const count = events[key]?.length || 0;
  if (button.dataset.action === "create-event" || count === 0) openCreationForm(key, button);
  else if (count === 1) openEventCard(key, 0, button);
  else openDayEvents(key, button);
});

calendar.addEventListener("pointerdown", () => { suppressThoughtClick = false; });
calendarToolButtons.forEach((button) => button.addEventListener("click", () => setCalendarTool(button.dataset.calendarTool)));
dayEraseActions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-erase-day-mark]");
  if (button) chooseDayErase(button.dataset.eraseDayMark);
});
dayEraseConfirm.addEventListener("click", executeDayErase);
document.querySelector(".calendar-panel").addEventListener("click", (event) => {
  if (activeCalendarTool && !event.target.closest(".calendar-cell[data-date], [data-calendar-tool], #day-mark-palette button, [data-go-today]")) setCalendarTool(null);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !activeDialog) setCalendarTool(null);
});
new ResizeObserver(scheduleDayRings).observe(calendar);
window.addEventListener("resize", scheduleDayRings);
calendar.addEventListener("dragover", previewCalendarDrop);
calendar.addEventListener("drop", dropThoughtOnDate);
calendar.addEventListener("dragleave", (event) => {
  if (!event.target.closest(".calendar-cell[data-date]")?.contains(event.relatedTarget)) clearCalendarDropTarget();
});

dayEventList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-event-index]");
  if (button) openEventCard(listDate, Number(button.dataset.eventIndex), null, true);
});
createFromList.addEventListener("click", () => openCreationForm(listDate, null, true));
editButton.addEventListener("click", openEventEditor);
returnThoughtButton.addEventListener("click", () => {
  if (activeDialog !== cardDialog || pendingDeletion || !selectedEvent) return;
  returnPlacedThought(placedEvents.get(selectedEvent.event), thoughtReturnError);
});
document.querySelector("#undo-thought-placement").addEventListener("click", () => {
  if (!activeDialog && undoThoughtPlacementId !== null) returnPlacedThought(undoThoughtPlacementId, thoughtOrderError);
});
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

thoughtAddButton.addEventListener("click", () => openThoughtDialog());
thoughtTrack.addEventListener("dragstart", startThoughtDrag);
thoughtScroll.addEventListener("dragover", previewThoughtDrop);
thoughtScroll.addEventListener("drop", dropThought);
thoughtScroll.addEventListener("dragleave", (event) => {
  if (!thoughtScroll.contains(event.relatedTarget)) clearThoughtDropTarget();
});
thoughtTrack.addEventListener("dragend", endThoughtDrag);
// A new pointer gesture is a deliberate click; the release ending a drag is not.
thoughtTrack.addEventListener("pointerdown", () => { suppressThoughtClick = false; });
thoughtTrack.addEventListener("click", (event) => {
  if (suppressThoughtClick) return;
  const card = event.target.closest("[data-thought-id]");
  if (card) openThoughtDialog(card.dataset.thoughtId);
});
thoughtTrack.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-thought-id]")) {
    event.preventDefault();
    openThoughtDialog(event.target.dataset.thoughtId);
  }
});
thoughtDeleteButton.addEventListener("click", requestThoughtDeletion);
document.querySelector("#confirm-thought-delete").addEventListener("click", confirmThoughtDeletion);
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

for (const dialog of [creationDialog, cardDialog, listDialog, filtersDialog, thoughtDialog, thoughtDeleteDialog, historyDeleteDialog, settingsDialog, dayEraseDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest("[data-close-dialog]")) dismissDialog();
    else if (event.target.closest("[data-back-to-list]")) openDayEvents(listDate);
  });
}
document.addEventListener("keydown", handleDialogKeydown);
nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
placedThoughtText.addEventListener("input", () => placedThoughtText.setCustomValidity(""));
eventForm.addEventListener("submit", submitEvent);

createColourPalette(thoughtColourPalette, (colour) => colour, setThoughtColour);
createColourPalette(eventColourPalette, toEventColour, setEventColour);
createColourPalette(dayMarkPalette, (colour) => colour, setCalendarToolColour);
setCalendarToolColour(activeCalendarToolColour);
loadDayMarks();
loadYearScale();
loadYearEvents();
loadThoughtPlacements();
showCalendarYear(currentYear);
loadHistory();
loadThoughts();
renderThoughts();
