import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "sfms_secret"

export function createToken(payload:any){
  return jwt.sign(payload, SECRET, {expiresIn:"1d"})
}

export function verifyToken(token:string){
  return jwt.verify(token, SECRET)
}