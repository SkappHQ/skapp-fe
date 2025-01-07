import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";

import {
  RequestBody,
  S3ActionTypes,
  S3SignedUrlActions
} from "~community/common/types/s3Types";

const s3 = new S3({
  region: process.env.REGION_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4"
});

const s3GetSignedUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { folderPath, type, action } = req.body as RequestBody;
    const bucketName = process.env.BUCKET_NAME;

    const path = `${bucketName}/${folderPath}`;
    let url = "";

    const fileParams = {
      Bucket: bucketName,
      Key: path,
      Expires: 300
    };

    if (action === S3ActionTypes.UPLOAD) {
      url = await s3.getSignedUrlPromise(S3SignedUrlActions.PUT_OBJECT, {
        ...fileParams,
        ContentType: decodeURIComponent(type ?? "")
      });
    } else if (action === S3ActionTypes.DOWNLOAD) {
      url = await s3.getSignedUrlPromise(
        S3SignedUrlActions.GET_OBJECT,
        fileParams
      );
    }
    res.status(200).json({ url });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export default s3GetSignedUrl;
