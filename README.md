# Weather Dashboard

## Project Overview

This project is a weather dashboard application that utilizes the OpenWeather API to provide weather data for multiple cities. Users can search for cities to get current weather conditions and a 5-day forecast. The weather data is fetched via the back-end, and the front-end is already prepared to display the results. Additionally, the application allows users to view past searches and delete cities from the search history. Use the [5-day weather forecast API](https://openweathermap.org/forecast5) to retrieve weather data for cities.

The base URL should look like the following:
`https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`

## Table of Contents

- [Usage](#usage)
- [Mock Up](#mock-up)
- [Instructions](#instructions)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Additional Resources](#additional-resources)

## Usage

The application is invoked by using the following command:

```bash
npm run start:dev
```

This will start both the front-end and back-end servers. Make sure to have your API key for OpenWeather in the `.env` file.

## Mock-Up

The following image shows the web application's appearance and functionality:

![The weather app includes a search option, a list of cities, and a 5-day forecast and current weather conditions for Atlanta ](./assets/09-servers-and-apis-homework-demo.png)

## Instructions

### 1. Install dependencies for both the client and server

```bash
npm install
```

### 2. Start the development server

```bash
npm run start:dev
```

### 3. The front-end will be accessible at `http://localhost:3000`, and the back-end API at `http://localhost:3001`

## Key Features

- Ability to delete cities from the search history.
- Search for a city to see current weather and a 5-day forecast.
- Display of weather information, including temperature, humidity, wind speed, and weather icons.
- Stores search history and allows the user to click on a previous city to view its weather again.

## Technology Stack:

This application requires the following tools and technologies to operate:
- **Bootstrap**: A CSS framework for styling the front-end.
- **Day.js**: A lightweight library to handle and format dates.
- **Express.js**: A Node.js framework for building the server and API routes.
- **Node.js & NPM**: Used for server-side logic and package management.
- **OpenWeather API**: Provides weather data for cities based on latitude and longitude.
- **FS (File System)**: Used to manage the search history by reading and writing to a `searchHistory.json` file.

## Additional Resources

How to handle API keys securely: [Full-Stack Blog on API Keys](https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys)

How to use Environment Variables with Render: [Render Environment Variables](https://docs.render.com/configure-environment-variables)

How to work with the OpenWeather API: [OpenWeather API Documentation](https://openweathermap.org/forecast5)
