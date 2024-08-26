const Candidte = require("./candidte"); // Ensure the correct path
const CandidateAddress = require("../candidate-address/candidate-address");
const CandidateCIBL = require("../candidate-cibil/candidte-cibil");
const CandidteDocs = require("../candidate-docs/candidte-docs");
const CandidteEduction = require("../candidate-eduction/candidte-eduction");
const CandidteReference = require("../candidate-reference/candidte-reference");
const CandidteVerification = require("../candidate-verification/candidte-verification");
const FathersDocuments = require("../fatherdoc/fathers-documents");
const WorkingExperiance = require("../WorkingExperiance/work-experience");
const sequelize = require("../../config/data-source");

const REST_API = require("../../util/api-util");//bsae
const mailer = require("../../config/mailer");
const User = require("../user/user");

// Define the createCandidate controller function
const createCandidate = async (req, res) => {
  try {
    const candidateEmail = req.body.email_id;
    if (!candidateEmail) {
      return res
        .status(400)
        .json({ msg: "Email ID is required", isError: true });
    }

    if (req.body.id) {
      return res.status(400).json({ msg: "Invalid request", isError: true });
    }

    const candidateList = await Candidte.findAll({
      where: { email_id: candidateEmail },
    });

    if (candidateList.length > 0) {
      return res
        .status(200)
        .json({ msg: "Email already exists", isError: true });
    }

    const userList = await User.findAll({
      where: { email: candidateEmail },
    });

    if (userList.length > 0) {
      return res
        .status(200)
        .json({ msg: "User already exists", isError: true });
    }

    const candidateResponse = await Candidte.create({
      ...req.body,
      persent_completed: 15,
    });
    const condidateIdd = candidateResponse.id;

    const conAddress = await CandidateAddress.bulkCreate([
      {
        candidate_id: condidateIdd,
        address_type: "current ",
      },
      {
        candidate_id: condidateIdd,
        address_type: "previous ",
      },
      {
        candidate_id: condidateIdd,
        address_type: "permanet ",
      },
    ]);
    const CandCIBL = await CandidateCIBL.create({
      candidate_id: condidateIdd,
    });
    const CandDoc = await CandidteDocs.create({
      candidate_id: condidateIdd,
    });

    const CanEdu = await CandidteEduction.bulkCreate([
      {
        candidate_id: condidateIdd,
        education_type: "current ",
      },
      {
        candidate_id: condidateIdd,
        education_type: "previous ",
      },
      {
        candidate_id: condidateIdd,
        education_type: "other ",
      },
    ]);
    const CanRef = await CandidteReference.create({
      candidate_id: condidateIdd,
    });

    const FathersDoc = await FathersDocuments.create({
      candidate_id: condidateIdd,
    });

    const Workxperiance = await WorkingExperiance.bulkCreate([
      {
        candidate_id: condidateIdd,
        experience_type: "current ",
      },
      {
        candidate_id: condidateIdd,
        experience_type: "previous ",
      },
      {
        candidate_id: condidateIdd,
        experience_type: "other ",
      },
    ]);

    const userResponse = await User.create({
      username: candidateEmail,
      password: req.body.mobile_no,
      user_role: 3,
      candidate_id: condidateIdd,
      email: candidateEmail,
      user_source_id: candidateResponse.id,
    });

    await CandidteVerification.create({
      status: 0,
      candidate_id: candidateResponse.id,
      created_by: null,
      updated_by: null,
    });

    if (Object.keys(userResponse).length > 0) {
      await Candidte.update(
        { user_id: userResponse.id },
        {
          where: { id: candidateResponse.id },
        }
      );
    }

    const mailOptions = {
      from: "info@vitsinco.com",
      to: candidateEmail, // Send email to candidate
      subject: "Please fill your Form",
      html: `
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Dear ${req.body.name},</p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Welcome to <strong style="color: #0056b3;">Vitsinco Global Consulting Private Limited</strong></p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Post to your appointment in <b> ${req.body.client_id} </b>. We request you to provide the necessary information to initiate your Background Verification process.</p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Kindly click on the link <a href="https://dashboard.vitsinco.com/auth/login?id=${candidateResponse.id}" style="color: #0056b3; text-decoration: none;">Login</a> to enter the necessary information for Background Verification:</p>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; font-family: Arial, sans-serif; font-size: 16px;">
      <tr style="background-color: #f8f9fa;">
        <th style="background-color: #0056b3; color: #ffffff; padding: 10px; text-align: left;">User ID</th>
        <td style="padding: 10px; color: #333;">${userResponse.username}</td>
      </tr>
      <tr style="background-color: #e9ecef;">
        <th style="background-color: #0056b3; color: #ffffff; padding: 10px; text-align: left;">Password</th>
        <td style="padding: 10px; color: #333;">${userResponse.password}</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <th style="background-color: #0056b3; color: #ffffff; padding: 10px; text-align: left;">Mobile No.</th>
        <td style="padding: 10px; color: #333;">${req.body.mobile_no}</td>
      </tr>
    </table>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; margin-top: 20px;">For any further clarification contact us at <a href="mailto:bgc@vitsinco.in" style="color: #0056b3; text-decoration: none;">bgc@vitsinco.in</a></p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">This is an auto-generated email. Please do not reply to this email.</p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Thanks and Regards,<br><strong style="color: #0056b3;">BGC Team</strong></p>
  `,
    };

    // Send email and handle response
    mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send(error.toString());
      }
      console.log("Message sent: %s", info.messageId);
    });

    // Response if email is not sent
    res.status(200).json(candidateResponse);
  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCandidteList = async (req, res) => {
  try {
    const response = await Candidte.findAll({
      include: [
        CandidateAddress,
        CandidateCIBL,
        CandidteDocs,
        CandidteEduction,
        CandidteReference,
        CandidteVerification,
        FathersDocuments,
        WorkingExperiance,
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching candidate list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCandidteById = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const response = await Candidte.findOne({
      where: { id: candidateId },
      include: [
        CandidateAddress,
        CandidateCIBL,
        CandidteDocs,
        CandidteEduction,
        CandidteReference,
        CandidteVerification,
        FathersDocuments,
        WorkingExperiance,
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCandidte = async (req, res) => {
  try {
    const response = await REST_API._update(req, res, Candidte);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCandidate = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;

    // Delete related records
    await CandidateAddress.destroy({
      where: { candidate_id: id },
      transaction,
    });
    await CandidateCIBL.destroy({ where: { candidate_id: id }, transaction });
    await CandidteDocs.destroy({ where: { candidate_id: id }, transaction });
    await CandidteEduction.destroy({
      where: { candidate_id: id },
      transaction,
    });
    await CandidteReference.destroy({
      where: { candidate_id: id },
      transaction,
    });
    await CandidteVerification.destroy({
      where: { candidate_id: id },
      transaction,
    });
    await FathersDocuments.destroy({
      where: { candidate_id: id },
      transaction,
    });
    await WorkingExperiance.destroy({
      where: { candidate_id: id },
      transaction,
    });
    await User.destroy({
      where: { candidate_id: id },
      transaction,
    });

    // Delete the main candidate record
    const deletedCandidate = await Candidte.destroy({
      where: { id },
      transaction,
    });

    if (deletedCandidate === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Candidate not found" });
    }

    await transaction.commit();
    res
      .status(200)
      .json({ message: "Candidate and related records deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.createCandidate = createCandidate;
exports.getCandidteList = getCandidteList;
exports.getCandidteById = getCandidteById;
exports.updateCandidte = updateCandidte;
exports.deleteCandidate = deleteCandidate;
