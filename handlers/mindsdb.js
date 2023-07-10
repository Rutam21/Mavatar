const MindsDB = require("mindsdb-js-sdk").default;
const avatarModelName = process.env.MINDSDB_AVATAR_MODEL_NAME;
const logger = require("../logger");

async function connectToMindsDB() {
  try {
    await MindsDB.connect({
      user: process.env.MINDSDB_USERNAME,
      password: process.env.MINDSDB_PASSWORD,
    });
    logger.info("Connected to MindsDB Cloud");
  } catch (error) {
    logger.error("Error connecting to MindsDB Cloud:", error);
    throw new Error("Failed to connect to MindsDB Cloud");
  }
}

async function generateAvatar(inputText, type) {
  let retries = 3; // Maximum number of retries

  while (retries > 0) {
    try {
      const escapedDescription = inputText.replace(/"/g, "");
      const text = `SELECT img_url FROM ${avatarModelName} WHERE description="${escapedDescription}" AND type="${type}"`;
      console.log(text);
      const avatarResponse = await MindsDB.SQL.runQuery(text);
      if (!avatarResponse.rows || avatarResponse.rows.length === 0) {
        throw new Error("Invalid response from MindsDB");
      }
      return avatarResponse.rows[0].img_url;
    } catch (error) {
      logger.error("Error generating avatar:", error);
      retries--;
      if (retries === 0) {
        throw new Error("Maximum number of retries reached");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }
}

module.exports = {
  connectToMindsDB,
  generateAvatar,
};
