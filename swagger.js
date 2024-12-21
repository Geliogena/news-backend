import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger-output.json"; 
const endpointsFiles = ["./routes/newsRoutes.ts", "./routes/authRoutes.ts", "./routes/protectedRoutes.ts"]; 

const doc = {
  info: {
    title: "News API",
    description: "Документація API новинного сервісу",
  },
  host: "localhost:8000", 
  schemes: ["http"],
};

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log("Документацію згенеровано!");
});