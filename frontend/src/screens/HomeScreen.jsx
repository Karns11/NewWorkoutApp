import Cards from "../components/Cards";
// import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Info from "../components/Info";
import Navbar from "../components/Navbar";
import Newslettter from "../components/Newslettter";

function HomeScreen() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Info />
      <Newslettter />
      <Cards />
      {/* <Footer /> */}
    </div>
  );
}

export default HomeScreen;
