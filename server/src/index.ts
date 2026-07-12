import "./config/env";
import app from "./app";

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`TransitOps API running on http://localhost:${port}`);
});