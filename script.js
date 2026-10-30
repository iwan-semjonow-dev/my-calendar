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
const eventDateInput = document.querySelector("#yearly-event-date-input");
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
const templatesButton = document.querySelector("#open-templates");
const templatesDialog = document.querySelector("#templates-dialog");
const templateList = document.querySelector("#template-list");
const templatesError = document.querySelector("#templates-error");
const templatesNotice = document.querySelector("#templates-notice");
const createTemplateButton = document.querySelector("#create-template");
const templateDialog = document.querySelector("#template-card-dialog");
const templateForm = document.querySelector("#template-form");
const templateName = document.querySelector("#template-name");
const templateDescription = document.querySelector("#template-description");
const templatePalette = document.querySelector("#template-colour-palette");
const templateSaveError = document.querySelector("#template-save-error");
const templateDeleteButton = document.querySelector("#delete-template");
const templateDeleteDialog = document.querySelector("#template-delete-dialog");
const templateDeleteError = document.querySelector("#template-delete-error");
let templateLibrary = [];
let templateEditorSnapshot = null;
let activeTemplateId = null;
let pendingTemplateId = null;
const templateFutureDialog = document.querySelector("#template-future-dialog");
const templateFutureHelp = document.querySelector("#template-future-help");
const templateFutureError = document.querySelector("#template-future-error");
const templateFutureList = document.querySelector("#template-future-list");
const templateFutureApply = document.querySelector("#apply-template-future");
let pendingTemplateUpdate = null;
const templateUseButton = document.querySelector("#use-template");
const calendarPlacementToast = document.querySelector("#calendar-copy-toast");
const calendarPlacementMessage = document.querySelector("#calendar-copy-message");
const calendarPlacementError = document.querySelector("#calendar-copy-error");
const calendarPlacementConfirm = document.querySelector("#confirm-template-placement");
let calendarPlacement = null;
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
const eventPreview = document.querySelector("#event-preview");
const eventPreviewContent = document.querySelector("#event-preview-content");
let previewSource = null;
let dismissedPreviewSource = null;
let previewCloseTimer = null;
let dialogOpenerDate = null;
let creationDate = null;
let listDate = null;
let dayListScrollTop = 0;
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
const backupFile = document.querySelector("#backup-file");
const importButton = document.querySelector("#import-calendar");
const restoreDialog = document.querySelector("#backup-restore-dialog");
const restoreConfirm = document.querySelector("#confirm-backup-restore");
const restoreError = document.querySelector("#backup-restore-error");
let backupReadToken = 0;
let pendingRestore = null;
let restoreNeedsReload = false;

function parseDayMarks(raw) {
  const stored = raw === null ? {} : JSON.parse(raw);
  if (!stored || typeof stored !== "object" || Array.isArray(stored)
    || !Object.entries(stored).every(([date, mark]) => isCalendarDate(date)
      && mark && typeof mark === "object" && !Array.isArray(mark)
      && ["fill", "ring"].every((part) => !Object.hasOwn(mark, part) || mark[part] === ""
        || calendarPalette.some(({ value }) => value === mark[part])))) throw new Error("Invalid day marks");
  return stored;
}

function loadDayMarks() {
  try {
    dayMarkStorageSnapshot = localStorage.getItem(dayMarkStorageKey);
    dayMarks = parseDayMarks(dayMarkStorageSnapshot);
  } catch {
    dayMarkStorageBlocked = true;
    showEventStorageError(dayMarkError, "Не удалось загрузить отметки дней: данные повреждены или хранилище недоступно. Запись отметок заблокирована, исходные данные не изменены. После восстановления перезагрузите страницу.");
  }
}

function setCalendarTool(tool) {
  hideEventPreview();
  if (tool) stopCalendarPlacement(false);
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
  if (restoreNeedsReload) return false;
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
  if (restoreNeedsReload) return false;
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
  if (restoreNeedsReload) return false;
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

function parseYearSettings(raw) {
  if (raw === null) return {};
  const settings = JSON.parse(raw);
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    throw new Error("Invalid settings structure");
  }
  return settings;
}

function readYearSettings() {
  return parseYearSettings(localStorage.getItem(settingsStorageKey));
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
  showEventStorageError(document.querySelector("#backup-export-error"));
  document.querySelector("#backup-export-status").hidden = true;
  showEventStorageError(document.querySelector("#backup-import-error"));
  document.querySelector("#backup-read-status").hidden = true;
  yearScaleDraft = yearScale;
  applyYearScale(yearScaleDraft);
  settingsButton.setAttribute("aria-expanded", "true");
  openDialog(settingsDialog, settingsButton, settingsDialog.querySelector('[aria-pressed="true"]'));
}

function saveYearSettings() {
  if (restoreNeedsReload) return false;
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

function readCalendarBackup() {
  const snapshots = new Map();
  function read(key, label, parse) {
    try {
      const raw = localStorage.getItem(key);
      snapshots.set(key, raw);
      return parse(raw);
    } catch {
      throw new Error(`Не удалось прочитать раздел «${label}»: хранилище недоступно или данные повреждены. Копия не создана, исходные данные не изменены.`);
    }
  }
  const backup = {
    format: "my-calendar-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: read(settingsStorageKey, "Настройки", parseYearSettings),
    events: read(eventStorageKey, "События", (raw) => {
      parseYearEvents(raw);
      // Export the original tuples, not the rendered events with attached thoughts.
      return raw === null ? {} : JSON.parse(raw);
    }),
    thoughtPlacements: read(placementStorageKey, "Размещения мыслей", parseThoughtPlacements),
    dayMarks: read(dayMarkStorageKey, "Отметки дней", parseDayMarks),
    templates: read(templateStorageKey, "Шаблоны", parseTemplates),
    thoughts: read(thoughtStorageKey, "Мысли", parseThoughts),
    history: read(historyStorageKey, "История", parseHistory),
  };
  // An explicitly saved empty v2 history takes precedence over legacy history.
  if (snapshots.get(historyStorageKey) === null) {
    backup.history = read(legacyHistoryStorageKey, "История", parseHistory);
  }
  // Detect a concurrent change during collection instead of exporting a mixed snapshot.
  for (const [key, raw] of snapshots) {
    let current;
    try {
      current = localStorage.getItem(key);
    } catch {
      throw new Error("Не удалось проверить хранилище перед скачиванием. Копия не создана, исходные данные не изменены.");
    }
    if (current !== raw) {
      throw new Error("Данные изменились во время создания копии. Скачивание не начато; повторите попытку.");
    }
  }
  return backup;
}

function exportCalendarBackup() {
  if (activeDialog !== settingsDialog) return;
  const error = document.querySelector("#backup-export-error");
  const status = document.querySelector("#backup-export-status");
  showEventStorageError(error);
  status.hidden = true;
  let backup;
  try {
    backup = readCalendarBackup();
  } catch (cause) {
    showEventStorageError(error, cause instanceof Error ? cause.message : "Не удалось прочитать хранилище. Копия не создана.");
    return;
  }
  let url;
  const link = document.createElement("a");
  try {
    url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" }));
    link.href = url;
    link.download = `my-calendar-backup-${backup.exportedAt.slice(0, 10)}.json`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    status.textContent = "Скачивание JSON запущено. Проверьте список загрузок браузера: приложение не может подтвердить сохранение файла на диске.";
    status.hidden = false;
  } catch {
    showEventStorageError(error, "Не удалось запустить скачивание. Данные календаря не изменены. Повторите попытку.");
  } finally {
    link.remove();
    // Give the browser time to acquire the Blob before releasing the URL.
    if (url) window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

function backupSections() {
  return [
    ["settings", settingsStorageKey, parseYearSettings, "настройки"],
    ["events", eventStorageKey, parseYearEvents, "события"],
    ["thoughtPlacements", placementStorageKey, parseThoughtPlacements, "размещения мыслей"],
    ["dayMarks", dayMarkStorageKey, parseDayMarks, "отметки дней"],
    ["templates", templateStorageKey, parseTemplates, "шаблоны"],
    ["thoughts", thoughtStorageKey, parseThoughts, "мысли"],
    ["history", historyStorageKey, parseHistory, "история"],
  ];
}

function validateCalendarBackup(text) {
  let backup;
  try { backup = JSON.parse(text); }
  catch { throw new Error("Файл не содержит корректный JSON."); }
  if (!backup || typeof backup !== "object" || Array.isArray(backup)
    || backup.format !== "my-calendar-backup" || backup.version !== 1) {
    throw new Error("Неподдерживаемый формат или версия резервной копии. Нужен my-calendar-backup, версия 1.");
  }
  for (const [name, , parse, label] of backupSections()) {
    if (!Object.hasOwn(backup, name)) throw new Error(`В файле отсутствует обязательный раздел: ${label}.`);
    try { parse(JSON.stringify(backup[name])); }
    catch { throw new Error(`Некорректные данные в разделе: ${label}.`); }
  }
  // Older readers do not require this informational timestamp.
  if (Object.hasOwn(backup, "exportedAt")
    && (typeof backup.exportedAt !== "string" || !Number.isFinite(Date.parse(backup.exportedAt)))) {
    throw new Error("Некорректное время создания резервной копии.");
  }
  return backup;
}

function snapshotRestoreStorage() {
  return new Map([...backupSections().map(([, key]) => key), legacyHistoryStorageKey]
    .map((key) => [key, localStorage.getItem(key)]));
}

function restoreStorageMatches(snapshot) {
  return [...snapshot].every(([key, raw]) => localStorage.getItem(key) === raw);
}

async function prepareBackupRestore() {
  const file = backupFile.files?.[0];
  backupFile.value = "";
  const token = ++backupReadToken;
  if (!file || activeDialog !== settingsDialog || restoreNeedsReload) return;
  const error = document.querySelector("#backup-import-error");
  const status = document.querySelector("#backup-read-status");
  showEventStorageError(error);
  status.textContent = "Чтение и проверка файла…";
  status.hidden = false;
  try {
    let text;
    try { text = await file.text(); }
    catch { throw new Error("Не удалось прочитать файл. Выберите его ещё раз."); }
    if (token !== backupReadToken || activeDialog !== settingsDialog) return;
    const backup = validateCalendarBackup(text);
    let original;
    try { original = snapshotRestoreStorage(); }
    catch { throw new Error("Хранилище недоступно. Восстановление не подготовлено, данные не изменены."); }
    pendingRestore = { original, writes: new Map(backupSections().map(([name, key]) => [key, JSON.stringify(backup[name])])) };
    const count = Object.values(backup.events).reduce((sum, records) => sum + records.length, 0);
    document.querySelector("#backup-restore-summary").textContent = `Файл: ${file.name}\nСохранённые данные годового календаря за ВСЕ годы будут заменены данными файла. Это не объединение.\nСобытия: ${count}; мысли: ${backup.thoughts.length}; размещения мыслей: ${backup.thoughtPlacements.length}; шаблоны: ${backup.templates.length}; снимки истории: ${backup.history.length}; даты с отметками: ${Object.keys(backup.dayMarks).length}. Настройки также будут заменены.\nПосле успешной записи страница перезагрузится; временный выбор и несохранённый масштаб будут сброшены.`;
    showEventStorageError(restoreError);
    restoreConfirm.disabled = false;
    openDialog(restoreDialog, null, document.querySelector("#cancel-backup-restore"));
  } catch (cause) {
    if (token === backupReadToken && activeDialog === settingsDialog) showEventStorageError(error, cause.message);
  } finally {
    if (token === backupReadToken) status.hidden = true;
  }
}

function rollbackBackupRestore(original, writes, attempted) {
  for (const key of [...attempted].reverse()) {
    try {
      const current = localStorage.getItem(key);
      if (current === original.get(key)) continue;
      // Never overwrite a value that no longer matches this operation's write.
      if (current !== writes.get(key)) continue;
      if (original.get(key) === null) localStorage.removeItem(key);
      else localStorage.setItem(key, original.get(key));
    } catch { /* Verify each key below, including a failed rollback. */ }
  }
  const unresolved = [];
  for (const [key, raw] of original) {
    try { if (localStorage.getItem(key) === raw) continue; }
    catch { /* An unreadable key cannot be claimed as restored. */ }
    unresolved.push(backupSections().find(([, candidate]) => candidate === key)?.[3] || "старая история");
  }
  return unresolved;
}

function requireRestoreReload(message) {
  restoreNeedsReload = true;
  pendingRestore = null;
  hideThoughtUndo();
  thoughtUndoToast.inert = true;
  restoreDialog.querySelectorAll("[data-close-dialog]").forEach((button) => { button.hidden = true; });
  restoreConfirm.hidden = true;
  const reload = document.querySelector("#reload-after-restore");
  reload.hidden = false;
  showEventStorageError(restoreError, message);
  reload.focus();
}

function confirmBackupRestore() {
  if (activeDialog !== restoreDialog || !pendingRestore || restoreConfirm.disabled || restoreNeedsReload) return;
  const { original, writes } = pendingRestore;
  restoreConfirm.disabled = true;
  showEventStorageError(restoreError);
  try {
    if (!restoreStorageMatches(original)) throw new Error("conflict");
  } catch {
    pendingRestore = null;
    showEventStorageError(restoreError, "Данные изменились после подготовки или хранилище недоступно. Ничего не записано. Отмените действие и заново выберите файл.");
    document.querySelector("#cancel-backup-restore").focus();
    return;
  }
  const expected = new Map(original);
  const attempted = [];
  try {
    for (const [key, raw] of writes) {
      if (!restoreStorageMatches(expected)) throw new Error("conflict");
      if (raw === original.get(key)) continue;
      attempted.push(key);
      localStorage.setItem(key, raw);
      expected.set(key, raw);
    }
    if (!restoreStorageMatches(expected)) throw new Error("verification failed");
  } catch {
    const unresolved = rollbackBackupRestore(original, writes, attempted);
    if (unresolved.length) {
      requireRestoreReload(`Восстановление не завершено. Исходное состояние не подтверждено для разделов: ${unresolved.join(", ")}. Там могут остаться данные файла или другой вкладки. Дальнейшие изменения заблокированы. Перезагрузите страницу, проверьте данные и при необходимости заново восстановите копию.`);
    } else {
      showEventStorageError(restoreError, "Запись не завершена. Исходные значения всех разделов восстановлены и проверены. Можно повторить попытку или отменить действие.");
      restoreConfirm.disabled = false;
      document.querySelector("#cancel-backup-restore").focus();
    }
    return;
  }
  requireRestoreReload("Все разделы записаны и проверены. Перезагрузка календаря…");
  try { window.location.reload(); }
  catch { showEventStorageError(restoreError, "Данные восстановлены. Перезагрузите страницу, чтобы работать с ними."); }
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
  if (restoreNeedsReload) return false;
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

function parseThoughtPlacements(raw) {
  const items = raw === null ? [] : JSON.parse(raw);
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
  return items;
}

function loadThoughtPlacements() {
  try {
    placementStorageSnapshot = localStorage.getItem(placementStorageKey);
    thoughtPlacements = parseThoughtPlacements(placementStorageSnapshot);
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
  if (restoreNeedsReload) return false;
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
      ? { ...item, date: changes.date ?? item.date, title: changes.title, colour: changes.colour.slice("thought-".length), type: changes.colour, description: changes.description }
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
  hideEventPreview();
  const card = event.target.closest("[data-thought-id]");
  if (!card || activeDialog) return;
  stopCalendarPlacement(false);
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
  if (restoreNeedsReload) return false;
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

function parseTemplates(raw) {
  const items = raw === null ? [] : JSON.parse(raw);
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

function readTemplateStore() {
  const raw = localStorage.getItem(templateStorageKey);
  return { raw, items: parseTemplates(raw) };
}

function readSavedTemplates() {
  return readTemplateStore().items;
}

function findMatchingTemplate(items, candidate) {
  return items.find((item) => item.title === candidate.title && item.type === candidate.type && item.description === candidate.description);
}

function writeTemplates(items, expectedRaw, errorElement) {
  if (restoreNeedsReload) return false;
  try {
    if (localStorage.getItem(templateStorageKey) !== expectedRaw) {
      showEventStorageError(errorElement, "Шаблоны изменились в другой вкладке. Запись остановлена. Скопируйте черновик перед закрытием редактора и откройте библиотеку заново.");
      return false;
    }
    localStorage.setItem(templateStorageKey, JSON.stringify(items));
  } catch {
    showEventStorageError(errorElement, "Не удалось сохранить шаблоны. Данные и черновик не изменены. Проверьте доступ к хранилищу и повторите попытку.");
    return false;
  }
  savedTemplates = items;
  templateLibrary = items;
  showEventStorageError(errorElement);
  return true;
}

function loadTemplateLibrary() {
  try {
    const store = readTemplateStore();
    templateLibrary = store.items;
    templateEditorSnapshot = store.raw;
    showEventStorageError(templatesError);
    createTemplateButton.disabled = false;
    return true;
  } catch {
    showEventStorageError(templatesError, "Не удалось загрузить шаблоны: данные повреждены или хранилище недоступно. Сохранения не изменены. После восстановления закройте и снова откройте библиотеку.");
    createTemplateButton.disabled = true;
    return false;
  }
}

function getTemplateRow(id) {
  return [...templateList.querySelectorAll("button")].find((button) => button.dataset.templateId === id);
}

function showTemplateLibrary(focusId = null, notice = "", reload = true) {
  const available = !reload || loadTemplateLibrary();
  templateList.replaceChildren();
  document.querySelector("#templates-empty").hidden = !available || templateLibrary.length > 0;
  if (available) for (const template of templateLibrary) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "day-event-row";
    row.dataset.templateId = template.id;
    const dot = document.createElement("span");
    dot.className = `day-event-dot ${template.type}`;
    dot.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span");
    copy.className = "day-event-copy";
    const title = document.createElement("span");
    title.className = "day-event-name";
    title.textContent = template.title;
    const description = document.createElement("span");
    description.className = "day-event-description";
    description.textContent = template.description || `${getEventColourName(template.type)} · шаблон события`;
    copy.append(title, description);
    row.append(dot, copy);
    templateList.append(row);
  }
  activeTemplateId = null;
  pendingTemplateId = null;
  showEventStorageError(templatesNotice, notice);
  openDialog(templatesDialog, templatesButton, getTemplateRow(focusId) || (available ? createTemplateButton : templatesDialog.querySelector("[data-close-dialog]")));
}

function setTemplateColour(colour) {
  templateForm.elements.colour.value = colour;
  updateColourPalette(templatePalette, colour);
  const legacy = document.querySelector("#template-legacy-colour");
  legacy.hidden = calendarPalette.some(({ value }) => toEventColour(value) === colour);
  legacy.textContent = legacy.hidden ? "" : `Текущий цвет: ${getEventColourName(colour)}. Он останется, пока вы не выберете другой.`;
}

function openTemplateEditor(id = null) {
  if (!loadTemplateLibrary()) return;
  const template = templateLibrary.find((item) => item.id === id);
  if (id !== null && !template) {
    showTemplateLibrary(null, "Этот шаблон уже удалён. Список обновлён.");
    return;
  }
  activeTemplateId = id;
  pendingTemplateId = null;
  templateForm.reset();
  templateName.maxLength = Math.max(60, template?.title.length || 0);
  templateDescription.maxLength = Math.max(240, template?.description.length || 0);
  templateName.value = template?.title ?? "";
  templateDescription.value = template?.description ?? "";
  templateName.setCustomValidity("");
  setTemplateColour(template?.type ?? toEventColour("yellow"));
  document.querySelector("#template-card-title").textContent = template ? "Редактировать шаблон" : "Новый шаблон";
  templateForm.querySelector("[type=submit]").textContent = template ? "Сохранить изменения" : "Создать шаблон";
  templateDeleteButton.hidden = !template;
  templateUseButton.hidden = !template;
  showEventStorageError(templateSaveError);
  openDialog(templateDialog, null, templateName);
}

function submitTemplate(event) {
  event.preventDefault();
  if (activeDialog !== templateDialog) return;
  const title = templateName.value;
  templateName.setCustomValidity(title.trim() ? "" : "Введите название шаблона.");
  if (!templateForm.reportValidity()) return;
  const changes = { title, type: templateForm.elements.colour.value, description: templateDescription.value };
  const existing = templateLibrary.find((item) => item.id === activeTemplateId);
  const duplicate = activeTemplateId === null && findMatchingTemplate(templateLibrary, changes);
  if (duplicate) {
    // A no-op still must not claim a stale template exists after a remote change.
    try {
      if (localStorage.getItem(templateStorageKey) !== templateEditorSnapshot) throw new Error();
    } catch {
      showEventStorageError(templateSaveError, "Не удалось проверить шаблоны: хранилище недоступно или изменилось в другой вкладке. Черновик сохранён; откройте библиотеку заново после проверки.");
      return;
    }
    showTemplateLibrary(duplicate.id, "Такой шаблон уже сохранён. Новая запись не создана.", false);
    return;
  }
  if (activeTemplateId !== null && !existing) return;
  const id = existing?.id ?? (pendingTemplateId ||= `template-${crypto.randomUUID()}`);
  const next = existing
    ? templateLibrary.map((item) => item.id === id ? { ...item, ...changes } : item)
    : [...templateLibrary, { id, ...changes }];
  if (!writeTemplates(next, templateEditorSnapshot, templateSaveError)) return;
  renderTemplateOptions();
  if (existing) {
    offerTemplateUpdate(next.find((item) => item.id === id));
    return;
  }
  showTemplateLibrary(id, "Шаблон сохранён.", false);
}

function localTodayKey() {
  const now = new Date();
  return getDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function futureTemplateRecords(id, todayKey) {
  return Object.entries(events).flatMap(([date, items]) => date > todayKey
    ? items.filter((item) => {
      const record = storedEventRecords.get(item);
      return !placedEvents.has(item) && record?.[3] === "template" && record[4] === id;
    }).map((item) => ({ date, item })) : []);
}

function describeTemplateUpdate(count) {
  const { template, todayKey } = pendingTemplateUpdate;
  templateFutureHelp.textContent = `Шаблон «${template.title}» уже сохранён. Связанных событий после ${formatDate(todayKey)} во всех годах: ${count}. Сегодняшний день не входит. Выберите записи для обновления. Только у выбранных событий название, цвет и описание будут заменены значениями сохранённого шаблона, включая изменения, внесённые вручную. Даты, порядок и невыбранные записи сохранятся. «Только шаблон» оставит все события без изменений.`;
}

function updateTemplateSelection() {
  const { selected, items } = pendingTemplateUpdate;
  document.querySelector("#template-future-count").textContent = `Выбрано: ${selected.size} из ${items.length}`;
  templateFutureApply.disabled = selected.size === 0;
}

function renderTemplateCandidates() {
  const { items, selected } = pendingTemplateUpdate;
  templateFutureList.replaceChildren();
  for (const { date, item } of items) {
    const row = document.createElement("label");
    row.className = "day-event-row future-event-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selected.has(item);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selected.add(item);
      else selected.delete(item);
      updateTemplateSelection();
    });
    const copy = document.createElement("span");
    copy.className = "day-event-copy";
    const dateLabel = document.createElement("span");
    dateLabel.className = "day-event-name";
    dateLabel.textContent = formatDate(date);
    const content = document.createElement("span");
    content.className = "day-event-description";
    content.textContent = `${item.title}\nЦвет: ${getEventColourName(item.colour)}\n${item.description || "Без описания"}`;
    copy.append(dateLabel, content);
    row.append(checkbox, copy);
    templateFutureList.append(row);
  }
  updateTemplateSelection();
}

function selectTemplateCandidates(all) {
  if (!pendingTemplateUpdate) return;
  const { items, selected } = pendingTemplateUpdate;
  selected.clear();
  if (all) items.forEach(({ item }) => selected.add(item));
  templateFutureList.querySelectorAll("input").forEach((input) => { input.checked = all; });
  updateTemplateSelection();
}

function finishTemplateUpdate(message) {
  const id = pendingTemplateUpdate.template.id;
  pendingTemplateUpdate = null;
  showTemplateLibrary(id, message);
}

function offerTemplateUpdate(template) {
  if (eventStorageBlocked) {
    showTemplateLibrary(template.id, "Шаблон сохранён. События недоступны: обновление не выполнено. Восстановите хранилище и перезагрузите страницу.", false);
    return;
  }
  const todayKey = localTodayKey();
  const items = futureTemplateRecords(template.id, todayKey);
  const count = items.length;
  if (!count) {
    showTemplateLibrary(template.id, "Шаблон сохранён. Связанных будущих событий в загруженном календаре нет; события не записывались.", false);
    return;
  }
  pendingTemplateUpdate = {
    template: structuredClone(template), snapshot: JSON.stringify(template), todayKey,
    eventSnapshot: eventStorageSnapshot, items, selected: new Set(items.map(({ item }) => item)),
  };
  describeTemplateUpdate(count);
  renderTemplateCandidates();
  showEventStorageError(templateFutureError);
  openDialog(templateFutureDialog, null, document.querySelector("#decline-template-future"));
}

function applyTemplateUpdate() {
  if (!pendingTemplateUpdate || activeDialog !== templateFutureDialog) return;
  const { template, snapshot } = pendingTemplateUpdate;
  try {
    const current = readSavedTemplates().find((item) => item.id === template.id);
    if (!current || JSON.stringify(current) !== snapshot) {
      showEventStorageError(templateFutureError, "Шаблон был сохранён, но затем изменён или удалён в другой вкладке. События не обновлены. Закройте окно и заново откройте актуальный шаблон.");
      return;
    }
    if (localStorage.getItem(eventStorageKey) !== pendingTemplateUpdate.eventSnapshot
      || eventStorageSnapshot !== pendingTemplateUpdate.eventSnapshot) {
      showEventStorageError(templateFutureError, "Шаблон сохранён. События изменены в другой вкладке; обновление остановлено. Чужие изменения не перезаписаны. Закройте окно и перезагрузите страницу.");
      return;
    }
  } catch {
    showEventStorageError(templateFutureError, "Шаблон был сохранён. Проверить хранилища не удалось; события не обновлены. Проверьте доступ и повторите попытку.");
    return;
  }
  const todayKey = localTodayKey();
  if (todayKey !== pendingTemplateUpdate.todayKey) {
    pendingTemplateUpdate.todayKey = todayKey;
    pendingTemplateUpdate.items = futureTemplateRecords(template.id, todayKey);
    const eligible = new Set(pendingTemplateUpdate.items.map(({ item }) => item));
    for (const item of pendingTemplateUpdate.selected) {
      if (!eligible.has(item)) pendingTemplateUpdate.selected.delete(item);
    }
    describeTemplateUpdate(pendingTemplateUpdate.items.length);
    renderTemplateCandidates();
    if (templateFutureApply.disabled) document.querySelector("#decline-template-future").focus();
    showEventStorageError(templateFutureError, "Наступила новая дата. Граница будущих событий пересчитана; подтвердите обновление ещё раз.");
    return;
  }
  const { selected } = pendingTemplateUpdate;
  const targets = pendingTemplateUpdate.items.filter(({ item }) => selected.has(item));
  if (!targets.length) return;
  const nextEvents = Object.fromEntries(Object.entries(events).map(([date, items]) => [date, items.map((item) => {
    if (!selected.has(item)) return item;
    const updated = { ...item, title: template.title, colour: template.type, description: template.description };
    storedEventRecords.set(updated, structuredClone(storedEventRecords.get(item)));
    return updated;
  })]));
  if (!saveYearEvents(nextEvents, templateFutureError)) {
    templateFutureError.textContent = `Шаблон уже сохранён; события не обновлены. ${templateFutureError.textContent}`;
    return;
  }
  Object.assign(events, nextEvents);
  for (const date of new Set(targets.map((target) => target.date))) refreshDate(date);
  finishTemplateUpdate(`Шаблон сохранён. Обновлено будущих событий: ${targets.length}.`);
}

function updatePlacementSelection() {
  calendar.classList.toggle("copy-mode", Boolean(calendarPlacement));
  calendar.querySelectorAll(".calendar-cell[data-date]").forEach((cell) => {
    const selected = calendarPlacement?.dates.has(cell.dataset.date) || false;
    cell.classList.toggle("template-selected", selected);
    cell.querySelectorAll("button[data-date]").forEach((button) => {
      if (calendarPlacement) button.setAttribute("aria-pressed", String(selected));
      else button.removeAttribute("aria-pressed");
    });
  });
  if (!calendarPlacement) return;
  const count = calendarPlacement.dates.size;
  calendarPlacementMessage.textContent = `«${calendarPlacement.record[0]}»: выберите даты в календаре. Повторное нажатие снимает выбор. Выбрано: ${count}. До подтверждения события не сохраняются.`;
  calendarPlacementConfirm.textContent = `Разместить (${count})`;
  calendarPlacementConfirm.disabled = count === 0;
}

function stopCalendarPlacement(returnFocus = true) {
  if (!calendarPlacement) return;
  const originDate = calendarPlacement.originDate;
  calendarPlacement = null;
  calendarPlacementToast.hidden = true;
  updatePlacementSelection();
  if (returnFocus) {
    const origin = originDate && calendar.querySelector(`[data-action="open-day"][data-date="${originDate}"]`);
    const bounds = origin?.getBoundingClientRect();
    const viewport = calendarScroll.getBoundingClientRect();
    const visible = bounds && bounds.left >= Math.max(0, viewport.left)
      && bounds.right <= Math.min(innerWidth, viewport.right) && bounds.top >= 0 && bounds.bottom <= innerHeight;
    const target = originDate ? (visible ? origin : calendarScroll) : templatesButton;
    target.focus({ preventScroll: true });
  }
}

function startCalendarPlacement(record, source = {}) {
  hideEventPreview();
  closeDialog();
  setCalendarTool(null);
  calendarPlacement = { record, ...source, dates: new Set() };
  showEventStorageError(calendarPlacementError);
  calendarPlacementToast.hidden = false;
  updatePlacementSelection();
}

function startTemplatePlacement() {
  const template = templateLibrary.find((item) => item.id === activeTemplateId);
  if (!template || activeDialog !== templateDialog) return;
  // Use the saved template, as in the reference; editor drafts are not applied.
  startCalendarPlacement([template.title, template.type, template.description, "template", template.id], {
    templateId: template.id, snapshot: JSON.stringify(template),
  });
}

function copyEventRecord(event) {
  const record = structuredClone(storedEventRecords.get(event) || [event.title, event.colour, event.description]);
  record[0] = event.title;
  record[1] = event.colour;
  if (record.length > 2 || event.description !== "") record[2] = event.description;
  // Extra tuple fields have no reference schema. Retain their data, but not
  // top-level record identities or thought ownership in metadata objects.
  for (const metadata of record.slice(3)) {
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) continue;
    for (const key of ["id", "eventId", "placementId", "thoughtId", "sourceThought"]) delete metadata[key];
  }
  return record;
}

function startEventRepeat() {
  if (!selectedEvent || pendingDeletion || activeDialog !== cardDialog) return;
  const { key, event } = selectedEvent;
  if (!events[key]?.includes(event)) return;
  const placement = placedEvents.has(event);
  // A repeated thought becomes an ordinary event, never another placement.
  const record = placement ? [event.title, event.colour, event.description] : copyEventRecord(event);
  startCalendarPlacement(record, { originDate: key, placementSnapshot: placement ? placementStorageSnapshot : undefined });
}

function selectPlacementDate(key) {
  const year = Number(key.slice(0, 4));
  if (!calendarPlacement || !isCalendarDate(key) || year < minimumYear || year > maximumYear) return;
  const dates = calendarPlacement.dates;
  if (dates.has(key)) dates.delete(key);
  else dates.add(key);
  updatePlacementSelection();
}

function confirmCalendarPlacement() {
  if (!calendarPlacement || !calendarPlacement.dates.size || activeDialog) return;
  const { record, templateId, snapshot, dates, placementSnapshot } = calendarPlacement;
  try {
    const current = templateId ? readSavedTemplates().find((item) => item.id === templateId) : null;
    if (templateId && (!current || JSON.stringify(current) !== snapshot)) {
      showEventStorageError(calendarPlacementError, "Шаблон изменён или удалён в другой вкладке. Ничего не размещено. Выбор дат сохранён; отмените операцию и заново откройте нужный шаблон.");
      return;
    }
    if (placementSnapshot !== undefined && localStorage.getItem(placementStorageKey) !== placementSnapshot) {
      showEventStorageError(calendarPlacementError, "Размещённые мысли изменились в другой вкладке. Ничего не размещено. Выбор дат сохранён; отмените операцию и обновите страницу перед повторением.");
      return;
    }
  } catch {
    showEventStorageError(calendarPlacementError, "Не удалось проверить источник. Ничего не размещено. Выбор дат сохранён; проверьте хранилище и повторите попытку.");
    return;
  }
  const nextEvents = { ...events };
  for (const key of dates) {
    const item = { title: record[0], colour: record[1], description: record[2] ?? "" };
    storedEventRecords.set(item, structuredClone(record));
    nextEvents[key] = [...(events[key] || []), item];
  }
  // One write commits the entire batch; keep selection and memory on failure.
  if (!saveYearEvents(nextEvents, calendarPlacementError)) return;
  for (const key of dates) events[key] = nextEvents[key];
  for (const key of dates) refreshDate(key);
  stopCalendarPlacement();
}

function requestTemplateDeletion() {
  const template = templateLibrary.find((item) => item.id === activeTemplateId);
  if (!template || activeDialog !== templateDialog) return;
  document.querySelector("#template-delete-help").textContent = `Удалить шаблон «${template.title}»? Уже созданные события и история останутся без изменений.`;
  showEventStorageError(templateDeleteError);
  openDialog(templateDeleteDialog, null, document.querySelector("#cancel-template-delete"));
}

function confirmTemplateDeletion() {
  if (activeDialog !== templateDeleteDialog || activeTemplateId === null) return;
  const index = templateLibrary.findIndex((item) => item.id === activeTemplateId);
  if (index < 0) return;
  const next = templateLibrary.filter((item) => item.id !== activeTemplateId);
  if (!writeTemplates(next, templateEditorSnapshot, templateDeleteError)) return;
  renderTemplateOptions();
  showTemplateLibrary((next[index] || next[index - 1])?.id, "Шаблон удалён.", false);
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
    : "Создайте шаблон в библиотеке «Шаблоны» или сохраните его из карточки события.");
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
  let store;
  try {
    store = readTemplateStore();
  } catch {
    templateNotice.textContent = "Не удалось прочитать шаблоны: данные повреждены или хранилище недоступно. Сохранение отменено, существующие данные не изменены.";
    return;
  }
  if (findMatchingTemplate(store.items, { title, type, description })) {
    templateNotice.textContent = `Шаблон «${title}» уже сохранён.`;
    return;
  }
  const template = { id: `template-${crypto.randomUUID()}`, title, type, description };
  if (!writeTemplates([...store.items, template], store.raw, templateNotice)) return;
  templateNotice.textContent = `Шаблон «${title}» сохранён. Его можно выбрать при создании следующего события.`;
  templateNotice.hidden = false;
}

function getDateKey(year, monthIndex, day) {
  return `${String(year).padStart(4, "0")}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return `${day} ${monthNamesGenitive[month - 1]} ${String(year).padStart(4, "0")} · ${getWeekday(year, month - 1, day)}`;
}

function updateEventButton(button, key) {
  if (previewSource === button) hideEventPreview();
  const dayEvents = events[key] || [];
  if (dayEvents.length) button.setAttribute("aria-keyshortcuts", "ArrowDown");
  else button.removeAttribute("aria-keyshortcuts");
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

const weekView = document.querySelector("#week-view");
const weekDaysContainer = document.querySelector("#week-days");
const weekNavigationButtons = [...document.querySelectorAll("[data-week-nav]")];
let displayedWeekDate = null;
let preferredWeekday = 0;
let yearlyReturnContext = null;

function getSelectedWeek(key) {
  if (!isCalendarDate(key)) return [];
  const [year, month, day] = key.split("-").map(Number);
  if (year < minimumYear || year > maximumYear) return [];
  const selected = createLocalDate(year, month - 1, day);
  const mondayOffset = (selected.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, index) => {
    const date = createLocalDate(year, month - 1, day - mondayOffset + index);
    if (date.getFullYear() < minimumYear || date.getFullYear() > maximumYear) return null;
    return getDateKey(date.getFullYear(), date.getMonth(), date.getDate());
  });
}

function adjacentWeekDate(direction) {
  if (!displayedWeekDate || ![-1, 1].includes(direction)) return null;
  const [year, month, day] = displayedWeekDate.split("-").map(Number);
  const offset = (createLocalDate(year, month - 1, day).getDay() + 6) % 7;
  const date = createLocalDate(year, month - 1, day - offset + direction * 7 + preferredWeekday);
  const key = date.getFullYear() < minimumYear ? getDateKey(minimumYear, 0, 1)
    : date.getFullYear() > maximumYear ? getDateKey(maximumYear, 11, 31)
    : getDateKey(date.getFullYear(), date.getMonth(), date.getDate());
  // Clamping retains partial boundary weeks, but cannot navigate beyond them.
  return getSelectedWeek(key)[0] === getSelectedWeek(displayedWeekDate)[0] ? null : key;
}

function scrollToSelectedWeekday() {
  const selected = weekDaysContainer.querySelector(".active");
  const scroller = weekDaysContainer.parentElement;
  scroller.scrollLeft = selected.offsetLeft - weekDaysContainer.offsetLeft - (scroller.clientWidth - selected.offsetWidth) / 2;
}

function navigateWeek(direction) {
  if (weekView.hidden) return;
  const key = adjacentWeekDate(direction);
  if (!key) return;
  renderSelectedWeek(key, getSelectedWeek(key));
  scrollToSelectedWeekday();
}

function goToCurrentWeek() {
  if (weekView.hidden) return;
  const now = new Date();
  const key = getDateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const dates = getSelectedWeek(key);
  if (!dates.length) return;
  preferredWeekday = (now.getDay() + 6) % 7;
  renderSelectedWeek(key, dates);
  scrollToSelectedWeekday();
}

function renderSelectedWeek(key, dates) {
  displayedWeekDate = key;
  weekDaysContainer.replaceChildren();
  dates.forEach((date, index) => {
    const column = document.createElement("section");
    column.className = "weekly-day";
    const heading = document.createElement("h2");
    heading.className = "weekly-day-title";
    const weekday = document.createElement("span");
    weekday.className = "weekly-weekday";
    weekday.textContent = weekDays[index] + (date === key ? " · выбрано" : "");
    const label = document.createElement(date ? "time" : "span");
    label.className = "weekly-date";
    if (date) {
      column.dataset.date = date;
      label.dateTime = date;
      const [, month, day] = date.split("-").map(Number);
      label.textContent = `${day} ${monthNamesGenitive[month - 1]}`;
      column.setAttribute("aria-label", `${formatDate(date)}${date === key ? ", выбранная дата" : ""}`);
    } else {
      label.textContent = "Вне диапазона";
      column.classList.add("unavailable");
    }
    column.classList.toggle("weekend", index >= 5);
    column.classList.toggle("active", date === key);
    heading.append(weekday, label);
    column.append(heading);
    weekDaysContainer.append(column);
  });
  const valid = dates.filter(Boolean);
  document.querySelector("#week-range").textContent = `${formatDate(valid[0])} — ${formatDate(valid.at(-1))}`;
  document.querySelector("#week-selected").textContent = `Выбран день: ${formatDate(key)}`;
  document.querySelector("#week-boundary").hidden = valid.length === 7;
  weekNavigationButtons.forEach((button) => {
    button.setAttribute("aria-disabled", String(adjacentWeekDate(Number(button.dataset.weekNav)) === null));
  });
}

function openSelectedWeek(key, opener) {
  if (activeDialog || activeCalendarTool || calendarPlacement || draggedThoughtId || restoreNeedsReload || !weekView.hidden) return;
  const dates = getSelectedWeek(key);
  if (!dates.length) return;
  yearlyReturnContext = { key, opener, left: calendarScroll.scrollLeft, x: window.scrollX, y: window.scrollY };
  hideEventPreview();
  clearTodayFocus();
  hideThoughtUndo();
  endThoughtDrag();
  const [year, month, day] = key.split("-").map(Number);
  preferredWeekday = (createLocalDate(year, month - 1, day).getDay() + 6) % 7;
  renderSelectedWeek(key, dates);
  app.hidden = true;
  app.inert = true;
  weekView.hidden = false;
  weekView.inert = false;
  document.body.classList.add("viewing-week");
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.querySelector("#week-title").focus({ preventScroll: true });
  scrollToSelectedWeekday();
}

function returnToYear() {
  if (!yearlyReturnContext || weekView.hidden) return;
  const context = yearlyReturnContext;
  weekView.hidden = true;
  weekView.inert = true;
  app.hidden = false;
  app.inert = false;
  document.body.classList.remove("viewing-week");
  calendarScroll.scrollLeft = context.left;
  scheduleDayRings();
  const target = context.opener.isConnected ? context.opener
    : calendar.querySelector(`[data-action="open-week"][data-date="${context.key}"]`) || calendarScroll;
  target.focus({ preventScroll: true });
  window.scrollTo({ left: context.x, top: context.y, behavior: "instant" });
  yearlyReturnContext = null;
}

document.querySelector("#back-to-year").addEventListener("click", returnToYear);
weekNavigationButtons.forEach((button) => button.addEventListener("click", () => navigateWeek(Number(button.dataset.weekNav))));
document.querySelector("#week-today").addEventListener("click", goToCurrentWeek);

function createDayRow(year, monthIndex, day) {
  const row = document.createElement("div");
  row.className = "calendar-cell";
  row.dataset.date = getDateKey(year, monthIndex, day);
  applyDayState(row, createLocalDate(year, monthIndex, day));
  applyDayMark(row);

  const line = document.createElement("div");
  line.className = "day-line";

  const number = document.createElement("button");
  number.type = "button";
  number.className = "date-number";
  number.dataset.date = row.dataset.date;
  number.dataset.action = "open-week";
  number.setAttribute("aria-label", `Открыть неделю, ${formatDate(row.dataset.date)}`);
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
  hideEventPreview();
  document.querySelector("#calendar-year").textContent = String(year).padStart(4, "0");
  document.querySelectorAll(".month-column").forEach((column, monthIndex) => {
    renderMonth(column, year, monthIndex);
  });
  scheduleDayRings();
  updatePlacementSelection();
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
  if (restoreNeedsReload) return;
  hideEventPreview();
  stopCalendarPlacement(false);
  if (activeDialog === listDialog) dayListScrollTop = listDialog.querySelector(".day-dialog").scrollTop;
  if (activeDialog) activeDialog.hidden = true;
  else {
    dialogOpener = opener;
    dialogOpenerDate = opener?.dataset.date || null;
  }
  activeDialog = dialog;
  app.inert = true;
  dialog.hidden = false;
  focusTarget.focus({ preventScroll: true });
}

function restoreDialogFocus() {
  const available = (element) => element?.isConnected && !element.disabled && element.getClientRects().length > 0;
  const dateButton = dialogOpenerDate
    ? calendar.querySelector(`[data-action="open-day"][data-date="${dialogOpenerDate}"]`) : null;
  const target = [dialogOpener, dateButton, ...app.querySelectorAll("button")].find(available);
  target?.focus({ preventScroll: true });
}

function closeDialog() {
  if (restoreNeedsReload) return;
  backupReadToken += 1;
  pendingRestore = null;
  if (!activeDialog) return;
  if (activeDialog === settingsDialog) {
    applyYearScale(yearScale);
    settingsButton.setAttribute("aria-expanded", "false");
  }
  if (activeDialog === filtersDialog) filtersButton.setAttribute("aria-expanded", "false");
  activeDialog.hidden = true;
  app.inert = false;
  restoreDialogFocus();
  activeDialog = null;
  dialogOpener = null;
  dialogOpenerDate = null;
  creationDate = null;
  listDate = null;
  dayListScrollTop = 0;
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
  eventDateInput.closest("label").hidden = !event;
  eventDateInput.disabled = !event;
  eventDateInput.value = key;
  eventDateInput.setCustomValidity("");
  document.querySelector("#yearly-event-date").hidden = Boolean(event);
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
  if (button) updateEventButton(button, key);
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
  if (events[key]?.length) openDayEvents(key, null, remaining[index] || remaining[remaining.length - 1]);
  else closeDialog();
}

function dismissDialog() {
  if (restoreNeedsReload) return;
  if (activeDialog === restoreDialog) {
    backupReadToken += 1;
    pendingRestore = null;
    openDialog(settingsDialog, null, importButton);
  }
  else if (activeDialog === templateFutureDialog) finishTemplateUpdate("Шаблон сохранён. События оставлены без изменений.");
  else if (activeDialog === templateDialog) showTemplateLibrary(activeTemplateId);
  else if (activeDialog === templateDeleteDialog) openDialog(templateDialog, null, templateDeleteButton);
  else if (activeDialog === thoughtDeleteDialog) cancelThoughtDeletion();
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

function openDayEvents(key, opener = null, focusEvent = null, focusCreation = false) {
  if (listDate !== key) dayListScrollTop = 0;
  selectedEvent = null;
  listDate = key;
  document.querySelector("#day-events-date").textContent = formatDate(key);
  dayEventList.replaceChildren(...(events[key] || []).map(createListEvent));
  const index = (events[key] || []).indexOf(focusEvent);
  const target = focusCreation ? createFromList
    : dayEventList.querySelector(`[data-event-index="${index}"]`) || dayEventList.querySelector("button") || createFromList;
  openDialog(listDialog, opener, target);
  const panel = listDialog.querySelector(".day-dialog");
  panel.scrollTop = dayListScrollTop;
  const bounds = panel.getBoundingClientRect();
  const focusBounds = target.getBoundingClientRect();
  if (focusBounds.top < bounds.top) panel.scrollTop -= bounds.top - focusBounds.top;
  else if (focusBounds.bottom > bounds.bottom) panel.scrollTop += focusBounds.bottom - bounds.bottom;
}

function returnToDayList() {
  const fromCreation = activeDialog === creationDialog && !editingEvent;
  if (!listDate || (!fromCreation && activeDialog !== cardDialog)) return;
  const focusEvent = fromCreation ? null : selectedEvent?.event;
  if (fromCreation) {
    eventForm.reset();
    creationDate = null;
  }
  openDayEvents(listDate, null, focusEvent, fromCreation);
}

function submitEvent(event) {
  event.preventDefault();
  if (!creationDate || activeDialog !== creationDialog) return;
  const sourceDate = creationDate;
  const targetDate = editingEvent ? eventDateInput.value : sourceDate;
  const targetYear = Number(targetDate.slice(0, 4));
  const validDate = isCalendarDate(targetDate) && targetYear >= minimumYear && targetYear <= maximumYear;
  eventDateInput.setCustomValidity(editingEvent && !validDate ? "Введите существующую дату от 01.01.0001 до 31.12.9999." : "");
  const titleInput = getEventTitleInput();
  const title = titleInput.value.trim();
  titleInput.setCustomValidity(title ? "" : (placedEvents.has(editingEvent) ? "Введите текст мысли." : "Введите название события."));
  if (!eventForm.reportValidity() || !validDate) return;

  const changes = {
    title,
    colour: eventForm.elements.colour.value,
    description: eventForm.elements.description.value.trim(),
  };
  const dayEvents = events[sourceDate] || [];
  const index = editingEvent ? dayEvents.indexOf(editingEvent) : -1;
  if (editingEvent && index < 0) return;
  if (editingEvent) {
    storedEventRecords.set(changes, storedEventRecords.get(editingEvent));
  } else {
    const template = savedTemplates.find((item) => item.id === templateSelect.value);
    if (template) {
      // Reference tuple: title, colour, description, "template", template ID.
      storedEventRecords.set(changes, [title, changes.colour, changes.description, "template", template.id]);
    }
  }
  const moved = editingEvent && targetDate !== sourceDate;
  const nextEvents = { ...events };
  if (moved) {
    nextEvents[sourceDate] = dayEvents.filter((item) => item !== editingEvent);
    if (!nextEvents[sourceDate].length) delete nextEvents[sourceDate];
    nextEvents[targetDate] = [...(events[targetDate] || []), changes];
  } else {
    nextEvents[sourceDate] = editingEvent
      ? dayEvents.map((item, position) => position === index ? changes : item)
      : [...dayEvents, changes];
  }
  if (placedEvents.has(editingEvent)) {
    if (!savePlacedEvent(editingEvent, { ...changes, date: targetDate }, eventSaveError)) return;
  } else if (!saveYearEvents(nextEvents, eventSaveError)) return;
  if (editingEvent) {
    Object.assign(editingEvent, changes);
    if (moved) {
      dayEvents.splice(index, 1);
      if (!dayEvents.length) delete events[sourceDate];
      (events[targetDate] ||= []).push(editingEvent);
      if (undoThoughtPlacementId === placedEvents.get(editingEvent)) hideThoughtUndo();
    }
  } else {
    (events[sourceDate] ||= []).push(changes);
  }
  refreshDate(sourceDate);
  if (moved) refreshDate(targetDate);
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

function hideEventPreview() {
  window.clearTimeout(previewCloseTimer);
  const source = previewSource;
  const returnFocus = eventPreview.contains(document.activeElement);
  eventPreview.hidden = true;
  source?.removeAttribute("aria-describedby");
  previewSource = null;
  dismissedPreviewSource = source;
  if (returnFocus && source?.isConnected) source.focus({ preventScroll: true });
}

function showEventPreview(button) {
  if (!button || button === dismissedPreviewSource || activeDialog || activeCalendarTool || calendarPlacement || draggedThoughtId) return;
  const entries = events[button.dataset.date] || [];
  if (!entries.length) return;
  if (previewSource === button) {
    window.clearTimeout(previewCloseTimer);
    return;
  }
  hideEventPreview();
  const cell = button.closest(".calendar-cell").getBoundingClientRect();
  const viewport = calendarScroll.getBoundingClientRect();
  if (cell.right <= viewport.left || cell.left >= viewport.right || cell.bottom <= 0 || cell.top >= innerHeight) return;
  previewSource = button;
  eventPreviewContent.textContent = entries.map((entry) => `${entries.length > 1 ? "• " : ""}${entry.title}${entry.description ? `\n${entry.description}` : ""}`).join("\n\n");
  const width = Math.min(cell.width, document.documentElement.clientWidth - 16);
  eventPreview.style.width = `${width}px`;
  eventPreview.style.left = `${Math.max(8, Math.min(cell.left, document.documentElement.clientWidth - width - 8))}px`;
  eventPreview.style.top = "8px";
  eventPreview.hidden = false;
  eventPreview.scrollTop = 0;
  const height = eventPreview.getBoundingClientRect().height;
  eventPreview.style.top = `${Math.max(8, Math.min(cell.top + cell.height / 2 - height / 2, innerHeight - height - 8))}px`;
  button.setAttribute("aria-describedby", "event-preview-content");
}

function schedulePreviewClose() {
  window.clearTimeout(previewCloseTimer);
  previewCloseTimer = window.setTimeout(() => {
    if (!eventPreview.matches(":hover") && !previewSource?.matches(":hover")
      && document.activeElement !== previewSource && !eventPreview.contains(document.activeElement)) hideEventPreview();
  }, 120);
}

calendar.addEventListener("pointerover", (event) => {
  if (event.pointerType === "touch") return;
  const button = event.target.closest('[data-action="open-day"]');
  if (button && !button.contains(event.relatedTarget)) showEventPreview(button);
});
calendar.addEventListener("pointerout", (event) => {
  const button = event.target.closest('[data-action="open-day"]');
  if (button && !button.contains(event.relatedTarget)) {
    if (dismissedPreviewSource === button) dismissedPreviewSource = null;
    schedulePreviewClose();
  }
});
calendar.addEventListener("focusin", (event) => {
  if (event.target.matches('[data-action="open-day"]:focus-visible')) showEventPreview(event.target);
});
calendar.addEventListener("focusout", (event) => {
  if (dismissedPreviewSource === event.target) dismissedPreviewSource = null;
  schedulePreviewClose();
});
eventPreview.addEventListener("pointerenter", () => window.clearTimeout(previewCloseTimer));
eventPreview.addEventListener("pointerleave", schedulePreviewClose);
eventPreview.addEventListener("focusout", schedulePreviewClose);
eventPreviewContent.addEventListener("click", () => {
  if (window.getSelection()?.toString()) return;
  const source = previewSource;
  hideEventPreview();
  source?.click();
});
document.addEventListener("keydown", (event) => {
  if (activeDialog) return;
  if (event.key === "ArrowDown" && document.activeElement.matches('[data-action="open-day"]')) {
    dismissedPreviewSource = null;
    showEventPreview(document.activeElement);
    if (previewSource) {
      event.preventDefault();
      eventPreview.focus({ preventScroll: true });
    }
    return;
  }
  const source = previewSource;
  if (event.key === "Escape" && source) {
    event.preventDefault();
    event.stopImmediatePropagation();
    hideEventPreview();
  } else if (source && document.activeElement === source && event.key === "Tab" && !event.shiftKey) {
    event.preventDefault();
    eventPreview.focus({ preventScroll: true });
  } else if (source && document.activeElement === eventPreview && event.key === "Tab") {
    event.preventDefault();
    const buttons = [...app.querySelectorAll("button")].filter((button) => !button.disabled && button.getClientRects().length);
    const next = event.shiftKey ? source : buttons[buttons.indexOf(source) + 1] || todayButton;
    hideEventPreview();
    next.focus({ preventScroll: true });
  } else if (source && document.activeElement === eventPreview && event.key === "Enter") {
    event.preventDefault();
    hideEventPreview();
    source.click();
  }
}, true);
document.addEventListener("scroll", (event) => {
  if (event.target !== eventPreview && previewSource) hideEventPreview();
}, true);
window.addEventListener("resize", () => hideEventPreview());

calendar.addEventListener("click", (event) => {
  if (app.hidden || draggedThoughtId) return;
  if (suppressThoughtClick && event.detail !== 0) return;
  const cell = event.target.closest(".calendar-cell[data-date]");
  if (calendarPlacement && cell) {
    selectPlacementDate(cell.dataset.date);
    return;
  }
  if (activeCalendarTool && cell) {
    if (activeCalendarTool === "erase") openDayErase(cell);
    else saveDayMark(cell);
    return;
  }
  const button = event.target.closest("button[data-date]");
  if (!button || !calendar.contains(button)) return;
  const key = button.dataset.date;
  if (button.dataset.action === "open-week") {
    openSelectedWeek(key, button);
    return;
  }
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
  if (calendarPlacement && !event.target.closest(".calendar-cell[data-date], [data-calendar-tool], #day-mark-palette button, [data-go-today], [data-year-nav]")) stopCalendarPlacement();
  if (activeCalendarTool && !event.target.closest(".calendar-cell[data-date], [data-calendar-tool], #day-mark-palette button, [data-go-today]")) setCalendarTool(null);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !activeDialog) {
    stopCalendarPlacement();
    setCalendarTool(null);
  }
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
document.querySelector("#export-calendar").addEventListener("click", exportCalendarBackup);
importButton.addEventListener("click", () => {
  if (activeDialog !== settingsDialog || restoreNeedsReload) return;
  backupReadToken += 1;
  backupFile.value = "";
  document.querySelector("#backup-read-status").hidden = true;
  backupFile.click();
});
backupFile.addEventListener("change", prepareBackupRestore);
restoreConfirm.addEventListener("click", confirmBackupRestore);
document.querySelector("#reload-after-restore").addEventListener("click", () => window.location.reload());

for (const dialog of [creationDialog, cardDialog, listDialog, filtersDialog, thoughtDialog, thoughtDeleteDialog, historyDeleteDialog, settingsDialog, dayEraseDialog, templatesDialog, templateDialog, templateDeleteDialog, templateFutureDialog, restoreDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest("[data-close-dialog]")) dismissDialog();
    else if (event.target.closest("[data-back-to-list]")) returnToDayList();
  });
}
document.addEventListener("keydown", handleDialogKeydown);
nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
eventDateInput.addEventListener("input", () => eventDateInput.setCustomValidity(""));
placedThoughtText.addEventListener("input", () => placedThoughtText.setCustomValidity(""));
eventForm.addEventListener("submit", submitEvent);
templatesButton.addEventListener("click", () => showTemplateLibrary());
templateUseButton.addEventListener("click", startTemplatePlacement);
calendarPlacementConfirm.addEventListener("click", confirmCalendarPlacement);
document.querySelector("#repeat-event").addEventListener("click", startEventRepeat);
document.querySelector("#cancel-template-placement").addEventListener("click", () => stopCalendarPlacement());
createTemplateButton.addEventListener("click", () => openTemplateEditor());
templateList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-template-id]");
  if (row) openTemplateEditor(row.dataset.templateId);
});
templateForm.addEventListener("submit", submitTemplate);
templateFutureApply.addEventListener("click", applyTemplateUpdate);
document.querySelector("#select-all-template-future").addEventListener("click", () => selectTemplateCandidates(true));
document.querySelector("#clear-template-future").addEventListener("click", () => selectTemplateCandidates(false));
templateName.addEventListener("input", () => templateName.setCustomValidity(""));
templateDeleteButton.addEventListener("click", requestTemplateDeletion);
document.querySelector("#confirm-template-delete").addEventListener("click", confirmTemplateDeletion);
createColourPalette(templatePalette, toEventColour, setTemplateColour);

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
