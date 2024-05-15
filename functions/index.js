/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require('firebase-functions/v2/https');
// const logger = require('firebase-functions/logger');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const user = require("../database/user.js");

exports.fcmtest = onDocumentWritten("ledu1017@naver.com/0", async (event) => {
  const userToken = await user.findTokenById("ledu1017@naver.com");

  console.log(1);
  const data = event.data.after.data();
  console.log(1);
  const previousValues = event.data.before.data();
  console.log(1);
  if (data != previousValues) {
    const pushMessage = data.chat.response;
    console.log(1);
    const message = {
      notification: {
        title: "Fluffy-mood",
        body: pushMessage,
      },
      token: userToken,
    };
    console.log(1);
    await admin.messaging().send(message);
  }
});
