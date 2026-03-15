export default function LineLoader() {
    return (
        <div className="w-full h-[5px] bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[shimmer_1.5s_infinite]"></div>

            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}