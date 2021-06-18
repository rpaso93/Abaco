import { ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';

const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authHeader = context.req.get('Authorization');
  if(!authHeader){
    throw new ApolloError('No autorizado.', '401');
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  const jwtKey = process.env.JWT_KEY || 'asdasd21312dasdasdas123';
  try {
    decodedToken = jwt.verify(token, jwtKey);
  }catch(err) {
    throw new ApolloError('No autorizado.', '401');
  }
  if(!decodedToken){
    throw new ApolloError('No autorizado.', '401');
  }
  context.req.userId = decodedToken.userId;
  return next();
}

export default isAuth;
