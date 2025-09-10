import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import { AdminContext } from "../App";

function CardGiornate({ partite, getNomeSquadra, onChange, values, isAdmin, onConferma }) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-2 max-w-xl mx-auto w-300 text-white">
      {Array.isArray(partite) && partite.length === 0 ? (
        <div className="text-gray-400">Nessuna partita disponibile per il girone B.</div>
      ) : (
        <>
          {Object.entries(
            partite
              .filter(p => {
                if (typeof p.n_gara !== 'string') return false;
                const match = p.n_gara.match(/^([1-6])\/B$/);
                if (!match) return false;
                return true;
              })
              .sort((a, b) => {
                const numA = parseInt(a.n_gara.split('/')[0], 10);
                const numB = parseInt(b.n_gara.split('/')[0], 10);
                return numA - numB;
              })
              .reduce((acc, p) => {
                const key = p.n_gara.split('/')[0];
                acc[key] = acc[key] || [];
                acc[key].push(p);
                return acc;
              }, {})
          ).map(([giornata, partiteGiornata]) => (
            <div key={giornata} className="mb-8 p-4 border-2 border-blue-900 rounded-xl bg-gray-950 shadow-lg">
              <div className="font-semibold mb-4 text-blue-300 text-center text-lg">Gara {giornata}</div>
              <table className="w-full bg-gray-800 rounded-lg overflow-hidden table-fixed">
                <colgroup>
                  <col className="w-2/6" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-2/6" />
                </colgroup>
                <tbody>
                  {partiteGiornata.map(p => (
                    <tr key={p.id} className="border-b border-gray-600 text-center align-middle">
                      <td className="py-2 px-2 font-semibold text-center align-middle">{getNomeSquadra(p.squadra1_id)}</td>
                      <td className="py-2 px-2 font-bold text-lg text-blue-400 text-center align-middle">{p.punti_squadra1}</td>
                      <td className="py-2 px-2 text-center align-middle">
                        -
                        <div className="flex flex-col items-center justify-center mt-1 gap-1">
                          <div className="flex flex-row items-center justify-center gap-2 bg-transparent rounded-lg px-3 py-2 shadow-md">
                            {/* bg-transparent mantiene lo sfondo trasparente */}
                            <input
                              type="text"
                              placeholder="CAMPO"
                              className="text-xs px-2 py-1 rounded text-center placeholder:text-gray-400 focus:ring-0 bg-gray-900/30 text-white border border-gray-500"
                              style={{ width: '8.5ch', minWidth: '8.5ch', maxWidth: '8.5ch', marginRight: '0.8rem' }}
                              maxLength={8}
                              value={values[p.id]?.campo || ""}
                              readOnly={false}
                              disabled={false}
                              tabIndex={0}
                            />
                            <input
                              type="time"
                              id={`orario-gara-${p.id}`}
                              name={`orario-gara-${p.id}`}
                              className={`text-xs px-2 py-1 rounded text-white text-center focus:ring-0 ${isAdmin ? 'bg-gray-900 border border-blue-700' : 'bg-transparent border-0'}`}
                              style={{
                                width: isAdmin ? '9ch' : '10ch',
                                minWidth: isAdmin ? '9ch' : '10ch',
                                maxWidth: isAdmin ? '9ch' : '10ch',
                                color: 'white',
                                appearance: !isAdmin ? 'none' : undefined,
                                WebkitAppearance: !isAdmin ? 'none' : undefined,
                                MozAppearance: !isAdmin ? 'none' : undefined
                              }}
                              value={values[p.id]?.orario || ""}
                              onChange={e => isAdmin ? onChange(p.id, "orario", e.target.value) : undefined}
                              disabled={!isAdmin}
                              readOnly={!isAdmin}
                              tabIndex={isAdmin ? 0 : -1}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 font-bold text-lg text-blue-400 text-center align-middle">{p.punti_squadra2}</td>
                      <td className="py-2 px-2 font-semibold text-center align-middle">{getNomeSquadra(p.squadra2_id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {isAdmin && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded shadow-lg"
                onClick={onConferma}
              >
                Conferma Modifiche
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function GironeB({ isAdmin }) {
  const [classifica, setClassifica] = useState([]);
  const [giornate, setGiornate] = useState([]);
  const [partite, setPartite] = useState([]);
  const [squadre, setSquadre] = useState([]);
  // isAdmin ora arriva come prop da App.jsx
  const [inputValues, setInputValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase
      .from("classifica_completa")
      .select("*")
      .eq("girone", "B")
      .order("Pt", { ascending: false })
      .then(({ data }) => setClassifica(data || []));

    supabase
      .from("partite")
      .select("*")
      .eq("girone", "B")
      .order("gara", { ascending: true })
      .order("girone", { ascending: true })
      .then(({ data }) => setGiornate(data || []));

    supabase
      .from("partite")
      .select("*")
      .then(({ data }) => {
        setPartite(data || []);
        // Precarica valori input se presenti
        const initial = {};
        (data || []).forEach(p => {
          initial[p.id] = {
              campo: p.campo || "",
            orario: p.orario || ""
          };
        });
        setInputValues(initial);
      });

    supabase
      .from("squadre")
      .select("*")
      .then(({ data }) => setSquadre(data || []));
  }, []);

  const getNomeSquadra = (id) => {
    const squadra = squadre.find(s => s.id === id);
    return squadra ? squadra.nome_squadra : id;
  };

  const handleInputChange = (id, field, value) => {
    setInputValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleConferma = async () => {
    setLoading(true);
    setMessage("");
    try {
      const updates = Object.entries(inputValues).map(([id, vals]) =>
    supabase.from("partite").update({ campo: vals.campo, orario: vals.orario }).eq("id", id)
      );
      await Promise.all(updates);
      setMessage("Modifiche salvate con successo!");
    } catch (e) {
      setMessage("Errore nel salvataggio delle modifiche.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white py-8">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <div className="w-full max-w-[500px] mx-auto px-1">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-1 px-1 text-left leading-none">Squadra</th>
                <th className="py-1 px-1 text-center leading-none w-[40px]">Pt</th>
                <th className="py-1 px-1 text-center leading-none w-[40px]">V</th>
                <th className="py-1 px-1 text-center leading-none w-[40px]">S</th>
                <th className="py-1 px-1 text-center leading-none w-[40px]">PF</th>
                <th className="py-1 px-1 text-center leading-none w-[40px]">PS</th>
                <th className="py-1 px-1 text-center leading-none w-[40px]">Diff</th>
              </tr>
            </thead>
            <tbody>
              {classifica.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="py-4 px-4">
                    <div className="w-full max-w-4xl px-1 md:px-8">
                      <img
                        src={row.logo}
                        alt={row.squadra + ' logo'}
                        className="w-4 h-4 md:w-8 md:h-8"
                      />
                      <span className="text-lg font-bold leading-tight">{row.squadra}</span>
                    </div>
                  </td>
                  <td className="py-1 px-1 text-center leading-none w-[40px]">{row.Pt}</td>
                  <td className="py-1 px-1 text-center leading-none w-[40px]">{row.V}</td>
                  <td className="py-1 px-1 text-center leading-none w-[40px]">{row.S}</td>
                  <td className="py-1 px-1 text-center leading-none w-[40px]">{row.PF}</td>
                  <td className="py-1 px-1 text-center leading-none w-[40px]">{row.PS}</td>
                  <td className="py-1 px-1 text-center leading-none w-[40px]">{row.Diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full h-20" />
      <div className="w-full max-w-4xl mt-8">
        <CardGiornate
          partite={partite}
          getNomeSquadra={getNomeSquadra}
          onChange={handleInputChange}
          values={inputValues}
          isAdmin={isAdmin}
          onConferma={handleConferma}
        />
        {message && (
          <div className="mt-4 text-center text-lg font-semibold text-green-400">{message}</div>
        )}
        {loading && (
          <div className="mt-2 text-center text-blue-300">Salvataggio in corso...</div>
        )}
      </div>
    </div>
  );
}

export default GironeB;