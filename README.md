# My Calendar

My Calendar is a visual yearly planning app inspired by a large paper calendar. It brings the months of a year into one connected view.

The project is a working yearly prototype in active development. The application interface is in Russian.

## Current features

- Twelve vertical month columns. The current system year opens when the page loads; previous and next year buttons let you browse other years.
- Jump to today's local date from any year, scroll it into view, and briefly highlight the cell.
- Valid dates and weekdays, including leap years, with distinct styling for weekends, past days, and today.
- Create, view, and edit events, and delete them with confirmation. Events have a date, title, colour, and description, without start or end times.
- Multiple events on one date, a counter for additional events, and a list of the day's events.
- Filters by event title that highlight matches and dim other events while keeping every date in the grid.
- Create undated thoughts in a horizontal card strip above the calendar, edit their text and colour, and delete them with confirmation.
- Reorder thoughts by dragging cards within the strip; the order is retained after a successful save.
- Drag a thought onto a calendar date to schedule it alongside existing events. Its full text, colour, and source identity are retained after reloading; it leaves the undated strip. Scheduled thoughts can be viewed, edited, deleted with confirmation, saved as templates, or added to history.
- Undo the latest thought placement within nine seconds, or return it through its event card later. The thought returns to the start of the strip with its current text and colour; its description is retained for scheduling it again.
- A shared 16-colour palette for creating thoughts and for creating and editing events.
- Add independent day fills and hand-drawn rounded outlines with the same 16-colour palette. Marks persist across reloads and year changes without changing events or thoughts. Click the active tool again, press Escape, or click an empty area of the calendar panel to leave marking mode.
- Save an event's title, colour, and description as an independent template. Apply a template when creating an event, keep the selected date, and adjust the fields before creation.
- Manually add independent event snapshots to a chronological history strip. Editing or deleting the original event does not change its snapshots. Deleting a snapshot requires confirmation.
- Three yearly scales: Compact, Standard, and Large. Selection gives an immediate preview; cancellation restores the previous scale, and saving retains the choice. Scale changes text size and the widths of the date number and weekday areas; row height stays the same.

## Data storage and limitations

| Data | Storage | After a page reload |
|---|---|---|
| Events | localStorage | Retained between reloads after a successful save |
| History snapshots | localStorage | Retained between reloads after a successful save |
| Thoughts | localStorage | Retained between reloads |
| Scheduled thoughts | localStorage | Retained between reloads after a successful save |
| Day fills and outlines | localStorage | Retained between reloads after a successful save |
| Event templates | localStorage | Retained between reloads |
| Yearly scale setting | localStorage | Retained between reloads |
| Filter selection | In memory | Reset |

localStorage belongs to the browser and profile used to open the app. It provides neither cloud synchronization nor a backup. Retention depends on storage being available and saving successfully; clearing browser data can remove saved records.

Events and history snapshots are retained after a successful save, but browser storage is not a backup.

The current version has no weekly mode, backup export, or backup restoration. Full template library management, including editing and deleting templates, is not implemented.

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

See [Project Vision](PROJECT_VISION.md) for the broader product direction. It describes planned capabilities, including detailed weekly planning and manual backup and restore. These are future work, not features of the current prototype. The implemented scope and storage limitations are described above.
