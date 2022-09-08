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
            data: book_isbn
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

function updateBookRecord(filePath, quantity) {
    if (checkFileExists(filePath)) {
        let rawdata = fs.readFileSync(filePath);
        datastring = JSON.parse(rawdata);
        datastring.Quantity = quantity;
        Helper.writejson(datastring, filePath);
        return true;
    }
    return false;

}

function updateUserRecord(filePath, data) {
    if (checkFileExists(filePath)) {
        Helper.writejson(data, filePath);
        return true;
    }
    return false;

}
exports.updateBook = (req, res, next) => {
    try {

        //request body will have other form-data paramss
        console.log(req.body);
        book_isbn = req.body.ISBN;
        quantity = req.body.quantity
        filePath = rootPath + "book\\" + book_isbn + ".json";
        let datastring = ""
        if (updateBookRecord(filePath, quantity)) {
            res.status(200).json({
                message: "successfully updated quantity " + quantity
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
 
        username = req.body.username
        book_isbn = req.body.ISBN
        quantity = req.body.quantity
        filePath = rootPath + "book\\" + book_isbn + ".json";
        if (checkFileExists(filePath)) {
            let rawdata = fs.readFileSync(filePath);
            datastring = JSON.parse(rawdata);
            if (Number(datastring.Quantity) >= Number(quantity)) {
                data = {
                    "username": username,
                    "ISBN": book_isbn,
                    "quantity": quantity,
                    "duedate": future,
                    "isReturned":false

                }
                userFile=rootPath + "user\\" + username + "_" + book_isbn + ".json";
                console.log("user file "+userFile);
                Helper.writejson(data, userFile);
                //todo update book quantity api 
                updatedVal = datastring.Quantity - quantity;
                updateBookRecord(filePath, updatedVal);
                res.status(200).json({
                    message: "Your Due Date to return the  book is " + future,
                    data: datastring
                });
            } else {
                res.status(400).json({
                    message: "Requested book quantity is not in Stock..",
                    data: datastring

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
function isLater(dateString1, dateString2) {
    console.log(dateString1 + ' ' + dateString2);
    return new Date(dateString2) >= new Date(dateString1)
  }
exports.returnBook = (req, res, next) => {
    try {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 0);
 
        username = req.body.username
        book_isbn = req.body.ISBN
        filePath = rootPath + "book\\" + book_isbn + ".json";
        userFile=rootPath + "user\\" + username + "_" + book_isbn + ".json";
        if (checkFileExists(userFile) && checkFileExists(filePath)) {
            let rawdata = fs.readFileSync(userFile);
            userinfo = JSON.parse(rawdata);
            console.log(isLater(currentDate,userinfo.duedate));
            if(isLater(currentDate,userinfo.duedate))
            {
                userinfo.isReturned=true;
                updateUserRecord(userFile,userinfo);

                //update book quantity back to normal
                let rawdata = fs.readFileSync(filePath);
                bookInfo = JSON.parse(rawdata);
                updatedVal = Number(bookInfo.Quantity) + Number(userinfo.quantity);
                updateBookRecord(filePath, updatedVal);

                res.status(200).json({
                    message: "Book has been returned successfully on " ,
                    data: userinfo
                });

            }else{
                res.status(200).json({
                    message: "Due date has been crossed please pay Fine of Rupees 100",
                    data: new Date()
                });
            }
        } else {
            res.status(200).json({
                message: "This book is not valid",
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