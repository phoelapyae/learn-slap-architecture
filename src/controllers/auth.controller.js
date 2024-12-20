const jwt = require("jsonwebtoken");
const utils = require("util");

const _verifyJWT = function (validToken) {
    const verify = utils.promisify(jwt.verify);
    return verify(validToken, process.env.JWT_KEY);
}

const _addTokenInRequest = function (req, jwt) {
    
    req.body.name = jwt.name;
    req.body.username = jwt.username;

    return new Promise((resolve, reject) => {
        resolve();
    })
}

const _getToken = function (req) {
    return new Promise((resolve, reject) => {
        if (req.headers.authorization)
        {
            const auth = req.headers.authorization;

            const authData = auth.split(" ");

            if (authData.length == 2)
            {
                resolve(authData[1]);
            }
            else
            {
                reject({ "error": process.env.ERR_INVALID_AUTH })
            }
        }
        else
        {
            reject({ "error": process.env.ERR_TOKEN });
        }
    });
}

const auth = function (req, res, next) {
    _getToken(req)
        .then((token) => _verifyJWT(token))
        .then((jwt) => _addTokenInRequest(req, jwt))
        .then(() => next())
        .catch(() => res.status(400).send({ "error": process.env.ERR_INVALID_TOKEN }));
}

module.exports = {
    auth
}