const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "it has to be associated with a user"],
    index:true 
    //An index gives MongoDB a fast lookup table for a field, so it doesn't have to scan every document to find matching values. 
  },

  status: {
    type:String,
    enum: {
      values: ["ACTIVE", "FROZEN", "CLOSED"],
    },
    default:"ACTIVE"
  },

  currency: {
    type: String,
    required: true,
    default: "INR",
  },
},{
    timestamps:true
});

accountSchema.index({user:1,status:1})

// Without a compound index, MongoDB finds the matching user and then checks each matching document for the status. With a compound index, MongoDB can directly look up the combination of user and status, so it does much less checking.

const accountModel = mongoose.model("account",accountSchema)

module.exports = accountModel