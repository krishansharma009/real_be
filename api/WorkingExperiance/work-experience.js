const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source");

class WorkExperience extends Model {}
WorkExperience.init(
  {
    experience_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salarySlip: {
      type: DataTypes.STRING, // Use STRING for file paths
      allowNull: true,
    },
    reasonForLeaving: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relievingLetter: {
      type: DataTypes.STRING, // Use STRING for file paths
      allowNull: true,
    },
    experienceLetter: {
      type: DataTypes.STRING, // Use STRING for file paths
      allowNull: true,
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "WorkExperience",
    tableName: "work_experiences",
  }
);

module.exports = WorkExperience;
