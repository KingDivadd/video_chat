require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: fetch } = require("node-fetch");
const jwt = require("jsonwebtoken");

const PORT = 9000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//
app.get("/", (req, res) => {
    res.send("Hello World!");
});

//
app.get("/get-token", (req, res) => {
    const API_KEY = '9dd3b903-2366-4397-9cd3-b66957032986';
    const SECRET_KEY = 'f15353776a062960967704615e85164d84acf8be7456d2684cfa790253649979';

    const options = { expiresIn: "10m", algorithm: "HS256" };

    const payload = {
        apikey: API_KEY,
        permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
    };

    const token = jwt.sign(payload, SECRET_KEY, options);
    res.json({ token });
});

//
app.post("/create-meeting", (req, res) => {
    const { token, region } = req.body;
    const url = `https://api.videosdk.live/api/meetings`; // Ensure this URL is absolute

    const options = {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ region }),
    };

    fetch(url, options)
        .then((response) => response.json())
        .then((result) => res.json(result)) // result will contain meetingId
        .catch((error) => {
            console.error("Error creating meeting:", error);
            res.status(500).json({ error: "Error creating meeting" });
        });
});


//
app.post("/validate-meeting/:meetingId", (req, res) => {
    const token = req.body.token;
    const meetingId = req.params.meetingId;

    const url = `https://api.videosdk.live/api/meetings/${meetingId}`;

    const options = {
        method: "POST",
        headers: { Authorization: token },
    };

    fetch(url, options)
        .then((response) => response.json())
        .then((result) => res.json(result)) // result will contain meetingId
        .catch((error) => console.error("error", error));
});

//
const port = process.env.PORT || 9000
app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});