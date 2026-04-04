import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    title: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    status: "active" | "completed" | "archived";
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["active", "completed", "archived"],
            default: "active",
        },
    },
    { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
