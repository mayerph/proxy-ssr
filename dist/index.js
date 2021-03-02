"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config.json");
const request = require("request");
const ssr_1 = require("./ssr");
var cookieParser = require("cookie-parser");
const app = express();
const destination = `${config.proxy.protocol}://${config.proxy.server}:${config.proxy.port}`;
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
/**
 * route to the page which should be server-side rendered using pupperty.
 * it enables the possibility to dynamically change the meta information of the page.
 * simultaneously the page can be found be search engines and the Open Graph-Markup for previews work
 */
app.get("/share/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("kommt hier was an");
    const url = `${destination}${req.url}`;
    const { html } = yield ssr_1.ssr(url);
    return res.status(200).send(html);
    // comment
}));
/**
 * Proxy-route to the frontend
 */
app.get("*", (req, res, next) => {
    req
        .pipe(request({ qs: req.query, uri: `${destination}${req.url}` }, (error, response, body) => {
        if (error) {
            return;
        }
    }))
        .pipe(res);
});
/**
 * Start server on port 5000
 */
app.listen(config.server.port, () => {
    console.log(`backend started with port ${config.server.port}`);
});
//# sourceMappingURL=index.js.map