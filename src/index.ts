import 'reflect-metadata';
import { Container } from './configs/inversify.config';

const container = new Container();
const app = container.getApp();

app.initialize(process);
app.listen();
