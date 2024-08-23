const CandidteReference = require("./candidte-reference"); // Ensure the correct path
const REST_API = require("../../util/api-util");

// Define the createCandidate controller function
// const createCandidateReference = async (req, res) => {

//   console.log(req.body);
//   const response = await REST_API._add(req, res, CandidteReference);
//   res.status(200).json(response);
// };

const createCandidateReference = async (req, res) => {
  let response;
  const { ...updateData } = req.body;
  let update = updateData[0];
  let candidate_id = update.candidate_id;
  let id = update.id;
  console.log(id, candidate_id);

  console.log(candidate_id, id);

  const existEdu = await CandidteReference.findOne({
    where: { candidate_id, id },
  });

  console.log("data", existEdu);

  if (!existEdu) {
    return res.status(404).json({ error: " reference  not found" });
  }

  const [updatedRows] = await CandidteReference.update(
    {
      ref_name: update.ref_name,
      ref_designation: update.ref_designation,
      company_name: update.company_name,
      ref_contact_num: update.ref_contact_num,
      ref_email: update.ref_email,
      ref_relationship: update.ref_relationship,
    },
    {
      where: { candidate_id, id },
    }
  );
  console.log(updatedRows);
  response = { id, updated: updatedRows > 0 };
  res.status(200).json(response);
};

const getCandidteListReference = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidteReference);
  res.status(200).json(response);
};

const getReferenceByCandidteId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidteReference,
    "candidate_id",
    candidateId
  );
  res.status(201).json(response);
};
const updateCandidteReference = async (req, res) => {
  const response = await REST_API._update(req, res, CandidteReference);
  res.status(201).json(response);
};

const deleteCandidateReference = async (req, res) => {
  const response = await REST_API._delete(req, res, CandidteReference);
  res.status(201).json(response);
};

exports.createCandidateReference = createCandidateReference;
exports.getCandidteListReference = getCandidteListReference;
exports.getReferenceByCandidteId = getReferenceByCandidteId;
exports.updateCandidteReference = updateCandidteReference;
exports.deleteCandidateReference = deleteCandidateReference;
