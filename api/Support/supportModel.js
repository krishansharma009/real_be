const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");



class support extends Model {
   
}

support.init(
    {
        name :{
            type: DataTypes.STRING(255),
            allowNull:false,
        },
        contact :{
            type: DataTypes.STRING(30),
            allowNull:false,
        },
        message:{
            type: DataTypes.TEXT,
            allowNull:false,
        },
    },
    {
        sequelize,
        modelName: "support",
        tableName: "support",
        timestamps: true,
    }
)




module.exports=support;