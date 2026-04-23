import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ProfileSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      unique: true,
      required: [true, "Name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      lowercase: true,
      required: [true, "Gender is required"],
    },
    gender_probability: {
      type: Number,
      min: 0,
      max: 1,
    },
    sample_size: Number,
    age: Number,
    age_group: {
      type: String,
      enum: ["adult", "teenager", "child", "senior"],
    },
    country_id: {
      type: String,
      minlength: 2,
      maxlength: 2,
    },
    country_probability: Number,
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const Profile = model("Profile", ProfileSchema);
