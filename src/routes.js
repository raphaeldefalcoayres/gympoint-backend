import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ success: true });
});

export default routes;
