import jwt from "jsonwebtoken";
import User from "../models/User.js";


const checkAuth = async (req, res, next) => {
  const token = req.header('x-token');

    if( !token  ) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }
    
    try {
        //TODO return user
        const { uid } = jwt.verify( token, `${process.env.JWT_SECRET}` );
        req.uid  = uid;
        req.user = await User.findOne({ _id:uid });

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    next();
};

export default checkAuth;
