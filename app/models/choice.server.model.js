'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Choice Schema
 */
var ChoiceSchema = new Schema({
    text: {type: String, required:'The the text cannot be left empty'},
    type: {type: String, enum:['radio', 'checkbox', 'text', 'number', 'date']},
    order: Number,
    question: {
        type: Schema.ObjectId,
        ref: 'Question'
    },
	skipLogic: String
});

mongoose.model('Choice', ChoiceSchema);
