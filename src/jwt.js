import jwt from 'jsonwebtoken'

export const generateToken= (userId, res)=>{
    const token= jwt.sign({userId},process.env.JWT_SECRET_KEY,{
        expiresIn:"3d"
    });

    res.cookie('jwt',token,{
        maxAge:3*24*60*60*1000,
        httpOnly:true,
    })

    return token;
}