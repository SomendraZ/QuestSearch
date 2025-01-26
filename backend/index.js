import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import {
  getUniqueTypes,
  searchQuestions,
} from "./controllers/QuestSearchController.js";

const PROTO_PATH = process.env.PROTO_PATH;
const GRPC_HOST = process.env.GRPC_HOST;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const questSearchProto =
  grpc.loadPackageDefinition(packageDefinition).QuestSearch;

const server = new grpc.Server();

connectDB()
  .then(() => {
    if (questSearchProto && questSearchProto.QuestSearchService) {
      server.addService(questSearchProto.QuestSearchService.service, {
        GetQuestions: searchQuestions,
        GetUniqueTypes: getUniqueTypes,
      });

      server.bindAsync(
        GRPC_HOST,
        grpc.ServerCredentials.createInsecure(),
        () => {
          console.log(`gRPC server running at ${GRPC_HOST}`);
        }
      );
    } else {
      console.error("Failed to load QuestSearch service.");
    }

    process.on("SIGINT", () => {
      console.log("Received SIGINT. Shutting down server gracefully...");

      server.tryShutdown((err) => {
        if (err) {
          console.error("Error during shutdown:", err);
        } else {
          console.log("Server shut down gracefully.");
        }
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      console.log("Received SIGTERM. Shutting down server gracefully...");
      server.tryShutdown((err) => {
        if (err) {
          console.error("Error during shutdown:", err);
        } else {
          console.log("Server shut down gracefully.");
        }
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
