export const getFileExtra = (extra) => extra?.file;

export const buildFileExtra = (file) => ({ file });

export const getS3FileExtra = (extra) => extra?.s3File;

export const buildS3FileExtra = (s3File) => ({ s3File });

export const getEmbeddedLinkExtra = (extra) => extra?.embeddedLink;

export const buildEmbeddedLinkExtra = (embeddedLink) => ({ embeddedLink });
