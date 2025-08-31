import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function CardGiornate({ partite, getNomeSquadra }) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-2 max-w-xl mx-auto w-300 text-white">
      {Array.isArray(partite) && partite.length === 0 ? (
        <div className="text-gray-400">Nessuna partita disponibile per il girone B.</div>
      ) : (
        Object.entries(
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
                    <td className="py-2 px-2 text-center align-middle">-</td>
                    <td className="py-2 px-2 font-bold text-lg text-blue-400 text-center align-middle">{p.punti_squadra2}</td>
                    <td className="py-2 px-2 font-semibold text-center align-middle">{getNomeSquadra(p.squadra2_id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

function GironeB() {
  const [classifica, setClassifica] = useState([]);
  const [giornate, setGiornate] = useState([]);
  const [partite, setPartite] = useState([]);
  const [squadre, setSquadre] = useState([]);

  useEffect(() => {
    supabase
      .from("classifica_completa")
      .select("*")
      .eq("girone", "B")
      .order("Pt", { ascending: false })
      .then(({ data }) => setClassifica(data || []));

    supabase
      .from("giornate")
      .select("*")
      .eq("girone", "B")
      .order("data", { ascending: true })
      .then(({ data }) => setGiornate(data || []));

    supabase
      .from("partite")
      .select("*")
      .then(({ data }) => {
        console.log("Partite girone B:", data);
        setPartite(data || []);
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
        <CardGiornate partite={partite} getNomeSquadra={getNomeSquadra} />
      </div>
    </div>
  );
}

export default GironeB;