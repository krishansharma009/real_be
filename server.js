const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/data-source");
const cors = require("cors");
const passport = require("./config/auth"); // Import your Passport configuration
const unless = require("express-unless"); // Import express-unless
const awsServerlessExpress = require("aws-serverless-express");

const userRouter = require("./api/user/user-route"); //hello
const candidateRouter = require("./api/candidate/candidate-route");
const candidateAddressRouter = require("./api/candidate-address/candidate-address-route");
const candidateCibilRouter = require("./api/candidate-cibil/candidate-cibil-route");
const candidateDocsRouter = require("./api/candidate-docs/candidate-docs-route");
const candidateEductionRouter = require("./api/candidate-eduction/candidate-eduction-route");
const candidateReferenceRouter = require("./api/candidate-reference/candidate-reference-route");
const candidateVerificationRouter = require("./api/candidate-verification/candidate-verification-route");
const clientRouter = require("./api/client/client-route");
const featureRouter = require("./api/feature/feature-route");
const internalTeamRouter = require("./api/internal-team/internal_team-route");
// const locationRouter = require("./api/geolocation/locationRoutes");
const locationRouter = require("./api/locationCSC/locationRoutes");

const WorkingRouter = require("./api/WorkingExperiance/work-experience-routes");
const FatherRouter = require("./api/fatherdoc/fathers-documents-routes");
const TeamregRouter = require("./api/TeamRegistration/teamRoutes");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //

// Comment out the authentication middleware
/*
const authenticate = (req, res, next) => {
  // Define paths to exclude from authentication
  const excludePaths = ['/users', '/users/login'];
  const shouldExclude = excludePaths.some(path => req.path.startsWith(path) && (path === req.path || path === '/users/login' || path === '/client' || path === '/users' && req.method === 'POST'));

  if (shouldExclude) {
    return next();
  } else {
    return passport.authenticate('bearer', { session: false })(req, res, next);
  }
};

app.use(authenticate);
*/

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.use("/_alive", async (req, res) => {
  res.status(200).send("hello guys this side gulshan");
});
app.use("/users", userRouter);
app.use("/candidate", candidateRouter);
app.use("/candidate-address", candidateAddressRouter);
app.use("/candidate-cibil", candidateCibilRouter);
app.use("/candidate-docs", candidateDocsRouter);
app.use("/candidate-education", candidateEductionRouter);
app.use("/candidate-reference", candidateReferenceRouter);
app.use("/candidate-verification", candidateVerificationRouter);
app.use("/client", clientRouter);
app.use("/feature", featureRouter);
app.use("/internal-tea", internalTeamRouter);
// app.use("/location", locationRouter);
app.use("/location", locationRouter);
app.use("/workingExp", WorkingRouter);
app.use("/candidate-workingExp", WorkingRouter);
app.use("/fathers-document", FatherRouter);
app.use("/internal-team", TeamregRouter);

// Start the server locally for testing
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//Export the handler for AWS Lambda
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
