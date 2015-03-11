'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    Answer = require('mongoose').model('Answer');

/**
 * AnswerSet Schema
 */
var AnswersetSchema = new Schema({
    survey: {
        type: Schema.ObjectId,
        ref: 'Survey'
    },
	answers: [Answer],
	respondent: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Answerset', AnswersetSchema);
