import Factura from "../models/Factura.js";
import Clients from "../models/Clients.js";
import {response} from"../helpers/response.js"
import fetch from 'node-fetch';
import fs from 'fs/promises'
import {dteBoletaMapping} from"../helpers/mapping.js"
import { writeFile } from "../helpers/fsWrapping.js"
import path from 'path';
import Emisor from "../models/Emisor.js";



const getOne = async (req, res)=>{
    const data = await Factura.find({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Factura.find()
	res.json(data);
}

const createDte = async (data, document="boleta")=>{
	console.log(JSON.stringify(data));
	var requestOptions = {
		method: 'POST',
		headers: {"apikey": process.env.OPENFACTURA_KEY},
		body: JSON.stringify(data),
		redirect: 'follow'
	};

	try {
		let response = await fetch("https://dev-api.haulmer.com/v2/dte/document", requestOptions)
		let result = await response.text();
		let dataParse = JSON.parse(result)
		if(dataParse.error){

			console.log(JSON.stringify(dataParse));
		}
		let name = `${document}_${Date.now()}.pdf`
		await writeFile(`./dte/${name}`, dataParse.PDF, 'base64' )
		return name
	} catch (error) {
		console.log(error);
	}
	
}

const createforWeb = async (req, res) =>{
	let rData = req.body;
	const emisor = await Emisor.findById("6478cf2019faa9ced45ca8f1")
	
	let data = dteBoletaMapping(rData["items"], rData["client"]["rut"], true, emisor)
//	
	let file = await createDte(data)
	try {
		let facturaReq = {
			type: "Boleta",
			typeId: 39,
			client :{
				RUTRecep: rData["client"]["rut"] ? rData["client"]["rut"] : null,
				name: rData["client"]["fistName"] ? rData["client"]["fistName"] + " " + rData["client"]["lastName"] : null,
				phone:rData["client"]["phone"] ? rData["client"]["phone"] : null,
				address:rData["client"]["address"] ? rData["client"]["address"] : null

			},
			url: process.env.SERVER +"factura/download/" +file,
			counter: await Factura.count(),
			items: data.dte.Detalle,
			totals:data.dte.Encabezado.Totales,
			emisor :"6478cf2019faa9ced45ca8f1",
		}
		
		const factura = new Factura(facturaReq);
		await factura.save();

		res.json({
			document:{
				...factura.toJSON(),
				"number": factura.counter,
				"saleType":"Internet",
				"createUser":"anticonceptivo",
    			"total":factura.totals.MntTotal
			}, 
			pdfUrl:process.env.SERVER +"factura/download/" +file,
			"error":{
				code:0,
				description:"OK"
			}
		});
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const register = async (req, res)=>{
	let rData = req.body;
	const client = await Clients.findById(rData.clientId)

	let data;
	switch (rData.dte) {
		case '39':
			data = dteBoletaMapping(req.body, client.rut, false)
			break;
	
		default:
			break;
	}
	
	
	let file = await createDte(data)

	try {
		/*const factura = new Factura(req.body);
		await factura.save();*/
		res.json(file);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const factura = await Factura.updateOne({ _id:req.params.id }, req.body);
	return factura ? res.json(factura) : response(res, 404, "Factura no existe");
}

const deleteData = async(req,res) => {
	const factura = await Factura.deleteOne({ _id:req.params.id });
	return factura ? res.json(factura) : response(res, 404, "Factura no existe");
}

const download = (req, res) => {
	const fileName = req.params.name;

	res.download('dte/' + fileName, fileName, (err) => {
	  if (err) {
		res.status(500).send({
		  message: "Could not download the file. " + err,
		});
	  }
	});
};

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
	download,
	createforWeb
};