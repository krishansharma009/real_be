const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const WorkExperience = require("./work-experience");
const REST_API = require("../../util/api-util");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads/work_experience/",
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
}).fields([
  { name: "salarySlip", maxCount: 1 },
  { name: "relievingLetter", maxCount: 1 },
  { name: "experienceLetter", maxCount: 1 },
]);

// Helper function to handle file upload
const handleFileUpload = async (req, existingFilePaths = {}) => {
  const files = req.files || {};
  let updatedPaths = { ...existingFilePaths };

  for (const [fieldName, fileArray] of Object.entries(files)) {
    if (fileArray && fileArray.length > 0) {
      const file = fileArray[0];
      updatedPaths[fieldName] = `/uploads/work_experience/${file.filename}`;
    }
  }

  return updatedPaths;
};

// Define the createWorkExperience controller function
const createWorkExperience = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let workExp = req.body;
      const filePaths = await handleFileUpload(req);

      if (Array.isArray(workExp)) {
        // Bulk create
        const workExpWithFiles = workExp.map((exp) => ({
          ...exp,
          ...filePaths,
        }));
        const response = await WorkExperience.bulkCreate(workExpWithFiles);
        return res.status(201).json(response);
      } else {
        // Single create
        workExp = { ...workExp, ...filePaths };
        const response = await WorkExperience.create(workExp);
        return res.status(201).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};

const getWorkExperienceList = async (req, res) => {
  const response = await REST_API._getAll(req, res, WorkExperience);
  res.status(200).json(response);
};

const getWorkExperienceByCandidateId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    WorkExperience,
    "candidate_id",
    candidateId
  );
  res.status(200).json(response);
};

const updateWorkExperience = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let workExp = req.body;
      const existingWorkExperience = await WorkExperience.findOne({
        where: { candidate_id: workExp.candidate_id, id: workExp.id },
      });

      if (!existingWorkExperience) {
        return res.status(404).json({ error: "Work experience not found" });
      }

      const filePaths = await handleFileUpload(req, {
        salarySlip: existingWorkExperience.salarySlip,
        relievingLetter: existingWorkExperience.relievingLetter,
        experienceLetter: existingWorkExperience.experienceLetter,
      });

      const [updatedRows] = await WorkExperience.update(
        { ...workExp, ...filePaths },
        {
          where: { candidate_id: workExp.candidate_id, id: workExp.id },
        }
      );

      res.status(200).json({ id: workExp.id, updated: updatedRows > 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const deleteWorkExperience = async (req, res) => {
  try {
    const workExperienceToDelete = await WorkExperience.findByPk(req.params.id);

    if (workExperienceToDelete) {
      await Promise.all([
        workExperienceToDelete.salarySlip &&
          fs.unlink(
            path.join(__dirname, "..", "..", workExperienceToDelete.salarySlip)
          ),
        workExperienceToDelete.relievingLetter &&
          fs.unlink(
            path.join(
              __dirname,
              "..",
              "..",
              workExperienceToDelete.relievingLetter
            )
          ),
        workExperienceToDelete.experienceLetter &&
          fs.unlink(
            path.join(
              __dirname,
              "..",
              "..",
              workExperienceToDelete.experienceLetter
            )
          ),
      ]);
    }

    const response = await REST_API._delete(req, res, WorkExperience);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createWorkExperience,
  getWorkExperienceList,
  getWorkExperienceByCandidateId,
  updateWorkExperience,
  deleteWorkExperience,
};
