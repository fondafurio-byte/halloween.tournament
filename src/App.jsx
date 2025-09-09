import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GironeA from "./pages/GironeA";
import GironeB from "./pages/GironeB";
import { supabase } from "./supabaseClient";


export const AdminContext = createContext({ isAdmin: false });

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName.toLowerCase();
      // F2 per aprire popup admin solo se NON admin e NON in input/textarea/select
      if (!isAdmin && e.key === 'F2' && !['input','textarea','select'].includes(tag)) {
        e.preventDefault();
        setShowAdminLogin(true);
        return false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        setUser(session.user);
        setIsAdmin(true);
        setShowAdminLogin(false);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, user }}>
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
              <Route path="/girone-a" element={<GironeA isAdmin={isAdmin} />} />
              <Route path="/girone-b" element={<GironeB isAdmin={isAdmin} />} />
              <Route path="*" element={<GironeA isAdmin={isAdmin} />} />
            </Routes>
          </div>

          {/* Pulsante accedi come admin in fondo alla pagina */}
          {!isAdmin && (
            <button
              className="mt-8 mb-8 px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold shadow"
              onClick={() => setShowAdminLogin(true)}
            >
              Accedi come admin
            </button>
          )}

          {showAdminLogin && !isAdmin && (
            <CustomAdminLogin onSuccess={() => { setIsAdmin(true); setShowAdminLogin(false); }} onClose={() => setShowAdminLogin(false)} />
          )}
        </div>
      </Router>
    </AdminContext.Provider>
  );
}

// Form custom per login admin tramite tabella utenti
function CustomAdminLogin({ onSuccess, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Query tabella utenti: username e password (plaintext o hash, qui plaintext per esempio)
    const { data, error: dbError } = await supabase
      .from("utenti")
      .select("*")
      .eq("username", username)
      .single();
    if (dbError || !data) {
      setError("Utente non trovato");
      setLoading(false);
      return;
    }
    if (data.password !== password) {
      setError("Password errata");
      setLoading(false);
      return;
    }
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-center">Accesso Amministratore</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full mb-3 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
          />
          <input
            type="password"
            className="w-full mb-3 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 mb-2 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold mb-2"
            disabled={loading}
          >
            {loading ? "Verifica..." : "Accedi"}
          </button>
        </form>
        <button className="w-full py-2 rounded bg-gray-700 text-white" onClick={onClose}>
          Chiudi
        </button>
      </div>
    </div>
  );
}

export default App;