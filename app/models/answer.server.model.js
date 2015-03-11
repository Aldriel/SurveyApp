'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
    question: {type: Schema.ObjectId,ref: 'Question', required:true},
    answer: [String]
});

mongoose.model('Answer', AnswerSchema);



