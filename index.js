import express from "express";
import bodyParser from "body-parser";
import { writeFile } from "node:fs";

const app = express();

const port = 3000;
const __dirname = import.meta.dirname;

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.post("/create", (req, res) => {
    const fileName = blogFileName(req.body);
    const filePath = fileNameToPath(fileName); 
    const blog = blogText(req.body);

    writeFile(filePath, blog, (err) => {
        if (err) throw err;
        console.log(`Blog saved to ${filePath}`);
    });

    res.redirect("/create");
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

function blogFileName(blog) {
    return blog["blog-title"].split(" ").join("-") + ".txt";
}

function fileNameToPath(fileName) {
    return __dirname + "/public/blogs/" + fileName;
}

function blogText(blog) {
    return blog["blog-title"] + "\n\n" + blog["blog-body"];
}