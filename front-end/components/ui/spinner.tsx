export default function Spinner() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-sm">
      <div className="relative w-12 h-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-600 rounded-full"
            style={{
              transform: `rotate(${i * 45}deg) translate(0, -16px)`,
              animation: `spinner-circle 1.2s linear infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes spinner-circle {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
