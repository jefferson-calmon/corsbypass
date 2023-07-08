"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDocs = void 0;
const fs_1 = __importDefault(require("fs"));
function renderDocs(headers, response) {
    const docFilePath = __dirname + '/assets/help.txt';
    const isHtml = /\.html$/.test(docFilePath);
    headers['content-type'] = isHtml ? 'text/html' : 'text/plain';
    fs_1.default.readFile(docFilePath, 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            response.writeHead(500, headers);
            response.end();
        }
        response.end(data);
    });
}
exports.renderDocs = renderDocs;
