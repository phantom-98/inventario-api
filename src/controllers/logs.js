import Log from "../models/Log.js";
import {createJwt, createId} from "../helpers/auth.js";
import {response} from "../helpers/response.js"

import {getModifiedFields} from "../helpers/logger.js"


const getData = async(req, res) => {
	const { uid } = req;
	
	const logs = await Log.find().sort({timestamp:-1});
	let changesArray = []

	for (const l of logs) {
	
		if(l.newData){
			const { oldValues, newValues }  = getModifiedFields( JSON.parse(l.prevData), JSON.parse(l.newData) );
			changesArray.push({
				userId:l.userId,
				action:l.action,
				timestamp: l.timestamp,
				prevData:JSON.stringify(oldValues),
				newData:JSON.stringify(newValues)
			})
		}else{
			changesArray.push({
				userId:l.userId,
				action:l.action,
				timestamp: l.timestamp
			})
		}
	}



	res.json({ logs:changesArray})
}




export {

	getData,
};
