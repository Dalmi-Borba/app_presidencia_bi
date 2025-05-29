// middleware/authMiddleware.js
import dotenv from 'dotenv';
dotenv.config();

export default function requiresAuth(req, res, next) {

  //const test = req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out';
  if(process.env.STAGE === 'dev') {
    return next();
  }

  if (req.oidc && req.oidc.isAuthenticated()) {
    return next();
  }
    res.oidc.login();
}