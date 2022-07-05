const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');
const fs = require('fs');
const path = require("path");
const session = require('express-session');
const apiAuth = require('./apiAuth');
const app = express();
const http = require('http');
const flash = require('connect-flash');
require('dotenv').config();

const basicAuth = new apiAuth().basicAuth;

const server = http.createServer(app);

/* Redirect http to https */
// app.enable('trust proxy');

// function redirectWwwTraffic(req, res, next) {
//     if (req.headers.host.slice(0, 4) === "www.") {
//         var newHost = req.headers.host.slice(4);
//         return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
//     }
//     next();
// }

// app.use(function (req, res, next) {
//     if (req.secure) {
//         // request was via https, so do no special handling
//         next();
//     } else {
//         // request was via http, so redirect to https
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });
// app.use(redirectWwwTraffic);

/* Middleware */
app.use(cors({
    credentials: true,
    // origin: "*"
    origin: [`${process.env.API_URL}:3000`, `${process.env.API_URL}:5000`]
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser({
    limit: "50mb"
}));
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(bodyParser.raw({
    limit: "50mb"
}));
app.use(bodyParser.text({
    limit: "50mb"
}));
app.use(
    session({
        secret: "secretcode",
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: { secure: false, expires: 1000 * 60 * 30 } /* Session expire in 30 minutes */
    })
);
app.use(flash());
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

/* Check if user is logged in middleware */
const isLoggedIn = (req, res, next) => {
    if(req.user) next();
    else res.redirect("/");
}

app.use(express.static(path.join(__dirname, '../shop/build')));

const urls = [
    'admin', 'panel', 'dodaj-produkt', 'lista-produktow', 'dodaj-dodatek', 'lista-dodatkow',
    'edytuj-dodatek', 'dodaj-stan-magazynowy-produktow', 'dodaj-stan-magazynowy-dodatkow',
    'lista-stanow-magazynowych-produktow', 'lista-stanow-magazynowych-dodatkow',
    'dodaj-kategorie', 'lista-kategorii', 'dodaj-artykul', 'lista-artykulow', 'newsletter',
    'regulaminy-polski', 'regulaminy-angielski', 'waitlista', 'lista-zamowien', 'szczegoly-waitlisty',
    'szczegoly-zamowienia', 'formularz', 'zmien-haslo-administratora'
]

/* Routers */
const orderRouter = require('./routers/order');
const productRouter = require('./routers/products');
const addonRouter = require('./routers/addons');
// const authRouter = require("./routers/auth");
const imageRouter = require("./routers/images");
const typesRouter  = require("./routers/types");
const stocksRouter = require('./routers/stocks');
const blogRouter = require('./routers/blog');
const newsletterRouter = require('./routers/newsletter');
const contentRouter = require('./routers/content');
const othersRouter = require('./routers/others');
const userRouter = require('./routers/user');
// const videoRouter = require("./routers/vid ..eo");
// const customFieldRouter = require("./routers/customField");
// const notificationRouter = require("./routers/notification");
// const squadRouter = require("./routers/squad");
// const visitedRouter = require("./routers/visited");
// const favoriteRouter = require("./routers/favorite");
// const couponRouter = require("./routers/coupon");
// const clubRouter = require("./routers/club");
// const userRouter = require("./routers/user");
// const blogRouter = require("./routers/blog");
// const priceRouter = require("./routers/price");
// const leagueRouter = require("./routers/league");
// const adminRouter = require("./routers/admin");
// const paymentRouter = require("./routers/payment");
// const chatRouter = require("./routers/chat");

app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/addons', addonRouter);
app.use('/types', typesRouter);
app.use('/stocks', stocksRouter);
// app.use("/auth", authRouter);
app.use('/blog', blogRouter);
app.use('/newsletter-api', newsletterRouter);
app.use('/content', contentRouter);
app.use('/others', othersRouter);
app.use('/user', userRouter);
app.use("/image", imageRouter); // only / not restricted (display image)
// app.use("/video", videoRouter); // only /get not restricted (display video)
// app.use("/custom-field", basicAuth, customFieldRouter);
// app.use("/notification", basicAuth, notificationRouter);
// app.use("/squad", basicAuth, squadRouter);
// app.use("/visited", basicAuth, visitedRouter);
// app.use("/favorite", basicAuth, favoriteRouter);
// app.use("/coupon", basicAuth, couponRouter);
// app.use("/club", clubRouter);
// app.use("/user", userRouter);
// app.use("/blog", basicAuth, blogRouter);
// app.use("/price", basicAuth, priceRouter);
// app.use("/league", basicAuth, leagueRouter);
// app.use("/admin", basicAuth, adminRouter);
// app.use("/payment", paymentRouter);
// app.use("/chat", basicAuth, chatRouter);

urls.forEach((item) => {
    app.get(`/${item}`, (req, res) => {
        res.sendFile(path.join(__dirname, '../shop/build/index.html'));
    });
});

server.listen(5000);
