export interface CurrentImage {
  filename?: string;
  imageId?: string;
  url: string;
  croppedUrl?: string;
  size?: string;
  createdAt?: string;
}

export interface NewImage extends CurrentImage {
  croppedUrl: string;
}

export interface Transformations {
  crop: {
    left: number;
    top: number;
    width: number;
    height: number;
    unit: string;
  };
  resize: {
    height: number;
    width: number;
  };
}
