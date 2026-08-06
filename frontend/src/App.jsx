// import { useState, useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";

// import AcademicCurator from "./pages/Home";
// import Search from "./pages/Search";

// import { Routes, Route } from "react-router-dom";
// import OwnerDashboard from "./pages/OwnerDashboard";
// import MyAccount from "./pages/MyAccount";
// import PropertyDetails from "./pages/PropertyDetails";
// import SignupPage from "./pages/SignUpPage";
// import LoginPage from "./pages/LoginPage";
// import ProtectedRoute from "./pages/ProtectedRoute";
// import CreateListing from "./pages/CreateListing";
// import UserData from "./pages/UserData";
// import EditListingModal from "./pages/EditListingModal";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";

// function App() {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       // optional: validate token later
//       console.log("User already logged in");
//     }
//   }, []);

//   return (
//     <>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <AcademicCurator />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/search"
//           element={
//             <ProtectedRoute>
//               <Search />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/owners"
//           element={
//             <ProtectedRoute>
//               <OwnerDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/account"
//           element={
//             <ProtectedRoute>
//               <MyAccount />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/newlisting"
//           element={
//             <ProtectedRoute>
//               <CreateListing />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/collectuserdata"
//           element={
//             <ProtectedRoute>
//               <UserData />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/propertydetails/:id"
//           element={
//             <ProtectedRoute>
//               <PropertyDetails />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/editdetails"
//           element={
//             <ProtectedRoute>
//               <EditListingModal />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//         <Route
//           path="/login"
//           element={
//             localStorage.getItem("token") ? <AcademicCurator /> : <LoginPage />
//           }
//         />

//         <Route
//           path="/signup"
//           element={
//             localStorage.getItem("token") ? <AcademicCurator /> : <SignupPage />
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";

import AcademicCurator from "./pages/Home";
import Search from "./pages/Search";

import { Routes, Route } from "react-router-dom";
import OwnerDashboard from "./pages/OwnerDashboard";
import MyAccount from "./pages/MyAccount";
import PropertyDetails from "./pages/PropertyDetails";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import CreateListing from "./pages/CreateListing";
import UserData from "./pages/UserData";
import EditListingModal from "./pages/EditListingModal";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentReviews from "./pages/Studentreviews";

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // optional: validate token later
      console.log("User already logged in");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<AcademicCurator />} />

        <Route path="/search" element={<Search />} />

        <Route
          path="/owners"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newlisting"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collectuserdata"
          element={
            <ProtectedRoute>
              <UserData />
            </ProtectedRoute>
          }
        />

          <Route
          path="/studentreviews"
          element={
           
              <StudentReviews />
            
          }
        />
        <Route
          path="/propertydetails/:id"
          element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editdetails"
          element={
            <ProtectedRoute>
              <EditListingModal />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/login"
          element={
            localStorage.getItem("token") ? <AcademicCurator /> : <LoginPage />
          }
        />

        <Route
          path="/signup"
          element={
            localStorage.getItem("token") ? <AcademicCurator /> : <SignupPage />
          }
        />
      </Routes>
    </>
  );
}

export default App;
