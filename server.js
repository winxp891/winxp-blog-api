const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'https://winxpdevblog.neocities.org' }));
app.use(express.json());

const postsFile = path.join(__dirname, 'posts.json');

async function initPostsFile() {
  try {
    await fs.access(postsFile);
  } catch {
    await fs.writeFile(postsFile, JSON.stringify([]));
  }
}
initPostsFile();

app.get('/posts', async (req, res) => {
  try {
    const data = await fs.readFile(postsFile);
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const posts = JSON.parse(await fs.readFile(postsFile));
    const newPost = {
      title: req.body.title,
      content: req.body.content,
      createdAt: new Date().toISOString(),
      isPersonal: req.body.title.toLowerCase().startsWith('p:')
    };
    posts.push(newPost);
    await fs.writeFile(postsFile, JSON.stringify(posts, null, 2));
    res.json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.listen(process.env.PORT || 3000);
