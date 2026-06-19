import path from "path";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

type UploadResult = {
  key?: string;
  url: string;
};

type PresignedUploadResult = {
  key: string;
  presignedUrl: string;
  expiresIn: number;
};

const isDevelopment = process.env.NODE_ENV === "development";

let s3Client: S3Client | null = null;

function getS3Client() {
  if (s3Client) {
    return s3Client;
  }

  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing AWS upload configuration. Expected AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY",
    );
  }

  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3Client;
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^\w.\-]/g, "-");
}

function buildS3ObjectKey(creatorId: string, filename: string) {
  const safeFilename = sanitizeFilename(filename);
  const extension = path.extname(safeFilename);
  const basename = path.basename(safeFilename, extension);

  return ["uploads", creatorId, `${Date.now()}-${basename}${extension}`].join(
    "/",
  );
}

function buildS3PublicUrl(key: string) {
  const customBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;

  if (customBaseUrl) {
    return `${customBaseUrl.replace(/\/$/, "")}/${key}`;
  }

  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;

  if (!bucket || !region) {
    throw new Error(
      "Missing AWS_S3_BUCKET or AWS_REGION for S3 public URL generation",
    );
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

class UploadService {
  async uploadMedia(
    creatorId: string,
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    if (isDevelopment) {
      if (!file.filename) {
        throw new Error("Local upload failed: file was not written to disk");
      }

      return {
        url: `/uploads/${creatorId}/${file.filename}`,
      };
    }

    if (!file.buffer?.length) {
      throw new Error("S3 upload failed: file buffer was not available");
    }

    const bucket = process.env.AWS_S3_BUCKET;

    if (!bucket) {
      throw new Error("Missing AWS_S3_BUCKET for production uploads");
    }

    const key = buildS3ObjectKey(creatorId, file.originalname);

    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        creatorId,
        source: "wellspring-admin",
      },
    };

    await getS3Client().send(new PutObjectCommand(uploadParams));

    return {
      key,
      url: buildS3PublicUrl(key),
    };
  }

  async generatePresignedUploadUrl(
    creatorId: string,
    filename: string,
    contentType: string,
    expiresIn = 900,
  ): Promise<PresignedUploadResult> {
    if (isDevelopment) {
      throw new Error(
        "Presigned upload URLs are only supported in production mode.",
      );
    }

    const bucket = process.env.AWS_S3_BUCKET;

    if (!bucket) {
      throw new Error("Missing AWS_S3_BUCKET for presigned uploads");
    }

    const key = buildS3ObjectKey(creatorId, filename);
    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      Metadata: {
        creatorId,
        source: "wellspring-admin",
      },
    };

    const s3Client: any = getS3Client();
    const presignedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(uploadParams),
      {
        expiresIn,
      },
    );

    return {
      key,
      presignedUrl,
      expiresIn,
    };
  }
}

export default new UploadService();
