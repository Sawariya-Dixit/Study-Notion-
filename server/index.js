const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload")
const cookieParser = require('cookie-parser');   // <-- ADD THIS
const courseRoutes = require("./routes/Course");
const authRoutes = require("./routes/AuthRoutes.js");
const profileRoutes = require('./routes/Profile.js');
const CategoryRoutes = require('./routes/Category.js')
const sectionRoutes = require("./routes/Section.js")
const subSectionRoutes = require('./routes/SubSection.js')
const ratingAndReviewRoutes = require('./routes/ratingAndReview.js')
const ContactRoutes = require("./routes/Contact.js")
// DB connect
const cors = require("cors");
const { connect } = require("./config/database");
connect();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


app.use(cookieParser());    
app.use(express.urlencoded({ extended: true }));     // <-- ADD THIS
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000","http://127.0.0.1:5173","https://study-notion-weld-two.vercel.app/" ];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use("/api/v1/category" , CategoryRoutes);
app.use("/api/v1/section" , sectionRoutes)
app.use("/api/v1/subsection",subSectionRoutes)
app.use("/api/v1/rating" , ratingAndReviewRoutes)
app.use("/api/v1/reach", ContactRoutes);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
