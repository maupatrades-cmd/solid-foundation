import logoAsset from "@/assets/marketing-io-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  glow = false,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <img
      src={logoAsset.url}
      alt="Marketing iO"
      className={cn("object-contain", className)}
      style={
        glow
          ? {
              filter:
                "drop-shadow(0 0 18px rgba(10,31,68,0.55)) drop-shadow(0 0 36px rgba(230,57,70,0.40)) brightness(1.05)",
            }
          : undefined
      }
    />
  );
}
