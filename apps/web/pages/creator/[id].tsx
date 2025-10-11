import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/creators/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Creator not found.</p>;

  return (
    <main style={{ maxWidth: 760, margin: "auto", padding: 32 }}>
      <div style={{display:'flex', gap:32, alignItems:'center'}}>
        <img src={data.profilePhotoUrl || '/default-avatar.png'} width={90} height={90} style={{borderRadius:'50%',objectFit:'cover'}}/>
        <div>
          <h1>{data.displayName} {data.verified && <span style={{color:'green',fontSize:22}} title="Verified">✔</span>}</h1>
          <div style={{fontSize:14, marginBottom:6}}>
            {data.categories?.map((cat:string) => <span key={cat} style={{color:'#347',marginRight:8}}>#{cat}</span>)}
          </div>
          <p>{data.bio}</p>
          {data.socialLinks && <div style={{marginTop:8, fontSize:13}}>
            {Object.entries(data.socialLinks).map(([k,v])=> <a key={k} href={v as string} target="_blank" style={{marginRight:10}} rel="noopener">{k}</a>)}
          </div>}
        </div>
      </div>
      {data.introVideoUrl && (
        <div style={{margin: '28px 0', maxWidth:400}}>
          <video src={data.introVideoUrl} controls width="100%" />
        </div>
      )}
      <div style={{margin:'24px 0'}}>
        <h3>Booking Tiers</h3>
        {data.pricingTiers ? (
            Object.entries(data.pricingTiers).map(([type, price]) => (
              <div key={type} style={{marginBottom:10}}>{type}: <b>${price}</b></div>
            ))
        ) : (
          <p>No pricing set.</p>
        )}
      </div>
      <button style={{padding:'12px 30px', background:'#349',color:'#fff',borderRadius:8,border:'none',fontSize:16}}>Book Now</button>
    </main>
  );
};

export default ProfilePage;
