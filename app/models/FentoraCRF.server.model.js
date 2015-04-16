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
    doctor: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    gender: {type: String, enum:['male', 'female']},
    dateOfBirth: Date,
    firstPrescriptionDate: Date,
    lastPrescriptionDate: Date,
    isOngoing:  {type: String, enum:['yes', 'no', 'unknown']},
    dailyDosage: Number,
    patientsCondition: String,
    otherOpioids: [
        {
            name: String,
            dailyDosage: Number,
            startDate: Date,
            endDate: {
                type: Date,
                required: false
            },
            isOngoing:  {type: String, enum:['yes', 'no', 'unknown']}
        }
    ],
    concomitantTreatments: [String],
    abusePreventionPractices:[String],
    patientBehaviours:[
        {
            behaviour: String,
            isPresent: {type: String, enum: ['yes', 'no', 'unknown']}
        }
    ]
});

mongoose.model('FentoraPatientCRF', FentoraPatientCRFSchema);

/**
 * Fentoracrf Schema
 */
var FentoracrfSchema = new Schema({
    doctor: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    numberOfPatients: Number,
    currentPatientNumber: Number,
    currentPage: Number,
    patientsCRFs:[FentoraPatientCRFSchema]
});

mongoose.model('Fentoracrf', FentoracrfSchema);
