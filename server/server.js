const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const schema = require("./schema");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection failed:", err));

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SUCCESS: Running GraphQL server at http://localhost:${PORT}/graphql`);
});
