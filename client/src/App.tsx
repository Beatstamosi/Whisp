import { useAuth } from "./components//Authentication/useAuth.jsx";
import ScrollToTop from "./components/ScrollToTop.js";
import NavBar from "./components/NavBar/NavBar.js";
import style from "./App.module.css";
import Footer from "./components/Footer/Footer.js";
import { Outlet } from "react-router-dom";

function App() {
  const { loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <ScrollToTop />
      <div className={style.pageWrapper}>
        <NavBar />
        <div className={style.outletContent}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
