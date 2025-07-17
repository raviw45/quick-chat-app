import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"});
    }
    const token=authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    
    jwt.verify(token,process.env.JWT_SECRET as string,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user=decoded as AuthUser; 
        next();
    });
}

export default authMiddleware;