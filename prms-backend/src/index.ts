import httpServer from "./app";
import config from "./config/config";

httpServer.listen(config.PORT, () => {
  console.log(
    `Server is running${config.NODE_ENV === "development" ? " on http://localhost:" : "."}${config.NODE_ENV === "development" ? config.PORT : ""} `
  );
});
