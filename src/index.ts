import 'reflect-metadata';
import { container } from './configs/inversify.config';

const app = container.getApp();

app.initialize();
app.listen();
