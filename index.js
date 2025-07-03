import express from "express";
import bodyParser from "body-parser";

const port = 3000;

const app = express();

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.post("/create", (req, res) => {
    res.sendStatus(200);
});

app.get("/view", (req, res) => {
    res.sendStatus(200);
});

app.get("/edit", (req, res) => {
    res.sendStatus(200);
});

app.get("/delete", (req, res) => {
    res.sendStatus(200);
});

app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});