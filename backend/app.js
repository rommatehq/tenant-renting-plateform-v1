// // app.js
// import express from "express";
// import cors from "cors";
// import listingRoutes from "./routes/listingRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import bookmarkRoutes from "./routes/bookmarkRoutes.js";
// import userdataRoutes from "./routes/userdataRoutes.js"
// import inquiryRoutes from "./routes/inquiryRoutes.js"
// const app = express();

// // Middleware
// // app.use(cors());
// // app.use(cors({
// //   origin: [
// //     "http://localhost:5173", // for local dev
// //     "https://tenant-renting-plateform.vercel.app" // your live frontend
// //   ],
// //   credentials: true
// // }));
// app.use(cors({
//   origin: "*",   // 🔥 TEMP fix for testing
// }));

// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:5173",
// //       "https://www.rommate.in",
// //       "https://rommate.in"
// //     ],
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //     credentials: true,
// //   })
// // );
// app.options("*", cors());

// app.get("/cors-test", (req, res) => {
//   res.json({
//     message: "new deployment working"
//   });
// });
// // app.use(cors({
// //   origin: "*"
// // }));
// app.use(express.json());

// // Routes
// app.use("/api/listings", listingRoutes);
// app.use("/api/auth",authRoutes);
// app.use("/api/bookmarks", bookmarkRoutes);
// app.use("/api/user", userdataRoutes);
// app.use("/api/inquiry",inquiryRoutes);
// // Health check
// app.get("/", (req, res) => {
//   res.json({ message: "✅ Backend is running" });
// });

// export default app;


import express from "express";
import cors from "cors";
import listingRoutes from "./routes/listingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import userdataRoutes from "./routes/userdataRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";

const app = express();

// ✅ CORS — must be FIRST, before any routes or express.json()
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://www.rommate.in",
    "https://rommate.in",
    // add your Vercel URL if you have one
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ handles preflight, uses SAME options object

app.use(express.json());

// Routes
app.use("/api/listings", listingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/user", userdataRoutes);
app.use("/api/inquiry", inquiryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running" });
});

export default app;