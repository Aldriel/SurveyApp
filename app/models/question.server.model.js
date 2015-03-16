'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Choice = mongoose.model('Choice');


var QuestionSchema = new Schema({
    text: String,
    number: Number,
    answerRequired: {
        type: Boolean,
        default:true
    },
    type: {type: String, enum:['radio', 'checkbox', 'text', 'number', 'date']},
    choices: [{
        type: Schema.ObjectId,
        ref: 'Choice'
    }],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    page: {
        type: Schema.ObjectId,
        ref: 'Page'
    }
});

mongoose.model('Question', QuestionSchema);
