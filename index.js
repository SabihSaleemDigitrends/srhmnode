import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import getQuestionsHandler from "./api/questionsCollection/schema/questions.js";
import updateQuestionHandler from "./api/questionsCollection/schema/updateQuestions.js";
import getBusinessHandler from "./api/questionsCollection/schema/BusinessCollection.js";
import getInterpersonalHandler from "./api/questionsCollection/schema/InterpersonalCollection.js";
import getPeopleHandler from "./api/questionsCollection/schema/PeopleCollection.js";
import getWorkplaceHandler from "./api/questionsCollection/schema/WorkplaceCollection.js";
import getOrganizationHandler from "./api/questionsCollection/schema/OrganizationCollection.js";
import getLeadershipHandler from "./api/questionsCollection/schema/LeadershipCollection.js";
import updateIsUnlockedHandler from "./api/questionsCollection/schema/isUpdatedBusinessCollection.js";
import updatePeopleIsUnlockedHandler from "./api/questionsCollection/schema/isUpdatedPeopleCollection.js";
import updateIsCompletedHandler from "./api/questionsCollection/schema/isCompletedBusinessCollection.js";
import updateIsExamCompletedHandler from "./api/questionsCollection/schema/isExamCompletedBusinessCollection.js";
import resetBusiness from "./api/questionsCollection/schema/resetBusinessCollection.js";
import getTopicsHandler from "./api/questionsCollection/schema/topics.js";
import getExamTopicsHandler from "./api/questionsCollection/schema/examTopics.js";
import updateFavouriteHandler from "./api/questionsCollection/schema/FavouriteQuestions.js";
import updateTopicProgressHandler from "./api/questionsCollection/schema/updateTopicProgressHandler.js";
import updateExamTopicProgressHandler from "./api/questionsCollection/schema/updateExamTopicProgressHandler.js";
import removeTopicProgressHandler from "./api/questionsCollection/schema/removeTopicProgressHandler.js";
import removeExamTopicProgressHandler from "./api/questionsCollection/schema/removeExamTopicProgressHandler.js";
import authenticateDevice from "./api/questionsCollection/schema/login.js";
import serverless from "serverless-http";

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());

// MongoDB Setup
const uri =
  "mongodb+srv://elizabethmike123123123:Pq3Q23qGnlBjNdlI@cluster1997.oanpq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let questionsCollection;
let topicsCollection;
let BusinessCollection;
let InterpersonalCollection;
let LeadershipCollection;
let OrganizationCollection;
let PeopleCollection;
let WorkplaceCollection;
let deviceAuthCollection;
let examTopicsCollection;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db("dbconnect");
    BusinessCollection = database.collection("Business");
    InterpersonalCollection = database.collection("Interpersonal");
    LeadershipCollection = database.collection("Leadership");
    OrganizationCollection = database.collection("Organization");
    PeopleCollection = database.collection("People");
    WorkplaceCollection = database.collection("Workplace");
    questionsCollection = database.collection("questions");
    topicsCollection = database.collection("topic");
    examTopicsCollection = database.collection("examTopics");
    deviceAuthCollection = database.collection("user");
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Pass questionsCollection to route handlers
app.use((req, res, next) => {
  req.BusinessCollection = BusinessCollection;
  req.InterpersonalCollection = InterpersonalCollection;
  req.LeadershipCollection = LeadershipCollection;
  req.OrganizationCollection = OrganizationCollection;
  req.PeopleCollection = PeopleCollection;
  req.WorkplaceCollection = WorkplaceCollection;
  req.questionsCollection = questionsCollection;
  req.topicsCollection = topicsCollection;
  req.examTopicsCollection = examTopicsCollection;
  req.deviceAuthCollection = deviceAuthCollection;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!....");
});
app.post("/login", authenticateDevice);

app.get("/questions", getQuestionsHandler);
app.post("/questions/update", updateQuestionHandler);
app.post("/questions/favourite", updateFavouriteHandler);

app.get("/topics", getTopicsHandler);
app.post("/topics/progress", updateTopicProgressHandler);
app.post("/topics/remove", removeTopicProgressHandler);
app.get("/examtopics", getExamTopicsHandler);
app.post("/examtopics/progress", updateExamTopicProgressHandler);
app.post("/examtopics/remove", removeExamTopicProgressHandler);
app.post("/examBusiness/complete", updateIsExamCompletedHandler);

app.get("/business", getBusinessHandler);
app.post("/business/unlock", updateIsUnlockedHandler);
app.post("/business/complete", updateIsCompletedHandler);
app.get("/business/reset", resetBusiness);

app.get("/people", getPeopleHandler);
app.post("/people/unlock", updatePeopleIsUnlockedHandler);

app.get("/interpersonal", getInterpersonalHandler);
app.get("/workplace", getWorkplaceHandler);
app.get("/organization", getOrganizationHandler);
app.get("/leadership", getLeadershipHandler);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

// Close MongoDB connection on app exit
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

export const handler = serverless(app);
