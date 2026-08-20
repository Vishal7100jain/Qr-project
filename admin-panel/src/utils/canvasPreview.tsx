import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { CircleX, Save } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // Create circular mask
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2 / pixelRatio,
    canvas.height / 2 / pixelRatio,
    Math.min(canvas.width, canvas.height) / 2 / pixelRatio,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.clip();

  const rotateRads = rotate * (Math.PI / 180);
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.rotate(rotateRads);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

export const ImageCropper = ({
  setFieldValue,
  imgSrc,
  setImgSrc,
  isOpen,
  onClose,
}: {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  imgSrc: string;
  setImgSrc: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Image crop states
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const handleCropAccept = () => {
    if (imgRef.current && previewCanvasRef.current && completedCrop) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        1,
        0
      );

      previewCanvasRef.current.toBlob(
        (blob) => {
          if (!blob) {
            return;
          }
          const croppedImageUrl = URL.createObjectURL(blob);
          setFieldValue("profilePhoto", croppedImageUrl);
          setFieldValue(
            "profilePhotoFile",
            new File([blob], "profile.jpg", { type: "image/jpeg" })
          );
          setImgSrc("");
          onClose();
        },
        "image/jpeg",
        0.9
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose} // Use the passed onClose
      className="max-w-[600px] p-5 lg:p-10"
    >
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Crop Profile Picture
      </h4>
      <div className="flex flex-col items-center">
        {imgSrc && (
          <div className="relative">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}
              aspect={1}
              className="max-h-[50vh] rounded-full"
              ruleOfThirds
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-w-full max-h-[50vh]"
              />
            </ReactCrop>
          </div>
        )}
        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onClose}
            startIcon={<CircleX />}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="md"
            onClick={handleCropAccept}
            variant="primary"
            startIcon={<Save />}
          >
            Save Crop
          </Button>
        </div>
      </div>
      <canvas ref={previewCanvasRef} className="hidden" />
    </Modal>
  );
};
