const mongoose = require('mongoose');
const Joi = require('joi-oid');
const medicineSchema = new mongoose.Schema({
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    medUse: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    sales: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    needPres: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  });
  function validateMedicine(newPrescription){
    const schema = Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        description: Joi.string().required(),
        medUse: Joi.string().required(),
        quantity: Joi.string().required(),
        sales: Joi.string().required(),
        price:Joi.string().required(),
        needPres: Joi.Boolean().required(),
        archived: Joi.Boolean().required(),
      });
    return schema.validate(newPrescription);
}
const medicine = mongoose.model('Medicine', medicineSchema);
module.exports={medicine,validateMedicine};