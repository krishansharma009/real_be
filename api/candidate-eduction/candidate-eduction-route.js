const express = require("express");
const router = express.Router();
const candidateEductionController = require("./candidate-eduction-controller"); // Ensure the correct path and export

// Define a route for creating a user
router.post("/", candidateEductionController.createCandidateEducation);
router.put("/", candidateEductionController.updateCandidateEducation);

router.get("/", candidateEductionController.getCandidateEducationList);
router.get("/:candidateId",candidateEductionController.getEducationByCandidateId);
router.delete("/", candidateEductionController.deleteCandidateEducation);

module.exports = router; // Export the router
