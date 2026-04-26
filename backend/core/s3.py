import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from loguru import logger
from core.cfg import cfg

class R2Client:
    def __init__(self):
        # boto3 client is thread-safe for presigned URL generation since it doesn't make network calls
        self.endpoint_url = f"https://{cfg.r2_account_id}.r2.cloudflarestorage.com"
        
        self.client = boto3.client(
            's3',
            endpoint_url=self.endpoint_url,
            aws_access_key_id=cfg.r2_access_key,
            aws_secret_access_key=cfg.r2_secret_key,
            config=Config(signature_version='s3v4'),
            region_name='auto'
        )

    def generate_upload_url(self, file_key: str, content_type: str, expiration: int = 3600) -> str:
        """
        Generates a presigned URL that the frontend can use to upload a file directly to R2.
        """
        try:
            response = self.client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': cfg.r2_bucket_name,
                    'Key': file_key,
                    'ContentType': content_type
                },
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logger.error(f"Failed to generate presigned upload URL: {e}")
            raise e

    def generate_download_url(self, file_key: str, expiration: int = 3600) -> str:
        """
        Generates a presigned URL for downloading/playing private media files.
        """
        # If we have a custom domain configured and the file is public, we can just return the custom domain URL.
        # But this function specifically handles private, presigned access.
        try:
            response = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': cfg.r2_bucket_name,
                    'Key': file_key
                },
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logger.error(f"Failed to generate presigned download URL: {e}")
            raise e

# Instantiate a single global client for DI
r2_service = R2Client()
