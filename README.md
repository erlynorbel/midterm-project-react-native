# Midterm Project - React Native Job Finder App

This project is a Job Finder App built with React Native + TypeScript using Expo Router.

## Features

- Job Finder screen
  - Fetches jobs from `https://empllo.com/api/v1`
  - Assigns unique IDs to fetched jobs using `react-native-uuid`
  - Displays job details (title, company, location, salary)
  - Includes search/filter by title, company, or location
  - Supports saving jobs with no duplicates
  - Supports applying directly from each job card
- Saved Jobs screen
  - Displays all saved jobs
  - Allows applying to a saved job
  - Allows removing a saved job
- Application Form screen
  - Fields: name, email, contact number, and "Why should we hire you?"
  - Validations: required fields, proper email format, contact number format/length, min/max text lengths
  - Shows submission feedback via alert
  - Clears form after successful submission
  - If opened from Saved Jobs, pressing "Okay" redirects to Job Finder screen
- Theme toggle
  - Light/Dark mode toggle button is available in both tab screens

## Tech Stack

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- React Navigation
- react-native-uuid

## Run the project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run start
   ```

3. Run lint:

   ```bash
   npm run lint
   ```

