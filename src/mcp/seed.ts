import mongoose from "mongoose";
import User from "../Model/UserDetails.Model/user.model";
import Project from "../Model/ProjectDetails/project.model";
import connectDB from "../Config/database";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});

    // Create User
    const user = await User.create({
      name: "Nabil Hasan",
      role: "Full Stack Developer & AI Enthusiast",
      location: "Dhaka, Bangladesh",
      bio: "Passionate developer building modern web applications and exploring AI integrations. Professional in React, Node.js, and TypeScript.",
      age: 22,
      BirthDate: new Date("2002-01-01"),
      favouriteColor: "Indigo",
      favouriteMovie: ["Interstellar", "Inception"],
      favouriteMusic: ["Rock", "Lo-fi"],
      favouriteHobby: ["Coding", "Graphic Design"],
      favouriteSport: ["Cricket"],
      favouriteBook: ["The Pragmatic Programmer"],
      favouriteGame: ["Minecraft", "Valorant"],
      skils: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "GSAP"],
      focusArea: ["Web Development", "AI Agents", "Motion Design"],
    });

    console.log("✅ User created:", user.name);

    // Create Projects
    const projects = [
      {
        title: "Portfolio 2024",
        description: "My personal portfolio built with React and GSAP for smooth animations.",
        owner: user._id,
        status: "completed",
      },
      {
        title: "MCP Knowledge Server",
        description: "An MCP server to expose user profile and project data to AI agents.",
        owner: user._id,
        status: "active",
      },
      {
        title: "E-commerce Dashboard",
        description: "A comprehensive dashboard for managing online store products and orders.",
        owner: user._id,
        status: "completed",
      },
    ];

    await Project.insertMany(projects);
    console.log("✅ Projects seeded successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
