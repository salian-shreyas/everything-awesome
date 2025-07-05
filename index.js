import express from "express";
import bodyParser from "body-parser";
import { writeFile } from "node:fs";
import { readdir } from "node:fs";

const app = express();

const port = 3000;
const __dirname = import.meta.dirname;
const blogFiles = [];

loadBlogFiles();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.locals.blogs = blogTitles();
    
    res.render("home.ejs");
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.post("/create", (req, res) => {
    const fileName = blogFileName(req.body);
    const filePath = blogFilePath(fileName); 
    const blog = blogText(req.body);

    writeFile(filePath, blog, (err) => {
        if (err) throw err;
        console.log(`Blog saved to ${filePath}`);
    });
    blogFiles.push(fileName);

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

function blogTitle(filename) {
    return filename.split("-").join(" ").slice(0, -4);
}

function blogFilePath(fileName) {
    return __dirname + "/public/blogs/" + fileName;
}

function blogText(blog) {
    return blog["blog-title"] + "\n\n" + blog["blog-body"];
}

function blogTitles() {
    return blogFiles.map(filename => blogTitle(filename) );
}

function loadBlogFiles() {
    readdir(__dirname + "/public/blogs", (err, files) => {
        if(err) throw err;

        files.forEach(file => {
            blogFiles.push(file);
        });     
    });
}
