const handler = require("../../helpers/handler");
const seriesService = require("../services/series-service");

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

const _findSeriesById = function (seriesID) {
    return seriesService.findSeriesById(seriesID, false);
}

const _deleteEpisode = function (series, seasonIndex, episodeIndex) {
    return seriesService.deleteEpisode(series, seasonIndex, episodeIndex);
}

const _updateEpisode = function (series, seasonIndex, episodeIndex, body) {
    return seriesService.updateEpisode(series, seasonIndex, episodeIndex, body);
}

const deleteEpisode = function (req, res) {
    seriesID = req.params.seriesID;
    seasonIndex = req.params.seasonIndex;
    episodeIndex = req.params.episodeIndex;

    _findSeriesById(seriesID)
        .then((series) => _deleteEpisode(series, seasonIndex, episodeIndex))
        .then((series) => _response(res, series))
        .catch((error) => _handleErrorResponse(res, error));
}

const updateEpisode = function (req, res) {
    const seriesID = req.params.seriesID;
    const episodeIndex = req.params.episodeIndex;
    const seasonIndex = req.params.seasonIndex;

    _findSeriesById(seriesID)
        .then((series) => _updateEpisode(series, seasonIndex, episodeIndex, req.body))
        .then((series) => _response(res, series))
        .catch((error) => _handleErrorResponse(res, error));
}

module.exports = {
    deleteEpisode,
    updateEpisode
}