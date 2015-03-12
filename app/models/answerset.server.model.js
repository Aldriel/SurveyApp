'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * AnswerSet Schema
 */
var AnswersetSchema = new Schema({
    survey: {
        type: Schema.ObjectId,
        ref: 'Survey'
    },
	answers: [{
        type: Schema.ObjectId,
        ref: 'Answer'
    }],
	respondent: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Answerset', AnswersetSchema);
