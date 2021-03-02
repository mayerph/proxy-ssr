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
exports.ssr = void 0;
const puppeteer = require("puppeteer");
function ssr(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info("rendering the page in ssr mode");
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        try {
            yield page.goto(url);
            yield page.waitForSelector("#shared-image");
        }
        catch (err) {
            console.error(err);
            throw new Error("page.goto/waitForSelector timed out.");
        }
        const html = yield page.content();
        yield browser.close();
        return { html };
    });
}
exports.ssr = ssr;
//# sourceMappingURL=ssr.js.map