import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MainFooter from "../components/MainFooter";
import { NavLink } from "react-router-dom";
import EditListingModal from "./EditListingModal";

const images = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
];


function StatusBadge({ status }) {
  const isActive = status === "active";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        minWidth: 90,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 10,
        backgroundColor: isActive ? "#ccfbf1" : "#f3f4f6",
        color: isActive ? "#0f766e" : "#6b7280",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: isActive ? "#0d9488" : "#9ca3af",
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

function PropertyRow({ property, onDelete,handleStatus,handleEdit  }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#f3eeff" : "transparent",
        transition: "background 0.15s",
      }}
    >
      {/* Property Details */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* 🖼️ Image */}
          <img
            src={property.images?.[0] || "/default.jpg"}
            alt={property.title}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />

          {/* 🏠 Title + Location */}
          <div>
            <p
              style={{
                fontWeight: 700,
                color: "#2e2a50",
                fontSize: 14,
                margin: 0,
              }}
            >
              {property.title}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#5c5680",
                margin: "3px 0 0",
                fontFamily: "sans-serif",
              }}
            >
              {property.location}
            </p>
          </div>
        </div>
      </td>

      {/* 💰 Price */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 600, color: "#2e2a50", fontSize: 14 }}>
          ₹{property.price}
        </span>
        <span
          style={{ fontSize: 12, color: "#5c5680", fontFamily: "sans-serif" }}
        >
          {" "}
          /month
        </span>
      </td>

      {/* 🟢 Status */}
<td style={{ padding: "14px 16px", whiteSpace: "nowrap", width: 170, minWidth: 170 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-start" }}>
          <button
            onClick={() => handleStatus(property._id, property.status)}
            style={{
              cursor: "pointer",
              border: "none",
              background: "transparent",
              padding: 0,
            }}
          >
            <StatusBadge status={property.status ?? "active"} />
          </button>
        </div>
      </td>
  

      {/* ⚙️ Actions */}
      <td style={{ padding: "14px 16px", textAlign: "right" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "flex-end",
            gap: 6,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
            <button onClick={() => handleEdit(property)} style={{ padding: "6px 8px", color: "green", background: "none", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 18 }}>
            <span className="material-symbols-outlined">Edit</span>
          </button>
          <button
            onClick={() => onDelete(property._id)}
            style={{
              padding: "6px 8px",
              color: "red",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            <span  className="material-symbols-outlined">delete</span>
          </button>

        
        </div>
      </td>
    </tr>
  );
}

// const tablerow=["Property Details", "Monthly Rent", "Status", "Inquiries", "Actions"];
const tablerow = ["Property Details", "Monthly Rent", "Status", "Actions"];

export default function OwnerDashboard() {
  const [email, setEmail] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [listings, setListings] = useState([]);
  const [editData, setEditData] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const filteredListings =
  filterStatus === "all"
    ? listings
    : listings.filter(item => item.status === filterStatus);

  const handleEdit = (property) => {
  setEditData(property);
};
const handleUpdate = async (form) => {
  const token = localStorage.getItem("token");

  console.log("Updating listing with data:", form);

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/listings/${editData._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    }
  );

  const data = await res.json();

  if (res.ok) {
    setListings(prev =>
      prev.map(item =>
        item._id === editData._id ? data.listing : item
      )
    );

    setEditData(null); // close modal
  }
};
    const handleStatus = async (id, currentStatus) => {
  try {
    const token = localStorage.getItem("token");

    const newStatus =
      currentStatus === "active" ? "inactive" : "active"; // ✅ FIXED

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      }
    );

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      // ✅ update UI
      setListings(prev =>
        prev.map(item =>
          item._id === id
            ? { ...item, status: newStatus }
            : item
        )
      );
    }

  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/mydata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setListings(data.data);
      }
    };

    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Remove from UI instantly
        setListings((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <>

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
        }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-headline { font-family: 'Plus Jakarta Sans', sans-serif; }
        tr { border-bottom: 1px solid #ebe5ff; }
        tr:last-child { border-bottom: none; }

        /* ── Dashboard layout ── */
        .dash-main {
          // max-width: 80%;
          margin: 0 auto;
          padding: 20px 32px 48px;
        }

        /* ── Header ── */
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 36px;
          margin-top: 24px;
          gap: 16px;
        }
        .dash-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #2e2a50;
          margin: 0 0 8px;
        }
        .dash-add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 24px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #4953ac, #929bfa);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(73,83,172,0.25);
          flex-shrink: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none;
          white-space: nowrap;
        }

        /* ── Carousel ── */
        .carousel-section {
          margin-bottom: 40px;
        }
        .carousel-box {
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          height: 340px;
          background: #1a1725;
          box-shadow: 0 1px 6px rgba(0,0,0,0.12);
        }

        /* ── Properties section header ── */
        .props-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 12px;
        }

        /* ── Banner ── */
        .banner-section {
          background-color: #81f3e5;
          border-radius: 24px;
          padding: 56px 64px;
          overflow: hidden;
          position: relative;
        }
        .banner-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .banner-shield {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background-color: rgba(0,90,83,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── Large desktop (1441px+) ── */
        @media (min-width: 1441px) {
          .dash-main {
            // padding: 10px 10px 10px;
          width:100%
          }
          .carousel-box {
            height: 420px;
          }
          
          
        }

        /* ── Tablet (max 900px) ── */
        @media (max-width: 900px) {
          .dash-main {
            padding: 16px 20px 40px;
          }
          .dash-title {
            font-size: 28px;
          }
          .carousel-box {
            height: 260px;
          }
          .banner-section {
            padding: 36px 32px;
          }
          .banner-shield {
            width: 160px;
            height: 160px;
          }
          .banner-shield .material-symbols-outlined {
            font-size: 80px !important;
          }
        }

        /* ── Mobile (max 600px) ── */
        @media (max-width: 600px) {
          .dash-main {
            padding: 12px 14px 32px;
          }
          .dash-header {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 16px;
            margin-bottom: 24px;
          }
          .dash-title {
            font-size: 24px;
            letter-spacing: -0.5px;
          }
          .dash-add-btn {
            width: 100%;
            justify-content: center;
            height: 48px;
          }
          .carousel-box {
            height: 200px;
          }
          .props-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .banner-section {
            padding: 28px 20px;
            border-radius: 16px;
          }
          .banner-inner {
            flex-direction: column;
            gap: 24px;
          }
          .banner-shield {
            width: 120px;
            height: 120px;
            align-self: center;
          }
          .banner-shield .material-symbols-outlined {
            font-size: 60px !important;
          }
          .banner-title {
            font-size: 22px !important;
          }
        }

        /* ── Extra small (max 400px) ── */
        @media (max-width: 400px) {
          .dash-title {
            font-size: 20px;
          }
          .banner-title {
            font-size: 19px !important;
          }
        }
      `}</style>

      <Navbar />

      <div
        style={{
          backgroundColor: "#f9f4ff",
          color: "#2e2a50",
          minHeight: "100vh",
        }}
      >
        <main className="dash-main">
          {/* ── Header ── */}
          <header className="dash-header">
            <div>
              <h1 className="dash-title">Owner Dashboard</h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#5c5680",
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                Manage your curated student residences and track your
                portfolio's performance across Kolkata.
              </p>
            </div>
            <NavLink to="/newlisting" className="dash-add-btn">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                add_circle
              </span>
              Add New Listing
            </NavLink>
          </header>

          {/* ── Carousel ── */}
          <section className="carousel-section">
            <div
              className="carousel-box"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Slides */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                {images.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${src}?w=600&q=80)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>

              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(15,10,30,0.55) 30%, transparent 80%)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Prev */}
              <button
                onClick={prevSlide}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                  padding: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  chevron_left
                </span>
              </button>

              {/* Next */}
              <button
                onClick={nextSlide}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                  padding: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  chevron_right
                </span>
              </button>

              {/* Dots */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 5,
                  zIndex: 3,
                }}
              >
                {images.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      cursor: "pointer",
                      background:
                        i === currentIndex ? "#fff" : "rgba(255,255,255,0.4)",
                      transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Your Properties ── */}
          <section style={{ marginBottom: 40 }} className="property_main">
            <div className="props-header">
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#2e2a50",
                  margin: 0,
                }}
              >
                Your Properties
              </h2>
             <div style={{ position: "relative" }}>
  
  {/* 🔘 Button */}
  <div
    onClick={() => setShowFilter(prev => !prev)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#f3eeff",
      padding: "8px 16px",
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 13,
      color: "#5c5680",
      fontWeight: 500,
    }}
  >
    <span
      className="material-symbols-outlined"
      style={{ fontSize: 16 }}
    >
      filter_list
    </span>
    Filter By Status
  </div>

  {/* 📦 Dropdown */}
  {showFilter && (
    <div
      style={{
        position: "absolute",
        top: "110%",
        right: 0,
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
        zIndex: 10,
        minWidth: 140
      }}
    >
      {["all", "active", "inactive"].map(option => (
        <div
          key={option}
          onClick={() => {
            setFilterStatus(option);
            setShowFilter(false);
          }}
          style={{
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: 13,
            background:
              filterStatus === option ? "#f3eeff" : "#fff",
            color: "#333"
          }}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </div>
      ))}
    </div>
  )}

</div>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 560,
                  }}
                >
                  <colgroup>
                    <col style={{ width: "60%" }} />
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "8%" }} />
                  </colgroup>
                  <thead>
                    <tr style={{ backgroundColor: "#f3eeff" }}>
                      {tablerow.map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "14px 16px",
                            textAlign: i === 4 ? "right" : "left",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#5c5680",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {listings.map((p) => (
                      <PropertyRow key={p.id} property={p} />
                    ))} */}
                    {filteredListings.map((item) => (
                      <PropertyRow
                        key={item._id}
                        property={item}
                        onDelete={deleteListing} // ✅ PASS HERE
                        handleStatus={handleStatus}
                        handleEdit={handleEdit} // ✅ ADD THIS
                      />
                    ))}
                   
                  </tbody>
                </table>
                <EditListingModal
  editData={editData}
  setEditData={setEditData}
  onUpdate={handleUpdate}
/>
              </div>
            </div>
          </section>

          {/* ── Banner ── */}
          <section className="banner-section">
            <div className="banner-inner">
              <div style={{ maxWidth: 480 }}>
                <h3
                  className="banner-title"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#005a53",
                    margin: "0 0 16px",
                  }}
                >
                  Enhance Your Visibility
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "#005a53",
                    opacity: 0.8,
                    lineHeight: 1.7,
                    margin: "0 0 28px",
                    fontFamily: "sans-serif",
                  }}
                >
                  Verified listings receive 4x more engagement from high-intent
                  students. Schedule your verification visit today.
                </p>
                <button
                  style={{
                    backgroundColor: "#005a53",
                    color: "#81f3e5",
                    padding: "14px 28px",
                    borderRadius: 12,
                    border: "none",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Get Verified Now
                </button>
                <p
                  style={{
                    fontSize: 10,
                    marginTop: 20,
                    color: "#005a53",
                    opacity: 0.8,
                    lineHeight: 1.7,
                    margin: "0 0 28px",
                    fontFamily: "sans-serif",
                  }}
                >
                  Feature will be added soon
                </p>
              </div>

              <div className="banner-shield">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 110,
                    color: "#005a53",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  verified_user
                </span>
              </div>
            </div>
          </section>
        </main>
        <MainFooter />
      </div>
    </>
  );
}



// {listings.map((item) => (
//   <div key={item._id} className="property-row">

//     {/* Property Details */}
//     <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

//       {/* 🖼️ Image */}
//       <img
//         src={item.images?.[0] || "/default.jpg"}
//         alt="property"
//         style={{
//           width: 60,
//           height: 60,
//           borderRadius: 12,
//           objectFit: "cover"
//         }}
//       />

//       {/* 🏠 Title + Location */}
//       <div>
//         <h3>{item.title}</h3>
//         <p>{item.location}</p>
//       </div>
//     </div>

//     {/* 💰 Price */}
//     <div>₹{item.price} /month</div>

//     {/* 🟢 Status (temporary static) */}
//     <div>
//       <span style={{ color: "green" }}>Active</span>
//     </div>

//     {/* 📊 Inquiries (fake for now) */}
//     <div>--</div>

//   </div>
// ))}

{
  /* <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 20, marginBottom: 40 }}>

            
            <div style={{
              backgroundColor: "#fff", borderRadius: 16, padding: "24px 28px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)", display: "flex",
              flexDirection: "column", justifyContent: "space-between", minHeight: 160,
              position: "relative", overflow: "hidden",
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#5c5680", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                Total Property Views
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 16 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#4953ac", letterSpacing: "-2px", lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  12,482
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0d9488", display: "flex", alignItems: "center", gap: 3 }}>
                  +14%
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
                </span>
              </div>
           
              <div style={{
                position: "absolute", right: 20, bottom: 12,
                width: 80, height: 80, borderRadius: "50%",
                backgroundColor: "#f3eeff",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0.8,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 42, color: "#c4b8f8" }}>visibility</span>
              </div>
            </div>

           
            <div style={{
              backgroundColor: "#fff", borderRadius: 16, padding: "24px 28px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              borderLeft: "4px solid #a83206",
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#5c5680", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                Inquiries (Oct)
              </p>
              <span style={{ fontSize: 48, fontWeight: 800, color: "#2e2a50", letterSpacing: "-2px", lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 16 }}>
                148
              </span>
              <p style={{ fontSize: 13, color: "#5c5680", margin: "auto 0 0", fontFamily: "sans-serif" }}>
                24 pending response
              </p>
            </div>

           
            <div style={{
              backgroundColor: "#81f3e5", borderRadius: 16, padding: "24px 28px",
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#005a53", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                Avg. Response Time
              </p>
              <span style={{ fontSize: 48, fontWeight: 800, color: "#005a53", letterSpacing: "-2px", lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 16 }}>
                2.4h
              </span>
              <div style={{ display: "flex", gap: 5, marginTop: "auto" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#005a53", display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#005a53", display: "inline-block", opacity: 0.35 }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#005a53", display: "inline-block", opacity: 0.35 }} />
              </div>
            </div>
          </section> */
}

{
  /* <footer className="bg-[#f3eeff] w-full mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 w-full max-w-7xl mx-auto">
            <div className="flex flex-col gap-4">
              <span className="text-lg font-extrabold text-[#4953ac] font-headline">
                The Academic Curator
              </span>
              <p className="text-[#5c5680] text-sm leading-relaxed max-w-xs">
                Elevating the student living experience through curated architecture and
                community-focused management.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-headline font-bold text-[#4953ac]">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {["About Us", "Verified Listings", "Safety Guidelines", "Contact Support"].map(
                  (l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-[#5c5680] hover:text-[#4953ac] text-sm hover:underline transition-all"
                    >
                      {l}
                    </a>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-headline font-bold text-[#4953ac]">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your work email"
                  className="bg-[#f3eeff] border border-[#aea8d7] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4953ac]/40 w-full"
                />
                <button className="bg-[#4953ac] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#3d469f] transition-colors">
                  Join
                </button>
              </div>
              <p className="text-xs text-[#5c5680]">
                © 2026 The Academic Curator. Premium Student Living in Kolkata.
              </p>
            </div>
          </div>
        </footer> */
}
