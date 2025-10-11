import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Discover() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      let url = "/creators?take=30";
      if (q) url += `&q=${encodeURIComponent(q)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      const data = await res.json();
      setCreators(data.creators || []);
      setLoading(false);
    };
    fetchCreators();
  }, [q, category]);

  return (
    <main style={{ maxWidth: 900, margin: 'auto', padding: 32 }}>
      <h1>Discover Creators</h1>
      <div style={{ margin: '16px 0' }}>
        <input
          placeholder="Search creators..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ marginRight: 16, padding: 6, width: 220 }}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="music">Music</option>
          <option value="comedy">Comedy</option>
          <option value="athlete">Athlete</option>
          <option value="lifestyle">Lifestyle</option>
          {/* Add more as desired */}
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22 }}>
          {creators.map((creator) => (
            <Link key={creator.id} href={`/creator/${creator.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #eee', borderRadius: 10, width: 240, padding: 15 }}>
                <img
                  src={creator.profilePhotoUrl || '/default-avatar.png'}
                  alt={creator.displayName}
                  width={60}
                  height={60}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
                <h3 style={{ margin: '14px 0 6px 0' }}>{creator.displayName}</h3>
                <p>{creator.bio?.slice(0, 55)}</p>
                <div style={{ fontSize: 12, marginTop: 8 }}>
                  {creator.categories?.map((cat:any) => (
                    <span key={cat} style={{ marginRight: 8, color: '#36c' }}>#{cat}</span>
                  ))}
                </div>
                {creator.verified && <span style={{ color: 'green', fontWeight: 'bold', fontSize: 13 }}>✔ Verified</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
