import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GironeA from "./pages/GironeA";
import GironeB from "./pages/GironeB";
import { useEffect, useState, createContext } from "react";
import { supabase } from "./supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';


export const AdminContext = createContext({ isAdmin: false });

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Blocca la shortcut solo se NON sei in un campo input/textarea/select
      const tag = document.activeElement.tagName.toLowerCase();
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A') && !['input','textarea','select'].includes(tag)) {
        e.preventDefault();
        setShowAdminLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
              <Route path="/girone-a" element={<GironeA />} />
              <Route path="/girone-b" element={<GironeB />} />
              <Route path="*" element={<GironeA />} />
            </Routes>
          </div>
          {showAdminLogin && !isAdmin && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-xs">
                <h2 className="text-lg font-bold mb-4 text-center">Accesso Amministratore</h2>
                <Auth
                  supabaseClient={supabase}
                  appearance={{ theme: ThemeSupa }}
                  theme="dark"
                  providers={[]}
                />
                <button className="mt-4 w-full py-2 rounded bg-gray-700 text-white" onClick={() => setShowAdminLogin(false)}>
                  Chiudi
                </button>
              </div>
            </div>
          )}
        </div>
      </Router>
    </AdminContext.Provider>
  );
}

export default App;