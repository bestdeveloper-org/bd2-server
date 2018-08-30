const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const cryptoJS = require("node-cryptojs-aes").CryptoJS;
const uuid = require("uuid");
const encryption = require("./encryption")(cryptoJS, uuid);

const app = new Koa();
const router = new Router();
const cors = require('@koa/cors');
require("./mongo")(app);

app.use(BodyParser());
app.use(cors());

app.use(async (ctx, next) => {
    try{
        ctx.body = await next();
    }catch(ex){
        ctx.body = {err: ex.message || ex};
    }
   
    console.log('Setting status')
    
  })
  app.use(require("./jwt"));

router.get("/", async function (ctx) {
    ctx.body = {message: "Hello Worldsfdww1!"}
});

router.get("/people", async (ctx) => {
    console.log(ctx.qwery);
    ctx.body = ctx.params.id;
    
});

router.post("/test", async function (ctx) {
    ctx.body = {message: "Hello Worldsfdww1!"}
});

router.post("/create", async function (ctx) {
        const data = ctx.request.body;
        if(!data.email)
        {
            throw {message: "No_email"};
        }

        const user = await ctx.app.people.findOne({email:data.email});

        if(user){
            throw "User_exist";
        }
        if(!data.password)
        {
            throw "No_password";
        }
        var salt = encryption.salt();
        var encryptedPassword = encryption.encrypt(data.password, salt);
        data.password = encryptedPassword;
        data.salt = salt;
        
            return await ctx.app.people.insert(data);
    
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4001);