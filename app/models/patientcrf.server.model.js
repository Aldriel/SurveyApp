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
	name: {
		type: String,
		default: '',
		required: 'Please fill Patientcrf name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Patientcrf', PatientcrfSchema);