const handler = require("../../helpers/handler");
const seriesService = require("../services/series-service");

const _getQueryData = function (req) {
    let offset = process.env.DEFAULT_OFFSET;
    let count = process.env.DEFAULT_COUNT;
    let query = "";

    if (req.query.count != null) {
        count = parseInt(req.query.count);
    }

    if (req.query.page != null) {
        let page = parseInt(req.query.page);
        offset = count * (page - 1);
    }

    if (req.query.q != null) {
        query = req.query.q;
    }

    return new Promise((resolve, reject) => {
        if (parseInt(count) > parseInt(process.env.DEFAULT_MAX_COUNT))
        {
            reject(process.env.OVER_LIMIT_TEXT);
        }
        else
        {
            resolve({
                "offset": offset,
                "count": count,
                "query": query
            });
        }
    });
}

const _findSeries = function (queryString) {
    let query = {};
    if (queryString.query != "") {
        query = {
            "title": {
                $regex: queryString.query,
                $options: "i"
            }
        }
    }
    return seriesService.findSeries(query, queryString.offset, queryString.count);
}

const _response = function (res, series) {
    let response = {
        status: 200,
        message: series
    };
    return handler.handleResponse(res, response);
}

const _handleErrorResponse = function (res, errorObject) {
    if (errorObject.status) {
        return handler.handleError(res, errorObject.error, errorObject.status);
    }
    return handler.handleError(res, errorObject);
}

const _pageSeries = function () {
    return seriesService.countSeries();
}

const _pageInfo = function (req, totalDocuments) {
    const currentPage = 1;
    let count = parseInt(process.env.DEFAULT_COUNT);
    let first = false;
    let last = false;

    if (req.query.page) {
        currentPage = req.query.page;
    }

    if (req.query.count) {
        currentPage = req.query.count;
    }

    let totalPage = Math.ceil(totalDocuments / count);
    if (currentPage == 1) {
        first = true;
    }
    else if (currentPage == totalPage) {
        last = true;
    }

    let response = {
        totalPage,
        first,
        last
    }

    return new Promise((resolve, reject) => {
        resolve(response);
    })
}

const _findSeriesById = function (req, seriesID) {
    if (req.query.less) {
        return seriesService.findSeriesById(seriesID, true);
    }
    return seriesService.findSeriesById(seriesID, false);
}

const _validateIsExist = function (series) {
    return new Promise((resolve, reject) => {
        if (series == null) {
            reject({ "error": process.env.RESOURCE_NOT_FOUND_TEXT, "status": 404 });
        }
        else
        {
            resolve(series);
        }
    })
}

const _seriesValidation = function (newSeries) {
    return seriesService.validateSeries(newSeries);
}

const _addSeries = function (newSeries) {
    return seriesService.addSeries(newSeries);
}

const findAll = function (req, res) {
    _getQueryData(req)
        .then((query) => _findSeries(query))
        .then((series) => _response(res, series))
        .catch((error) => _handleErrorResponse(res, error));
}

const getAllPages = function (req, res) {
    _pageSeries()
        .then((count) => _pageInfo(req, count))
        .then((pageInfo) => _response(res, pageInfo))
        .then((error) => _handleErrorResponse(res, error));
}

const findById = function (req, res) {
    const seriesID = req.params.seriesID;
    _findSeriesById(req, seriesID)
        .then((series) => _validateIsExist(series))
        .then((series) => _response(res, series))
        .catch((error) => _handleErrorResponse(res, error));
}

const add = function (req, res) {
    _seriesValidation(req.body)
        .then((newSeries) => _addSeries(newSeries))
        .then((series) => _response(res, series))
        .catch((error) => _handleErrorResponse(res, error));
}

module.exports = {
    findAll,
    getAllPages,
    findById,
    add
}