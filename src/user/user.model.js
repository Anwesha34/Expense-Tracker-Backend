import { model, Schema } from "mongoose";

const userschema = new Schema(
{
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    // ✅ KEEP ONLY THIS
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

},
{ timestamps: true }
);

const UserModel = model("user", userschema);
export default UserModel;