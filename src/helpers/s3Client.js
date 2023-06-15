import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
dotenv.config("../../.env")
const REGION = "us-east-1";

const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY 

const s3Client = new S3Client({ 
    region: REGION,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
    
});

console.log(s3Client)

export { s3Client };