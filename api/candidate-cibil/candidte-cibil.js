const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source");

class CandidteCibil extends Model {}
CandidteCibil.init(
  {
    pan_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan_card: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cibil_score: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cibil_report: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aadhar_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aadhar_card: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
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
    modelName: "CandidteCibil",
    tableName: "candidate_cibil",
  }
);

module.exports = CandidteCibil;
