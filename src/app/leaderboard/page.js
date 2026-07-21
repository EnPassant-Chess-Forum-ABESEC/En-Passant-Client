"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";

export default function LeaderboardPage() {
  const fetchApi = useApi();
  const [timeControl, setTimeControl] = useState("rapid");
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeControl]);

  useEffect(() => {
    loadMyRank();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/leaderboard?timeControl=${timeControl}&limit=20`);
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMyRank = async () => {
    try {
      const data = await fetchApi(`/leaderboard/my-rank`);
      if (data.success) {
        setMyRank(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-8 mt-24 font-sans bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-4">Leaderboard</h1>

      {myRank && (
        <div className="bg-[#1a1a1a] p-4 border border-white/10 flex gap-8 mb-8 text-sm uppercase tracking-wider">
          <div className="text-white/50 font-bold">Your Rank:</div>
          <div>Rapid: {myRank.rapid?.rank ? `#${myRank.rapid.rank} (${myRank.rapid.rating})` : "N/A"}</div>
          <div>Blitz: {myRank.blitz?.rank ? `#${myRank.blitz.rank} (${myRank.blitz.rating})` : "N/A"}</div>
          <div>Bullet: {myRank.bullet?.rank ? `#${myRank.bullet.rank} (${myRank.bullet.rating})` : "N/A"}</div>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        {["rapid", "blitz", "bullet"].map(tc => (
          <button
            key={tc}
            onClick={() => setTimeControl(tc)}
            className={`px-6 py-2 uppercase font-bold tracking-widest text-sm transition border ${timeControl === tc ? 'bg-[#9b1a1a] text-white border-transparent' : 'bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white'}`}
          >
            {tc}
          </button>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#222] text-white/50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4 font-normal">Rank</th>
              <th className="p-4 font-normal">Player</th>
              <th className="p-4 font-normal">Branch/Year</th>
              <th className="p-4 font-normal text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-white/40 uppercase">Loading...</td></tr>
            ) : leaderboard.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-white/40 uppercase">No players found</td></tr>
            ) : (
              leaderboard.map((player, index) => (
                <tr key={player.userId} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono text-[#9b1a1a] font-bold">#{index + 1}</td>
                  <td className="p-4">
                    <div className="font-bold">{player.username}</div>
                    <div className="text-xs text-white/40">{player.chessComUsername || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-sm text-white/70">
                    {player.branch} - {player.year ? `Y${player.year}` : ''}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-lg">
                    {player.rating}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
