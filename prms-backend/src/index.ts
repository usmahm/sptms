import app from "./app";
import config from "./config/config";

app.listen(config.PORT, () => {
  console.log(
    `Server is running${config.NODE_ENV === "development" ? " on http://localhost:" : "."}${config.NODE_ENV === "development" ? config.PORT : ""} `
  );
});
