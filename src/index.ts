import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import * as config from "./config.json"
import * as request from "request"
import { ssr } from "./ssr"

var cookieParser = require("cookie-parser")

const app = express()
const destination = `${config.proxy.protocol}://${config.proxy.server}`
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

/**
 * route to the page which should be server-side rendered using pupperty.
 * it enables the possibility to dynamically change the meta information of the page.
 * simultaneously the page can be found be search engines and the Open Graph-Markup for previews work
 */
app.get(
  "/share/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("kommt hier was an")
    const url = `${destination}${req.url}`
    const { html } = await ssr(url)
    return res.status(200).send(html)
    // comment
  }
)

/**
 * Proxy-route to the frontend
 */
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  req
    .pipe(
      request({ qs: req.query, uri: `${destination}${req.url}` }, (error, response, body) => {
        if (error) {
          return 
        }

      })
      )
    .pipe(res)
})

/**
 * Start server on port 5000
 */
app.listen(5000, () => {
  console.log(`backend started with port ${config.server.port}`)
})
