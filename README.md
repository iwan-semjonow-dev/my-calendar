# My Calendar

My Calendar is a visual yearly planning app inspired by a large paper calendar. It brings the months of a year into one connected view.

The project is a working yearly prototype in active development. The application interface is in Russian.

## Current features

### Yearly view and navigation

The calendar has twelve equally sized vertical month columns, with valid dates and weekdays, leap-year handling, and distinct styling for weekends, past days, and today. It opens on the current system year. Browse other years with the navigation buttons, or use Today to return to the current local date, scroll it into view, and briefly highlight it.

The grid fills the available panel width on wide screens. Narrower windows use horizontal scrolling inside the calendar, keeping all twelve months in one row. Compact, Standard, and Large scales change text size and the widths of the date number and weekday areas; row height stays the same. Scale changes can be previewed, cancelled, or saved.

Select a day number to open the Monday-to-Sunday week containing that exact date, including its year. Use the previous and next arrows to move by one week, or Today (**Сегодня**) to select the current local date and its week. The selected day moves with the week, retaining its weekday where possible; at the supported date boundary, the nearest valid day is selected. The weekly view includes a local-time grid from 00:00 to 24:00, with 30-minute divisions and hourly labels. Day headings stay visible during vertical scrolling; the time scale stays visible during horizontal scrolling inside the panel. Use Add event (**＋ Добавить событие**) to create an event on a valid date in the displayed week, with a title, colour, optional description, and start and end times in 30-minute steps. Events must end later than they start, at or before 24:00; overlapping intervals on the same date are rejected, while touching intervals are allowed. Weekly events stay in memory while browsing weeks and switching views, but are lost on reload. They are separate from yearly events and are not included in yearly backups. Editing, deleting, and creating weekly events by clicking the grid are not available yet. The return button (**← Годовой календарь**) restores the original yearly view, scroll position, and focus even after browsing other weeks. Dates beyond the supported years 0001–9999 are shown as unavailable, and navigation stops at the boundary weeks. While marking days or selecting dates for a batch, day numbers continue to act on that mode instead of opening a week. Weekly navigation does not change saved data or the scope of yearly backups.

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

## Local storage

| Data | Storage | After a page reload |
|---|---|---|
| Yearly events, including template links | localStorage | Retained after a successful save |
| History snapshots | localStorage | Retained after a successful save |
| Undated thoughts and their order | localStorage | Retained after a successful save |
| Scheduled thoughts and their source identity | localStorage | Retained after a successful save |
| Day fills and outlines | localStorage | Retained after a successful save |
| Event templates | localStorage | Retained after a successful save |
| Yearly scale setting | localStorage | Retained after a successful save |
| Weekly events | In memory | Lost |
| Filter selection | In memory | Reset |
| Displayed year | In memory | Current system year opens again |
| Unsaved form edits and unconfirmed date or event selections | In memory | Discarded |
| Unsaved scale preview and active marking tool | In memory | Reset |

localStorage belongs to the browser, profile, and origin used to open the app. For a web address, the origin is its protocol, host, and port; opening the app at a different origin uses separate storage. Retention requires storage to be available and each save to succeed. Clearing browser data can delete the saved calendar.

Local storage is not a backup and does not automatically synchronize devices. Copying the application files or running `git push` does not transfer localStorage data. Use a JSON backup to move saved data between browsers, profiles, or devices.

Storage behaviour for direct `file://` access varies between browsers; see [Run locally](#run-locally) before relying on saved data.

The app reports storage errors and blocks conflicting writes when saved records have changed in another tab. Unsaved input remains temporary: copy it before reloading if you need to keep it.

## Backups and restoration

### Create a backup

1. Open Settings (**Настройки**).
2. Select Create backup (**Создать резервную копию**).
3. Check the browser's downloads and keep the downloaded `.json` file in a safe place. The app confirms that downloading was started, not that the file was saved to disk.

The suggested filename is `my-calendar-backup-YYYY-MM-DD.json`, using the export date in UTC. Your browser may adjust the name if a file with that name already exists.

Export reads the latest saved data for all years, regardless of the displayed year: events and template links, undated thoughts and their order, scheduled thoughts and information needed to return them, templates, independent history snapshots, day fills and outlines, and settings. Drafts, temporary selections, and an unsaved scale preview are excluded. Export does not change the stored calendar.

If a section cannot be read, contains unsupported or damaged data, or changes during collection, export reports an error and does not start a download. It does not silently substitute empty data to produce an incomplete backup.

### Restore a backup

Before replacing a calendar, export its current data to a separate file if you may need it later.

1. Open Settings (**Настройки**) and select Restore data (**Восстановить данные**).
2. Choose a JSON backup file. The app reads and validates the complete file before opening confirmation.
3. Review the filename and the summary of records to be restored.
4. Select Restore data (**Восстановить данные**) to replace the saved calendar, or Cancel (**Отмена**) to leave it unchanged.

Confirmation replaces saved yearly data for **all years and settings**; records are not merged. Before confirmation, selecting or reading a file does not change calendar data. Cancelling, closing the confirmation, pressing Escape, or clicking its backdrop does not write changes. Unrelated browser storage keys are left alone.

After all sections have been written and verified, the page reloads with the restored data and settings. Temporary selections, drafts, and the unsaved scale preview are reset. You can select the same file again if another attempt is needed.

### Move data to another device

Export a backup on the source device, transfer the JSON file yourself, then restore it in My Calendar on the receiving device. Restoration replaces the receiving calendar; this is a manual transfer, not two-way synchronization.

The JSON file contains user records in plain text and is not encrypted by the app. Store and share it with the same care as the calendar's contents.

### Errors and recovery limits

The current backup format is `my-calendar-backup`, version `1`. Restoration checks the required settings, events, thought placements, day marks, templates, thoughts, and history sections using the app's supported record formats. Invalid JSON, an unsupported format or version, missing sections, and damaged required data are rejected before writing. Compatibility with every older application or backup version is not guaranteed.

If saved data changes after the confirmation was prepared, including in another tab, restoration stops and asks you to cancel and select the file again. Avoid editing the calendar in other tabs while restoring.

If a write fails, the app attempts to restore the original values and verifies the result. Detected changes from another tab are not overwritten during rollback. If all original values are confirmed, you can retry or cancel. If the original state cannot be confirmed, the app reports the affected sections and blocks further writes from the page until reload; it does not report a successful restoration.

localStorage has no transaction spanning multiple keys. Checks cannot prevent every concurrent-write race, and closing the page or browser during restoration can leave a partial result. After an interruption, keep the backup file, reload the page, inspect the data, and repeat restoration if needed. The app does not guarantee recovery from a browser crash or interruption midway through writing.

## Run locally

1. Clone the repository, or download the ZIP archive and extract it.
2. Open `index.html` in a modern browser.

No dependency installation or build step is required. Keep `index.html`, `styles.css`, and `script.js` together in the project folder.

When opening the app directly through a `file://` URL, localStorage availability and behaviour can vary between browsers. Check that saving and reloading work in the browser you use before relying on retained data.

Use a separate browser profile with artificial data for local testing to keep test records isolated from your working calendar.

## Technology and files

The app uses HTML5, CSS3, JavaScript, and the Web Storage API (`localStorage`).

| File | Purpose |
|---|---|
| `index.html` | Page structure and dialogs |
| `styles.css` | Layout and visual styles |
| `script.js` | Calendar rendering and interactions |

## Project direction

See [Project Vision](PROJECT_VISION.md) for the broader product direction. It includes goals beyond the current application, such as detailed weekly planning, synchronization, and AI assistance. Those capabilities are not implemented. The features and storage behaviour described in this README reflect the current yearly calendar.
