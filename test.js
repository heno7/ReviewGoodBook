const moment = require("moment");

const today = moment().startOf("day");

const start = moment().startOf("day").toDate();
const end = moment().endOf("day").toDate();

const stackStart = today.toDate();
const stackEnd = moment(today).endOf("day").toDate();
console.log(start, end);
console.log(stackStart, stackEnd);
