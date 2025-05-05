const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.assignUserRole = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { uid, role, userName, email, designation } = req.body;

    // Validate input
    if (!uid || !role || !userName || !email || !designation) {
      return res.status(400).json({ error: "Invalid input: all fields are required." });
    }

    try {
      // Check if the user already exists in Firestore
      const userDoc = await admin.firestore().collection("users").doc(uid).get();
      if (userDoc.exists) {
        return res.status(400).json({ error: "User already exists." });
      }

      // Set the custom user claims for role-based access
      await admin.auth().setCustomUserClaims(uid, { role });

      // Create user details object to store in Firestore
      const userDetails = {
        uid,
        userName,
        email,
        designation,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Store user details in Firestore under 'users' collection
      await admin.firestore().collection("users").doc(uid).set(userDetails);

      console.log(`User role assigned and details saved successfully for UID: ${uid}`);

      return res.status(200).json({ message: "User role assigned and details saved successfully." });
    } catch (error) {
      console.error("Error assigning user role:", error);
      return res.status(500).json({ error: "Unable to assign user role." });
    }
  });
});
