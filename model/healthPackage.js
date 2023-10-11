const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Joi = require("joi");

const healthPackagesSchema = new mongoose.Schema({
  packageName: { type: String, required: true },
  price: { type: Number, required: true, min: 1},
  doctorDiscount: { type: Number, required: true, min: 1, max: 100 },
  pharmacyDiscount: { type: Number, required: true, min: 1, max: 100 },
  familyDiscount: { type: Number, required: true, min: 1, max: 100 },
});

const healthPackage = mongoose.model("HealthPackages", healthPackagesSchema);

function validateHealthPackage(toBeUpdatedHealthPackage) {
  const schema = Joi.object({
    packageName: Joi.string().required(),
    price: Joi.number().required().min(1),
    doctorDiscount: Joi.number().min(1).max(100).required(),
    pharmacyDiscount: Joi.number().min(1).max(100).required(),
    familyDiscount: Joi.number().min(1).max(100).required(),
  });
  return schema.validate(toBeUpdatedHealthPackage);
}

module.exports = {healthPackage, validateHealthPackage};
