const FormData = require('form-data');
const axios = require('axios');
const Helper = require('../helper/helper');
const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');
const {
    log
} = require('console');

const rootPath = ""
// to read env files
// require('dotenv').config()

exports.addBook = (req, res, next) => {
    try {

        //request body will have other form-data paramss
        console.log(req.body);
        book_isbn = uuidv4();
        book_name = req.body.book_name
        quantity = req.body.quantity
        data = {
            "BookName": book_name,
            "ISBN": book_isbn,
            "Quantity": quantity
        }
        filePath = rootPath + "book\\" + book_isbn + ".json";

        Helper.writejson(data, filePath);
        res.status(200).json({
            message: "successfully added new book named " + book_name,
            data: new Date()
        });

    } catch (err) {
        console.trace(err);
        res.status(500).json({
            error: err
        });
    }
};
exports.getBook = (req, res, next) => {
    try {
        if (typeof req.query.ISBN === "undefined" || req.query.ISBN === null) {
            res.status(417).json({
                message: "Please mention ISBN to get book"
            });
        } else {
            book_isbn = req.query.ISBN
            filePath = rootPath + "book\\" + book_isbn + ".json";
            if (checkFileExists(filePath)) {
                let rawdata = fs.readFileSync(filePath);
                datastring = JSON.parse(rawdata);
                res.status(200).json({
                    message: "successfully updated book ",
                    data: datastring
                });
            } else {
                res.status(400).json({
                    message: "File is not present",
                    data: filePath
                });
            }
        }
    } catch (err) {
        console.trace(err);
        res.status(500).json({
            error: err
        });
    }
};
exports.updateBook = (req, res, next) => {
    try {

        //request body will have other form-data paramss
        console.log(req.body);
        book_isbn = req.body.ISBN;
        quantity = req.body.quantity
        filePath = rootPath + "book\\" + book_isbn + ".json";
        let datastring = ""
        if (checkFileExists(filePath)) {
            let rawdata = fs.readFileSync(filePath);
            datastring = JSON.parse(rawdata);
            datastring.Quantity = quantity;
            Helper.writejson(datastring, filePath);
            res.status(200).json({
                message: "successfully updated book ",
                data: datastring
            });
        } else {
            res.status(400).json({
                message: "File is not present",
                data: filePath
            });
        }



    } catch (err) {
        console.trace(err);
        res.status(500).json({
            error: err
        });
    }
};

exports.deletebook = (req, res, next) => {
    try {

        //request body will have other form-data paramss
        console.log(req.query.ISBN);
        if (typeof req.query.ISBN === "undefined" || req.query.ISBN === null) {
            res.status(417).json({
                message: "Please mention ISBN to delete book"
            });
        } else {
            book_isbn = req.query.ISBN
            filePath = rootPath + "book\\" + book_isbn + ".json";

            if (checkFileExists(filePath)) {
                fs.unlinkSync(filePath);
                res.status(200).json({
                    message: "Book has been deleted successfully " + book_isbn + ".json",
                    data: new Date()
                });
            } else {
                res.status(417).json({
                    message: "Book Not Found with matching ISBN"
                });
            }
        }

    } catch (err) {
        console.trace(err)
        res.status(500).json({
            error: err
        });
    }
};

function checkFileExists(filePath) {
    if (fs.existsSync(filePath))
        return true;
    else return false;
}
exports.borrowBook = (req, res, next) => {
    try {
        var future = new Date();
        future.setDate(future.getDate() + 30);
        //request body will have other form-data paramss
        console.log(req.body);
        username = req.body.username
        book_isbn = req.body.ISBN
        quantity = req.body.quantity
        filePath = rootPath + "book\\" + book_isbn + ".json";
        if (checkFileExists(filePath)) {
            let rawdata = fs.readFileSync(filePath);
            datastring = JSON.parse(rawdata);
            if (datastring.Quantity != null && datastring.Quantity >= quantity) {
                data = {
                    "username": username,
                    "ISBN": book_isbn,
                    "quantity": quantity,
                    "duedate": future
                }
                Helper.writejson(data, rootPath + "user\\" + username + "_" + book_isbn + ".json");

                //todo update book quantity api 
                res.status(200).json({
                    message: "Your Due Date to return the  book is " + future,
                    data: new Date()
                });
            } else {
                res.status(400).json({
                    message: "Requested book is not in Stock..",
                    data: new Date()
                });
            }
        } else {
            res.status(200).json({
                message: "Requested book is not in Stock",
                data: new Date()
            });
        }


    } catch (err) {
        console.trace(err);
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
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};