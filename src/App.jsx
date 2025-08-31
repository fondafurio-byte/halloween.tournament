import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GironeA from "./pages/GironeA";
import GironeB from "./pages/GironeB";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center bg-black text-white">
        <img
          src="https://fakhxzycjmlokihzsply.supabase.co/storage/v1/object/sign/loghi/loGo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81M2Y2MGQwNy1mOTgzLTQ5YjQtYjE5Mi05MDE4Yzg1NGRmYmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2doaS9sb0dvLnBuZyIsImlhdCI6MTc1NjY1NzIxNSwiZXhwIjoxNzg4MTkzMjE1fQ.T0QHXSKNpcCxNgBnKa7gpqDIZq0hqZ8fNfJWSTIOpWg"
          alt="Logo principale"
            className="w-[400px] h-[200px] mt-8 mb-6 mx-auto object-contain"
        />
        <div className="mb-8">
          <select
            className="px-4 py-2 rounded-lg shadow border border-blue-300 text-blue-700 bg-white"
            onChange={e => window.location.href = e.target.value}
            defaultValue={window.location.pathname}
          >
            <option value="/girone-a">Girone A</option>
            <option value="/girone-b">Girone B</option>
          </select>
        </div>
        <div className="w-full max-w-3xl">
          <Routes>
            <Route path="/girone-a" element={<GironeA />} />
            <Route path="/girone-b" element={<GironeB />} />
            <Route path="*" element={<GironeA />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;