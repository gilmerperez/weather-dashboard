import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'node:url';

// Import the routes
import routes from './routes/index.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT) || 3001;

// Serve static files of entire client dist folder
// From server/dist, we need to go up two levels to reach root, then into client/dist
app.use(express.static(path.join(__dirname, '../../client/dist')));
// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
// Listen on 0.0.0.0 to accept connections from all network interfaces (required for Render)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
