const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"please enter your email"],
        lowercase:true,
        trim:true,
        match:[/[\w.-]+@[\w.-]+\.\w+/,"please enter a valid email"],
        maxlength: [40, "Too long"],
        unique:[true,"email already in use"]
    },
    name:{
        type:String,
        required:[true,"name is required"]
    },
    password:{
        type:String,
        required:[true,"enter password"],
        minlength:[6,"password should be atleast 6 digit long "],
        select:false
    }
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user",userSchema)

module.exports = userModel