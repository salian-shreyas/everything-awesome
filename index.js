import express from "express";
import bodyParser from "body-parser";
import { writeFile } from "node:fs";
import { readdir } from "node:fs";
import { readFileSync } from "node:fs";

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
    const fileName = blogTitleToFileName(req.body["blog-title"]);
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
    setTitleBodyToLocals(req, res);

    res.render("view.ejs");
});

app.get("/edit", (req, res) => {
    setTitleBodyToLocals(req, res);

    res.render("create.ejs");
});

app.get("/delete", (req, res) => {
    res.sendStatus(200);
});

app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});

function blogTitleToFileName(blogTitle) {
    return blogTitle.split(" ").join("-") + ".txt";
}

function blogFileNameToTitle(filename) {
    return filename.split("-").join(" ").slice(0, -4);
}

function blogFilePath(fileName) {
    return __dirname + "/public/blogs/" + fileName;
}

function blogText(blog) {
    return blog["blog-title"] + "\n\n" + blog["blog-body"];
}

function blogBody(filename) {
    const blog = readFileSync("public/blogs/" + filename, "utf-8");

    return blog.split("\n").slice(1).join("\n");
}

function blogTitles() {
    return blogFiles.map(filename => blogFileNameToTitle(filename) );
}

function setTitleBodyToLocals(req, res) {
    const blogTitle = req.query["blog-title"];
    const blogFileName = blogTitleToFileName(blogTitle);
    
    res.locals["blog-title"] = blogTitle;
    res.locals["blog-body"] = blogBody(blogFileName);
}

function loadBlogFiles() {
    readdir(__dirname + "/public/blogs", (err, files) => {
        if(err) throw err;

        files.forEach(file => {
            blogFiles.push(file);
        });     
    });
}
