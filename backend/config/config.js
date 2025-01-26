import dotenv from "dotenv";
dotenv.config();

export const PROTO_PATH = "./QuestSearch.proto";

export const GRPC_HOST = process.env.GRPC_HOST || "localhost:50051";

export const PROTO_FILE_LOAD_OPTIONS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
