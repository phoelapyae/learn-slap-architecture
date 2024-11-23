const mongoose = require("mongoose");
const Series = mongoose.model(process.env.SERIES_MODEL);

const findSeries = function (query, offset, limit) {
    return Series.find(query, "_id title first_air_date rate poster")
        .skip(offset)
        .limit(limit)
        .exec();
}

const countSeries = function () {
    return Series.countDocuments();
}

const findSeriesById = function (seriesID, less) {
    if (less) {
        return Series.findById(seriesID, '_id title first_air_date rate poster description origin_country').exec();
    }
    return Series.findById(seriesID).exec();
}

const validateSeries = function (newSeries) {
    return new Promise((resolve, reject) => {
        Series.validate(newSeries)
            .then(() => {
                resolve(newSeries)
            })
            .catch((error) => {
                reject(error);
            })
    });
}

const addSeries = function (newSeries) {
    return Series.create(newSeries);
}

const deleteSeriesById = function (seriesID) {
    return Series.findByIdAndDelete(seriesID);
}

const findSeriesByIdAndUpdate = function (seriesID, series) {
    return Series.findByIdAndUpdate(seriesID, series).exec();
}

const findSeriesByIdAndReplace = function (seriesID, newSeries) {
    return this.findSeriesById(seriesID)
        .then((series) => {
            series.title = newSeries.title;
            series.year = newSeries.year;
            series.rate = newSeries.rate;
            series.channel = newSeries.channel;
            series.genres = newSeries.genres;
            series.seasons = newSeries.seasons;
            return series.save();
        });
}

const deleteEpisode = function (series, seasonIndex, episodeIndex) {
    let seasons = series.seasons[seasonIndex];
    seasons.episodes.splice(episodeIndex, 1);
    series.seasons[seasonIndex] = seasons;
    return series.save();
}

const updateEpisode = function (series, seasonIndex, episodeIndex, body) {
    let season = series.seasons[seasonIndex];
    
    season.episodes[episodeIndex].episode_number = body.episode_number;
    season.episodes[episodeIndex].name = body.name;
    season.episodes[episodeIndex].overview = body.overview;
    season.episodes[episodeIndex].image = body.image;
    series.seasons[seasonIndex] = season;
    return series.save();
}

module.exports = {
    findSeries,
    countSeries,
    findSeriesById,
    validateSeries,
    addSeries,
    deleteSeriesById,
    findSeriesByIdAndUpdate,
    findSeriesByIdAndReplace,
    deleteEpisode,
    updateEpisode
}