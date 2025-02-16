import express from 'express';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';
import getQuestionsHandler from './src/questionsCollection/schema/questions.js';
import updateQuestionHandler from './src/questionsCollection/schema/updateQuestions.js';
import getBusinessHandler from './src/questionsCollection/schema/BusinessCollection.js';
import getInterpersonalHandler from './src/questionsCollection/schema/InterpersonalCollection.js';
import getPeopleHandler from './src/questionsCollection/schema/PeopleCollection.js';
import getWorkplaceHandler from './src/questionsCollection/schema/WorkplaceCollection.js';
import getOrganizationHandler from './src/questionsCollection/schema/OrganizationCollection.js';
import getLeadershipHandler from './src/questionsCollection/schema/LeadershipCollection.js';
import updateIsUnlockedHandler from './src/questionsCollection/schema/isUpdatedBusinessCollection.js';
import updatePeopleIsUnlockedHandler from './src/questionsCollection/schema/isUpdatedPeopleCollection.js';
import updateIsCompletedHandler from './src/questionsCollection/schema/isCompletedBusinessCollection.js';
import updateIsExamCompletedHandler from './src/questionsCollection/schema/isExamCompletedBusinessCollection.js';
import resetBusiness from './src/questionsCollection/schema/resetBusinessCollection.js';
import getTopicsHandler from './src/questionsCollection/schema/topics.js';
import getExamTopicsHandler from './src/questionsCollection/schema/examTopics.js';
import updateFavouriteHandler from './src/questionsCollection/schema/FavouriteQuestions.js';
import updateTopicProgressHandler from './src/questionsCollection/schema/updateTopicProgressHandler.js';
import updateExamTopicProgressHandler from './src/questionsCollection/schema/updateExamTopicProgressHandler.js';
import removeTopicProgressHandler from './src/questionsCollection/schema/removeTopicProgressHandler.js';
import removeExamTopicProgressHandler from './src/questionsCollection/schema/removeExamTopicProgressHandler.js';
import authenticateDevice from './src/questionsCollection/schema/login.js';

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());

// MongoDB Setup
const uri =
  'mongodb+srv://elizabethmike123123123:Pq3Q23qGnlBjNdlI@cluster1997.oanpq.mongodb.net/?retryWrites=true&w=majority';
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
    const database = client.db('dbconnect');
    BusinessCollection = database.collection('Business');
    InterpersonalCollection = database.collection('Interpersonal');
    LeadershipCollection = database.collection('Leadership');
    OrganizationCollection = database.collection('Organization');
    PeopleCollection = database.collection('People');
    WorkplaceCollection = database.collection('Workplace');
    questionsCollection = database.collection('questions');
    topicsCollection = database.collection('topic');
    examTopicsCollection = database.collection('examTopics');
    deviceAuthCollection = database.collection('user');
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
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
app.get('/', (req, res) => {
  res.send('Hello World!....');
});
app.post('/login', authenticateDevice);

app.get('/questions', getQuestionsHandler);
app.post('/questions/update', updateQuestionHandler);
app.post('/questions/favourite', updateFavouriteHandler);

app.get('/topics', getTopicsHandler);
app.post('/topics/progress', updateTopicProgressHandler);
app.post('/topics/remove', removeTopicProgressHandler);
app.get('/examtopics', getExamTopicsHandler);
app.post('/examtopics/progress', updateExamTopicProgressHandler);
app.post('/examtopics/remove', removeExamTopicProgressHandler);
app.post('/examBusiness/complete', updateIsExamCompletedHandler);

app.get('/business', getBusinessHandler);
app.post('/business/unlock', updateIsUnlockedHandler);
app.post('/business/complete', updateIsCompletedHandler);
app.get('/business/reset', resetBusiness);

app.get('/people', getPeopleHandler);
app.post('/people/unlock', updatePeopleIsUnlockedHandler);

app.get('/interpersonal', getInterpersonalHandler);
app.get('/workplace', getWorkplaceHandler);
app.get('/organization', getOrganizationHandler);
app.get('/leadership', getLeadershipHandler);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

// Close MongoDB connection on app exit
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});
