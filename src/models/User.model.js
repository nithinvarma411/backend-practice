import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    }
},{timestamps: true})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id }, 
        process.env.ACCESS_TOKEN, 
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
}

userSchema.methods.createRefreshToken = function () {
    return jwt.sign(
        { userId: this._id }, 
        process.env.REFRESH_TOKEN, 
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
}

export const User = mongoose.model("User", userSchema);