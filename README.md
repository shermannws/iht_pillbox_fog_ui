# Fog Layer - UI
## Author
Done by: Sherman Ng Wei Sheng

## Requirements
<u>Tested on the following hardware / software</u>: <br/>
Device: Windows 10, 64 bit<br/>
Node.JS Version: 18.4.0<br/>
npm Version: 8.12.1<br/>

## Description
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Directory Description
1. `src`: Contains the React source code
2. `src/components`: Modular components used within the UI
3. `src/messanger`: Contains the code logic for MQTT browser client
4. `src/pages`: Contains the pages of the app
5. `src/resources`: Contains the images used to render pill status
6. `src/services`: Contains the services to interact with local backend server

## How to Run
1. Create/Clone the .env.local file from .env.local.example. The following environment variables are required.
```
REACT_APP_MQTT_USER=\<USERNAME OF MQTT USER>
REACT_APP_MQTT_PASSWORD=\<PASSWORD OF MQTT USER>
REACT_APP_HOST=\<IP ADDR OF MQTT BROKER>
REACT_APP_PORT=\<PORT OF MQTT BROKER>

REACT_APP_BACKEND_URL=\<URL TO FOG BACKEND EXPRESS SERVER>
REACT_APP_CLOUD_URL=\<URL TO CLOUD BACKEND SERVER>
```
1. Install all dependencies
```bash
npm install
```
2. Start a local server
```bash
npm start
```
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.