const express = require("express");
const router = express.Router();
const candidateReferenceController = require("./candidate-reference-controller"); // Ensure the correct path and export

// Define a route for creating a user
router.post("/", candidateReferenceController.createCandidateReference);
router.put("/", candidateReferenceController.updateCandidteReference);

router.get("/", candidateReferenceController.getCandidteListReference);
router.get("/:candidateId", candidateReferenceController.getReferenceByCandidteId);
router.delete("/", candidateReferenceController.deleteCandidateReference);

module.exports = router; // Export the router
