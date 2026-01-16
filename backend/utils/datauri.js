// import DataUriParser from "datauri/parser.js";
// import path from "path";

// const parser = new DataUriParser();

// const getDataUri = (file)=>{
//     const extName = path.extname(file.originalName).toString();
//     return parser.format(extName, file.buffer).content;
// };
// export default getDataUri;




import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const getDataUri = (file) => {
  const extName = path.extname(file.originalname); // e.g., .jpg
  return parser.format(extName, file.buffer).content; // data URI
};

export default getDataUri;
