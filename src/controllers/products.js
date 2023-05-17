import Product from "../models/Product.js";
import {response} from"../helpers/response.js"
import XLSX from "xlsx"; 

const getOne = async (req, res)=>{
    const data = await Product.findOne({ _id:req.params.id})
	res.json(data);
}

const getAll = async (req, res)=>{
	const data = await Product.find()
	res.json({data});
}

const importFromExcel = async (req, res) =>{
	
	const wb = XLSX.readFile("./excel/listado-productos.xlsx"); 
    const sheets = wb.SheetNames;
    
    if(sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        console.log(data)

        /*await Product.insertMany(data).then(function (docs) {
			res.json(docs);
		})
		.catch(function (err) {
			res.status(500).send(err);
		}); */
    }
  
}

const exportFromExcel = async (req, res) =>{
	/*const movies = await Movie.findAll({
        attributes: [
            'id', 
            'movie', 
            'category', 
            'director', 
            'rating'
        ],
        raw: true
    }); 

    const headings = [
        ['Id', 'Movie', 'Category', 'Director', 'Rating']
    ]; 

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(movies, { 
        origin: 'A2', 
        skipHeader: true 
    });
    XLSX.utils.sheet_add_aoa(ws, headings); 
    XLSX.utils.book_append_sheet(wb, ws, 'Movies');

    const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' }); 
    res.attachment('movies.csv');

    return res.send(buffer);*/
}

const register = async (req, res)=>{
	const { name } = req.body;
	const product = await Product.findOne({ name });

	if (product) return response(res, 400, "producto ya registrado");

	try {
		const product = new Product(req.body);
		await product.save();
		res.json(product);
	} catch (error) {
		console.log(error);
		return response(res, 500, error);
	}
}

const update = async(req,res) => {
	
	const product = await Product.updateOne({ _id:req.params.id }, req.body);
	return product ? res.json(product) : response(res, 404, "El producto no existe");
}

const deleteData = async(req,res) => {
	const product = await Product.deleteOne({ _id:req.params.id });
	return product ? res.json(product) : response(res, 404, "El producto no existe");
}

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
	 importFromExcel
};