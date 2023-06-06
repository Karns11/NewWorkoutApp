import bcrypt from "bcryptjs";

const users = [
  {
    firstName: "Nate",
    lastName: "Karns",
    email: "nate@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Jane Doe",
    email: "Jane@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
