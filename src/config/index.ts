const DB_CLUSTER = '';
const DB_NAME = '';
const DB_USERNAME = '';
const DB_PASSWORD = '';

export const DB = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;
