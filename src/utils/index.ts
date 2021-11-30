import express, { ErrorRequestHandler, RequestHandler } from "express"

const ReqErrHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message || " * Unexpected Error !!")
}

export {
    ReqErrHandler
}