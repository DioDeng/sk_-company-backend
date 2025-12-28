const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getCases,
  createCase,
  updateCase,
  deleteCase,
  getCaseById,
} = require("../controllers/caseController");

router.get("/", auth, getCases);
router.get("/:id", auth, getCaseById);
router.post("/", auth, createCase);
router.put("/:id", auth, updateCase);
router.delete("/:id", auth, deleteCase);

module.exports = router;
