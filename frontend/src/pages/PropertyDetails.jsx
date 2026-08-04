import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MainFooter from "../components/MainFooter";
import SEO from "../components/SEO.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PROXIMITY = [
  {
    icon: "🚶",
    name: "St. Xavier's College",
    sub: "Main Campus Entrance",
    time: "4 mins walk",
  },
  {
    icon: "🚌",
    name: "Loreto College",
    sub: "Middleton Row",
    time: "12 mins walk",
  },
  {
    icon: "🚇",
    name: "Park Street Metro",
    sub: "North-South Corridor",
    time: "8 mins walk",
  },
];

const GUIDELINES = [
  {
    icon: "🔴",
    title: "11:00 PM Curfew",
    desc: "Late entry requires prior guardian notification via the app.",
  },
  {
    icon: "👥",
    title: "Guest Policy",
    desc: "Day guests allowed in common areas. No overnight visitors.",
  },
  {
    icon: "🚭",
    title: "Zero Tolerance",
    desc: "No smoking or alcohol permitted within the premises.",
  },
  {
    icon: "📋",
    title: "Weekly Audit",
    desc: "Regular room maintenance checks for hygiene standards.",
  },
];

const PHOTOS = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
];

function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  return bp;
}

export default function PropertyDetails() {
  const [listing, setListing] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const bp = useBreakpoint();

  const isMobile = bp === "mobile";
  const galleryImages =
    Array.isArray(listing?.images) && listing.images.length > 0
      ? listing.images
      : PHOTOS;

  const openGallery = (index = 0) => {
    setActiveImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => setIsGalleryOpen(false);

  useEffect(() => {
    if (isGalleryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isGalleryOpen]);

  const showPrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/listings/${id}`,
        );

        setListing(res.data);

        console.log("Listing Data:", res.data);
        console.log("Owner Profile:", res.data.ownerProfile);
        console.log("Profile Image:", res.data.ownerProfile?.profileImg);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>Loading...</div>
    );
  }

  const seoTitle = `${listing.title} — Verified Student Rental in Kolkata`;
  const seoDescription =
    listing.description ||
    `Discover trusted student accommodation in Kolkata near top colleges. ${listing.title} offers a safe, curated rental option for students.`;
  const seoUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://rommate.in/propertydetails/${id}`;
  const seoImage = listing.images?.[0] || "/logostart.png";
  const seoKeywords = `student housing Kolkata, ${listing.title}, ${listing.location || "Kolkata"}, verified rental`;

  const handleCall = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ track call click
      await fetch(`${import.meta.env.VITE_API_URL}/api/inquiry/track-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listing._id,
        }),
      });

      // ✅ open phone dialer
      window.location.href = `tel:${listing.owner_phone}`;
    } catch (error) {
      console.error(error);

      // still open dialer even if tracking fails
      window.location.href = `tel:${listing.owner_phone}`;
    }
  };
  const handleWhatsApp = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔒 Require login first
      if (!token) {
        navigate("/login");
        return;
      }

      // ✅ Track inquiry
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inquiry/track-whatsapp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listingId: listing._id,
          }),
        },
      );

      await res.json();

      if (res.ok) {
        const phone = `91${listing.owner_phone}`;

        const message = encodeURIComponent(
          `Hi ${listing.owner_name}, I'm interested in your listing priced at ₹${listing.price}.`,
        );

        // ✅ Open WhatsApp after tracking
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const listingUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://rommate.in/propertydetails/${id}`;

  const shareText = `Check out this property on Rommate: ${listing?.title} in ${listing?.location}. ${listingUrl}`;

  const showToast = (message) => {
    setCopyStatus(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setCopyStatus(""), 2200);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: shareText,
          url: listingUrl,
        });
        showToast("Property shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareText);
        showToast("Link copied to clipboard!");
      }
    } catch (error) {
      console.error(error);
      showToast("Could not share right now.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl);
      showToast("Link copied to clipboard!");
    } catch (error) {
      console.error(error);
      showToast("Failed to copy link.");
    }
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={seoUrl}
        image={seoImage}
        keywords={seoKeywords}
      />
      <style>{`
        * { box-sizing: border-box; }

        .pd-root {
          background-color: #f0edf8;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .pd-toast {
          position: fixed;
          left: 50%;
          bottom: 28px;
          transform: translateX(-50%);
          padding: 12px 18px;
          background: rgba(20, 116, 62, 0.98);
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14);
          z-index: 9999;
          max-width: calc(100% - 32px);
          text-align: center;
          opacity: 0.98;
        }

        /* ── Breadcrumb ── */
        .pd-breadcrumb {
          padding: 12px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        @media (max-width: 639px) {
          .pd-breadcrumb { padding: 10px 16px; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .pd-breadcrumb { padding: 12px 20px; }
        }

        .pd-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* ── Photo Grid ── */
        .pd-photo-grid {
          padding: 0 32px 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          // height: 480px;
        }
        @media (max-width: 639px) {
          .pd-photo-grid {
            padding: 0 16px 20px;
            grid-template-columns: 1fr;
            height: auto;
          }
          .pd-photo-right { display: none; }
          .pd-photo-main { height: 240px; border-radius: 14px; overflow: hidden; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .pd-photo-grid {
            padding: 0 20px 24px;
            // height: 280px;
          }
        }

        .pd-photo-main {
          border-radius: 16px;
          overflow: hidden;
          height: 100%;
        }
        .pd-photo-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 8px;
        }

        .pd-photo-main,
        .pd-photo-thumb {
          border: none;
          padding: 0;
          background: transparent;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .pd-photo-main {
          display: block;
          border-radius: 16px;
          overflow: hidden;
        }

        .pd-photo-thumb {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .pd-gallery-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 12, 24, 0.78);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 10000;
        }

        .pd-gallery-modal {
          width: min(1080px, 100%);
          max-height: 90vh;
          background: #fff;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
        }

        .pd-gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .pd-gallery-image {
          width: 100%;
          height: min(70vh, 620px);
          object-fit: contain;
          display: block;
          background: #f3f0ff;
          border-radius: 18px;
        }

        .pd-gallery-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
        }

        .pd-gallery-btn {
          border: none;
          border-radius: 999px;
          padding: 10px 16px;
          background: #5b54d4;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }

        .pd-gallery-btn.secondary {
          background: #f1edff;
          color: #3b3584;
        }

        .pd-gallery-counter {
          font-size: 13px;
          color: #5f5b7b;
          font-weight: 600;
        }

        /* ── Content + Sidebar layout ── */
        .pd-content-wrap {
          padding: 0 32px 48px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 639px) {
          .pd-content-wrap {
            padding: 0 16px 48px;
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .pd-content-wrap {
            padding: 0 20px 48px;
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* ── Title ── */
        .pd-title {
          font-size: 30px;
          font-weight: 800;
          color: #1a1740;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin: 0 0 8px; 
          z-index: 10;
          
        }
        @media (max-width: 639px) { .pd-title { font-size: 22px; letter-spacing: -0.5px; } }
        @media (min-width: 640px) and (max-width: 1023px) { .pd-title { font-size: 32px; } }

        /* ── Amenities grid ── */
        .pd-amenities-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 639px) {
          .pd-amenities-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .pd-amenities-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Guidelines grid ── */
        .pd-guidelines-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 32px;
        }
        @media (max-width: 639px) {
          .pd-guidelines-grid { grid-template-columns: 1fr; gap: 16px; }
        }

        /* ── Peace of mind banner ── */
        .pd-peace-banner {
          background-color: #4cd9b0;
          border-radius: 20px;
          padding: 24px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        @media (max-width: 639px) {
          .pd-peace-banner {
            flex-direction: column;
            align-items: flex-start;
            padding: 18px 20px;
          }
        }

        /* ── Sidebar ── */
        .pd-sidebar {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (max-width: 1023px) {
          .pd-sidebar { position: static; }
        }

        /* ── Sidebar cards side-by-side on tablet ── */
        .pd-sidebar-inner {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .pd-sidebar-inner {
            flex-direction: row;
            align-items: flex-start;
          }
          .pd-sidebar-inner > * { flex: 1; }
        }

        /* ── Pricing card ── */
        .pd-pricing-card {
          background: #fff;
          border: 1px solid #e8e4f8;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(91,84,212,0.08);
        }
        @media (max-width: 639px) {
          .pd-pricing-card { padding: 18px; }
        }

        .pd-price-amount {
          font-size: 32px;
          font-weight: 800;
          color: #1a1740;
          letter-spacing: -1px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        @media (max-width: 639px) { .pd-price-amount { font-size: 26px; } }

        /* ── Reserve button ── */
        .pd-reserve-btn {
          width: 100%;
          padding: 14px 0;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #5b54d4, #4038b0);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        /* ── Curator card ── */
        .pd-curator-card {
          background: #fff;
          border: 1px solid #e8e4f8;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 24px rgba(91,84,212,0.08);
        }
      `}</style>

      <Navbar />
      <div className="pd-root">
        {copyStatus && <div className="pd-toast">{copyStatus}</div>}
        {/* ── Breadcrumb + Badges ── */}
        <div className="pd-breadcrumb">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: isMobile ? 11 : 13,
              color: "#7b78a0",
              fontFamily: "sans-serif",
            }}
          >
            <a
              href="/search"
              style={{ color: "#7b78a0", textDecoration: "none" }}
            >
              Listings
            </a>
            <span>›</span>
            <a href="#" style={{ color: "#7b78a0", textDecoration: "none" }}>
              Kolkata
            </a>
            <span>›</span>
            <span style={{ color: "#1a1740", fontWeight: 600 }}>
              {listing.title}
            </span>
          </div>
          <div
            className="pd-badges"
            style={{ alignItems: "center", flexDirection: "column", gap: 8 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {listing.verified && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "6px 12px" : "8px 18px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: "#4caf8e",
                    color: "#fff",
                    fontFamily: "sans-serif",
                  }}
                >
                  ✓ Verified Listing
                </span>
              )}
              <button
                onClick={handleShare}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: isMobile ? "6px 12px" : "8px 16px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid #dad7f0",
                  backgroundColor: "#fff",
                  color: "#3b3584",
                  cursor: "pointer",
                  fontFamily: "sans-serif",
                }}
              >
                🔗 Share Property
              </button>
              <button
                onClick={handleCopyLink}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: isMobile ? "6px 12px" : "8px 16px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid #dad7f0",
                  backgroundColor: "#fff",
                  color: "#3b3584",
                  cursor: "pointer",
                  fontFamily: "sans-serif",
                }}
              >
                📋 Copy Link
              </button>
            </div>
          </div>
          {/* <span style={{
            display: "flex", alignItems: "center",
            padding: isMobile ? "6px 12px" : "8px 18px",
            borderRadius: 999, fontSize: 12,
            fontWeight: 600, backgroundColor: "#ffe0d4", color: "#c0441a",
            fontFamily: "sans-serif",
          }}>
            Only 2 Rooms Left
          </span> */}
        </div>

        {/* ── Photo Grid ── */}
        <div className="pd-photo-grid">
          <button
            type="button"
            className="pd-photo-main"
            onClick={() => openGallery(0)}
            aria-label="Open image gallery"
          >
            <img
              src={galleryImages[0]}
              alt="main"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </button>
          <div className="pd-photo-right">
            {galleryImages.slice(1, 5).map((p, i) => (
              <button
                key={i}
                type="button"
                className="pd-photo-thumb"
                onClick={() => openGallery(i + 1)}
                aria-label={`Open image ${i + 2}`}
              >
                <img
                  src={p}
                  alt={`photo-${i}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {i === 3 && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      openGallery(0);
                    }}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      backgroundColor: "rgba(255,255,255,0.92)",
                      borderRadius: 8,
                      padding: "5px 10px",
                      fontSize: 11,
                      fontFamily: "sans-serif",
                      fontWeight: 600,
                      color: "#1a1740",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      cursor: "pointer",
                    }}
                  >
                    ⊞ View all {galleryImages.length} images
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {isGalleryOpen && (
          <div className="pd-gallery-backdrop" onClick={closeGallery}>
            <div
              className="pd-gallery-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pd-gallery-header">
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      color: "#1a1740",
                    }}
                  >
                    Listing Photos
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      color: "#7b78a0",
                    }}
                  >
                    {listing.title}
                  </p>
                </div>
                <button
                  type="button"
                  className="pd-gallery-btn secondary"
                  onClick={closeGallery}
                >
                  Close
                </button>
              </div>

              <img
                src={galleryImages[activeImageIndex]}
                alt={`listing photo ${activeImageIndex + 1}`}
                className="pd-gallery-image"
              />

              <div className="pd-gallery-controls">
                <button
                  type="button"
                  className="pd-gallery-btn"
                  onClick={showPrevImage}
                >
                  ← Prev
                </button>
                <span className="pd-gallery-counter">
                  {activeImageIndex + 1} / {galleryImages.length}
                </span>
                <button
                  type="button"
                  className="pd-gallery-btn"
                  onClick={showNextImage}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Content + Sidebar ── */}
        <div className="pd-content-wrap">
          {/* LEFT COLUMN */}
          <div>
            {/* Title */}
            <h1 className="pd-title">{listing.title}</h1>
            <p
              style={{
                fontSize: isMobile ? 12 : 14,
                color: "#7b78a0",
                fontFamily: "sans-serif",
                margin: "0 0 28px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              📍 {listing.location}
            </p>

            {/* Amenities */}
            <h2
              style={{
                fontSize: isMobile ? 15 : 18,
                fontWeight: 700,
                color: "#1a1740",
                margin: "0 0 14px",
              }}
            >
              Premium Student Amenities
            </h2>
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e8e4f8",
                borderRadius: 14,
                padding: "16px",
                marginBottom: 28,
              }}
            >
              <div className="pd-amenities-grid">
                {listing.amenities?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "14px 8px",
                        borderRadius: 10,
                        backgroundColor: "#f8f6ff",
                        cursor: "default",
                      }}
                    >
                      {/* <span style={{ fontSize: 22 }}>{icon}</span> */}
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#3b3584",
                          fontFamily: "sans-serif",
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Academic Proximity */}
            <div
              style={{
                backgroundColor: "#f8f6ff",
                border: "1px solid #e4e0f4",
                borderRadius: 14,
                padding: "20px",
                marginBottom: 28,
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a1740",
                  margin: "0 0 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                🎓 Academic Proximity
              </h3>
              {listing.nearbyPlaces.map((p, i) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom:
                      i < listing.nearbyPlaces.length - 1
                        ? "1px solid #e4e0f4"
                        : "none",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#3b3584",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {/* {p.icon} */}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: isMobile ? 12 : 13,
                          fontWeight: 600,
                          color: "#1a1740",
                        }}
                      >
                        {p.place}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#9b96b8",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {p.description}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#5b54d4",
                      fontFamily: "sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {p.distance}
                  </span>
                </div>
              ))}
            </div>

            {/* House Guidelines */}
            <h2
              style={{
                fontSize: isMobile ? 15 : 18,
                fontWeight: 700,
                color: "#1a1740",
                margin: "0 0 14px",
              }}
            >
              House Guidelines
            </h2>
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e8e4f8",
                borderRadius: 14,
                padding: "20px",
                marginBottom: 28,
              }}
            >
              <div className="pd-guidelines-grid">
                {listing.guidelines.map((g, i) => (
                  <div key={g.title} style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>
                      {/* {g.icon} */}
                      {i + 1}.
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#1a1740",
                          marginBottom: 3,
                        }}
                      >
                        {g.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#7b78a0",
                          fontFamily: "sans-serif",
                          lineHeight: 1.5,
                        }}
                      >
                        {g.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Peace of Mind */}
            <div className="pd-peace-banner">
              <div>
                <h3
                  style={{
                    fontSize: isMobile ? 15 : 18,
                    fontWeight: 700,
                    color: "#0a2e24",
                    margin: "0 0 8px",
                  }}
                >
                  Academic Peace of Mind
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#0f4035",
                    fontFamily: "sans-serif",
                    lineHeight: 1.6,
                    maxWidth: 380,
                    margin: 0,
                  }}
                >
                  This property is directly verified by The Academic Curator
                  team. We've checked structural safety, Wi-Fi speeds, and local
                  security measures.
                </p>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/45.jpg",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      objectFit: "cover",
                      marginLeft: i === 0 ? 0 : -8,
                      display: "block",
                    }}
                  />
                ))}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#2a9d7a",
                    border: "2px solid #fff",
                    marginLeft: -8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: "sans-serif",
                  }}
                >
                  +45
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="pd-sidebar">
            <div className="pd-sidebar-inner">
              {/* Pricing Card */}
              <div className="pd-pricing-card">
                <div style={{ marginBottom: 16 }}>
                  <span className="pd-price-amount">₹{listing.price}</span>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#7b78a0",
                      fontFamily: "sans-serif",
                      marginLeft: 4,
                    }}
                  >
                    /month
                  </span>
                </div>

                <div
                  style={{
                    borderBottom: "1px solid #e8e4f8",
                    paddingBottom: 14,
                    marginBottom: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      fontFamily: "sans-serif",
                    }}
                  >
                    <span style={{ color: "#7b78a0" }}>Security Deposit</span>
                    <span style={{ color: "#1a1740", fontWeight: 500 }}>
                      ₹{listing.security_deposit}
                    </span>
                  </div>
                  {/* <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: "sans-serif" }}>
                    <span style={{ color: "#7b78a0" }}>Service Fee</span>
                    <span style={{ color: "#1a1740", fontWeight: 500 }}>₹1,500</span>
                  </div> */}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "sans-serif",
                    marginBottom: 18,
                  }}
                >
                  <span style={{ color: "#1a1740" }}>
                    Total Initial Payment
                  </span>
                  <span style={{ color: "#5b54d4", fontSize: 15 }}>
                    ₹{listing.price + listing.security_deposit}
                  </span>
                </div>

                <button className="pd-reserve-btn">Reserve Now</button>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    color: "#9b96b8",
                    fontFamily: "sans-serif",
                    margin: 0,
                  }}
                >
                  No charges applied until owner approval
                </p>
              </div>

              {/* Property Curator Card */}
              <div className="pd-curator-card">
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#9b96b8",
                    fontFamily: "sans-serif",
                    margin: "0 0 14px",
                  }}
                >
                  PROPERTY CURATOR
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#5b54d4",
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {listing?.ownerProfile?.profileImg ? (
                      <img
                        src={listing.ownerProfile.profileImg}
                        alt="curator"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      listing?.owner_name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1a1740",
                      }}
                    >
                      {listing.owner_name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#7b78a0",
                        fontFamily: "sans-serif",
                      }}
                    >
                      Response rate: 98%
                    </div>
                  </div>
                </div>

                {/* <a href={`tel:${listing.phone}`}>
  <button>📞 Call Owner</button>
</a> */}
                <div
                  onClick={handleCall}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    backgroundColor: "#f8f6ff",
                    padding: "10px 12px",
                    borderRadius: 10,
                    marginBottom: 12,
                    color: "#4a4770",
                    fontFamily: "sans-serif",
                    wordBreak: "break-all",
                    cursor: "pointer",
                  }}
                >
                  📞 Call Owner
                </div>

                <button
                  onClick={handleWhatsApp}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderRadius: 12,
                    backgroundColor: "#f0edf8",
                    border: "1px solid #ddd8f0",
                    color: "#3b3584",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  💬 Connect with Owner
                </button>
              </div>
            </div>
          </div>
        </div>

        <MainFooter />
      </div>
    </>
  );
}
