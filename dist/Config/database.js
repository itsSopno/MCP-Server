"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
// Fix for querySrv ECONNREFUSED which is common in some network environments
if (dns_1.default.setDefaultResultOrder) {
    dns_1.default.setDefaultResultOrder("ipv4first");
}
// Explicitly set DNS servers to Google Public DNS to ensure SRV records are resolvable
try {
    dns_1.default.setServers(["8.8.8.8", "8.8.4.4"]);
}
catch (e) {
    console.warn("⚠️ Could not set custom DNS servers, falling back to system default.");
}
async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        // mongoose.connect() রিটার্ন করে একটি connection অবজেক্ট
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
        // ডাটাবেস এর নাম এবং কালেকশন চেক করার সঠিক উপায়
        const db = conn.connection.db;
        const dbName = conn.connection.name; // ডাটাবেসের নাম দেখাবে
        if (db) {
            const collectionName = "products";
            const collections = await db.listCollections({ name: collectionName }).toArray();
            if (collections.length === 0) {
                await db.createCollection(collectionName);
                console.log(`🚀 Collection '${collectionName}' created in ${dbName}!`);
            }
            else {
                console.log(`ℹ️ Collection '${collectionName}' already exists in ${dbName}`);
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("❌ MongoDB Connection Error:", error.message);
            if (error.message.includes("querySrv ETIMEOUT") || error.message.includes("querySrv ECONNREFUSED")) {
                console.error("💡 TIP: This is likely a DNS resolution issue. If you're using a VPN or restricted network, try manual DNS (e.g. 8.8.8.8).");
            }
        }
        process.exit(1);
    }
}
exports.default = connectDB;
