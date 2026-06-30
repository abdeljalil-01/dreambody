import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const sizes = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 56, height: 56 },
};

export function Logo({ className, showText = true, size = "md", priority = false }: LogoProps) {
  const dim = sizes[size];

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        alt="DreamBody"
        width={dim.width}
        height={dim.height}
        className="object-contain"
        priority={priority}
        sizes={`${dim.width}px`}
      />
      {showText && (
        <span className="font-inter text-lg font-bold tracking-tight">
          <span className="text-foreground">Dream</span>
          <span className="text-primary">Body</span>
        </span>
      )}
    </Link>
  );
}
