import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";
dotenv.config();

const PROTO_PATH = "./QuestSearch.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const questSearchProto =
  grpc.loadPackageDefinition(packageDefinition).QuestSearch;

const client = new questSearchProto.QuestSearchService(
  "127.0.0.1:9090",
  grpc.credentials.createInsecure()
);

// GetQuestions Request
const getQuestionsRequest = {
  query: "math",
  type: "MCQ",
  page: 1,
  limit: 5,
};

client.GetQuestions(getQuestionsRequest, (error, response) => {
  if (error) {
    console.error("Error fetching questions:", error);
  } else {
    console.log("Questions Response:", response);
  }
});

// GetUniqueTypes Request
const getUniqueTypesRequest = {};

client.GetUniqueTypes(getUniqueTypesRequest, (error, response) => {
  if (error) {
    console.error("Error fetching unique types:", error);
  } else {
    console.log("Unique Types Response:", response);
  }
});
