# ARCHITECTURE.md

This file contains the project architecture details.

## Architecture
- The project is a client-side JavaScript application
- The project is hosted as static files (no server-side code)
- The project will use CSS with no dependencies, no frameworks, no libraries.
- The project will use the SonarCalendar API for data (see readme)

## Deployment
- This event list will be used on many pages on different domains with different themes and layouts
- This event list will be dropped onto other systems by incluing a javascript library and specifying the DOM selector to be inserted within and the data source
- The data source will be specified by a URL parameter that is the root location of the API described on calendar-api-node-mvp

## UI/UX
- The UI/UX should be similar to the mockup found in /mockup/ui-mockup/
- The UI/UX should be responsive and mobile-first
- The UI/UX should be accessible
- The UI/UX should be simple and easy to use
- The UI/UX should be modern and clean
- The UI/UX should using coding techniques similar to the music player demo found in /mockup/js-mockup/demos/


