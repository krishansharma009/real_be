const Client = require("./client"); // Ensure the correct path
const REST_API = require("../../util/api-util");
const User = require("../user/user");
const Candidte = require("../candidate/candidte");
const CandidteAddress = require("../candidate-address/candidate-address");
const CandidteCibil = require("../candidate-cibil/candidte-cibil");
const CandidteDocs = require("../candidate-docs/candidte-docs");
const CandidteEduction = require("../candidate-eduction/candidte-eduction");
const CandidteReference = require("../candidate-reference/candidte-reference");
const CandidteVerification = require("../candidate-verification/candidte-verification");
const FathersDocuments = require("../fatherdoc/fathers-documents");
const WorkingExperiance = require("../WorkingExperiance/work-experience");

const mailer = require("../../config/mailer");

const createClient = async (req, res) => {
  try {
    console.log("Inside createClient");

    const clientEmail = req.body.email_id;

    if (req.body.id) {
      return res.status(400).json({
        msg: "Something went wrong. Please try again!",
        isError: true,
      });
    }

    const clientList = await Client.findAll({
      where: { email_id: clientEmail },
    });
    if (clientList.length > 0) {
      return res
        .status(409)
        .json({ msg: "Email already exists", isError: true });
    }

    const userList = await User.findAll({ where: { email: clientEmail } });
    if (userList.length > 0) {
      return res
        .status(409)
        .json({ msg: "User already exists!", isError: true });
    }

    if (req.body.process_list && Array.isArray(req.body.process_list)) {
      req.body.process_list = req.body.process_list.join(",");
    }

    const clientResponse = await REST_API._add(req, res, Client);

    if (clientResponse.process_list) {
      clientResponse.process_list = clientResponse.process_list.split(",");
    }

    const userResponse = await User.create({
      username: clientEmail,
      password: req.body.mobile_number,
      user_role: 2,
      email: clientEmail,
      user_source_id: clientResponse.id,
    });

    const mailOptions = {
      from: "info@vitsinco.com",
      to: clientEmail,
      subject: "Welcome to Vitsinco",
      html: `
        <p>Dear ${clientEmail},</p>
        <p>Your account has been created successfully.</p>
        <p>Username: ${userResponse.username}</p>
        <p>Password: ${userResponse.password}</p>
        <p><a href="https://dashboard.vitsinco.com/auth/login?id=${clientResponse.id}">Login</a></p>
      `,
    };

    mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Failed to send email");
      }
      console.log("Message sent: %s", info.messageId);
      res.status(200).json(clientResponse);
    });
  } catch (err) {
    console.error("Error in createClient:", err);
    res.status(500).json({ msg: "Server Error", isError: true });
  }
};

const getClientList = async (req, res) => {
  const response = await REST_API._getAll(req, res, Client);
  response.forEach((client) => {
    if (client.process_list) {
      client.process_list = client.process_list.split(",");
    }
  });
  res.status(200).json(response);
};

const getCandidtes = async (req, res) => {
  const ClientId = req.params.id;
  const status = req.query.status;
  const incCandidateVerification = status
    ? {
        model: CandidteVerification,
        where: {
          status: status,
        },
      }
    : { model: CandidteVerification };
  const response = await Candidte.findAll({
    where: {
      client_id: ClientId,
    },
    include: [
      CandidteAddress,
      CandidteCibil,
      CandidteDocs,
      CandidteEduction,
      CandidteReference,
      incCandidateVerification,
    ],
  });
  res.status(201).json(response);
};

const getClinetById = async (req, res) => {
  const { ClientId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    Client,
    "id",
    ClientId
  );
  if (response && response.process_list) {
    response.process_list = response.process_list.split(",");
  }
  res.status(201).json(response);
};
const updateClient = async (req, res) => {
  console.log("asdfasdfasd    ", req);
  if (req.body.process_list && Array.isArray(req.body.process_list)) {
    req.body.process_list = req.body.process_list.join(",");
  }
  const response = await REST_API._update(req, res, Client);
  if (response.process_list) {
    response.process_list = response.process_list.split(",");
  }
  res.status(201).json(response);
};

const deleteClient = async (req, res) => {
  const response = await REST_API._delete(req, res, Client);
  res.status(201).json(response);
};

exports.createClient = createClient;
exports.getClientList = getClientList;
exports.getClinetById = getClinetById;
exports.updateClient = updateClient;
exports.deleteClient = deleteClient;
exports.getCandidtes = getCandidtes;
