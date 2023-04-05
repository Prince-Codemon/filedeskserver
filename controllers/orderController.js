const Order = require('../model/Order')
const create = async (req,res)=>{
    try{
        console.log('hi');
        // console.log(req.body.files);
        // console.log(req.body.files[0]);
        // console.log(req.body.file);
        console.log(req.body.data);
        console.log(req.body.delivery);
        console.log(req.body.totalPrice);
        console.log(req.body.totalPages);
        console.log(req.body.address);
        console.log(req.body.totalFiles);
        console.log(req.body.subTotalPrice);
        res.status(201).json({msg:'success'});
    }catch(err){
        res.status(500).json({err});
    }
}





module.exports ={
    create
}