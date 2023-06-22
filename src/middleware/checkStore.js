import jwt from "jsonwebtoken";
import User from "../models/User.js";


const checkStore = async (req, res, next) => {
    const token = req.header('s-token');
    if( !token  ) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token de tienda'
        });
    }
    
    try {
        req.store = await Store.findOne({ _id:token });
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    next();
};

export default checkStore;
