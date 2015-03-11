'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    Question = require('mongoose').model('Question'),
    Answer = require('mongoose').model('Answer'),
    Page = require('mongoose').model('Page');

var AnswerSetSchema = new Schema({
    survey: {type: Schema.ObjectId,ref: 'Survey', required:true},
    respondent: {
        type: Schema.ObjectId,
        ref:'User', required: false
    },
    answers: [Answer]
});

mongoose.model('AnswerSet', AnswerSetSchema);

/**
 * Survey Schema
 */
var SurveySchema = new Schema({
	title: {
        type: String,
        default: '',
        required: 'Please fill Survey title',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Please fill Survey description',
        trim: true
    },
    status: {
        type: String,
        enum:['under construction', 'open', 'closed'],
        default: 'under construction'
    },
    pages:[
            {
                type: Schema.ObjectId,
                ref: 'Page'
            }
    ],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Survey', SurveySchema);
