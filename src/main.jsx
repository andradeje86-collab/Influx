import { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";

const T = {
  purple:"#6C4AB6",purpleLight:"#8B6FD4",purpleDark:"#4A2F8A",
  pink:"#FF006E",white:"#FFFFFF",bg:"#F5F5F5",card:"#FFFFFF",
  text:"#1A1A2E",sub:"#7B7B9A",border:"#E8E8F0",
  success:"#00C896",warn:"#FF8C00",
  grad1:"linear-gradient(135deg,#6C4AB6,#8B6FD4)",
  grad2:"linear-gradient(135deg,#FF006E,#FF4D9B)",
  grad3:"linear-gradient(135deg,#00C896,#00A878)",
};

function App() {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#f0ebff"}}>
      <div style={{fontFamily:"Poppins,sans-serif",fontSize:32,fontWeight:800,color:T.purple}}>
        ⚡ Influx funcionando!
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App/>);
