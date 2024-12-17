import S3Client from "aws-sdk/clients/s3";
import { type NextApiRequest, type NextApiResponse } from "next";

import { RequestBody } from "~enterprise/common/types/s3Types";

const s3Client = new S3Client({
  region: process.env.REGION_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4"
});

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { folderPath } = req.body as RequestBody;
    const bucketName = process.env.BUCKET_NAME;
    const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const path = `${env === "PROD" ? "leaveapp" : bucketName}/${folderPath}`;
    const fileParams = {
      Bucket: bucketName ?? "",
      Key: path ?? ""
    };

    const status = (await s3Client.deleteObject(fileParams).promise()).$response
      .httpResponse.statusCode;

    // This is due to deleteObject not returning response elements
    if (status >= 200 && status < 300) {
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(400).json({ message: "File deletion failed" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export default handleDelete;
