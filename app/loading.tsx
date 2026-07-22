// État de chargement global — sobre, dans le vide de La Traversée.
export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#08060f",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#ff4ea8",
          boxShadow: "0 0 16px rgba(255,78,168,.7)",
          animation: "tx-pulse 1.4s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes tx-pulse { 0%,100% { opacity:.35 } 50% { opacity:1 } }`}</style>
    </div>
  );
}
