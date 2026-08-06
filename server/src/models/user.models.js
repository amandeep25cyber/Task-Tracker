import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },

    avatar: {
      type: String,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active","Inactive"],
      default: "Inactive",
    },
    
    lastActive: {
      type: Date,
      default: null,
    },

    phoneNo:{
      type:String,
      default:null,
    },

    bio:{
      type:String,
      default:"Hii! I am new here."
    },

    jobRole:{
      type:String,
      default:"Trainee"
    }
  },
  { timestamps: true },
);

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) {
        return next;
    }

    this.password = await bcrypt.hash(this.password, 10);

    next;
});

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      role: this.role,
      orgId: this.organisation,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXIPRY,
    },
  );
};

export const User = mongoose.model("User", userSchema);
