// LINE Notification
const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

admin.initializeApp();
const firestore = admin.firestore();

exports.scheduledLineNotification = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    // LINE Notify API URL
    const url = "https://notify-api.line.me/api/notify";

    // The access token from LINE Notify (replace with your token)
    const accessToken = "o6ePf7E5yJ2J8L402iftd3aaV3Yp0r5U29tZ2kiV5dc";

    // Helper function to check if rent is due today
    function isRentDueToday(moveInDate) {
      const today = new Date();
      const moveInDay = new Date(moveInDate);

      // Rent is due on the same day of the month as the move-in date
      return today.getDate() === moveInDay.getDate(); // Rent due 1 day before move-in date monthly
    }

    try {
      // Fetch users from Firestore (assuming the collection is called 'users')
      const usersSnapshot = await firestore.collection("playlists").get();

      usersSnapshot.forEach(async (doc) => {
        const roomData = doc.data();
        const moveInDate = roomData.moveInDate;
        // Ensure moveInDate is a valid date and check if rent is due today
        if (isRentDueToday(moveInDate)) {
          const message = `${roomData.title} 房要拍電錶了`;

          // Send a LINE notification for the user
          const options = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `message=${message}`,
          };

          // Send the POST request to LINE Notify API
          const response = await fetch(url, options);
          const data = await response.json();

          // Log the response from LINE
          console.log(`LINE notification sent for user ${doc.id}:`, data);
        }
      });

      // Indicate the function ran successfully
      return null;
    } catch (error) {
      console.error("Error sending LINE notification:", error);
      throw new Error("Failed to send LINE notification");
    }
  });

/////////
// Google App Script to retrive latest data from firebase

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();
// const db = admin.firestore();

// exports.getFirestoreData = functions.https.onRequest(async (req, res) => {
//   try {
//     const snapshot = await db.collection("playlists").get();
//     const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).send(error.toString());
//   }
// });

////////////////////

// 下方程式碼會自動將db資料寫入 Google Sheet
// const functions = require("firebase-functions");
// const fetch = require("node-fetch");

// exports.onFirestorePlaylistUpdate = functions.firestore
//   .document("playlists/{playlistId}")
//   .onWrite((change, context) => {
//     const playlistId = context.params.playlistId;
//     const updatedData = change.after.exists ? change.after.data() : null;
//     console.log("updatedData : ", updatedData);
//     const googleAppsScriptWebhookUrl =
//       "https://script.google.com/macros/s/AKfycbyG5GMHIU7_KzOn7l9pmWWh8nfdBKJJ-eFwdEDacn16GJHLIAMYF4mmorK9rqbZHl_q/exec";

//     return fetch(googleAppsScriptWebhookUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ playlistId, updatedData }),
//     })
//       .then((response) => {
//         return response.text(); // Read response as text
//       })
//       .then((data) => {
//         console.log("Google Apps Script called successfully:", data);
//       })
//       .catch((error) => {
//         console.error("Error calling Google Apps Script:", error);
//       });
//   });

/////////////////

///////////////////////////////////

// Below is saved for Google App Script

// function onPlaylistUpdate() {
//   const url = 'https://firestore.googleapis.com/v1/projects/rental-management-45bc4/databases/(default)/documents/playlists';

//   // Replace these with your Firebase Service Account details
//   const serviceAccountEmail = 'rental-management-45bc4@appspot.gserviceaccount.com';
//   const privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5G+iD1MOlD/wV\nXxpuSV/nztMB7EJPR7Mf1/Iq/idkQF2DRS3raHQXWpUfB8HhEFpUOtUSri4YVOHI\n7XtjZZQBmqrIAC9NEhrjizqUgSBOY9A6jz93s6UCxF22QuQohZ/hSHEUmO1HJmKW\nHw0AU0piWqyrquNwZ2N6QOT8LMBrLGjZ3BCzp2aEeoV2JrXBj9ZxMkZXWS9FRg/y\nEYL95KuWVC4D/Zpe5x8EO4k5NKAB7Sn91Txmmv1x4yOTCBxBVwv7V6cthYZtjsi1\nJfSttZOgUeb8tre1WaVd93nlH+GIDT8Mf0qqtUn/2ipLJ6h/9i836eMNqc3ubHjS\n0bMIdCcXAgMBAAECggEAK5bLT3PkKDPV6BBvkGXd3B/DZ3IDgVjAcPCweXhEvWI8\nwwMg14zOvYsaj2aLvJxVsPzznMUAXMFsM5zcj+DlE+Wgbp1AhjULuOZZwouPmHX/\nnDKMPvtCEZ889ATXZkVlCy88VZ3XTghXccNZE+kJHJT+kSQaD6eA8NJkOY+uNe4l\nfsgff+PSi1hWgQdduTLEkVZTXOyFhliywwAHevFCLDYYkAkx6fvcyefMRbowgxwF\naBbMn0ll8d6NmWqP+D3wKjUhwFb9TNgU9303F87ANW9SVzRZ6ZM9xcL8y12q9/KZ\nojq0/XScgVj2a0dawQgIle++KqLfhLoLviom+ZI7KQKBgQD0uFguJQbm8UYeckn2\nlG0B8EEn81McGHkv4YGvvSxTO7ApNwtJYx2itAnsSE8rA5Lr8x8O9Ks8H3XIESaO\nKv+ZSVPpzMRdBqske8uEtKdyRFFAGYkqs644oaFBpXREDyWVwWTt7mjTO2MqrETX\nDM5a/6uqiQgLTmcZ654IQCl5mQKBgQDBpCnH1UNfUO+lZ/mqF2fKtN1/6Ntk1Vv7\nN3CsLevofau+kC/3xLFHVXery6O0fSdIWYUBjyG5Sez46BZurjFrtZFhVn2acBTF\nZkvjVhf5qQv16fnZ6VLaitdRWW7HsBGDLRbGiJDw/cDYc5X41R8o3MLTlHK/ClOT\nu8zTQRn0LwKBgCjwvi/aGfGA484sKJuL8UClxQC+AGVu4rdT7rJL36J9FdePUeAR\nKOATZqWU40m661V18vg5jnwcd0PlOqIGJ4Spc9RlYWR+vRr5au7kmi7PpxgmLYBr\nVvY6dBPbbjwEnLEVDaGQhRDxmoGFGG8xwUQQCdQZ4LKjhzQa6vFOaqHhAoGARXMs\nbPiHFlt/5/IXsDJ+zkv6GVMZxNtlBv/GUGqT7qmL/GfYXGPWNUBpEFuUFjrA6Qj6\nVCnSrZLfBBKxYPbm0LupLaEIoWhLetUKqLmLFcbUfFlze/1b8vfS6+FIgyQZ09NL\nFN+MJHLORJOIGVvOtigfVCUs1mnMufKkLqxts48CgYB/qlQSCakp7NZJklt43ax3\n3KJsKB/0AvMcQOqh/gKLA7r00xColq8qrvShOBt1ixbiZpXy5ytHNr9rHwM8X4EP\nSY1aRjp3uibEHelS+ZsdKFuz5v7eKToOvoVv6rsuzqxKmF2wS8dm2gYvESu+yLDb\n0lU2Z5uAuLrFT8cyVnIH2Q==\n-----END PRIVATE KEY-----\n`;

//   const jwtToken = createJwtToken(serviceAccountEmail, privateKey)

//   const options = {
//     'method': 'GET',
//     'headers': {
//       'Authorization': 'Bearer ' + jwtToken
//     }
//   };

//   const response = UrlFetchApp.fetch(url, options)
//   const data = JSON.parse(response.getContentText()).documents
//   Logger.log(data)
//   const sheet = SpreadsheetApp.openById("1EICt9c_jQxaOUB81QsYlQTkANXFQCt9M6LMBlH845KM").getActiveSheet();
//   sheet.clear(); // Clear existing data

//   // 整個 Column D 設寬為130，整個 Column E 設寬為27
//   sheet.setColumnWidth(4, 130)
//   sheet.setColumnWidth(5, 27)

//   // 資料處理部分(塞入cell)
//   var titleRow = 1
//   var rentRow = 3
//   var depositRow = 3
//   var periodRow = 1
//   var remarkRow = 2

//   for (var i = 0; i < data.length; i++) {
//     var title = data[i].fields.title.stringValue
//     var rent = data[i].fields.rent.integerValue
//     var deposit = data[i].fields.deposit.integerValue
//     var moveInDate = new Date(parseInt(data[i].fields.moveInDate.integerValue))
//     var moveOutDate = new Date(parseInt(data[i].fields.moveOutDate.integerValue))
//     var remark = data[i].fields.remark ? data[i].fields.remark.stringValue : ''

//     // Format dates to YYYY/MM/DD
//     var formattedDates = formatDate(moveInDate) + " - " + formatDate(moveOutDate)

//     var rangeForTitle = sheet.getRange(titleRow, 5, 3, 1); // 3 rows, 1 column (A)

//     // 房號處理 (Title) (Column E)
//     rangeForTitle.merge();
//     rangeForTitle.setValue(title)
//     rangeForTitle.setVerticalAlignment("middle");
//     rangeForTitle.setHorizontalAlignment("center")
//     titleRow += 3

//     // 租金
//     sheet.getRange(rentRow, 1).setValue('租金')
//     sheet.getRange(rentRow, 1).setHorizontalAlignment('right')
//     sheet.getRange(rentRow, 1).setVerticalAlignment('middle')
//     sheet.getRange(rentRow, 2).setValue(rent);
//     sheet.getRange(rentRow, 2).setHorizontalAlignment('left')
//     sheet.getRange(rentRow, 2).setVerticalAlignment('middle')
//     rentRow += 3

//     // 押金
//     sheet.getRange(depositRow, 3).setValue('押金')
//     sheet.getRange(depositRow, 3).setHorizontalAlignment('right')
//     sheet.getRange(depositRow, 3).setVerticalAlignment('middle')
//     sheet.getRange(depositRow, 4).setValue(deposit)
//     sheet.getRange(depositRow, 4).setHorizontalAlignment('left')
//     sheet.getRange(depositRow, 4).setVerticalAlignment('middle')
//     depositRow += 3

//     // 起退租日 (YYYY/MM/DD - YYYY/MM/DD) in Column C
//     sheet.getRange(periodRow, 3).setValue(formattedDates);
//     sheet.getRange(periodRow, 3).setVerticalAlignment("middle")
//     sheet.getRange(periodRow, 3).setHorizontalAlignment("left")
//     periodRow += 3

//     // 備註
//     sheet.getRange(remarkRow, 1).setValue(remark)
//     sheet.getRange(remarkRow, 1).setVerticalAlignment("middle")
//     remarkRow += 3
//   }

//   // 設定斑馬背景以方便閱覽
//   var lightGreyColor = '#f6f6f6'
//   for (var i = 4; i <= sheet.getMaxRows(); i += 6) {  // Start at row 5 and skip 8 rows each iteration
//     // Apply to rows 5, 6, 7, 13, 14, 15, etc.
//     sheet.getRange(i, 1, 3, sheet.getMaxColumns()) // 3 rows starting from row i, covering all columns
//         .setBackground(lightGreyColor);
//   }
// }

// // Helper function to format the timestamp into "YYYY/MM/DD"
// function formatDate(timestamp) {
//   var date = new Date(timestamp);
//   var year = date.getFullYear();
//   var month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
//   var day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
//   return year + '/' + month + '/' + day;
// }

// // Helper function to create a JWT Token for Firebase Authentication
// function createJwtToken(serviceAccountEmail, privateKey) {
//   const iat = Math.floor(Date.now() / 1000);
//   const exp = iat + 3600;

//   const header = {
//     "alg": "RS256",
//     "typ": "JWT"
//   };

//   const claimSet = {
//     "iss": serviceAccountEmail,
//     "sub": serviceAccountEmail,
//     "aud": "https://firestore.googleapis.com/",
//     "iat": iat,
//     "exp": exp
//   };

//   const base64Header = Utilities.base64Encode(JSON.stringify(header));
//   const base64ClaimSet = Utilities.base64Encode(JSON.stringify(claimSet));

//   const signatureInput = base64Header + '.' + base64ClaimSet;
//   const signature = Utilities.computeRsaSha256Signature(signatureInput, privateKey);
//   const base64Signature = Utilities.base64Encode(signature);

//   return base64Header + '.' + base64ClaimSet + '.' + base64Signature;
// }
