import {response} from"../helpers/response.js"
import CashRegister from './../models/CashRegister.js';
import moment from "moment";

const getOne = async (req, res)=>{
    const data = await CashRegister.findOne({ _id:req.params.id}).populate('registers.movements.user')
    
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await CashRegister.find()
	res.json(data);
}

const register = async (req, res)=>{
	const { name } = req.body;
	const cash = await CashRegister.findOne({ name });
	
	if (cash) return response(res, 400, "CashRegister ya registrado");

	try {
		const cash = new CashRegister(req.body);
		await cash.save();
		res.json(cash);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const cash = await CashRegister.updateOne({ _id:req.params.id }, req.body);
	return cash ? res.json(cash) : response(res, 404, "CashRegister no existe");
}

const deleteData = async(req,res) => {
	const cash = await CashRegister.deleteOne({ _id:req.params.id });
	return cash ? res.json(cash) : response(res, 404, "CashRegister no existe");
}

const movement = async(req, res) =>{
	const data = await CashRegister.findOne({ _id:req.params.id})
    data.registers[data.registers.length - 1].movements.push(req.body);
    data.save();
    return data ? res.json(data) : response(res, 404, "CashRegister no existe");
}



const registerBox = async(req, res) =>{
    const data = await CashRegister.findOne({ _id:req.params.id})
    const now = moment().toDate();
    
    if(data.registers.length > 0 ){
        let lastRegister = data.registers[data.registers.length - 1];
        if(lastRegister.endAt < now){
            data.registers.push({initAt:now});
            data.save()
        }else{
            data.registers[data.registers.length - 1].endAt = now;
            data.registers[data.registers.length - 1].status = req.body
            data.save();
        }

    }else{
        data.registers = [{initAt:now}]
        data.save()
    }
    res.json(data)

}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
	movement,
    registerBox
};