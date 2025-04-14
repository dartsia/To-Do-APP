const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
let express = require('express');
let authRoute = require('./routes/authRouter');
let taskRoute = require('./routes/taskRouter');
let adminRoute = require('./routes/adminRouter');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const verifyRole = require('./middleware/verifyRole');
const logRequestToDatabase = require('./middleware/logRequests');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml')

const app = express();
const PORT = process.env.PORT || 3000;


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use(logRequestToDatabase);
app.use(express.json());
app.use(cookieParser());

app.use('/auth/', authRoute);

app.use(verifyJWT);
app.use('/', taskRoute);
app.use('/admin', verifyJWT, verifyRole(['admin']), adminRoute);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`${process.env.PORT}`);
});