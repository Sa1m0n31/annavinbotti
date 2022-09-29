const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require('express-session');
const app = express();
const authApi = require('./apiAuth');
const flash = require('connect-flash');
require('dotenv').config();

const basicAuth = new authApi().basicAuth;

/* Redirect http to https */
app.enable('trust proxy');

function redirectWwwTraffic(req, res, next) {
    if (req.headers.host.slice(0, 4) === "www.") {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
    }
    next();
}

app.use(function (req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});
app.use(redirectWwwTraffic);

/* Middleware */
app.use(cors({
    credentials: true,
    // origin: "*"
    origin: ['http://localhost:3000', `${process.env.API_URL}:3000`, `${process.env.API_URL}:5000`]
}));
app.use(bodyParser.urlencoded({extended: true}));
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
        cookie: { secure: false, expires: 1000 * 60 * 60 * 24 } /* Session expire in 24 hours */
    })
);
app.use(flash());

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../client/build')));

const urls = [
    'admin', 'panel', 'dodaj-produkt', 'lista-produktow', 'dodaj-dodatek', 'lista-dodatkow',
    'edytuj-dodatek', 'dodaj-stan-magazynowy-produktow', 'dodaj-stan-magazynowy-dodatkow',
    'lista-stanow-magazynowych-produktow', 'lista-stanow-magazynowych-dodatkow', 'przyklad',
    'dodaj-kategorie', 'lista-kategorii', 'dodaj-artykul', 'lista-artykulow', 'newsletter',
    'regulaminy-polski', 'regulaminy-angielski', 'waitlista', 'lista-zamowien', 'szczegoly-waitlisty',
    'szczegoly-zamowienia', 'formularz', 'zmien-haslo-administratora', 'formularz-weryfikacji',
    'sklep', 'moje-konto', 'produkt', 'produkt/*', 'kontakt', 'blog', 'post/*', 'przypomnij-haslo', 'po-rejestracji',
    'odzyskiwanie-hasla', 'zamowienie', 'potwierdzenie-subskrypcji-newslettera', 'faq', 'o-nas',
    'nasze-wartosci', 'jak-powstaja', 'jak-zamawiac', 'jak-mierzyc-stope-czolenka', 'jak-mierzyc-stope-oficerki',
    'odstapienie-od-umowy', 'wysylka', 'sposoby-platnosci', 'adres-do-wysylki', 'regulamin', 'polityka-prywatnosci',
    'panel-klienta', 'informacje-o-zamowieniu', 'formularz-mierzenia-stopy', 'formularz-weryfikacji-buta',
    'oplac-zamowienie', 'weryfikacja', 'edycja-faq', 'wyslij-newsletter', 'oswiadczenie-reklamacyjne',
    'zrezygnuj-z-newslettera', 'gwarancja', 'zbiorczy-mail', 'vzh2sffqjn'
]

/* Routers */
const orderRouter = require('./routers/order');
const productRouter = require('./routers/products');
const addonRouter = require('./routers/addons');
const imageRouter = require("./routers/images");
const typesRouter  = require("./routers/types");
const stocksRouter = require('./routers/stocks');
const blogRouter = require('./routers/blog');
const newsletterRouter = require('./routers/newsletter');
const contentRouter = require('./routers/content');
const othersRouter = require('./routers/others');
const userRouter = require('./routers/user');
const formsRouter = require('./routers/forms');
const adminRouter = require('./routers/admin');

app.use('/orders', orderRouter);
app.use('/products', basicAuth, productRouter);
app.use('/addons', basicAuth, addonRouter);
app.use('/types', basicAuth, typesRouter);
app.use('/stocks', basicAuth, stocksRouter);
app.use('/blog-api', basicAuth, blogRouter);
app.use('/newsletter-api', basicAuth, newsletterRouter);
app.use('/content', basicAuth, contentRouter);
app.use('/others', basicAuth, othersRouter.router);
app.use('/user', basicAuth, userRouter);
app.use('/forms', basicAuth, formsRouter);
app.use('/admin-api', basicAuth, adminRouter);
app.use("/image", imageRouter);

urls.forEach((item) => {
    app.get(`/${item}`, (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
});

app.listen(5000);
