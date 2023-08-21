import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";

import Header from "./pages/partials/Header";
import Home from "./pages/Home";
import Companies from "./pages/CompanyTable";
import Products from "./pages/ProductTable";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <div className="App" style={{ height: "100vh" }}>
        <Routes>
          {/* No layout routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with layout */}
          <Route
            path="/*"
            element={
              <Layout style={{ height: "100%" }}>
                <Header />
                <Content style={{ height: "calc(100% - 64px)", overflow: "auto" }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/company" element={<Companies />} />
                    <Route path="/product" element={<Products />} />
                  </Routes>
                </Content>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
