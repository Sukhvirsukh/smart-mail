import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { InversifyExpressServer } from 'inversify-express-utils';
import { iocContainer } from '../inversify.config';
import './controllers/_manifests/controller.manifest';

// Start the server
let server = new InversifyExpressServer(iocContainer);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
