# My Calendar

My Calendar is a visual yearly planning app inspired by a large paper calendar. It brings the months of a year into one connected view.

The project is a working yearly prototype in active development. The application interface is in Russian.

## Current features

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

## Data storage and limitations

| Data | Storage | After a page reload |
|---|---|---|
| Events, including template links | localStorage | Retained after a successful save |
| History snapshots | localStorage | Retained after a successful save |
| Undated thoughts and their order | localStorage | Retained after a successful save |
| Scheduled thoughts and their source identity | localStorage | Retained after a successful save |
| Day fills and outlines | localStorage | Retained after a successful save |
| Event templates | localStorage | Retained after a successful save |
| Yearly scale setting | localStorage | Retained after a successful save |
| Filter selection | In memory | Reset |
| Displayed year | In memory | Current system year opens again |
| Unsaved form edits and unconfirmed date or event selections | In memory | Discarded |

localStorage is tied to the browser, profile, and origin used to open the app. It provides neither cloud synchronization nor a backup. Retention depends on storage being available and saving successfully; clearing browser data can remove saved records.

The app reports storage errors and blocks conflicting writes when saved records have changed in another tab. Unsaved input remains temporary: copy it before reloading if you need to keep it.

The current version has no weekly mode, backup export, or backup restoration.

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

See [Project Vision](PROJECT_VISION.md) for the broader product direction. It includes goals beyond the current application, such as detailed weekly planning, manual backup and restore, synchronization, and AI assistance. Those capabilities are not implemented. The features and storage behaviour described in this README reflect the current yearly calendar.
