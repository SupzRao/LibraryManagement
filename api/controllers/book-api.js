const FormData = require('form-data');
const axios = require('axios');
const Helper = require('../helper/helper');
const fs = require('fs');
const rootPath="C:\\Suprada\\Node Project\\node-sample-project-1\\api\\book\\"
// to read env files
// require('dotenv').config()

exports.addBook = (req, res, next) => {
    try {
       
            //request body will have other form-data paramss
            console.log(req.body);
            book_isbn=Math.random().toString(36).slice(2)
            book_name=req.body.book_name
            quantity=req.body.quantity
            data={
                "BookName":book_name,
                "ISBN":book_isbn,
                "Quantity":quantity
            }
          Helper.writejson(data,rootPath+book_isbn+".json");
        

    }    
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.deleteBook = (req, res, next) => {
    try {
        
            //request body will have other form-data paramss
            console.log(req.body);
            book_isbn=req.body.book_isbn
            fs.unlinkSync(rootPath+book_isbn+".json");        
    }    
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.borrowBook = (req, res, next) => {
    try {
            var future = new Date();
            future.setDate(future.getDate() + 30);
            //request body will have other form-data paramss
            console.log(req.body);
            username=req.body.username
            book_isbn=req.body.book_isbn
            book_name=req.body.book_name
            quantity=req.body.quantity
            data={
                "UserName":username,
                "BookName":book_name,
                "ISBN":book_isbn,
                "Quantity":quantity,
                "DueDate":future.getDate()
            }
          Helper.writejson(data,rootPath+book_isbn+".json");       
    }    
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.process_log_dummy_api = (req, res, next) => {
    try {
        res.status(200).json({
            message: "successfully processed file",
            data: new Date()
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
};