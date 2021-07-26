// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const session = require('express-session');
const MongoStore = require('connect-mongo')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 24* 60 * 60 // your cookie will be cleared after these seconds
      },
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/plantpal',
      ttl: 60*60*24
    })
}));

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/api", profileRoutes);

const plantRoutes = require("./routes/plants.routes");
app.use("/api", plantRoutes);

const reminderRoutes = require("./routes/reminders.routes");
app.use('/api', reminderRoutes)

const fileUploadRoutes = require('./routes/file-upload.routes')
app.use("/api", fileUploadRoutes);

const dashboardsRoutes = require('./routes/dashboard.routes')
app.use("/api", dashboardsRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;