const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"need a account to continure transaction"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        require:[true,"amount is needed for transactions"],
        immutable:true
    },
    transactions:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"it must be associated"],
        index:true,
        immutable:true
    },
    type:{
      type:String,
      enum:{
        values:["CREDIT","DEBIT"]
      },
      required:true,
      immutable:true
    }
},{
    timestamps:true
})

function preventLedgerModification(){
    throw new Error("ledger entries cannot be modified")
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification)
ledgerSchema.pre("DeleteOne",preventLedgerModification)
ledgerSchema.pre("remove",preventLedgerModification)
ledgerSchema.pre("updateOne",preventLedgerModification)
ledgerSchema.pre("findOneAndReplace",preventLedgerModification)
ledgerSchema.pre("findOneAndDelete",preventLedgerModification)

const ledgerModel = mongoose.model("ledger",ledgerSchema)