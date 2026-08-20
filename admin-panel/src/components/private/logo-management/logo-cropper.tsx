"use client";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { CircleX, Save } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  imgSrc: string;
  setImgSrc: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  onClose: () => void;
}

export const LogoImageCropper = ({
  setFieldValue,
  imgSrc,
  setImgSrc,
  isOpen,
  onClose,
}: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    if (!imgSrc || !croppedAreaPixels) return;

    const image = await createImage(imgSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 🔥 upscale factor to increase clarity (try 2–4 depending on how HD you want)
    const upscaleFactor = 6;

    const outputWidth = croppedAreaPixels.width * upscaleFactor;
    const outputHeight = croppedAreaPixels.height * upscaleFactor;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.scale(upscaleFactor, upscaleFactor);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.save();

    // Circular crop mask
    ctx.beginPath();
    ctx.arc(
      croppedAreaPixels.width / 2,
      croppedAreaPixels.height / 2,
      Math.min(croppedAreaPixels.width, croppedAreaPixels.height) / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    ctx.restore();

    // ⬇️ Convert canvas to ultra-HD Blob (use PNG or WebP)
    return new Promise<void>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const croppedUrl = URL.createObjectURL(blob);
          setFieldValue("profilePhoto", croppedUrl);
          setFieldValue(
            "profilePhotoFile",
            new File([blob], "logo.webp", { type: "image/webp" }) // use webp for sharper quality
          );

          onClose();
          resolve();
        },
        "image/webp", // or "image/png" for lossless
        1.0 // full quality
      );
    });
  }, [imgSrc, croppedAreaPixels, setFieldValue, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-5 lg:p-10"
    >
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Crop Profile Picture
      </h4>
      <div className="flex flex-col items-center">
        {imgSrc && (
          <div className="relative w-[300px] h-[300px] bg-black/10 rounded-full overflow-hidden">
            <Cropper
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {/* Zoom slider */}
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full mt-6 accent-blue-500"
        />

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
            onClick={createCroppedImage}
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

// Utility function to load image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // avoid CORS issues
    image.src = url;
  });
