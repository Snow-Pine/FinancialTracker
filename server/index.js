require("dotenv").config();
const PORT = process.env.PORT || 8001;
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
// Auth stuff imported from index.js
const { auth, requiresAuth } = require('express-openid-connect');


const dashboard_overview_router = require("./routers/dashboard_overview_router");
const dashboard_goals_router = require("./routers/dashboard_goals_router");
const dashboard_notifications_router = require("./routers/dashboard_notifications_router");
const dashboard_share_router = require("./routers/dashboard_share_router");
const authRouter = require('./routers/auth_router');
const transactionRouter = require("./routers/transactions_router");

// DATABASE ====================================================================
mongoose.connect(process.env.MONGODB_KEY);
const db = mongoose.connection;

// added by Vic - for testing purposes ----------------------------------------
db.once("open", () => {
    console.log("Connected to Spendr database");
});

db.on("error", (err) => {
    console.log("Connection Error");
});
// ----------------------------------------------------------------------------

// AUTH CONFIGS ================================================================
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email',
        state: true,
    }
};

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200
}

// MIDDLEWARE ==================================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(auth(config));

// ROUTES ======================================================================
app.use("/dashboard/overview", dashboard_overview_router);
app.use("/dashboard/goals", dashboard_goals_router);
app.use("/dashboard/notifications", dashboard_notifications_router);
app.use("/dashboard/share", dashboard_share_router);

// Auth stuff imported from index.js
app.use('/auth', authRouter);

// DONE: Vic
app.use("/user", transactionRouter);

// STANDARD ====================================================================
// Overwritten the default route to redirect to the dashboard page
app.get('/', requiresAuth(), (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
    res.status(404).send("Page not found");
});