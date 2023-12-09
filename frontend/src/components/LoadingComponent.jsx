import React from "react";
import { motion } from "framer-motion";
import { Card } from "@mui/material";

function LoadingComponent(props) {
  return (
    <Card sx={{ display: "flex", alignItems: "center", width: parseInt(props.width), height: parseInt(props.height) }}>
      <motion.div
        style={{
          background: "linear-gradient(90deg, #B7B7B7, #D3D3D3)",
          width: "30%",
          height: "70%",
          marginLeft: "3%",
          borderRadius: 6,
        }}
        initial={{ background: "linear-gradient(90deg, #B7B7B7, #D3D3D3)" }}
        animate={{ background: "linear-gradient(90deg, #D3D3D3, #B7B7B7)" }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        ‎
      </motion.div>
      <div style={{ width: "60%", marginLeft: "3%" }}>
        <motion.div
          style={{
            background: "linear-gradient(90deg, #B7B7B7, #D3D3D3)",
            width: "100%",
            height: "10%",
            marginBottom: 10,
            borderRadius: 6,
          }}
          initial={{ background: "linear-gradient(90deg, #B7B7B7,#D3D3D3)" }}
          animate={{ background: "linear-gradient(90deg, #D3D3D3, #B7B7B7)" }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          ‎
        </motion.div>
        <motion.div
          style={{
            background: "linear-gradient(90deg, #B7B7B7, #D3D3D3)",
            width: "100%",
            height: "10%",
            borderRadius: 6,
          }}
          initial={{ background: "linear-gradient(90deg, #B7B7B7,#D3D3D3)" }}
          animate={{ background: "linear-gradient(90deg, #D3D3D3, #B7B7B7)" }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          ‎
        </motion.div>
      </div>
    </Card>
  );
}

export default LoadingComponent;
