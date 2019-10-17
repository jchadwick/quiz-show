import React from "react";
import { observer } from "mobx-react-lite";

interface SlideProps {
  className?: string;
  slide: number;
}

export const Slide = observer(({ className, slide }: SlideProps) => {
  return (
    <div className={className}>
      <img
        alt={`Slide${slide}.jpg`}
        src={`/slides/Slide${slide}.jpg`}
        style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  );
});
