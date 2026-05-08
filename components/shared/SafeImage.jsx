const FALLBACK_IMAGE = "/images/placeholders/image-placeholder.svg";

export default function SafeImage({
  src,
  alt = "Nexarin image",
  className = "",
  fallback = FALLBACK_IMAGE,
  ...props
}) {
  const safeSrc = src || fallback;

  return (
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
