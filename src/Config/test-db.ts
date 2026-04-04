import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import dns from "dns";

// Fix for querySrv ECONNREFUSED
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

dotenv.config({ path: path.join(__dirname, "../../.env") });

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
}

console.log("Connecting to:", mongoUri.split("@")[1]); // Log only the host for security

mongoose.connect(mongoUri)
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });
