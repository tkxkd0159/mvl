import express, { ErrorRequestHandler, RequestHandler } from "express"

const ReqErrHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message || " * Unexpected Error !!")
}

function getTime(scope: string) {
    const current_t = new Date()
    let tmp_y = current_t.getUTCFullYear().toString()
    let tmp_m = (current_t.getUTCMonth() + 1).toString()
    let tmp_d = current_t.getUTCDate().toString()
    let tmp_h = current_t.getUTCHours().toString()
    let tmp_mm = current_t.getUTCMinutes().toString()
    let tmp_s = current_t.getUTCSeconds().toString()

    if (tmp_m.length == 1) {
        tmp_m = '0' + tmp_m
    }

    if (tmp_d.length == 1) {
        tmp_d = '0' + tmp_d
    }
    if (tmp_h.length == 1) {
        tmp_h = '0' + tmp_h
    }
    if (tmp_mm.length == 1) {
        tmp_mm = '0' + tmp_mm
    }
    if (tmp_s.length == 1) {
        tmp_s = '0' + tmp_s
    }

    let time;
    if (scope === "day") {
        return tmp_y + tmp_m + tmp_d
    } else if (scope === "hour") {
        return tmp_y + tmp_m + tmp_d + tmp_h
    } else if (scope === "minute") {
        return tmp_y + tmp_m + tmp_d + tmp_h + tmp_mm
    }
    else {
        return tmp_y + tmp_m + tmp_d + tmp_h + tmp_mm + tmp_s
    }

}

export {
    ReqErrHandler,
    getTime
}