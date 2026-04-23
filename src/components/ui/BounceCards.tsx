"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import "./BounceCards.css";

interface BounceCardsProps {
  className?: string;
  images: string[];
  titles?: string[];
  descriptions?: string[];
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
  titles = [],
  descriptions = [],
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      const el = card as HTMLElement;
      if (i === hoveredIndex) {
        el.style.zIndex = "10";
        gsap.to(card, {
          transform: getNoRotationTransform(transformStyles[i] || ""),
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      } else {
        el.style.zIndex = "1";
        const distance = Math.abs(i - hoveredIndex);
        // Each card gets a cumulative push: closer cards push more,
        // but every card gets at least 80px so none hide behind others
        const pushDistance = Math.max(80, 180 / distance) + (distance - 1) * 40;
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
      const el = card as HTMLElement;
      el.style.zIndex = "";
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
              setHoveredIndex(i);
              pushSiblings(i);
              onHover?.(i);
            }
          }}
          onMouseLeave={() => {
            if (enableHover) {
              setHoveredIndex(null);
              resetSiblings();
              onHover?.(null);
            }
          }}
        >
          <img className="image" src={src} alt="" />
          {/* Hover overlay with title + description */}
          <div className={`card-overlay${hoveredIndex === i ? " card-overlay--active" : ""}`}>
            {titles[i] && <span className="card-overlay-title">{titles[i]}</span>}
            {descriptions[i] && <p className="card-overlay-desc">{descriptions[i]}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
