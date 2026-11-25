# My Calendar — Project Vision

## Motivation

The idea for My Calendar grew out of the experience of using a large paper yearly calendar. Its main advantage was the ability to see the entire year as one connected view. Conventional digital calendars work well for viewing a day, week, or month, but they rarely make it easy to understand the whole year at a glance.

## Product Direction

My Calendar brings together long-term yearly planning, weekly scheduling, undated ideas, and a history of meaningful events. The aim is to move between these levels of detail while keeping the broader view of time.

## Current planning areas

### 1. Thoughts

The strip above the yearly calendar holds undated ideas. Users can place a thought on a date and return it to the strip later.

### 2. Yearly Calendar

The yearly calendar opens first, with all twelve months arranged in vertical columns. Its events have a date. Selecting a day number opens the corresponding week for timed planning.

### 3. History

The history strip below the yearly calendar holds snapshots that users save from individual events. A snapshot keeps its contents even if the original event changes or is deleted.

### 4. Weekly Calendar

The weekly grid holds events with a date, start time, and end time. It checks for overlapping intervals on the same date before saving.

The two calendars have separate template libraries. The yearly view also supports independent day fills and outlines. Both calendars save locally and share a manual JSON backup. See the [README](README.md) for the current workflows and recovery limits.

## Design Principles

- **Year-first planning:** Keep the complete year visible as the primary planning context.
- **Clear and calm interface:** Present information without unnecessary visual noise.
- **Progressive disclosure:** Show additional detail only when it is relevant.
- **Explicit user control:** Keep important actions understandable and intentional.
- **Independent information layers:** Allow events, thoughts, history, and visual markers to remain distinct.
- **Local-first operation:** Make core planning available without depending on a remote service.
- **Readable on laptops and large monitors:** Maintain clarity across the intended screen sizes.

## Future directions

Ideas for future development include synchronization between devices and an AI assistant that could turn natural-language instructions into event drafts. Any future automation or bulk change should require explicit confirmation before it alters the calendar.

The current app uses HTML, CSS, and JavaScript. TypeScript and React are possible future technology choices.
