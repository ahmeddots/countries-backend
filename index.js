// add env variables
import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import { flagsRouter } from "./routes/flags.js";
import { usersRouter } from "./routes/users.js";
import { authRouter } from "./routes/auth.js";
import cors from "cors";
import helmet from "helmet";
const app = express();

// import session related packages
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import session from "express-session";
import lowdbStore from "connect-lowdb";

// create lowdb db and lowdb session store
const adapter = new JSONFile("data/sessions.json");
const db = new Low(adapter);
const LowdbStore = lowdbStore(session);

// middleware

app.use(
	helmet(),

	session({
		store: new LowdbStore({ db }),
		resave: false,
		saveUninitialized: false,
		secret: process.env.EXPRESS_SESSION_SECRET,
		cookie: {
			httpOnly: true,
			sameSite: "none",
			// secure: true,
			maxAge: 1000 * 60 * 60 * 24 * 3,
		},
	}),

	json(),
	cors({
		// to be configured later
		origin: ["http://localhost:5173", "https://countries.ahmed.systems"],
		methods: ["GET", "POST", "PATCH"],
		credentials: true,
	}),
);

// routers

app.use("/flags", flagsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// not found routes
app.all("*", (req, res) => {
	return res.sendStatus(404);
});

// run

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	`Running on (${PORT})`;
});
