type SpinnerProps = {
  size?: number;
  color?: string;
  className?: string;
};

const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "#111827",
  className = ""
}) => {
  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        border: `${size * 0.15}px solid ${color}`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }}
    />
  );
};

export default LoadingSpinner;
