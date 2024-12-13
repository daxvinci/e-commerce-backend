import { expressjwt } from "express-jwt";

function jwtMiddleware (){
   return expressjwt({
        secret:process.env.SECRET,
        algorithms:["HS256"],
        isRevoked:isRevoked
    }).unless({
        path:[
            {url:/^\/public\/upload/, method:['GET']},
            {url:/^\/products/, method:['GET']},
            {url:/^\/categories/, method:['GET','OPTIONS']},
            '/users/login',
            '/users/register'
        ]
    })
}

async function isRevoked(req, payload) {
    console.log(payload);
    if (payload.isAdmin == false) {
      console.log('Not Admin');
      return true;
    }
    console.log('Admin');
    return false;
  }

export default jwtMiddleware;