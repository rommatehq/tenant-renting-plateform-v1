// routes/listingRoutes.js
import express from "express";
import multer from "multer";
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getAllData,
  getOwnerListings,
  updateListingStatus,
  deleteOwnerListing
} from "../controllers/listingController.js";

// import { signup } from "../controllers/authController.js";

const router = express.Router();
import {authMiddleware} from "../utils/middleware.js"

const upload = multer({ storage: multer.memoryStorage(), limits: { files: 10 } });

const uploadImages = (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE" || err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            error:
              "Too many images uploaded. Maximum 10 files are allowed with field name 'images'.",
          });
        }
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Routes
router.post("/", uploadImages, authMiddleware, createListing);          // POST /api/listings
router.get("/", getListings);              // GET /api/listings?location=jadavpur&maxPrice=7000
router.get("/getall", getAllData);
router.get("/mydata",authMiddleware,getOwnerListings);
router.get("/:id", getListingById);        // GET /api/listings/:id
router.put("/:id",authMiddleware, updateListing);         // PUT /api/listings/:id
router.patch("/:id/status",authMiddleware, updateListingStatus);
router.delete("/:id", deleteListing);      // DELETE /api/listings/:id
// router.post("/signup", signup);
router.delete("/:id", authMiddleware, deleteOwnerListing);
export default router;
