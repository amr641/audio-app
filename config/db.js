import { connect } from "mongoose";

const dbConn = connect("mongodb+srv://amr:amr123@cluster0.rirt7.mongodb.net/")
    .then(() => {
        console.log("dataBase connected successfully...");
    })
    .catch(() => {
        console.error("error dataBase connection!");
    });

export default dbConn;