// Fixed ambient background layer — soft teal radial glows that sit behind all
// page content. Renders once in the root layout. Pointer-events-none so it never
// interferes with interaction; -z-10 keeps it beneath everything.
//
// Note on positioning: each gradient holds its peak color out to ~22% of radius
// before beginning falloff, so glows whose centers sit off-screen still bleed
// real color onto the visible canvas rather than just their faded outer tail.
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
          top: "-180px",
          right: "-140px",
          width: "720px",
          height: "720px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(29, 158, 117, 0.22) 0%, rgba(29, 158, 117, 0.22) 22%, rgba(29, 158, 117, 0) 72%)",
        }}
      />
      {/* Mid-left deep teal glow — pulled onscreen */}
      <div
        className="absolute"
        style={{
          top: "24%",
          left: "-160px",
          width: "640px",
          height: "640px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(3, 65, 71, 0.16) 0%, rgba(3, 65, 71, 0.16) 22%, rgba(3, 65, 71, 0) 72%)",
        }}
      />
      {/* Lower-left sage glow — gives the left side a second, brighter presence */}
      <div
        className="absolute"
        style={{
          bottom: "-120px",
          left: "-100px",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(29, 158, 117, 0.18) 0%, rgba(29, 158, 117, 0.18) 20%, rgba(29, 158, 117, 0) 70%)",
        }}
      />
      {/* Lower-right sage glow */}
      <div
        className="absolute"
        style={{
          bottom: "-160px",
          right: "10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(29, 158, 117, 0.17) 0%, rgba(29, 158, 117, 0.17) 20%, rgba(29, 158, 117, 0) 70%)",
        }}
      />
      {/* Upper-center warmth */}
      <div
        className="absolute"
        style={{
          top: "6%",
          left: "36%",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(93, 202, 165, 0.12) 0%, rgba(93, 202, 165, 0) 68%)",
        }}
      />
    </div>
  );
}
