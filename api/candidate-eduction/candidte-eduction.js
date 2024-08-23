const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source");

class CandidateEducation extends Model {}
CandidateEducation.init(
  {
    education_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name_of_certificate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institution_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institution_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    university_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passing_year: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    roll_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gpa_percentage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certificate: {
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
    highest_qualify: {
      type: DataTypes.ENUM("12th", "Graduation", "Master's", "PhD", "Other"),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificate_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "CandidateEducation",
    tableName: "candidate_education",
  }
);

module.exports = CandidateEducation;
