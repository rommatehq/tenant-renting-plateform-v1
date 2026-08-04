import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import descriptionIcon from "../assets/description-alt.png";
import locationDataset from "../data/location-dataset.json";

const STEPS = [
  { num: 1, label: "Details" },
  { num: 2, label: "Photos" },
  { num: 3, label: "Verification" },
  { num: 4, label: "Publish" },
];

const AMENITIES = [
  "Wi-Fi",
  "Almirah",
  "Mattress",
  "Gas, burner",
  "Kitchen",
  "Maid facilities",
  "Refrigerator",
  "Dining Table",
  "Water Purifier",
  "24 Hours Electricity ",
  "Geysers",
  "Lift",
  "Meal Plan",
  "AC",
  "Non AC",
  "24/7 Security",
  "Parking",
  "Washing Machine",
  "Balcony",
];

const roomTypes = ["Single", "2 Sharing", "3 Sharing", "4 Sharing"];
const categories = ["Premium", "Regular"];

export default function CreateListing() {
  const [currentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedSubAreaId, setSelectedSubAreaId] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [form, setForm] = useState({
    propertyName: "",
    owner_name: "",
    phone: "",
    security_deposit: "",
    location: "",
    description: "",
    price: "",
    availableFrom: "",
  });
  const [toast, setToast] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef([]);

  const isMobile = window.innerWidth < 768;

  /// IT IS WORKING

  const addImageFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) return;

    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current = [...previewUrlsRef.current, ...urls];
    setUploadedImages((prev) => [...prev, ...imageFiles]);
    setPreviewImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
    setPreviewImages((prev) => {
      const removedUrl = prev[index];
      if (removedUrl) {
        URL.revokeObjectURL(removedUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (_, idx) => idx !== index,
        );
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  // const handleSubmit = async () => {
  //   try {
  //     const formData = new FormData();

  //     // Basic fields
  //     formData.append("title", form.propertyName);
  //     formData.append("price", Number(form.price));
  //     formData.append("location", form.location);
  //     formData.append("description", form.description);
  //     formData.append("owner_name", form.owner_name); // i have changed ownername to owner_name
  //     formData.append("owner_phone", form.phone);
  //     formData.append("amenities", selectedAmenities.join(",")); // ✅ IMPORTANT
  //     const tags = [];
  //     if (selectedRoom) tags.push(selectedRoom);
  //     if (selectedCategory) tags.push(selectedCategory);
  //     formData.append("tags", tags.join(",")); // ✅ IMPORTANT

  //     // // Amenities (array)
  //     // selectedAmenities.forEach((a) => {
  //     //   formData.append("amenities", a);
  //     // });

  //     // // Tags (room + category)
  //     // if (selectedRoom) formData.append("tags", selectedRoom);
  //     // if (selectedCategory) formData.append("tags", selectedCategory);

  //     // Images (VERY IMPORTANT)
  //     uploadedImages.forEach((img) => {
  //       formData.append("images", img);
  //     });

  //     console.log("FormData entries:", Array.from(formData.entries()));

  //     const res = await fetch("http://localhost:5000/api/listings", {
  //       method: "POST",
  //       body: formData, // ❗ NO headers, let browser set it to multipart/form-data with correct boundaries
  //     });

  //     const data = await res.json();
  //     console.log(data);

  //   if (res.ok) {
  //     setToast(true);

  //     setTimeout(() => {
  //       setToast(false);
  //     }, 2000);
  //   }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("title", form.propertyName);
      formData.append("price", Number(form.price));
      formData.append("security_deposit", Number(form.security_deposit));
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("owner_name", form.owner_name); // i have changed ownername to owner_name
      formData.append("owner_phone", form.phone);
      formData.append("amenities", selectedAmenities.join(",")); // ✅ IMPORTANT
      const tags = [];
      if (selectedRoom) tags.push(selectedRoom);
      if (selectedCategory) tags.push(selectedCategory);
      formData.append("tags", tags.join(",")); // ✅ IMPORTANT

      // Nearby Places and Guidelines
      if (nearbyPlaces.length > 0) {
        formData.append("nearbyPlaces", JSON.stringify(nearbyPlaces));
      }
      if (guidelines.length > 0) {
        formData.append("guidelines", JSON.stringify(guidelines));
      }

      // Images (VERY IMPORTANT)
      uploadedImages.forEach((img) => {
        formData.append("images", img);
      });

      console.log("FormData entries:", Array.from(formData.entries()));
      const token = localStorage.getItem("token");

      if (uploadedImages.length < 4) {
        alert("Please upload 4 images.");
        return;
      }

      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ ADD THIS
        },
        body: formData, // ❗ NO headers, let browser set it to multipart/form-data with correct boundaries
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setToast(true);

        setTimeout(() => {
          setToast(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    const area = locationDataset.find((item) => item.area_id === areaId);
    setSelectedAreaId(areaId);
    setSelectedSubAreaId("");
    updateLocation(area ? area.area : "", "", customLocation);
  };

  const handleSubAreaChange = (e) => {
    const subAreaId = e.target.value;
    setSelectedSubAreaId(subAreaId);
    const area = locationDataset.find(
      (item) => item.area_id === selectedAreaId,
    );
    const subArea = area?.sub_areas.find((item) => item.id === subAreaId);
    updateLocation(
      area?.area || "",
      subArea ? subArea.name : "",
      customLocation,
    );
  };

  const handleCustomLocationChange = (e) => {
    const value = e.target.value;
    setCustomLocation(value);
    const area = locationDataset.find(
      (item) => item.area_id === selectedAreaId,
    );
    const subArea = area?.sub_areas.find(
      (item) => item.id === selectedSubAreaId,
    );
    updateLocation(area?.area || "", subArea ? subArea.name : "", value);
  };

  const updateLocation = (area, subArea, custom) => {
    const parts = [area, subArea, custom].filter(Boolean); // remove empty parts
    setForm((prev) => ({
      ...prev,
      location: parts.join(", "),
    }));
  };

  const toggleAmenity = (a) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  const handleCancel = () => {
    const confirmLeave = window.confirm("Discard all changes?");
    if (confirmLeave) {
      navigate("/");
    }
  };

  const addNearbyPlace = () => {
    setNearbyPlaces([
      ...nearbyPlaces,
      { place: "", description: "", distance: "" },
    ]);
  };

  const updateNearbyPlace = (index, field, value) => {
    const updated = [...nearbyPlaces];
    updated[index][field] = value;
    setNearbyPlaces(updated);
  };

  const removeNearbyPlace = (index) => {
    setNearbyPlaces(nearbyPlaces.filter((_, i) => i !== index));
  };

  const addGuideline = () => {
    setGuidelines([...guidelines, { title: "", desc: "" }]);
  };

  const updateGuideline = (index, field, value) => {
    const updated = [...guidelines];
    updated[index][field] = value;
    setGuidelines(updated);
  };

  const removeGuideline = (index) => {
    setGuidelines(guidelines.filter((_, i) => i !== index));
  };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const files = Array.from(e.dataTransfer.files).filter((f) =>
  //     f.type.startsWith("image/"),
  //   );
  //   const urls = files.map((f) => URL.createObjectURL(f));
  //   setUploadedImages((prev) => [...prev, ...urls].slice(0, 10));
  // };

  // const handleFileInput = (e) => {
  //   const files = Array.from(e.target.files);
  //   const urls = files.map((f) => URL.createObjectURL(f));
  //   setUploadedImages((prev) => [...prev, ...urls].slice(0, 10));
  // };

  const handleDrop = (e) => {
    e.preventDefault();
    addImageFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e) => {
    addImageFiles(Array.from(e.target.files));
    e.target.value = null;
  };

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, []);

  const selectedArea = locationDataset.find(
    (item) => item.area_id === selectedAreaId,
  );
  const subAreas = selectedArea?.sub_areas || [];

  /////////////// CONSOLE> LOGGING FOR DEBUGGING PURPOSES

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        input::placeholder { color: #b0adc8; }
          /* TOAST */
          .toast {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #3a2f8b;
    color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 13px 28px;
    border-radius: 99px;
    box-shadow: 0 8px 24px rgba(58,47,139,0.3);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1000;
    white-space: nowrap;
  }
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f0eef8",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* ── Top Nav ── */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            height: 60,
            backgroundColor: "#fff",
            borderBottom: "1px solid #ebe8f5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <NavLink
              to={"/owners"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#5c5680",
                fontSize: 18,
                padding: 4,
                display: "flex",
              }}
            >
              ←
            </NavLink>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#2e2a50" }}>
              Rommate
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: "#5c5680", fontWeight: 500 }}>
              Owner Dashboard
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: "#e8e4f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#5b54d4",
                cursor: "pointer",
              }}
            >
              👤
            </div>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <div
          style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          {/* ── Step Indicator ── */}
          {/* <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 48,
              position: "relative",
            }}
          >
          
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                right: 18,
                height: 2,
                backgroundColor: "#ddd8f0",
                zIndex: 0,
              }}
            />
           
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                width: "calc(33.33% - 0px)",
                height: 2,
                backgroundColor: "#4f46e5",
                zIndex: 1,
              }}
            />

            {STEPS.map((step) => {
              const isActive = step.num === currentStep;
              const isDone = step.num < currentStep;
              const isFuture = step.num > currentStep;
              return (
                <div
                  key={step.num}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      step.num === 1
                        ? "flex-start"
                        : step.num === 4
                          ? "flex-end"
                          : "center",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: isActive || isDone ? "#4f46e5" : "#fff",
                      border: isFuture
                        ? "2px solid #ddd8f0"
                        : "2px solid #4f46e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: isActive || isDone ? "#fff" : "#b0adc8",
                    }}
                  >
                    {step.num}
                  </div>
                  <span
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#2e2a50" : "#9b96b8",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div> */}

          {/* ── Form Card ── */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: "40px 48px",
              boxShadow: "0 2px 16px rgba(91,84,212,0.06)",
              marginBottom: 1,
            }}
          >
            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#1a1740",
                margin: "0 0 10px",
                letterSpacing: "-0.5px",
              }}
            >
              Create New Listing
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#7b78a0",
                margin: "0 0 36px",
                lineHeight: 1.6,
                maxWidth: 460,
              }}
            >
              Enter the specifics of your academic rental. Listings with
              detailed locations and clear photos perform 40% better.
            </p>

            {/* Row 1: Property Name + Phone */}

            {/* Row 1: Property Name — full width */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#2e2a50",
                  marginBottom: 8,
                }}
              >
                Property Name
              </label>
              <input
                name="propertyName"
                value={form.propertyName}
                onChange={handleChange}
                placeholder="e.g., Modern Studio near St. Xavier's"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #e8e4f8",
                  fontSize: 14,
                  color: "#2e2a50",
                  outline: "none",
                  backgroundColor: "#faf9ff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
            </div>

            {/* Row 2: Owner's Full Name + Owner's Phone Number — side by side */}
            <div
              style={{
                display: "grid",
                // gridTemplateColumns: "1fr 1fr",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 24,
                marginBottom: 24,
              }}
            >
              {/* Owner's Full Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2e2a50",
                    marginBottom: 8,
                  }}
                >
                  Owner's Full Name
                </label>
                <input
                  name="owner_name"
                  value={form.owner_name}
                  onChange={handleChange}
                  placeholder="e.g., Jane Doe"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #e8e4f8",
                    fontSize: 14,
                    color: "#2e2a50",
                    outline: "none",
                    backgroundColor: "#faf9ff",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
              </div>

              {/* Owner's Phone Number */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2e2a50",
                    marginBottom: 8,
                  }}
                >
                  Owner's Phone Number
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    borderRadius: 12,
                    border: "1.5px solid #e8e4f8",
                    overflow: "hidden",
                    backgroundColor: "#faf9ff",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "#ede9fe",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#4f46e5",
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 0,
                      borderRight: "1.5px solid #e8e4f8",
                    }}
                  >
                    +91
                  </div>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      border: "none",
                      fontSize: 14,
                      color: "#2e2a50",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* </div> */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#2e2a50",
                  marginBottom: 8,
                }}
              >
                Description
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #e8e4f8",
                  backgroundColor: "#faf9ff",
                }}
              >
                {/* <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span> */}
                <img
                  src={descriptionIcon} // in asserts, we can have a location icon or description icon
                  alt="location"
                  style={{ width: 16, height: 16, flexShrink: 0 }}
                />
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write a proper description..."
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: 14,
                    color: "#2e2a50",
                    backgroundColor: "transparent",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
              </div>
            </div>
            {/* Row 2: Location */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#2e2a50",
                  marginBottom: 8,
                }}
              >
                Room Location &amp; University Proximity
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #e8e4f8",
                  backgroundColor: "#faf9ff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
                  <span style={{ fontSize: 14, color: "#5c5680" }}>
                    Pick the area first, then sub-area if available.
                  </span>
                </div>
                <select
                  name="area"
                  value={selectedAreaId}
                  onChange={handleAreaChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #d6d1f2",
                    fontSize: 14,
                    color: "#2e2a50",
                    backgroundColor: "#fff",
                    outline: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <option value="">Select area</option>
                  {locationDataset.map((area) => (
                    <option key={area.area_id} value={area.area_id}>
                      {area.area}
                    </option>
                  ))}
                </select>
                <select
                  name="subArea"
                  value={selectedSubAreaId}
                  onChange={handleSubAreaChange}
                  disabled={!selectedAreaId}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #d6d1f2",
                    fontSize: 14,
                    color: "#2e2a50",
                    backgroundColor: selectedAreaId ? "#fff" : "#f7f5ff",
                    outline: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <option value="">Sub-area (optional)</option>
                  {subAreas.map((subArea) => (
                    <option key={subArea.id} value={subArea.id}>
                      {subArea.name}
                    </option>
                  ))}
                </select>
                <input
                  name="customLocation"
                  value={customLocation}
                  onChange={handleCustomLocationChange}
                  placeholder="Additional location details (e.g., near university, specific landmark)"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #d6d1f2",
                    fontSize: 14,
                    color: "#2e2a50",
                    backgroundColor: "#fff",
                    outline: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Row 3: Price + Date */}
            <div
              style={{
                display: "grid",
                // gridTemplateColumns: "1fr 1fr",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 24,
                marginBottom: 36,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2e2a50",
                    marginBottom: 8,
                  }}
                >
                  Monthly Price (₹)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #e8e4f8",
                    backgroundColor: "#faf9ff",
                  }}
                >
                  <span
                    style={{ fontSize: 15, color: "#7b78a0", flexShrink: 0 }}
                  >
                    ₹
                  </span>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="15,000"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: 14,
                      color: "#2e2a50",
                      backgroundColor: "transparent",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2e2a50",
                    marginBottom: 8,
                  }}
                >
                  Security Deposit(₹)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #e8e4f8",
                    backgroundColor: "#faf9ff",
                  }}
                >
                  <span
                    style={{ fontSize: 15, color: "#7b78a0", flexShrink: 0 }}
                  >
                    ₹
                  </span>
                  <input
                    name="security_deposit"
                    value={form.security_deposit}
                    onChange={handleChange}
                    placeholder="7,000"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: 14,
                      color: "#2e2a50",
                      backgroundColor: "transparent",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                backgroundColor: "#f0edf8",
                marginBottom: 28,
              }}
            />

            {/* Amenities */}
            <div style={{ marginBottom: 36 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1a1740",
                  margin: "0 0 18px",
                }}
              >
                Amenities
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {AMENITIES.map((a) => {
                  const checked = selectedAmenities.includes(a);
                  return (
                    <label
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 16px",
                        borderRadius: 10,
                        border: `1.5px solid ${checked ? "#c4b8f8" : "#e8e4f8"}`,
                        backgroundColor: checked ? "#f0edf8" : "#faf9ff",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: checked ? "#4f46e5" : "#5c5680",
                        transition: "all 0.15s",
                        userSelect: "none",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          flexShrink: 0,
                          border: `1.5px solid ${checked ? "#7c6ef8" : "#ccc8e8"}`,
                          backgroundColor: checked ? "#7c6ef8" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {checked && (
                          <span
                            style={{
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      {a}
                    </label>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
                Room Type
              </h2>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {roomTypes.map((item) => {
                  const checked = selectedRoom === item;

                  return (
                    <label
                      key={item}
                      onClick={
                        () => setSelectedRoom(checked ? "" : item) // toggle + single select
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 16px",
                        borderRadius: 10,
                        border: `1.5px solid ${checked ? "#c4b8f8" : "#e8e4f8"}`,
                        backgroundColor: checked ? "#f0edf8" : "#faf9ff",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: checked ? "#4f46e5" : "#5c5680",
                      }}
                    >
                      {/* Checkbox UI */}
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          border: `1.5px solid ${checked ? "#7c6ef8" : "#ccc8e8"}`,
                          backgroundColor: checked ? "#7c6ef8" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {checked && (
                          <span style={{ color: "#fff", fontSize: 10 }}>✓</span>
                        )}
                      </div>

                      {item}
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
                Category
              </h2>

              <div style={{ display: "flex", gap: 10 }}>
                {categories.map((item) => {
                  const checked = selectedCategory === item;

                  return (
                    <label
                      key={item}
                      onClick={() => setSelectedCategory(checked ? "" : item)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 16px",
                        borderRadius: 10,
                        border: `1.5px solid ${checked ? "#c4b8f8" : "#e8e4f8"}`,
                        backgroundColor: checked ? "#f0edf8" : "#faf9ff",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: checked ? "#4f46e5" : "#5c5680",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          border: `1.5px solid ${checked ? "#7c6ef8" : "#ccc8e8"}`,
                          backgroundColor: checked ? "#7c6ef8" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {checked && (
                          <span style={{ color: "#fff", fontSize: 10 }}>✓</span>
                        )}
                      </div>

                      {item}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Nearby Places */}
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1740",
                    margin: 0,
                  }}
                >
                  Nearby Places (Optional)
                </h2>
                <button
                  type="button"
                  onClick={addNearbyPlace}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #c4b8f8",
                    backgroundColor: "#f0edf8",
                    color: "#4f46e5",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add Place
                </button>
              </div>
              {nearbyPlaces.map((place, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 16,
                    padding: 16,
                    border: "1px solid #e8e4f8",
                    borderRadius: 12,
                    backgroundColor: "#faf9ff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#2e2a50",
                        margin: 0,
                      }}
                    >
                      Place {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeNearbyPlace(index)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "none",
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Place name (e.g., Mall, Hospital)"
                      value={place.place}
                      onChange={(e) =>
                        updateNearbyPlace(index, "place", e.target.value)
                      }
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d6d1f2",
                        fontSize: 14,
                        color: "#2e2a50",
                        backgroundColor: "#fff",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Distance (e.g., 2 km)"
                      value={place.distance}
                      onChange={(e) =>
                        updateNearbyPlace(index, "distance", e.target.value)
                      }
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d6d1f2",
                        fontSize: 14,
                        color: "#2e2a50",
                        backgroundColor: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={place.description}
                    onChange={(e) =>
                      updateNearbyPlace(index, "description", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #d6d1f2",
                      fontSize: 14,
                      color: "#2e2a50",
                      backgroundColor: "#fff",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Guidelines */}
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1740",
                    margin: 0,
                  }}
                >
                  Guidelines (Optional)
                </h2>
                <button
                  type="button"
                  onClick={addGuideline}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #c4b8f8",
                    backgroundColor: "#f0edf8",
                    color: "#4f46e5",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add Guideline
                </button>
              </div>
              {guidelines.map((guideline, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 16,
                    padding: 16,
                    border: "1px solid #e8e4f8",
                    borderRadius: 12,
                    backgroundColor: "#faf9ff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#2e2a50",
                        margin: 0,
                      }}
                    >
                      Guideline {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeGuideline(index)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "none",
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Title (e.g., Check-in Time)"
                    value={guideline.title}
                    onChange={(e) =>
                      updateGuideline(index, "title", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #d6d1f2",
                      fontSize: 14,
                      color: "#2e2a50",
                      backgroundColor: "#fff",
                      outline: "none",
                      marginBottom: 12,
                    }}
                  />
                  <textarea
                    placeholder="Description"
                    value={guideline.desc}
                    onChange={(e) =>
                      updateGuideline(index, "desc", e.target.value)
                    }
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #d6d1f2",
                      fontSize: 14,
                      color: "#2e2a50",
                      backgroundColor: "#fff",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                backgroundColor: "#f0edf8",
                marginBottom: 28,
              }}
            />

            {/* Upload Photos */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1740",
                    margin: 0,
                  }}
                >
                  Upload Photos
                </h2>
                <div>
                  <span
                    style={{ fontSize: 12, color: "#9b96b8", fontWeight: 500 }}
                  >
                    4 photos are required • JPEG/PNG
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                {/* Drop zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    flex: isMobile ? "none" : "0 0 320px",
                    width: isMobile ? "100%" : "320px",
                    border: "2px dashed #c4b8f8",
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    cursor: "pointer",
                    backgroundColor: "#faf9ff",
                    transition: "background 0.15s",
                    minHeight: 180,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "#ede9fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      marginBottom: 12,
                    }}
                  >
                    ☁️
                  </div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#2e2a50",
                    }}
                  >
                    Drag &amp; drop images
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#9b96b8",
                      textAlign: "center",
                    }}
                  >
                    or browse from your device
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleFileInput}
                    style={{ display: "none" }}
                  />
                </div>

                {/* Uploaded image thumbnails */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    overflowX: "auto",
                    width: "100%",
                    minHeight: 180,
                    paddingBottom: 4,
                  }}
                >
                  {previewImages.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: 16,
                        overflow: "hidden",
                        position: "relative",
                        minHeight: 180,
                        minWidth: 140,
                        flex: "0 0 140px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <img
                        src={src}
                        alt={`upload-${i}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <button
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          border: "none",
                          color: "#fff",
                          fontSize: 14,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => removeImage(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div
            style={{ height: 1, backgroundColor: "#ddd8f0", margin: "0 0 0" }}
          />

          {/* ── Footer Actions ── */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #f0edf8",
              borderRadius: "0 0 20px 20px",
              boxShadow: "0 2px 16px rgba(91,84,212,0.06)",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                color: "#4f46e5",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {/* Save as Draft */}
            </button>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: "12px 28px",
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#7c6ef8",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "12px 28px",
                  borderRadius: 12,
                  border: "none",
                  background: loading
                    ? "#a5b4fc"
                    : "linear-gradient(135deg, #4f46e5, #7c6ef8)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>

          {/* ── Listing Guarantee Banner ── */}
          <div
            style={{
              marginTop: 32,
              backgroundColor: "#b2f0e8",
              borderRadius: 20,
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "#0d6e5a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🛡
            </div>
            <div>
              <h3
                style={{
                  margin: "0 0 5px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0a3d30",
                }}
              >
                Our Listing Guarantee
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#0f5240",
                  lineHeight: 1.6,
                  fontFamily: "sans-serif",
                }}
              >
                Every property listed on Academic Curator undergoes a strict
                manual verification process within 24 hours to ensure safety for
                our student community.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* TOAST */}
      <div className={`toast ${toast ? "show" : ""}`}>
        ✓ Data saved successfully!
      </div>
    </>
  );
}
