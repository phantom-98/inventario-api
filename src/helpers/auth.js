import jwt from "jsonwebtoken";

const createJwt = (uid) => {
	return jwt.sign({ uid }, `${process.env.JWT_SECRET}`, {
		expiresIn: "1d",
	});
};

const createJwtWeb = () => {
	return jwt.sign({ uid:"Web" }, `${process.env.JWT_SECRET}`, {
		expiresIn: "365d",
	});
};

const createId = () => {
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha;
};
  
export {
	createId,
	createJwt,
	createJwtWeb
}