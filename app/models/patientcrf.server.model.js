'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Patientcrf Schema
 */
var PatientcrfSchema = new Schema({
	gender: {
        type: String,
        enum:['male', 'female']
    },
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
                ],
    diversion: {type: String, enum:['yes', 'no', 'unknown']}
});

mongoose.model('Patientcrf', PatientcrfSchema);
