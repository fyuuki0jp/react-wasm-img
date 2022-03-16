import express from 'express';
import * as path from 'path';
const app = express();
const PORT = 3030;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT);
console.log(`listen on port: ${PORT}`);