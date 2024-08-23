const express = require("express");
const router = express.Router();
const candidateAddressController = require("./candidate-address-controller"); // Ensure the correct path and export

// Define a route for creating a user
router.post("/", candidateAddressController.createCandidateAddress);
router.put("/", candidateAddressController.updateCandidteAddress);

router.get("/", candidateAddressController.getCandidteAddressList);
router.get("/:candidateId", candidateAddressController.getAddressByCandidteId);
router.delete("/", candidateAddressController.deleteCandidateAddress);

module.exports = router; // Export the router
