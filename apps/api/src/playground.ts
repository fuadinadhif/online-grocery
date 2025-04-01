import jwt from "jsonwebtoken";

console.log(jwt.sign({ name: "Nadhif" }, "jwtsecrethere"));
