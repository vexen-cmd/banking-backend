const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  // 4 things

  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "user must have a account"],
    index: true,
  },

  // to whom
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "user must have a account"],
    index: true,
  },

	status:{
		type:String,
		enum:{values:["PENDING","COMPLETED","FAILED","REVERSED"]},
		default:"ACTIVE"
	},

	amount:{
		type:Number,
		required:[true,"account is needed to make a transaction"],
		min:0
	},

	idempotencyKey:{
		type:String,
		required:[true,"idempotencyKey is required"],
		index:true,
		unique:true
	}
},{
	timestamps:true
});


const transactionModel = mongoose.model("transaction",transactionSchema)

module.exports = transactionModel