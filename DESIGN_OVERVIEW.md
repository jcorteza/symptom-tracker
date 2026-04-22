# Symptom Tracker

## Overview

The symptom tracker is a web application to make daily symptom tracking easier for users. It features a symptom log for daily symptom capture and an overview page to allow users to review how their symptom data changes over time. The application aims to make consistent capture of symptom data a seamless process by incorporating auto-saving and standardizing symptom measurement.

## Goals and Non-Goals

The Symptom Tracker will simplify daily symptom tracking for users. This is done through a simple layout for symptom entry that emphasizes an entry for “Today” while allowing users to go back and edit or create entries for past dates. Ultimately users will be able to view symptom data trends over a specified time period (1 week, 1 month, etc.) on the “Overview” page.

This Symptom Tracker will not attempt to interpret the user’s symptom data or draw conclusions about causation. It will not send notifications or reminders to input the day’s symptoms. It will not be available for offline use.

To summarize, the Symptom Tracker will enable users to do the following:

1. track symptoms
2. access an overview of symptoms
3. edit past entries

## Constraints and Assumptions

- Frontend will be written with Typescript, React, and Next.js.
- Backend will be written with Node.js and rely on a PostgreSQL database.
- Limit stored Personally Identifiable Information (PII).
- Enforce per-user access to data via authentication/authorization.
- Symptom data is organized on a daily level, not as individual change events.

## Core Design Decisions

For a given user, each day is represented by a single row in the database. This can be contrasted with data models where each change is treated as an “event” and that event is treated as a row in the database. Instead, as the user is updating symptom data for a given day, the related row in the database will be updated as well. This will simplify data model and write logic as there will be a single source of truth. 

Additionally, in order to preserve the accuracy of the data for the user, missing days or database rows will not be interpolated. Sometimes even the absence of data is data if for instance the user did not feel well enough to enter data on a given day.

## High-Level Architecture

The Symptom Tracker is a web application for users with accounts to track their symptom-based data over time. The app stores user-inputted symptom data and provides a way for the user to review and visualize this data.

![container-diagram.drawio.png](attachment:86115fc2-c33f-4e32-a38c-445994f44ae8:container-diagram.drawio.png)

The Symptom Tracker is a monolithic web application with a separate database. The client is responsible for rendering the HTML and executing JavaScript. It’s also responsible for sharing user-provided data with the server via HTTP requests. The server is responsible for processing HTTP requests from authenticated users and making queries to the database. User symptom data will be stored by a PostgreSQL DB.

Ultimately this application prioritizes security for user data via single-user accounts accessed through authentication. It will also ensure data reliability and integrity in the storage and preservation of symptom data.

## Risks and Mitigations

The crux of Symptom Tracker is to track how symptoms change over time. That means ensuring reliable, accurate timestamps from which the user’s local time can be computed. There is a risk that the timestamp for entries could be inconsistent and/or inaccurate if multiple time sources are used. A possible solution for this will be to choose a single source of truth such as the server’s clock and to store the timestamp as UTC.

Another risk comes from how often updates to the symptom entry are persisted. Ideally, users will not have to perform manual saves of their data. Instead the app will auto-save them as they are being updated. However, this could lead to spamming the server’s API if the client were to submit multiple HTTP PUT requests in quick succession. This can be mitigated by implementing debouncing or AbortController. These techniques would also help prevent accidental overwrites of entries.

There is also a risk that querying the database becomes inefficient. Choosing the right indexes is crucial for mitigating this. Additionally, in enabling the ability to query symptom data based on user-created tags, it may become necessary to create something like a secondary index.

An additional risk to mitigate will be the loss of data when there is an uncertain save state. For example, a user could finish updating their symptoms entry and the network could lose connection as the server attempts to persist it to the database. Preserving this data temporarily in state and retrying the save attempt would be one way to prevent this loss of data.

## Future Work

TBD
