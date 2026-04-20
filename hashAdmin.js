const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/your-test-db-name");

async function run() {
  await User.deleteOne({ email: "admin@vetdiag.com" });

  const hashedPassword = await bcrypt.hash("123456", 10);

  console.log("NEW HASH:", hashedPassword);

  await User.create({
    name: "Admin",
    email: "admin@vetdiag.com",
    password: hashedPassword,
    phone: "9999999999",
    gender: "Other",
    isAdmin: true,
    isActive: true,
    isVerified: true
  });

  console.log("ADMIN CREATED CLEANLY");

  mongoose.disconnect();
}

run();