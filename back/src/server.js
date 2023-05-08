require('./config/variables.env');

const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');

const app = express();

app.use(cors({
	exposedHeaders: ['X-Total-Count']
}));
app.use(express.json());
app.use(routes);
app.use(errors());

app.listen(process.env.PORT || process.env.NODE_PORT || 3333);
