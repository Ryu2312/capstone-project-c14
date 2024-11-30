"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (params) => {
    params.context.query(`RAISE EXCEPTION 'up migration not implemented'`);
};
exports.up = up;
const down = async (params) => {
    params.context.query(`RAISE EXCEPTION 'down migration not implemented'`);
};
exports.down = down;
