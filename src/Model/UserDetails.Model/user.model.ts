import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    role: string;
    location: string;
    bio: string;
    age: number;
    BirthDate: Date;
    favouriteColor: string;
    favouriteMovie: string[];
    favouriteMusic: string[];
    favouriteHobby: string[];
    favouriteSport: string[];
    favouriteBook: string[];
    favouriteGame: string[];
    skils: string[];
    focusArea: string[];

}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        bio: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true,
        },
        BirthDate: {
            type: Date,
            required: true,
        },
        favouriteColor: {
            type: String,
            required: true,
            trim: true
        },
        favouriteMovie: {
            type: [String],
            required: true,
            trim: true
        },
        favouriteMusic: {
            type: [String],
            required: true,
            trim: true
        },
        favouriteHobby: {
            type: [String],
            required: true,
            trim: true
        },
        favouriteSport: {
            type: [String],
            required: true,
            trim: true
        },
        favouriteBook: {
            type: [String],
            required: true,
            trim: true
        },
        favouriteGame: {
            type: [String],
            required: true,
            trim: true
        },
        skils: {
            type: [String],
            required: true,
            trim: true
        },
        focusArea: {
            type: [String],
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
