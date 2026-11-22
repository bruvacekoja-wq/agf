"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { saveStreamer } from "./actions";
import { Activity, Bot, Clapperboard, CircleHelp, Film, Gauge, Link2, ListVideo, Radio, Settings, ShieldCheck, Youtube, Twitch, Zap } from "lucide-react";

type Streamer = { name: string; platform: string; permission: boolean };
const initialStreamers: Streamer[] = [];
const navItems = [
  { name: "Overview", icon: Gauge }, { name: "My streamers", icon: Radio },
  { name: "Clips library", icon: Film }, { name: "Upload queue", icon: ListVideo },
  { name: "Settings", icon: Settings }
];
export default function Home() {
  const [page,setPage] = useState("Overview");
  const [streamers,setStreamers] = useState(initialStreamers);
  const [name,setName] = useState("");
  const [platform,setPlatform] = useState("Twitch");
  const [permission,setPermission] = useState(false);
  const [auto,setAuto] = useState(false);
  const [notice,setNotice] = useState("");
  const [clips,setClips] = useState<{title:string;source:string;status:string}[]>([]);
  const connect = (provider:string) => { window.location.href = `/api/connect/${provider.toLowerCase()}`; };
  
const addStreamer = async () => {
  if (!name.trim() || !permission) {
    setNotice("Enter a streamer name and confirm permission.");
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    setNotice("Please sign in at /login first.");
    return;
  }

  const result = await saveStreamer(
    name.trim(),
    platform,
    true,
    session.access_token
  );

  if ("error" in result) {
    setNotice(result.error || "Unable to save streamer.");
    return;
  }

  setStreamers((previous) => [
    ...previous.filter(
      (s) =>
        !(s.name.toLowerCase() === name.trim().toLowerCase()
          && s.platform === platform)
    ),
    { name: name.trim(), platform, permission: true }
  ]);

  setName("");
  setPermission(false);
  setNotice("Streamer saved to Supabase successfully!");
};

    if(!name.trim() || !permission) { setNotice("Enter the streamer's channel name and confirm they have explicitly granted permission."); return; }
    setStreamers([...streamers,{name:name.trim(),platform,permission:true}]); setName(""); setPermission(false); setNotice("Streamer added to your permission list.");
  };
  const toggleAuto = () => {
    if(!streamers.length){setNotice("Add at least one streamer who has explicitly granted permission first.");return;}
    setAuto(!auto); setNotice(!auto ? "Automation preference saved in this page. Server-side clip processing still needs to be configured." : "Automation paused.");
  };
  return <main className="shell">
    <header className="top">
      <div className="brand"><div className="logo"><Clapperboard size={22}/></div>ClipBot <span style={{color:"#a394ff"}}>AI</span></div>
      <div className="topright"><span className="muted">CREATOR WORKSPACE</span><div className="avatar">C</div></div>
    </header>
    <div className="layout">
      <aside className="side">
        <div className="navlabel">WORKSPACE</div>
        {navItems.map(item=><button key={item.name} className={`nav ${page===item.name?"active":""}`} onClick={()=>{setPage(item.name);setNotice("");}}><item.icon size={17}/>{item.name}</button>)}
        <div className="sidefoot"><ShieldCheck size={16} style={{verticalAlign:"middle",marginRight:6,color:"#6ed9c1"}}/> Permission-first clipping<br/>Only creators you authorize.</div>
      </aside>
      <section className="main">
        <div className="headrow"><div><div className="eyebrow">YOUR CONTENT, ON AUTOPILOT</div><h1 className="heading">{page==="Overview"?"Welcome to your command center":page}</h1><div className="sub">{page==="Overview"?"Your livestream highlights, organized in one place.":"Manage your creator connections and publishing workflow."}</div></div>
          {page==="Overview" && <button className="btn primary" onClick={()=>setPage("My streamers")}><Radio size={15} style={{verticalAlign:"middle",marginRight:7}}/>Add a streamer</button>}
        </div>
        {notice && <div className="notice">{notice}</div>}
        {page==="Overview" && <>
          <div className="stats">
            <div className="card"><div className="statlabel">Connected streamers</div><div className="statnum">{streamers.length}</div><div className="statnote">Permission-confirmed channels</div></div>
            <div className="card"><div className="statlabel">Clips discovered</div><div className="statnum">{clips.length}</div><div className="statnote">Waiting for pipeline setup</div></div>
            <div className="card"><div className="statlabel">Ready to publish</div><div className="statnum">0</div><div className="statnote">YouTube destination required</div></div>
            <div className="card"><div className="statlabel">Automation</div><div className="statnum" style={{fontSize:21,color:auto?"#6ed9c1":"#d6b879"}}>{auto?"Enabled*":"Paused"}</div><div className="statnote">*Preference only until backend setup</div></div>
          </div>
          <div className="columns">
            <div className="card"><div className="cardhead"><div className="cardtitle">Platform connections</div><span className="muted">OAuth</span></div>
              <div className="platform"><div className="platleft"><div className="platicon"><Twitch size={20}/></div><div><div className="platname">Twitch</div><div className="platdesc">Connect creator accounts with permission</div></div></div><button className="btn" onClick={()=>connect("twitch")}>Connect</button></div>
              <div className="platform"><div className="platleft"><div className="platicon yt"><Youtube size={20}/></div><div><div className="platname">YouTube</div><div className="platdesc">Choose your publishing channel</div></div></div><button className="btn" onClick={()=>connect("youtube")}>Connect</button></div>
              <div className="muted" style={{marginTop:12}}>OAuth buttons become active when you add your platform credentials to the server environment.</div>
            </div>
            <div className="card"><div className="cardhead"><div className="cardtitle">Getting started</div><Zap size={17} color="#a394ff"/></div>
              <div className="steps">
                <div className="step"><div className="stepnum">1</div><div><strong>Connect your YouTube channel</strong><p>Authorize ClipBot AI to upload videos to your channel.</p></div></div>
                <div className="step"><div className="stepnum">2</div><div><strong>Add consenting streamers</strong><p>Only add channels after the streamer has granted permission.</p></div></div>
                <div className="step"><div className="stepnum">3</div><div><strong>Configure clip & upload rules</strong><p>Set titles, visibility, and publishing limits before automation.</p></div></div>
              </div>
            </div>
          </div>
          <div className="card wide"><div className="cardhead"><div className="cardtitle">Recent activity</div><Activity size={17} color="#9c8cff"/></div><div className="empty">No activity yet. Connect your platforms and add a permitted streamer to get started.</div></div>
        </>}
        {page==="My streamers" && <div className="card">
          <div className="cardhead"><div><div className="cardtitle">Streamer permissions</div><div className="muted" style={{marginTop:5}}>Add only creators who have explicitly agreed to be clipped.</div></div><ShieldCheck color="#6ed9c1"/></div>
          <div className="notice">Permission matters: adding a channel is your declaration that the streamer has authorized clipping and reuse of their content. Keep a record of their consent outside this demo.</div>
          <div className="field"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Streamer channel name or handle"/><select value={platform} onChange={e=>setPlatform(e.target.value)} className="btn"><option>Twitch</option><option>YouTube</option></select></div>
          <label style={{display:"flex",gap:9,alignItems:"center",fontSize:13,color:"#c3ccdc",marginBottom:15}}><input type="checkbox" checked={permission} onChange={e=>setPermission(e.target.checked)}/> I confirm this streamer has explicitly given permission.</label>
          <button className="btn primary" onClick={addStreamer}>Add permitted streamer</button>
          <div style={{marginTop:22}}>{streamers.length===0?<div className="empty">No streamers added yet.</div>:streamers.map((s,i)=><div className="listrow" key={i}><div><strong>{s.name}</strong><div className="muted">{s.platform}</div></div><span className="tag">Permission confirmed</span></div>)}</div>
        </div>}
        {page==="Clips library" && <div className="card"><div className="cardhead"><div className="cardtitle">Your clips</div><Film color="#9c8cff"/></div><div className="empty">Your discovered clips will appear here once Twitch/YouTube ingestion and clip processing are configured.</div></div>}
        {page==="Upload queue" && <div className="card"><div className="cardhead"><div className="cardtitle">Publishing queue</div><Youtube color="#ff7d8a"/></div><div className="empty">Nothing queued. Connect your YouTube channel and configure upload rules to publish clips.</div></div>}
        {page==="Settings" && <div className="card"><div className="cardhead"><div className="cardtitle">Automation settings</div><Bot color="#a394ff"/></div>
          <div className="listrow"><div><strong>Automatic publishing</strong><div className="muted">Enable the automation preference for permitted streamers.</div></div><button className={`btn ${auto?"primary":""}`} onClick={toggleAuto}>{auto?"Enabled":"Paused"}</button></div>
          <div className="listrow"><div><strong>Streamer permission requirement</strong><div className="muted">Required for every channel added to ClipBot AI.</div></div><span className="tag">Always on</span></div>
          <div className="listrow"><div><strong>Upload visibility</strong><div className="muted">Configure this after YouTube is connected.</div></div><span className="status">Not configured</span></div>
          <div className="notice" style={{marginTop:18}}>This starter site stores the automation preference only in the current browser session. A production scheduler, clipper, secure token vault, and YouTube upload worker must be deployed before automatic publishing can run.</div>
        </div>}
        <div className="footer">ClipBot AI · Built for creators · Permission-first publishing</div>
      </section>
    </div>
  </main>;
}
