const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const cryptoJS = require("node-cryptojs-aes").CryptoJS;
const uuid = require("uuid");
const encryption = require("./encryption")(cryptoJS, uuid);
const jwt = require("./jwt");
const app = new Koa();
//const router = new Router();
const cors = require('@koa/cors');
require("./mongo")(app);

// Create a new securedRouter
const router = new Router();
const securedRouter = new Router();

// Apply JWT middleware to secured router only
securedRouter
    //.use(jwt.errorHandler())
    .use(jwt.jwt());

app.use(BodyParser());
app.use(cors());

app.use(async (ctx, next) => {
    try{
        console.log("000000000000");
        const resp = await next();
        console.log("response este dff", resp);
        ctx.body = resp;
    }catch(ex){
        ctx.body = {err: ex.message || ex};
    }

    // console.log('Setting status')

  })
  //app.use(require("./jwt"));

router.get("/", async function (ctx) {
    ctx.body = {message: "Hello Worldsfdww1!"}
});

router.get("/people", async (ctx) => {
    console.log(ctx.qwery);
    ctx.body = ctx.params.id;
    
});

router.post("/test", async (ctx) => {
    debugger;

    const resp = {items:[],
    count:0};
        resp.items = await ctx.app.people.find().skip(0).limit(2    )
    .toArray();
    resp.count = await ctx.app.people.count();

    console.log("ddddddddddddddddddddddddddddddd");
    return  resp;
});

router.post("/auth", async (ctx) => {
     console.log("aaa");
   // throw "error";
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

if (username === "user" && password === "pwd") {
    return {
        token: jwt.issue({
            user: "user",
            role: "admin"
        })
    }
} else {
    console.log("else");

     ctx.status = 401;
    return {error: "Invalid login"}
}
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

// Add the securedRouter to our app as well
app.use(router.routes()).use(router.allowedMethods());
app.use(securedRouter.routes()).use(securedRouter.allowedMethods());

app.listen(4001);

