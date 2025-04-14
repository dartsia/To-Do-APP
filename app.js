const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
let express = require('express');
let authRoute = require('./routes/authRouter');
let taskRoute = require('./routes/taskRouter');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const logRequestToDatabase = require('./middleware/logRequests');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(logRequestToDatabase);
app.use(express.json());
app.use(cookieParser());

app.use('/auth/', authRoute);

app.use(verifyJWT);
app.use('/', taskRoute);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`${process.env.PORT}`);
});