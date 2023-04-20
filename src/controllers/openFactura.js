import User from "../models/User.js";
import {erroResp} from "../helpers/response.js"
import axios from 'axios';

let config = {
	method: 'post',
  	maxBodyLength: Infinity,
	headers: { 
	  'apikey': '928e15a2d14d4a6292345f04960f4bd3'
	}
};

const createDte = async(req,res) => {
	
	

	const headers = {
		'Content-Type': 'application/json',
		'apikey': '928e15a2d14d4a6292345f04960f4bd3'
	}
	console.log(req.body)  
	axios.post(`${process.env.OF_UR}/v2/dte/document`, req.body, {
		  headers: headers
		})
	.then((response) => {
		console.log(JSON.stringify(response.data));
		res.json(response.data)
	})
	.catch((error) => {
		console.log(error);
		res.json(error.message)
	})

}



export {
	createDte
};


