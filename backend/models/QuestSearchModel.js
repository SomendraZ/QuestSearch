import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blockSchema = new Schema({
  text: { type: String, required: true },
  showInOption: { type: Boolean, required: true },
  isAnswer: { type: Boolean, required: true },
});

const optionSchema = new Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, required: true },
});

const questionSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  siblingId: { type: Schema.Types.ObjectId },

  anagramType: { type: String, enum: ["WORD", "SENTENCE"] },
  blocks: [blockSchema],
  solution: { type: String },

  options: [optionSchema],
});

const QuestSearchModel = model("QuestSearch", questionSchema);

export default QuestSearchModel;
