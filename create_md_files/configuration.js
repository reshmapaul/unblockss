require('dotenv').config();
let API_URL, BASE_URL, NEWS_PROJECT_ID, EVENTS_PROJECT_ID, PRESS_PROJECT_ID, CLEAN_URL_FIELD, LOCATION_FIELD, EVENT_CANCELLED_FIELD, AUTH_TOKEN;
    API_URL = process.env.API_URL;
    BASE_URL= process.env.BASE_URL;
    NEWS_PROJECT_ID=process.env.NEWS_PROJECT_ID;
    EVENTS_PROJECT_ID=process.env.EVENTS_PROJECT_ID;
    PRESS_PROJECT_ID=process.env.PRESS_PROJECT_ID;
    CLEAN_URL_FIELD=process.env.CLEAN_URL_FIELD;
    LOCATION_FIELD=process.env.LOCATION_FIELD;
    EVENT_CANCELLED_FIELD=process.env.EVENT_CANCELLED_FIELD;
    AUTH_TOKEN=process.env.AUTH_TOKEN;

const configuration = {
    apiUrl: API_URL,
    baseUrl: BASE_URL,
    newsProjectId: NEWS_PROJECT_ID,
    eventProjectId: EVENTS_PROJECT_ID,
    pressProjectId: PRESS_PROJECT_ID,
    cleanUrlField: CLEAN_URL_FIELD,
    locationField: LOCATION_FIELD,
    eventCancelledField: EVENT_CANCELLED_FIELD,
    authToken: AUTH_TOKEN
};


module.exports = configuration;