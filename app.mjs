import 'dotenv/config'

const port = process.env.PORT || 3000;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import methodOverride from 'method-override';

import documents from "./docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

app.use(methodOverride("_method"));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/${result.lastID}`);
});

app.get('/:id', async (req, res) => {
    return res.render("doc", { doc: await documents.getOne(req.params.id) });
});

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});

app.put("/:id", async (req, res) => {
    const documentId = req.body.rowid;
    const updatedData = req.body;
    await documents.updateOne(documentId, updatedData);

    res.redirect('/');
});

app.get('/skapa', (req, res) => {
    res.render('doc', { doc: null });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
