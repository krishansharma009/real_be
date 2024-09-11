const supportModel=require('./supportModel');


const REST_API = require("../../utils/crudHelper");

exports.PostData=async(req,res)=>{
    try{
        const response=await supportModel.create(req.body);
        res.status(200).json(response);
    }catch(error){
        res.status(500).json(error);
    }
}

exports.getData=async(req,res)=>{
    try{
        const response=await supportModel.findAll();
        res.status(200).json(response);
    }catch(error){
        res.status(500).json(error);
    }
}

exports.deleteData=async(req,res)=>{
    try{
        const response=await supportModel.destroy({where:{id:req.params.id}});
        res.status(200).json(response);
    }catch(error){
        res.status(500).json(error);
    }
}