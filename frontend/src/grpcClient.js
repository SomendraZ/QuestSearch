import { QuestSearchServiceClient } from "./QuestSearch_grpc_web_pb";
import { QuestionRequest, Empty } from "./QuestSearch_pb";

const client = new QuestSearchServiceClient("localhost:9090", null, null);

// Function to get questions
export const getQuestions = (query, type, page, limit) => {
  return new Promise((resolve, reject) => {
    const request = new QuestionRequest();
    request.setQuery(query);
    request.setType(type);
    request.setPage(page);
    request.setLimit(limit);

    client.getQuestions(request, {}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response.toObject());
      }
    });
  });
};

// Function to get unique types
export const getUniqueTypes = () => {
  return new Promise((resolve, reject) => {
    const request = new Empty();

    client.getUniqueTypes(request, {}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response.toObject());
      }
    });
  });
};
