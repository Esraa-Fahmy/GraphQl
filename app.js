const express = require("express");
const dotenv = require("dotenv")
dotenv.config({ path: ".env" });
const app = express();
const PORT = process.env.PORT || 7000;

const cors = require("cors");
const mongoose = require("mongoose");

const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

app.use(cors());
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once("open", () => {
  console.log("DB connected successfully");
});

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
