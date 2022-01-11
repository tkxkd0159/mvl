import { ErrorRequestHandler } from "express";
import moment from 'moment';
moment().format();

const ReqErrHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message || " * Unexpected Error !!")
}

function add0(target: number): string{
    let tmp = target.toString()
    if (tmp.length == 2){
        return tmp;
    } else {
        return '0' + tmp;
    }
}

function getTime(scope: string): string {
    const current_t = new Date()
    let tmp_y = current_t.getUTCFullYear()
    let tmp_m = add0((current_t.getUTCMonth() + 1))
    let tmp_d = add0(current_t.getUTCDate())
    let tmp_h = add0(current_t.getUTCHours())
    let tmp_mm = add0(current_t.getUTCMinutes())
    let tmp_s = add0(current_t.getUTCSeconds())

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

function makeTimestamp(dateWithColon: string) {
    let t: any = dateWithColon.split(":")
    let dayUpper = monthThres[parseInt(t[2]).toString()]
    let year = parseInt(t[0]);
    let month = parseInt(t[1]) - 1;
    let day = parseInt(t[2]);
    let hour = parseInt(t[3]);
    let mins = parseInt(t[4]);

    if (year < 2021) return -1;
    else if ( month < 0 || month > 11) return -1;
    else if (day < 0 || day > dayUpper) return -1;
    else if (hour < 0 || hour > 23) return -1;
    else if (mins < 0 || mins > 59) return -1;

    t = Date.UTC(year, month, day, hour, mins);
    let res = Math.floor(t / 1000);
    if (isNaN(res)) return -1;
    else return res;
}

let monthThres: any = {
    '1': 31,
    '2': 28,
    '3': 31,
    '4': 30,
    '5': 31,
    '6': 30,
    '7': 31,
    '8': 31,
    '9': 30,
    '10': 31,
    '11': 30,
    '12': 31
}

export {
    ReqErrHandler,
    add0,
    getTime,
    makeTimestamp
}