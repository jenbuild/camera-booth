import "./App.css";

import { IoIosCamera } from "react-icons/io";
import CameraComponent from "./components/CameraComponent";

function App() {

  return (
    <main className="container">

      <CameraComponent />

      <div className="camera-controls">
        <div id="shutter-button">
          <IoIosCamera size={40} fill="white" />
        </div>
      </div>
    </main>
  );
}

export default App;
