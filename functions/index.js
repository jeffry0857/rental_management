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
      return today.getDate() === moveInDay.getDate() - 1; // Rent due 1 day before move-in date monthly
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
