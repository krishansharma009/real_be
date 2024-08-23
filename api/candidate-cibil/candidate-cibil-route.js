const express = require("express");
const router = express.Router();
const candidateCibilController = require("./candidate-cibil-controller"); // Ensure the correct path and export

// Define a route for creating a user
router.post("/", candidateCibilController.createCandidateCibil); //createCandidateCibil
router.put("/", candidateCibilController.updateCandidteCibil);

router.get("/", candidateCibilController.getCandidteListCibil);
router.get("/:candidateId", candidateCibilController.getCibilByCandidteId);
router.delete("/", candidateCibilController.deleteCandidateCibil);

module.exports = router; // Export the router
