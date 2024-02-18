"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
require("reflect-metadata");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_config_1 = require("../inversify.config");
require("./controllers/_manifests/controller.manifest");
// Start the server
let server = new inversify_express_utils_1.InversifyExpressServer(inversify_config_1.iocContainer);
server.setConfig((app) => {
    app.use(bodyParser.json());
    // app.use(
    //   bodyParser.urlencoded({
    //     extended: true,
    //   })
    // )
    // // Middleware
    // app.use(helmet())
    // app.use(
    //   rateLimit({
    //     windowMs: 15 * 60 * 1000, // 15 minutes
    //     max: 100, // limit each IP to 100 requests per windowMs
    //   })
    // )
});
// Build and start the server
let app = server.build();
app.get('/', (req, res) => {
    // Send a simple HTML response to the browser
    res.send('<h1>App is Working!</h1>');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
