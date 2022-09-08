const fs = require('fs');


class Helper
{
    static writejson(data,filename)
    {
        let datastring = JSON.stringify(data);
        fs.writeFileSync(filename, datastring);
    }
}
module.exports = Helper;
