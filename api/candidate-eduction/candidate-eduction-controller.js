const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const CandidateEducation = require("./candidte-eduction");
const REST_API = require("../../util/api-util");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads/education/",
  filename: function (req, file, cb) {
    cb(null, `education-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB file size limit
}).single("certificate");

// Helper function to handle file upload
const handleFileUpload = async (req, existingFilePath = null) => {
  if (req.file) {
    if (existingFilePath) {
      const oldFilePath = path.join(__dirname, "..", "..", existingFilePath);
      await fs
        .unlink(oldFilePath)
        .catch((err) => console.error("Error deleting old file:", err));
    }
    return `/uploads/education/${req.file.filename}`;
  }
  return existingFilePath;
};

// Define the createCandidateEducation controller function
const createCandidateEducation = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let educationData = req.body;
      let response;

      if (Array.isArray(educationData)) {
        // Bulk create
        const educations = educationData.map((education) => ({
          ...education,
          certificate: null, // We can't handle multiple file uploads in this setup
        }));
        response = await CandidateEducation.bulkCreate(educations);
      } else {
        // Single create
        educationData.certificate = await handleFileUpload(req);
        response = await CandidateEducation.create(educationData);
      }

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const getCandidateEducationList = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidateEducation);
  res.status(200).json(response);
};

const getEducationByCandidateId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidateEducation,
    "candidate_id",
    candidateId
  );
  res.status(200).json(response);
};

const updateCandidateEducation = async (req, res) => {
  upload(req, res, async (err) => {
    console.log(req);
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let educationData = req.body;
      let response;

      if (Array.isArray(educationData)) {
        // Bulk update
        response = await Promise.all(
          educationData.map(async (education) => {
            const [updatedRows] = await CandidateEducation.update(education, {
              where: {
                candidate_id: education.candidate_id,
                id: education.id,
              },
            });
            return { id: education.id, updated: updatedRows > 0 };
          })
        );
      } else {
        // Single update
        const { candidate_id, id, ...updateData } = educationData;

        const existingEducation = await CandidateEducation.findOne({
          where: { candidate_id, id },
        });

        if (!existingEducation) {
          return res.status(404).json({ error: "Education record not found" });
        }

        updateData.certificate = await handleFileUpload(
          req,
          existingEducation.certificate
        );

        const [updatedRows] = await CandidateEducation.update(updateData, {
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

const deleteCandidateEducation = async (req, res) => {
  try {
    const educationToDelete = await CandidateEducation.findByPk(req.params.id);

    if (educationToDelete && educationToDelete.certificate) {
      await fs.unlink(
        path.join(__dirname, "..", "..", educationToDelete.certificate)
      );
    }

    const response = await REST_API._delete(req, res, CandidateEducation);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCandidateEducation,
  getCandidateEducationList,
  getEducationByCandidateId,
  updateCandidateEducation,
  deleteCandidateEducation,
};
