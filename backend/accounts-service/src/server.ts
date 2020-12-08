import app from "./app";

import database from "./db";

(async () => {
  try {
    const port = parseInt(`${process.env.PORT}`);

    await database.sync();

    await app.listen(port);

    console.log(`Server running on port: ${port}`);
  } catch (error) {
    console.log(`${error}`);
  }
})();
