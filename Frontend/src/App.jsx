import { Routes, Route } from "react-router"
import Navbar from "./components/Navbar"
import HomePage from "./pages/Home"
import ProductPage from "./pages/Product"
import ProfilePage from "./pages/Profile"
import CreateProductPage from "./pages/CreateProduct"
import EditProductPage from "./pages/EditProduct"



function App() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
        </Routes>
      </main>
    </div>
  )
};

export default App
