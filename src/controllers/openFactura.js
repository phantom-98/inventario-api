import User from "../models/User.js";
import { response } from "../helpers/response.js";
import axios from "axios";
import fetch from "node-fetch";
import fs from "fs";

const createDte = async (req, res) => {
  var requestOptions = {
    method: "POST",
    headers: { apikey: process.env.OPENFACTURA_KEY },
    body: JSON.stringify(req.body),
    redirect: "follow",
  };

  fetch("https://dev-api.haulmer.com/v2/dte/document", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      let data = JSON.parse(result);
      console.log(data);

      res.json(data);
    })
    .catch((error) => console.log("error", error));
};

export { createDte };
