const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.headers.origin)
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

    next();
});

app.use('/api', require('./lib/api'));

app.listen(4040, () => {
    console.log(`Server started on port 8080`);
});
