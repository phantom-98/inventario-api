import User from "../models/User.js";
import {response} from "../helpers/response.js"
import axios from 'axios';
import fetch from 'node-fetch';
import fs from "fs";

const createDte = async(req,res) => {
  /*
      "RUTEmisor": "77278722-7",
      "RznSoc": "K&G SpA",
      "GiroEmis": "Venta de productos farmaceuticos y servicio online ecommerce",
      "Acteco": "477201",
      "DirOrigen": "ANTONIO BELLET 147, PROVIDENCIA, SANTIAGO",
      "CmnaOrigen": "PROVIDENCIA",
      "Telefono": "2 2437 0237",
      "CdgSIISucur": "88815786"
  */
	
  var requestOptions = {
    method: 'POST',
    headers: {"apikey": process.env.OPENFACTURA_KEY},
    body: JSON.stringify(req.body),
    redirect: 'follow'
  };

  fetch("https://dev-api.haulmer.com/v2/dte/document", requestOptions)
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result)
      console.log(data)
      /*fs.writeFile("./dte/sample.pdf", data.PDF, 'base64', function(err) {
        console.log(err);
      })*/
      res.json(data)
    })
    .catch(error => console.log('error', error));

}



export {
	createDte
};


