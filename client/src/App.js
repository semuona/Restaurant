import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import pizza from "./images/main.png";
import Carousel from "./components/Carousel/Carousel";
function App() {
  return (
    <div className="App">
      <NavBar />
      <div
        style={{
          padding: "30px 0",
          backgroundImage: "url(" + pizza + ")",
          width: "100%",
          height: "850px",
          backgroundPosition: "top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
        }}
      ></div>{" "}
      <Carousel />
    </div>
  );
}

export default App;
