const CandidteCibil = require("./candidte-cibil");
const REST_API = require("../../util/api-util");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/cibil";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const createCandidateCibil = async (req, res) => {
  try {
    upload.fields([
      { name: "pan_card", maxCount: 1 },
      { name: "cibil_report", maxCount: 1 },
      { name: "aadhar_card", maxCount: 1 },
    ])(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ error: "Unknown error occurred during file upload" });
      }

      const { pan_number, cibil_score, aadhar_number, candidate_id } = req.body;

      const newCibil = await CandidteCibil.create({
        pan_number,
        cibil_score,
        aadhar_number,
        candidate_id,
        pan_card: req.files["pan_card"] ? req.files["pan_card"][0].path : null,
        cibil_report: req.files["cibil_report"]
          ? req.files["cibil_report"][0].path
          : null,
        aadhar_card: req.files["aadhar_card"]
          ? req.files["aadhar_card"][0].path
          : null,
      });

      res.status(201).json(newCibil);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getCandidteListCibil = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidteCibil);
  res.status(200).json(response);
};

const getCibilByCandidteId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidteCibil,
    "candidate_id",
    candidateId
  );
  res.status(201).json(response);
};

const updateCandidteCibil = async (req, res) => {
  try {
    upload.fields([
      { name: "pan_card", maxCount: 1 },
      { name: "cibil_report", maxCount: 1 },
      { name: "aadhar_card", maxCount: 1 },
    ])(req, res, async function (err) {
      console.log("-----------------------", req.files);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ error: "Unknown error occurred during file upload" });
      }

      const { candidate_id, id, ...updateData } = req.body;

      const existEdu = await CandidteCibil.findOne({
        where: { candidate_id, id },
      });

      if (!existEdu) {
        return res.status(404).json({ error: "Cibil not found" });
      }

      // Add file paths to updateData if files were uploaded
      if (req.files["pan_card"]) {
        updateData.pan_card = req.files["pan_card"][0].path;
      }
      if (req.files["cibil_report"]) {
        updateData.cibil_report = req.files["cibil_report"][0].path;
      }
      if (req.files["aadhar_card"]) {
        updateData.aadhar_card = req.files["aadhar_card"][0].path;
      }

      const [updatedRows] = await CandidteCibil.update(updateData, {
        where: { candidate_id, id },
      });

      const response = { id, updated: updatedRows > 0 };
      res.status(200).json(response);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCandidateCibil = async (req, res) => {
  const response = await REST_API._delete(req, res, CandidteCibil);
  res.status(201).json(response);
};

exports.createCandidateCibil = createCandidateCibil;
exports.getCandidteListCibil = getCandidteListCibil;
exports.getCibilByCandidteId = getCibilByCandidteId;
exports.updateCandidteCibil = updateCandidteCibil;
exports.deleteCandidateCibil = deleteCandidateCibil;
