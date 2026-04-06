"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import "./BounceCards.css";

interface BounceCardsProps {
  className?: string;
  images: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
  onHover?: (index: number | null) => void;
}

export default function BounceCards({
  className = "",
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  transformStyles = [
    "rotate(10deg) translate(-170px)",
    "rotate(5deg) translate(-85px)",
    "rotate(-3deg)",
    "rotate(-10deg) translate(85px)",
    "rotate(2deg) translate(170px)",
  ],
  enableHover = true,
  onHover,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".card");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { scale: 0 },
      {
        scale: 1,
        stagger: animationStagger,
        ease: easeType,
        delay: animationDelay,
      }
    );
  }, [animationDelay, animationStagger, easeType]);

  const getNoRotationTransform = (transform: string) => {
    return transform.replace(/rotate\([^)]*\)/, "rotate(0deg)");
  };

  const getPushedTransform = (
    transform: string,
    pushDistance: number,
    direction: number
  ) => {
    const translateMatch = transform.match(/translate\(([^)]*)\)/);
    if (translateMatch) {
      const currentTranslate = parseFloat(translateMatch[1]);
      const newTranslate = currentTranslate + pushDistance * direction;
      return transform.replace(
        /translate\([^)]*\)/,
        `translate(${newTranslate}px)`
      );
    }
    return `${transform} translate(${pushDistance * direction}px)`;
  };

  const pushSiblings = (hoveredIndex: number) => {
    const cards = containerRef.current?.querySelectorAll(".card");
    if (!cards) return;

    cards.forEach((card, i) => {
      if (i === hoveredIndex) {
        gsap.to(card, {
          transform: getNoRotationTransform(transformStyles[i] || ""),
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      } else {
        const distance = Math.abs(i - hoveredIndex);
        const pushDistance = 60 / distance;
        const direction = i < hoveredIndex ? -1 : 1;
        gsap.to(card, {
          transform: getPushedTransform(
            transformStyles[i] || "",
            pushDistance,
            direction
          ),
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      }
    });
  };

  const resetSiblings = () => {
    const cards = containerRef.current?.querySelectorAll(".card");
    if (!cards) return;

    cards.forEach((card, i) => {
      gsap.to(card, {
        transform: transformStyles[i] || "",
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    });
  };

  return (
    <div
      ref={containerRef}
      className={`bounceCardsContainer ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`card card-${i}`}
          style={{ transform: transformStyles[i] || "" }}
          onMouseEnter={() => {
            if (enableHover) {
              pushSiblings(i);
              onHover?.(i);
            }
          }}
          onMouseLeave={() => {
            if (enableHover) {
              resetSiblings();
              onHover?.(null);
            }
          }}
        >
          <img className="image" src={src} alt="" />
        </div>
      ))}
    </div>
  );
}
