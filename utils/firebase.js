const firebase = require("firebase");
const uuid = require("./uuid");
const Sheet = require("../models/sheet");

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
});

const database = firebase.database();

module.exports = {
  get: id => {
    return database
      .ref(`signup-sheets/${id}`)
      .once("value")
      .then(snapshot => {
        if (!snapshot.val) {
          throw "No results";
        }

        const { name, members, date } = snapshot.val();
        return new Sheet(name, members, date);
      });
  },
  query: (property, value) => {
    return database
      .ref("signup-sheets")
      .limitToFirst(1)
      .orderByChild("name")
      .equalTo("");
  },
  update: sheet => {
    const { id, name, date, members } = sheet;
    return database.ref("signup-sheets").update({
      [id || uuid()]: { name, date, members }
    });
  },
  delete: sheet => {
    return database.ref(`signup-sheets/${sheet.id}`).remove();
  }
};
