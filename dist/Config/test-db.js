"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dns_1 = __importDefault(require("dns"));
// Fix for querySrv ECONNREFUSED
if (dns_1.default.setDefaultResultOrder) {
    dns_1.default.setDefaultResultOrder("ipv4first");
}
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
}
console.log("Connecting to:", mongoUri.split("@")[1]); // Log only the host for security
mongoose_1.default.connect(mongoUri)
    .then(() => {
    console.log("Successfully connected to MongoDB!");
    process.exit(0);
})
    .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
});
