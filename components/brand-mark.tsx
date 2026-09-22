type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className="brand" aria-label="Tu compañero de IA">
      <span className="brand-symbol" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      {!compact && <span className="brand-name">tu compañero</span>}
    </span>
  );
}
