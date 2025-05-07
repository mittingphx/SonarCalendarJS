# AGENT-RULES.md

This file is used to store the rules for the agent.

## Rules
- never write to the /mockup/ directory, it is used for reference only
- the /source/ directory is where all code should be written
- reference README.md for project details
- the /docs/ directory is for documentation about the project except for README.md
- always update AGENT-HISTORY.md at the end of each significant task or analysis phase

## Project Structure
- use modern JavaScript practices
- use semantic HTML
- use CSS for styling
- browser navigation should remain within the single HTML file the library gets embedded within, but the History API should be used to allow for back/forward navigation

# Documentation
- the agent should update documentation as it completes its work in the following ways:
  - update the AGENT-HISTORY.md with a history of the work it has done
  - update the ARCHITECTURE.md to describe and justify the decisions made on how the software is designed
  - update AGENT-RULES.md to remember rules it has been given that it should continue to follow

## Coding Style (General)
- My philosophy on code is to have all methods and public fields/properties to be well-documented with comments that can be exported to a documentation generator, and code should be written similar to paragraphs with a single line comments describing that those lines in the "paragraph" does

## Coding Style (JavaScript)
- use ES6+ features
- use const and let instead of var
- use arrow functions instead of function declarations
- use template literals instead of string concatenation
- use const for constants
- use let for variables that will change
- use const for functions that will not change
- use const for objects that will not change
- use const for arrays that will not change
- use async/await when appropriate
- detect and handle errors
- use JSDoc comments to document code
- use classes to organize code
- use a settings class to specify default settings, accept object parameters for constructors with any key not specified coming from the default settings object, for example if you have a class name SonarCalendar, SonarCalendarSettings will contain default settings for the SonarCalendar class.

## Coding Style (CSS)
- All CSS should be mobile-first and mobile-responsive
- Use CSS variables for colors and dimensions
- Use CSS variables for spacing
- Multiple theme files should be available to provide as an example and stored in a separate CSS file
- Light and dark themes should be available
- CSS should use well-commented sections to make maintenance easier

