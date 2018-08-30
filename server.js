const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();
const cors = require('@koa/cors');

app.use(cors());

router.get("/", async function (ctx) {
    ctx.body = {message: "Hello Worldsfdww1!"}
});

router.post("/test", async function (ctx) {
    ctx.body = {message: "Hello Worldsfdww1!"}
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4001);