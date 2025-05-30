// template for endpoints
import ErrorWrapper from "./errorWrapper";
import expressAsyncHandler from "express-async-handler";

// const name = expressAsyncHandler(async (req, res) => {
//     const { } = req.params;
//     const { } = req.query;
//     const { } = req.body;
//     try {
//         // endpoint Logic here
//         return res.status(200).json({
//             status: 200,
//             success: true,
//             result: {}
//         });
//     } catch (error) {
//         if (error instanceof ErrorWrapper) {
//             return res.status(error.code).json({
//                 status: error.code,
//                 success: false,
//                 error: {
//                     name: error.name,
//                     message: error.message,
//                 }
//             });
//         } else {
//             console.error(error);
//             return res.status(500).json({
//                 status: 500,
//                 success: false,
//                 error: {
//                     name: error.name,
//                     message: error.message,
//                 }
//             });
//         }
//     }
// })