const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const courseRoutes = require("./routes/Course");
const authRoutes = require("./routes/AuthRoutes.js");
const profileRoutes = require("./routes/Profile.js");
const CategoryRoutes = require("./routes/Category.js");
const sectionRoutes = require("./routes/Section.js");
const subSectionRoutes = require("./routes/SubSection.js");
const ratingAndReviewRoutes = require("./routes/ratingAndReview.js");
const ContactRoutes = require("./routes/Contact.js");

// DB
const { connect } = require("./config/database");
connect();

const app = express();
const PORT = process.env.PORT || 4000;

/* =========================
   MIDDLEWARES
========================= */

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Body & cookies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =========================
   CORS CONFIG (FINAL FIX)
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://study-notion-weld-two.vercel.app" // ❗ no trailing slash
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow postman / server-to-server / preflight
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(null, false); // ❗ error throw mat karo
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight fix
// app.options("*", cors());

/* =========================
   ROUTES
========================= */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subsection", subSectionRoutes);
app.use("/api/v1/rating", ratingAndReviewRoutes);
app.use("/api/v1/reach", ContactRoutes);

/* =========================
   SERVER
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyNotion backend is running 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
