import User from "../models/User.js";
import {response} from "../helpers/response.js"
import axios from 'axios';
import fetch from 'node-fetch';
import fs from "fs";

const createDte = async(req,res) => {
	
  var requestOptions = {
    method: 'POST',
    headers: {"apikey": "928e15a2d14d4a6292345f04960f4bd3"},
    body: JSON.stringify(req.body),
    redirect: 'follow'
  };

  fetch("https://dev-api.haulmer.com/v2/dte/document", requestOptions)
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result)
      
      fs.writeFile("./dte/sample.pdf", data.PDF, 'base64', function(err) {
        console.log(err);
      })
      res.json(data)
    })
    .catch(error => console.log('error', error));

}



export {
	createDte
};


