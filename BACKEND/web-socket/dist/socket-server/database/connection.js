"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pg = (0, pg_promise_1.default)({});
exports.db = pg("postgres://postgres:123456@localhost:5432/dacn");
//# sourceMappingURL=connection.js.map