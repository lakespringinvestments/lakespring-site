// Fixed ambient background layer — soft teal radial glows that sit behind all
// page content. Renders once in the root layout. Pointer-events-none so it never
// interferes with interaction; -z-10 keeps it beneath everything.
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-cream-50"
    >
      {/* Top-right sage glow */}
      <div
        className="absolute"
        style={{
          top: "-200px",
          right: "-200px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(29, 158, 117, 0.10) 0%, rgba(29, 158, 117, 0) 70%)",
        }}
      />
      {/* Mid-left deep teal glow */}
      <div
        className="absolute"
        style={{
          top: "30%",
          left: "-250px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(3, 65, 71, 0.07) 0%, rgba(3, 65, 71, 0) 70%)",
        }}
      />
      {/* Lower-right sage glow */}
      <div
        className="absolute"
        style={{
          bottom: "-150px",
          right: "15%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(29, 158, 117, 0.08) 0%, rgba(29, 158, 117, 0) 70%)",
        }}
      />
      {/* Subtle upper-center warmth to keep cream feeling */}
      <div
        className="absolute"
        style={{
          top: "10%",
          left: "40%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(93, 202, 165, 0.05) 0%, rgba(93, 202, 165, 0) 70%)",
        }}
      />
    </div>
  );
}
