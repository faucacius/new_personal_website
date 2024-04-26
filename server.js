const express = require('express');
const marked = require('marked');
const fs = require('fs');

const app = express();
const port = 3000;
const blogs = require("./blogs.json");

app.set('view engine', 'ejs');
app.use(express.static('public'));

const getBlogCounts = () => {
  const blogCountByYear = {};
  const blogCountByMonth = {};
  blogs.forEach((blog) => {
    const date = new Date(blog.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    if (!blogCountByYear[year]) {
      blogCountByYear[year] = 1;
    } else {
      blogCountByYear[year]++;
    }

    if (!blogCountByMonth[year]) {
      blogCountByMonth[year] = {};
    }
    
    if (!blogCountByMonth[year][month]) {
      blogCountByMonth[year][month] = 1;
    } else {
      blogCountByMonth[year][month]++;
    }
  });

  return { blogCountByYear, blogCountByMonth };
};

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/blogs', (req, res) => {
  const { blogCountByYear, blogCountByMonth } = getBlogCounts();
  res.render("blogs", { blogs, blogCountByYear, blogCountByMonth });
});

app.get('/blogs/:link', (req, res) => {
  const blogLink = req.params.link;
  const blog = blogs.find((blog) => blog.link === "/blogs/" + blogLink);
  if (!blog) {
    res.status(404).send("Blog not found");
    return;
  }

  const content = fs.readFileSync(`public/blog-posts/${blogLink}/blog-post.md`, "utf-8");
  const blogContent = marked.parse(content);

  res.render("blog-post", { blog, blogContent });
});

app.get('/projects', (req, res) => {
  res.render("projects");
})

app.get('/work', (req, res) => {
  res.render("work");
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
