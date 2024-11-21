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
    console.log("NewSeries ************** ", newSeries);
    
    return this.findSeriesById(seriesID)
        .then((series) => {
            series.title = newSeries.title;
            // series.year = newSeries.year;
            // series.rate = newSeries.rate;
            // series.channel = newSeries.channel;
            // series.seasons = newSeries.seasons;
            return series.save();
        });
}

module.exports = {
    findSeries,
    countSeries,
    findSeriesById,
    validateSeries,
    addSeries,
    deleteSeriesById,
    findSeriesByIdAndUpdate,
    findSeriesByIdAndReplace
}