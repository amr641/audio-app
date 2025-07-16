import { globalHandeling } from "./middlewares/globalErrHandeling.js"
import express from "express"
import userRouter from "./routes/authroutes.js"

export const bootstrap = function (app) {
    app.use(express.json())
    app.use((req, _res, next) => {
        const log = (`${new Date().toLocaleDateString()} ${req.method} ${req.url}\n`);
        console.log(log)
        next();
    })
    app.use("/users",userRouter)
    app.use((_req, res) => {
        res.status(404).json({ message: "Page Not Found" });
    });
    app.use(globalHandeling)

}
