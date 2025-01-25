"use client";

import { Param } from "drizzle-orm";
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

function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

export function CroppedImage({ src, alt, defaultCrop }: CroppedImageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [rotation, setRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const { width, height } = calculateAspectRatioFit(
        img.naturalWidth,
        img.naturalHeight,
        700, // container width
        700, // container height
      );
      setDimensions({ width, height });
      setScale(Math.max(700 / width, 700 / height));
    };

    const rotations = [0, 90, 180, 270];
    const randomRotation =
      rotations[Math.floor(Math.random() * rotations.length)];
    setIsMounted(true);
    setRotation(randomRotation!);

    setCrop({
      unit: "%",
      x: 50,
      y: 50,
      width: 60, // slightly smaller crop area
      height: 60,
      ...(defaultCrop && {
        x: defaultCrop.x,
        y: defaultCrop.y,
        width: defaultCrop.width,
        height: defaultCrop.height,
      }),
    });
  }, [src]);

  if (!isMounted) return <div className="h-64 w-64" />;

  return (
    <div className="relative h-[350px] w-[350px] overflow-hidden rounded-lg border-2 border-gray-700">
      {crop && (
        <div className="relative h-full w-full">
          <img
            src={src}
            alt={alt}
            className="absolute transform object-cover"
            style={{
              maxWidth: "none",
              maxHeight: "none",
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transform: `translate(-${crop.x}%, -${crop.y}%) scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              imageRendering: "auto", // Changed from pixelated for better quality
            }}
          />
        </div>
      )}
    </div>
  );
}
