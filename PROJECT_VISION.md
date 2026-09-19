# My Calendar — Project Vision

## Motivation

The idea for My Calendar grew out of the experience of using a large paper yearly calendar. Its main advantage was the ability to see the entire year as one connected view. Conventional digital calendars work well for viewing a day, week, or month, but they rarely make it easy to understand the whole year at a glance.

## Product Direction

My Calendar is planned as a visual planning tool that brings together long-term yearly planning, detailed weekly scheduling, undated ideas, and a lasting history of meaningful events. The product should support different levels of detail without losing the broader view of time.

## Planned Main Areas

### 1. Thoughts

The Thoughts area is planned for the top of the interface. It will hold ideas that do not yet have a date, time, or priority. A thought may later be moved into the calendar when the user is ready to schedule it.

### 2. Yearly Calendar

The Yearly Calendar is planned as the main screen. It will display all 12 months at the same time, arranged as vertical columns. Events in this view are date-based and do not store start or end times. Time-specific planning belongs to the weekly calendar.

### 3. History

The History area is planned below the yearly calendar. It will allow users to preserve important events manually. Each history entry will be stored as an independent snapshot, so later changes to the original event will not alter the saved historical record.

### 4. Weekly Calendar

The Weekly Calendar is planned as an additional detailed mode. Events in this view will include a date, start time, and end time. Possible time overlaps must be checked before an event is saved.

## Planned Supporting Features

- Event templates without fixed dates for reusable event structures
- Independent visual day markers, such as fill and outline, that can represent separate information layers
- Web Storage API (`localStorage`) for local-first use
- Manual backup and restore controlled by the user
- Future synchronization between devices
- A future AI assistant for creating events from natural-language instructions

Automatic actions and bulk changes must require explicit user confirmation before they are applied.

## Design Principles

- **Year-first planning:** Keep the complete year visible as the primary planning context.
- **Clear and calm interface:** Present information without unnecessary visual noise.
- **Progressive disclosure:** Show additional detail only when it is relevant.
- **Explicit user control:** Keep important actions understandable and intentional.
- **Independent information layers:** Allow events, thoughts, history, and visual markers to remain distinct.
- **Local-first operation:** Make core planning available without depending on a remote service.
- **Readable on laptops and large monitors:** Maintain clarity across the intended screen sizes.

## Initial Technical Direction

The initial project is planned with:

- HTML5
- CSS3
- JavaScript

TypeScript, React, backend synchronization, and AI capabilities belong to later stages of development.

## Status

My Calendar is at an early stage of development. The capabilities described in this document represent the planned product direction, not completed functionality. Features will be introduced gradually through separate, verifiable stages.
