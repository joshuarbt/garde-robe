type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return <h2 className={`label-caps ${className}`.trim()}>{children}</h2>;
}
