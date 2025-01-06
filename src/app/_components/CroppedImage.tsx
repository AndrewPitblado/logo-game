"use client";

import { useState, useEffect } from "react";
import ReactCrop, { defaultCrop, type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CroppedImageProps {
  src: string;
  alt: string;
  defaultCrop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export function CroppedImage({ src, alt, defaultCrop }: CroppedImageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setCrop({
      unit: "%",
      x: 30,
      y: 30,
      width: 20,
      height: 20,
      ...(defaultCrop && {
        x: defaultCrop.x,
        y: defaultCrop.y,
        width: defaultCrop.width,
        height: defaultCrop.height,
      }),
    });
  }, [defaultCrop]);

  if (!isMounted) return <div className="h-64 w-64" />;

  return (
    <div className="relative h-[350px] w-[350px] overflow-hidden rounded-lg border-2 border-gray-700">
      {crop && (
        <div className="relative h-full w-full">
          <img
            src={src}
            alt={alt}
            className="absolute left-1/2 top-1/2 max-h-[90%] max-w-[90%] -translate-x-1/2 -translate-y-1/2 transform object-contain"
            style={{
              transform: `translate(-${crop.x / 0.5}%, -${crop.y / 0.5}%) 
              scale(2.5)
              rotate(-90deg)`,
              transformOrigin: "center center",
            }}
          />
        </div>
      )}
    </div>
  );
}
