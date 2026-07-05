const mongoose = require("mongoose")

const tokenBlackListSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
},{
    timestamps:true
}) 

tokenBlackListSchema.index({createdAt:1},{
    expireAfterSeconds:60 * 60 * 60 *3
})

const tokenBlackListModel = mongoose.model("tokenBlackList" , tokenBlackListSchema)

module.exports = tokenBlackListModel