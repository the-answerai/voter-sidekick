import * as React from "react";
import Image from "next/image";

import { cn } from "@/utils/tailwindMerge";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col p-4 rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(
  ({ className, ...props }, ref) =>
    props && (
      <h3
        ref={ref}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight mb-2",
          className
        )}
        {...props}
      />
    )
);
CardTitle.displayName = "CardTitle";

const CardSubTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardSubTitle.displayName = "CardSubTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

interface CardMediaProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt: string;
}

const CardMedia = React.forwardRef<HTMLElement, CardMediaProps>(
  ({ className, src, alt, ...props }, ref) => (
    <div className="relative w-full h-48">
      <Image fill className="object-cover" src={src} alt={alt} {...props} />
    </div>
  )
);
CardMedia.displayName = "CardMedia";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center mt-auto pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardSubTitle,
  CardDescription,
  CardContent,
  CardMedia,
};
