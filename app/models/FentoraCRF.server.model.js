'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* Patient CRF Schema
*/

var FentoraPatientCRFSchema = new Schema({

});

mongoose.model('FentoraPatientCRF', FentoraPatientCRFSchema);

/**
 * Fentoracrf Schema
 */
var FentoracrfSchema = new Schema({
    physician: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    numberOfPatients: Number,
    currentPatientNumber: Number,
    currentPageIndex: Number,
    patientsCRFs:[FentoraPatientCRFSchema]
});

mongoose.model('Fentoracrf', FentoracrfSchema);
