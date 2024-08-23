const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const CandidteAddress = require("./candidate-address");
const REST_API = require("../../util/api-util");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB file size limit
}).single("address_proof_file");

// Helper function to handle file upload
const handleFileUpload = async (req, existingFilePath = null) => {
  if (req.file) {
    if (existingFilePath) {
      const oldFilePath = path.join(__dirname, "..", "..", existingFilePath);
      await fs
        .unlink(oldFilePath)
        .catch((err) => console.error("Error deleting old file:", err));
    }
    return `/uploads/${req.file.filename}`;
  }
  return existingFilePath;
};

// Define the createCandidateAddress controller function
const createCandidateAddress = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let addressData = req.body;
      let response;

      if (Array.isArray(addressData)) {
        // Bulk create
        const addresses = addressData.map((address) => ({
          ...address,
          address_proof_file: null, // We can't handle multiple file uploads in this setup
        }));
        response = await CandidteAddress.bulkCreate(addresses);
      } else {
        // Single create
        addressData.address_proof_file = await handleFileUpload(req);
        response = await CandidteAddress.create(addressData);
      }

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const getCandidteAddressList = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidteAddress);
  res.status(200).json(response);
};

const getAddressByCandidteId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidteAddress,
    "candidate_id",
    candidateId
  );
  res.status(200).json(response);
};

const updateCandidteAddress = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let addressData = req.body;
      let response;

      if (Array.isArray(addressData)) {
        // Bulk update
        response = await Promise.all(
          addressData.map(async (address) => {
            const [updatedRows] = await CandidteAddress.update(address, {
              where: {
                candidate_id: address.candidate_id,
                id: address.id,
              },
            });
            return { id: address.id, updated: updatedRows > 0 };
          })
        );
      } else {
        // Single update
        const { candidate_id, id, ...updateData } = addressData;

        const existingAddress = await CandidteAddress.findOne({
          where: { candidate_id, id },
        });

        if (!existingAddress) {
          return res.status(404).json({ error: "Address not found" });
        }

        updateData.address_proof_file = await handleFileUpload(
          req,
          existingAddress.address_proof_file
        );

        const [updatedRows] = await CandidteAddress.update(updateData, {
          where: { candidate_id, id },
        });

        response = { id, updated: updatedRows > 0 };
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const deleteCandidateAddress = async (req, res) => {
  try {
    const addressToDelete = await CandidteAddress.findByPk(req.params.id);

    if (addressToDelete && addressToDelete.address_proof_file) {
      await fs.unlink(
        path.join(__dirname, "..", "..", addressToDelete.address_proof_file)
      );
    }

    const response = await REST_API._delete(req, res, CandidteAddress);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCandidateAddress = createCandidateAddress;
exports.getCandidteAddressList = getCandidteAddressList;
exports.getAddressByCandidteId = getAddressByCandidteId;
exports.updateCandidteAddress = updateCandidteAddress;
exports.deleteCandidateAddress = deleteCandidateAddress;
