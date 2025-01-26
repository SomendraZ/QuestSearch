import grpc from "@grpc/grpc-js";
import QuestSearchModel from "../models/QuestSearchModel.js";

const searchQuestions = async (call, callback) => {
  try {
    const { query, type, page = 1, limit = 10 } = call.request;

    let filter = {};
    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }
    if (type) {
      filter.type = type;
    }

    const skip = (page - 1) * limit;

    const questions = await QuestSearchModel.find(filter)
      .skip(skip)
      .limit(limit);

    const totalCount = await QuestSearchModel.countDocuments(filter);

    const response = {
      questions: questions.map((question) => ({
        id: question._id,
        type: question.type,
        title: question.title,
        siblingId: question.siblingId,
        anagramType: question.anagramType || "",
        blocks: question.blocks
          ? question.blocks.map((block) => ({
              text: block.text,
              showInOption: block.showInOption || false,
              isAnswer: block.isAnswer || false,
            }))
          : [],
        solution: question.solution || "",
        options: question.options
          ? question.options.map((option) => ({
              text: option.text,
              isCorrectAnswer: option.isCorrectAnswer || false,
            }))
          : [],
      })),
      total_count: totalCount,
      total_pages: Math.ceil(totalCount / limit),
      current_page: page,
      per_page: limit,
    };

    callback(null, response);
  } catch (error) {
    console.error("Error fetching questions:", error);
    callback({
      code: grpc.status.INTERNAL,
      details: "Server error, please try again later.",
    });
  }
};

const getUniqueTypes = async (_, callback) => {
  try {
    const uniqueTypes = await QuestSearchModel.distinct("type");

    if (!uniqueTypes || uniqueTypes.length === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "No unique types found",
      });
    }

    const typesWithCount = await Promise.all(
      uniqueTypes.map(async (type) => {
        const count = await QuestSearchModel.countDocuments({ type });
        return { type, count };
      })
    );

    callback(null, { types: typesWithCount });
  } catch (error) {
    console.error("Error fetching unique types:", error);
    callback({
      code: grpc.status.INTERNAL,
      details: "Server error, please try again later.",
    });
  }
};

export { searchQuestions, getUniqueTypes };
