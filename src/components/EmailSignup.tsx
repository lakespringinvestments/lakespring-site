export default function EmailSignup() {
  const embedUrl =
    process.env.NEXT_PUBLIC_BEEHIIV_EMBED_URL ||
    "https://embeds.beehiiv.com/0a30b2d5-820a-460f-b5da-e166b7ae408f";

  return (
    <div className="beehiiv-embed">
      <iframe
        src={embedUrl}
        data-test-id="beehiiv-embed"
        width="100%"
        height="320"
        frameBorder="0"
        scrolling="no"
        style={{
          margin: 0,
          borderRadius: "12px",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
