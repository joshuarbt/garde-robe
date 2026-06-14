import Image from "next/image";

type ItemImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ItemImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
}: ItemImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--surface-muted)] text-sm text-[var(--muted)] ${className}`}
      >
        No photo
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[var(--surface-muted)] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
