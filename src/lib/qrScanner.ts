import jsQR from "jsqr";

type QrDecodeOptions = {
  cropRatio?: number;
  maxDimension?: number;
};

export function decodeQrFromVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: QrDecodeOptions = {},
) {
  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    return null;
  }

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  if (!videoWidth || !videoHeight) {
    return null;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const cropRatio = Math.min(1, Math.max(0.5, options.cropRatio ?? 0.82));
  const maxDimension = Math.max(240, options.maxDimension ?? 720);

  const sourceWidth = Math.max(1, Math.floor(videoWidth * cropRatio));
  const sourceHeight = Math.max(1, Math.floor(videoHeight * cropRatio));
  const sourceX = Math.max(0, Math.floor((videoWidth - sourceWidth) / 2));
  const sourceY = Math.max(0, Math.floor((videoHeight - sourceHeight) / 2));
  const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
  const targetWidth = Math.max(1, Math.floor(sourceWidth * scale));
  const targetHeight = Math.max(1, Math.floor(sourceHeight * scale));

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  const imageData = context.getImageData(0, 0, targetWidth, targetHeight);
  return jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });
}