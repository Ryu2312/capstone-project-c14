"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatIssues = formatIssues;
function formatIssues(errors) {
    const errorList = errors.map((error) => [error.path, error.message]);
    return Object.fromEntries(errorList);
}
