# My Calendar

My Calendar combines a paper-inspired year overview with a weekly grid for planning events by time.

A yearly event records what happens on a date. A weekly event reserves a start and end time. They are separate records even when they share a date.

## Run locally

1. Clone the repository, or download and extract its ZIP archive.
2. From the project folder, open `index.html` in a modern browser. Keep `styles.css`, `i18n.js` and `script.js` beside it. No installation, build step, or server is required.
3. The interface starts in German. In either calendar, open **Einstellungen → Sprache** / **Настройки → Язык интерфейса**, choose **Deutsch** or **Русский**, and save. Both views switch immediately and remember your choice. Your entries and custom category names keep their original text.

Direct-file (`file://`) storage varies by browser. Save a test event and reload before relying on it. If you later serve the same files over HTTP, the calendar saved under the file address may be unavailable there. To carry your data across, [create a backup](#create-a-backup) at the original address and [restore it](#restore-a-backup) at the new one. Use a separate browser profile and artificial records for testing.

### Schedule your first timed event

1. In the yearly overview, find the date and click its **day number** to open that week.
2. Click **＋ Добавить событие**, enter a title in **Название**, choose **Начало** and **Конец**, then click **Сохранить событие**. The card appears in that day's time column.
3. Click **← Годовой календарь** to return to the original date. The timed entry stays in the weekly grid.

See [Yearly planning](#yearly-planning) for date-based events and [Weekly planning](#weekly-planning) for time slots, overlap checks, and grid settings.

## Yearly planning

### Yearly view and navigation

The calendar has twelve equally sized vertical month columns, with valid dates and weekdays, leap-year handling, and distinct styling for weekends, past days, and today. It opens on the current system year. Browse other years with the navigation buttons, or use Today to return to the current local date, scroll it into view, and briefly highlight it.

The grid fills the available panel width on wide screens. Narrower windows use horizontal scrolling inside the calendar, keeping all twelve months in one row. Compact, Standard, and Large scales change text size and the widths of the date number and weekday areas; row height stays the same. Scale changes can be previewed, cancelled, or saved.

### Events and daily details

Create events with a date, title, colour, and description, without start or end times. View and edit them, move them to another date or year through the editor, or delete them with confirmation. Moving an event appends it to the destination day's list without replacing existing entries; saving on the same date keeps its position. Day marks remain on their original dates.

A date can hold several events, with a counter for additional entries. An empty date opens the creation form, one event opens its card, and several events open the day's list. From the list, open a specific event or create another one. Hovering over an occupied cell or focusing it with the keyboard previews its titles and descriptions, including multiline text. Long previews can be scrolled; Escape closes the preview without opening a dialog.

### Colours, filters, and day marks

A shared 16-colour palette is available for thoughts, events, templates, and day marks. Filters use event titles from the displayed year to highlight matches and dim other entries, while keeping every date in the grid.

Day fills and hand-drawn rounded outlines are independent layers and can coexist on a date without changing its events. The eraser removes a chosen fill, outline, all events on that date, or all these layers together. Any operation that removes events requires confirmation. Erasing a scheduled thought deletes it rather than returning it to the thought strip; history snapshots and templates are unaffected. Press Escape or click the active tool again to leave marking mode.

### Thoughts and scheduling

Keep undated thoughts in the horizontal strip above the calendar. Create them, edit their text and colour, delete them with confirmation, and drag cards to change their order.

Drag a thought onto a date to schedule it alongside existing events. It leaves the undated strip while retaining its full text, colour, and identity. A scheduled thought can be edited, moved to another date, or deleted with confirmation. Undo the latest placement within nine seconds, or return the thought through its card later. It returns to the start of the strip with its current text and colour; any description is retained for scheduling it again. Deletion and return are separate actions.

### Templates and repetition

Create reusable templates directly in the library or save an event's title, colour, and description as a template without a date. Edit templates or delete them with confirmation. Apply a template in the event creation form, then adjust its fields before saving. Events retain the selected template's ID across reloads, edits, and date changes. Matching titles do not create a link, and deleting a template does not delete its events.

Place a saved template on several dates by selecting days directly in the calendar and confirming the batch. Selecting a day again deselects it, and year navigation keeps the selection. Each date receives a separate event linked to that template; existing entries remain. Repeat an existing event through the same date-selection flow to create independent copies of its actual content and template link, if any. The original stays unchanged. Selecting the original date or repeating a later operation can add another copy. Repeating a scheduled thought creates ordinary events, not additional placements of that thought. These are manual operations, not automatic recurring schedules.

A template link does not automatically update events. After saving changes to an existing template, review its linked events strictly after today's local date, across all saved years, and choose which to update. Candidates start selected; individual checkboxes, Select all, and Clear selection control the selection. Confirmation replaces only the selected events' title, colour, and description, including manual edits to those fields. Dates, order, and unselected events stay unchanged. Today and past dates are excluded. Declining the update leaves the saved template in place without changing events; if the event update fails, it can be retried without saving the template again.

### Independent history

Manually add an event to the chronological history strip as an independent snapshot of its date, title, colour, and description. Editing, moving, or deleting the original event, or applying template changes to it, does not alter the snapshot. Deleting a snapshot requires confirmation and does not delete the source event.

## Weekly planning

### Open a week and return to the year

Click **Неделя** / **Woche** beside the yearly heading to open the current week with today selected, from any year. To open another date's week, click its **day number**. While a marking tool or a batch date selection is active, the number serves that operation. The arrows (**Предыдущая неделя** and **Следующая неделя**) move one week at a time and keep the selected weekday where possible. Navigation stops at years 0001 and 9999, with out-of-range days unavailable. **Сегодня** selects today's local date. **← Годовой календарь** restores the original year and scroll position and returns focus to the button or day number that opened the week.

### Create, edit, or delete an event

- Use **＋ Добавить событие** to start at 18:00 on the selected date, or click a free interval in the grid to use that column's date and the start of that interval. Both methods propose one time step. Enter a title, adjust the fields, and choose **Сохранить событие**.
- Events on the same date may touch but cannot overlap. With a 15-minute step, an event following 09:00–10:00 can start at 10:00. Starting it at 09:45 would overlap. The end must be later than the start and may be as late as 24:00.
- Click a card or focus it and press Enter to edit its title, date within the displayed week, times, category, colour, or optional description. **Сохранить изменения** checks the interval against the other events. **Отмена** discards the draft. To delete the event, choose **Удалить**, check the saved title, date, and interval, then confirm with **Удалить**. Cancelling the confirmation returns to your draft.

### Choose categories and reuse templates

Choose **Категория** and **Цвет** independently. The initial categories are **Учёба**, **Работа**, **Проект**, **Личное**, and **Финансы**. New events start in blue with **Учёба** selected, falling back to the first available category or **Без категории**.

Open **Категории** to add a name with **Добавить** (up to 32 characters, unique regardless of case). Confirming **Удалить категорию** moves its events to **Без категории** and preserves their colours and other details. Editing unrelated fields also preserves older events' missing or unknown categories and saved colours.

In the event form, **Сохранить как шаблон** saves the current fields as a weekly template. The event itself still needs its own save. In a new event, choose a template under **Создать из шаблона** to fill the title, category, colour, and description. The selected date and both times stay in place. The template's usual time and duration are hints. Adjust the filled fields before saving, or choose **Без шаблона** to restore their values from before you applied the template.

### Adjust the grid and return to your range

Open **Настройки**, make your choices, and select **Сохранить** to apply them or **Отмена** to discard them.

- **Первый день недели** sets which weekday appears first (Monday by default). The selected date stays selected when the columns change order.
- **Шаг времени** sets the grid divisions, click intervals, and time choices to 15 or 30 minutes (default 30). Existing events keep their exact times, including off-step times in the editor.
- **Основной диапазон** sets the scale. Choose whole-hour boundaries within 00:00–24:00, initially 06:00–22:00. The grid scales that range to the available panel height, allowing at least 360 pixels for it, and scrolls to its start where possible. All 24 hours remain reachable, including events outside or crossing the range.
- **Диапазон · 06:00–22:00** in the toolbar shows the saved boundaries. After scrolling to other hours, press it to return to the start of that range with the same day columns in view.
- **Фон календаря** sets the background colour of the time scale and day columns after saving. Event cards keep their own colours.

Short cards show less text to fit their duration. Open the card for full details. On small screens, scroll inside the panel with the day headings and time scale in view. In very low windows the weekly view also scrolls to keep the controls reachable. Resizing preserves the time in view as far as the scroll limits allow.

## Local storage

| Data | Storage | After a page reload |
|---|---|---|
| Yearly events, including template links | localStorage | Retained after a successful save |
| History snapshots | localStorage | Retained after a successful save |
| Undated thoughts and their order | localStorage | Retained after a successful save |
| Scheduled thoughts and their source identity | localStorage | Retained after a successful save |
| Day fills and outlines | localStorage | Retained after a successful save |
| Yearly event templates | localStorage | Retained after a successful save |
| Shared settings (language, yearly scale, first weekday, time step, main range, weekly background) | localStorage | Retained after a successful save |
| Weekly events, categories, and weekly templates | localStorage | Retained after a successful save |
| Filter selection | In memory | Reset |
| Displayed year | In memory | Current system year opens again |
| Unsaved form edits and unconfirmed date or event selections | In memory | Discarded |
| Unsaved scale preview and active marking tool | In memory | Reset |

localStorage belongs to the browser, profile, and origin used to open the app. For a web address, the origin is its protocol, host, and port; opening the app at a different origin uses separate storage. Retention requires storage to be available and each save to succeed. Clearing browser data can delete the saved calendar.

Local storage is not a backup and does not automatically synchronize devices. Copying the application files or running `git push` does not transfer localStorage data. Use a calendar JSON backup to move saved data between browsers, profiles, or devices.

The app reports storage errors and blocks conflicting writes when saved records have changed in another tab. Unsaved input remains temporary: copy it before reloading if you need to keep it.

## Backups and restoration

### Create a backup

1. In the yearly view, open Settings (**Настройки**).
2. Select Create backup (**Создать резервную копию**).
3. Check the browser's downloads and keep the downloaded `.json` file in a safe place. The app confirms that downloading was started, not that the file was saved to disk.

The suggested filename is `my-calendar-backup-YYYY-MM-DD.json`, using the export date in UTC. Your browser may adjust the name if a file with that name already exists.

Export reads the latest saved data for all years and weeks. It includes yearly events and template links, undated and scheduled thoughts, yearly templates, independent history snapshots, day fills and outlines, and the separate weekly events, categories, and templates. The shared `settings` object includes the weekly grid preferences and background. Drafts, temporary selections, and an unsaved scale preview are excluded. Export does not change the stored calendar.

If a section cannot be read, contains unsupported or damaged data, or changes during collection, export reports an error and does not start a download. It does not silently substitute empty data to produce an incomplete backup.

### Restore a backup

Before replacing a calendar, export its current data to a separate file if you may need it later.

1. In the yearly view, open Settings (**Настройки**) and select Restore data (**Восстановить данные**).
2. Choose a JSON backup file. The app reads and validates the complete file before opening confirmation.
3. Review the filename and the summary. Version 2 replaces both calendars for all years and the shared settings. Version 1 replaces yearly data and shared settings while preserving the receiving calendar's weekly events, categories, and templates.
4. Select Restore data (**Восстановить данные**) to replace the saved calendar, or Cancel (**Отмена**) to leave it unchanged.

In a full backup, an empty weekly list clears that collection. A backup made with the built-in category list restores that default, distinct from an intentionally empty list.

Records are not merged. Selecting a file, cancelling, closing the confirmation, pressing Escape, or clicking its backdrop does not write changes. Unrelated browser storage keys are left alone.

After all sections have been written and verified, the page reloads with the restored data and settings. A backup with a supported language restores that choice. If the language is missing or unsupported, the calendar opens in German. Temporary selections, drafts, and the unsaved scale preview are reset. You can select the same file again if another attempt is needed.

### Move data to another device

[Create a backup](#create-a-backup) on the source device and transfer the downloaded JSON file yourself. On the receiving device, open My Calendar and follow [Restore a backup](#restore-a-backup). Later edits stay on the device where you make them.

The JSON file contains user records in plain text and is not encrypted by the app. Store and share it with the same care as the calendar's contents.

### Errors and recovery limits

The current backup format is `my-calendar-backup`, version `2`. In addition to the version 1 sections, it requires `weeklyEvents`, `weeklyCategories`, and `weeklyTemplates`. Invalid JSON, an unsupported format or version, missing sections, and damaged required data are rejected before writing.

If saved data changes after the confirmation was prepared, including in another tab, restoration stops and asks you to cancel and select the file again. Avoid editing the calendar in other tabs while restoring.

If a write fails, the app attempts to restore the original values and verifies the result. Detected changes from another tab are not overwritten during rollback. If all original values are confirmed, you can retry or cancel. If the original state cannot be confirmed, the app reports the affected sections and blocks further writes from the page until reload; it does not report a successful restoration.

localStorage has no transaction spanning multiple keys. Checks cannot prevent every concurrent-write race, and closing the page or browser during restoration can leave a partial result. After an interruption, keep the backup file, reload the page, inspect the data, and repeat restoration if needed. The app does not guarantee recovery from a browser crash or interruption midway through writing.

## Technology and files

The app uses HTML5, CSS3, JavaScript, and the Web Storage API (`localStorage`).

| File | Purpose |
|---|---|
| `index.html` | Page structure and dialogs |
| `styles.css` | Layout and visual styles |
| `script.js` | Calendar rendering and interactions |
| `i18n.js` | Russian and German interface messages |

## Project direction

See [Project Vision](PROJECT_VISION.md) for the broader product direction, including plans for synchronization and AI assistance.
