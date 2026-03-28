import { useState, useEffect, useCallback, useRef } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// THEME
// ══════════════════════════════════════════════════════════════════════════════
const T = {
  purple: "#6C4AB6", purpleLight: "#8B6FD4", purpleDark: "#4A2F8A",
  pink: "#FF006E", pinkLight: "#FF4D9B",
  white: "#FFFFFF", bg: "#F5F5F5", card: "#FFFFFF",
  text: "#1A1A2E", sub: "#7B7B9A", border: "#E8E8F0",
  success: "#00C896", warn: "#FF8C00", danger: "#FF3B30",
  grad1: "linear-gradient(135deg, #6C4AB6, #8B6FD4)",
  grad2: "linear-gradient(135deg, #FF006E, #FF4D9B)",
  grad3: "linear-gradient(135deg, #00C896, #00A878)",
};
const PAL = ["#6C4AB6","#FF006E","#00C896","#FF8C00","#0099FF","#9C27B0","#E91E63","#4CAF50"];
const PLATFORM_FEE = 0.20;

// ══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════════════════════
const USERS_DB = {
  "marca@email.com":   { id:"u1", name:"Jedivan Andrade", email:"marca@email.com",   pass:"123456",  role:"brand",      rating:5, since:2022, avatar:"JA" },
  "inf@email.com":     { id:"u2", name:"Ana Fitness",     email:"inf@email.com",     pass:"123456",  role:"influencer", rating:4, since:2023, avatar:"AF", instagram:"@fitlife_ana", followers:"1.01K", engagement:"13.74", category:"Fitness", pixKey:"ana@pix.com", bio:"Criadora de conteúdo fitness 💪" },
  "admin@influx.com":  { id:"u0", name:"Admin Influx",    email:"admin@influx.com",  pass:"admin123",role:"admin",      avatar:"AD" },
};

const INFLUENCERS_DB = [
  { id:"i1", username:"@mariagomes",   name:"Maria Gomes",     followers:"11.2M", engagement:"0.26",  avatar:"MG", category:"Lifestyle", top:true  },
  { id:"i2", username:"@lucas.art",    name:"Lucas Art",       followers:"3.13M", engagement:"0.06",  avatar:"LA", category:"Arte",      top:false },
  { id:"i3", username:"@natureza_br",  name:"Natureza BR",     followers:"2.48M", engagement:"3.16",  avatar:"NB", category:"Natureza",  top:true  },
  { id:"i4", username:"@beazau",       name:"Bea Zau",         followers:"1.83M", engagement:"3.45",  avatar:"BZ", category:"Moda",      top:true  },
  { id:"i5", username:"@turistandoslz",name:"Turistando SLZ",  followers:"127K",  engagement:"22.91", avatar:"TS", category:"Viagem",    top:true  },
  { id:"i6", username:"@fitlife_ana",  name:"Ana Fitness",     followers:"1.01K", engagement:"13.74", avatar:"FA", category:"Fitness",   top:false },
  { id:"i7", username:"@techbr",       name:"Tech BR",         followers:"2.24K", engagement:"2.14",  avatar:"TB", category:"Tech",      top:false },
  { id:"i8", username:"@cozinhando_br",name:"Cozinhando BR",   followers:"890K",  engagement:"5.2",   avatar:"CB", category:"Gastronomia",top:false},
];

const INIT_PROPOSALS = [
  { id:"3477", type:"Feed",   value:10, netValue:8,  status:"in_progress", date:"25/03/2026 17:13", influencerName:"Ana Fitness", influencerAvatar:"AF", pixKey:"ana@pix.com",
    messages:[{from:"brand",text:"Olá! Aguardando sua entrega 😊",time:"17:15"},{from:"inf",text:"Já estou preparando o conteúdo!",time:"17:20"}] },
  { id:"3476", type:"Stories",value:10, netValue:8,  status:"upload_done", date:"25/03/2026 10:40", influencerName:"Ana Fitness", influencerAvatar:"AF", pixKey:"ana@pix.com",
    messages:[{from:"inf",text:"Fiz o upload! Pode verificar 🎉",time:"11:00"}] },
  { id:"3475", type:"Feed",   value:20, netValue:16, status:"completed",   date:"20/03/2026 14:00", influencerName:"Ana Fitness", influencerAvatar:"AF", pixKey:"ana@pix.com",
    messages:[] },
];

const INIT_PROJECTS = [
  { id:"p1", title:"1 vídeo story",              desc:"Criar um vídeo em modo selfie apresentando as funcionalidades do app.",                   value:10, type:"Stories", status:"active", candidates:["i5","i3","i6","i7","i8"], date:"2026-03-20" },
  { id:"p2", title:"Publicação para story",      desc:"Vídeo em modo selfie, falando das funções do app. Referência: www.influx.com.br.",        value:10, type:"Stories", status:"active", candidates:["i4","i6"],              date:"2026-03-18" },
  { id:"p3", title:"Post no feed institucional", desc:"Foto no feed apresentando o produto com legenda criativa.",                               value:20, type:"Feed",    status:"done",   candidates:[],                        date:"2026-03-10" },
  { id:"p4", title:"Reels de lançamento",        desc:"Reels criativo mostrando o produto em uso no dia a dia.",                                 value:50, type:"Reels",   status:"open",   candidates:[],                        date:"2026-03-25" },
];

const ADMIN_USERS = [
  { id:"u1", name:"Jedivan Andrade", email:"marca@email.com",  role:"brand",      status:"active",  since:"Jan 2022", projects:3,  spent:40  },
  { id:"u2", name:"Ana Fitness",     email:"inf@email.com",    role:"influencer", status:"active",  since:"Mar 2023", proposals:3, earned:24 },
  { id:"u3", name:"Maria Gomes",     email:"maria@email.com",  role:"influencer", status:"active",  since:"Fev 2022", proposals:12,earned:320},
  { id:"u4", name:"Lucas Art",       email:"lucas@email.com",  role:"influencer", status:"pending", since:"Mar 2026", proposals:0, earned:0  },
  { id:"u5", name:"TechStartup BR",  email:"tech@brand.com",   role:"brand",      status:"active",  since:"Dez 2025", projects:8,  spent:250 },
];

const STATUS_ORDER = ["created","paid","in_progress","upload_done","approved","completed"];
const TIMELINE = [
  { key:"created",     label:"Proposta Criada",  desc:"A proposta foi criada pelo anunciante.",          icon:"📄" },
  { key:"paid",        label:"Proposta Paga",    desc:"A proposta foi paga pelo anunciante via PIX.",     icon:"💰" },
  { key:"in_progress", label:"Em Andamento",     desc:"Aguardando o influencer realizar o serviço.",      icon:"⏳" },
  { key:"upload_done", label:"Upload Feito",     desc:"O influencer enviou o conteúdo para aprovação.",   icon:"📤" },
  { key:"approved",    label:"Aprovado",         desc:"Marca aprovou. Transferência PIX em até 24h.",     icon:"✅" },
  { key:"completed",   label:"Tudo Feito!",      desc:"A proposta foi concluída com sucesso.",            icon:"🏆" },
];

// ══════════════════════════════════════════════════════════════════════════════
// SHARED UI
// ══════════════════════════════════════════════════════════════════════════════
function Av({ initials, size=42, idx=0 }) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:PAL[idx%PAL.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*.34,flexShrink:0,fontFamily:"Poppins,sans-serif"}}>{initials}</div>;
}
function Stars({ n=5 }) { return <span style={{color:"#FFB800",fontSize:15,letterSpacing:2}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>; }
function Card({ children, style={}, onClick }) {
  return <div onClick={onClick} style={{background:T.card,borderRadius:20,padding:18,boxShadow:"0 2px 16px rgba(108,74,182,.08)",marginBottom:12,cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}
function BannerCard({ label, value, icon, grad }) {
  return <div style={{background:grad,borderRadius:20,padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,boxShadow:"0 6px 20px rgba(108,74,182,.2)"}}><div><div style={{color:"rgba(255,255,255,.85)",fontSize:13,fontFamily:"Poppins,sans-serif",marginBottom:4}}>{label}</div><div style={{color:T.white,fontSize:26,fontWeight:800,fontFamily:"Poppins,sans-serif"}}>{value}</div></div><span style={{fontSize:38}}>{icon}</span></div>;
}
function Btn({ label, onClick, v="purple", sm=false, full=false, off=false }) {
  const bgs = {purple:T.grad1,pink:T.grad2,green:T.grad3,ghost:"transparent",danger:"linear-gradient(135deg,#FF3B30,#FF6B6B)",gray:"#ddd"};
  const clr = {ghost:T.purple,gray:T.sub};
  return <button onClick={onClick} disabled={off} style={{background:bgs[v]||T.grad1,color:clr[v]||T.white,border:v==="ghost"?`1.5px solid ${T.purple}`:"none",borderRadius:50,padding:sm?"8px 16px":"13px 22px",fontSize:sm?11:14,fontWeight:700,fontFamily:"Poppins,sans-serif",cursor:off?"not-allowed":"pointer",width:full?"100%":"auto",opacity:off?.55:1,boxShadow:v!=="ghost"&&v!=="gray"?"0 4px 14px rgba(108,74,182,.25)":"none",transition:"all .2s"}}>{label}</button>;
}
function Inp({ label, type="text", value, onChange, placeholder, prefix }) {
  return <div style={{marginBottom:14}}>{label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{label}</label>}<div style={{position:"relative"}}>{prefix&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:14}}>{prefix}</span>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:prefix?"13px 16px 13px 36px":"13px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:14,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=T.purple} onBlur={e=>e.target.style.borderColor=T.border} /></div></div>;
}
function Sel({ label, value, onChange, options }) {
  return <div style={{marginBottom:14}}>{label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:14,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></div>;
}
function Hdr({ title, sub, onBack, right, dark }) {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 12px",background:dark?T.purple:T.white,borderBottom:dark?"none":`1px solid ${T.border}`,flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:10}}>{onBack&&<button onClick={onBack} style={{background:dark?"rgba(255,255,255,.2)":"none",border:"none",cursor:"pointer",fontSize:17,color:dark?T.white:T.purple,padding:dark?"6px 10px":0,borderRadius:10}}> ← </button>}<div><div style={{fontSize:onBack?19:23,fontWeight:800,color:dark?T.white:T.pink,fontFamily:"Poppins,sans-serif",lineHeight:1.1}}>{title}</div>{sub&&<div style={{fontSize:11,color:dark?"rgba(255,255,255,.7)":T.sub,fontFamily:"Poppins,sans-serif",marginTop:1}}>{sub}</div>}</div></div>{right}</div>;
}
function Toast({ msg, type="info", onClose }) {
  useEffect(()=>{const t=setTimeout(onClose,3800);return()=>clearTimeout(t);},[onClose]);
  const bg = type==="success"?T.success:type==="warn"?T.warn:T.purpleDark;
  return <div style={{position:"absolute",top:14,left:14,right:14,background:bg,color:T.white,borderRadius:14,padding:"12px 16px",zIndex:999,fontFamily:"Poppins,sans-serif",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.25)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{msg}</span><button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:16}}>✕</button></div>;
}
function Badge({ s }) {
  const m = {created:["🟣","#ede7f6","#6C4AB6"],paid:["💰","#e8f5e9","#00C896"],in_progress:["⏳","#e3f2fd","#1565C0"],upload_done:["📤","#fff8e1","#FF8C00"],approved:["✅","#e8f5e9","#00A878"],completed:["🏆","#f3e5f5","#7B1FA2"],open:["🟢","#e8f5e9","#00C896"],active:["🔵","#e3f2fd","#1565C0"],done:["✓","#f5f5f5","#888"],pending:["⏸","#fff8e1","#FF8C00"]};
  const [icon,bg,fg]=m[s]||["·","#eee","#555"];
  return <span style={{background:bg,color:fg,fontSize:10,fontWeight:700,fontFamily:"Poppins,sans-serif",padding:"3px 9px",borderRadius:50,display:"inline-flex",alignItems:"center",gap:3}}>{icon} {s}</span>;
}

// ══════════════════════════════════════════════════════════════════════════════
// PROPOSAL TIMELINE
// ══════════════════════════════════════════════════════════════════════════════
function ProposalTimeline({ proposal, role, onAction, onChat }) {
  const curIdx = STATUS_ORDER.indexOf(proposal.status);
  return (
    <div style={{flex:1,overflowY:"auto",background:T.bg}}>
      <div style={{background:T.purple,padding:"16px 20px 22px"}}>
        <div style={{fontSize:20,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif",marginBottom:14}}>Resumo da Proposta</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["STATUS", TIMELINE.find(s=>s.key===proposal.status)?.label],["PROPOSTA Nº", proposal.id]].map(([l,v])=>(
            <div key={l} style={{background:"rgba(255,255,255,.15)",borderRadius:14,padding:"10px 14px"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.7)",fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
              <div style={{fontSize:14,fontWeight:700,color:T.white,fontFamily:"Poppins,sans-serif",marginTop:2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"18px 20px 8px"}}>
        {/* Timeline */}
        <Card style={{padding:"20px 16px"}}>
          {TIMELINE.map((step,i)=>{
            const done=i<curIdx, active=i===curIdx, future=i>curIdx;
            return (
              <div key={step.key} style={{display:"flex",gap:16}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:20,flexShrink:0}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:done?T.pink:active?T.purpleDark:"#ccc",border:active?`3px solid ${T.purple}`:"none",boxShadow:active?"0 0 0 4px rgba(108,74,182,.2)":"none",flexShrink:0,marginTop:6}} />
                  {i<TIMELINE.length-1&&<div style={{width:2,flex:1,minHeight:28,background:done?T.pink:active?"linear-gradient(#4A2F8A,#ccc)":"#e0e0e0",marginTop:2}} />}
                </div>
                <div style={{paddingBottom:i<TIMELINE.length-1?18:0,paddingTop:4,flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{step.icon}</span>
                    <span style={{fontSize:14,fontWeight:700,color:future?T.sub:T.text,fontFamily:"Poppins,sans-serif"}}>{step.label}</span>
                  </div>
                  <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif",marginTop:3,lineHeight:1.5}}>{step.desc}</div>
                </div>
              </div>
            );
          })}
        </Card>
        {/* Value */}
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Valor total</div><div style={{fontSize:22,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {proposal.value},00</div></div>
            {role==="influencer"&&<div style={{textAlign:"right"}}><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Você recebe (−20%)</div><div style={{fontSize:20,fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {proposal.netValue},00</div></div>}
          </div>
          {role==="influencer"&&<div style={{marginTop:10,padding:"8px 12px",background:"#f0ebff",borderRadius:10,fontSize:11,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>🔑 PIX: {proposal.pixKey}</div>}
        </Card>
        {/* Buttons */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <Btn label="📄 Conteúdo" onClick={()=>alert("Ver conteúdo enviado")} v="purple" />
          <Btn label="ℹ️ Info & Ações" onClick={()=>alert("Informações")} v="purple" />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <Btn label="💬 Chat" onClick={onChat} v="pink" />
          {!["completed","approved"].includes(proposal.status)&&<Btn label="🚫 Cancelar" onClick={()=>alert("Cancelar proposta?")} v="danger" />}
        </div>
        {role==="influencer"&&proposal.status==="in_progress"&&<Btn label="📤 Avisar que fiz o serviço" onClick={()=>onAction("upload_done")} v="green" full />}
        {role==="brand"&&proposal.status==="upload_done"&&<Btn label="✅ Aprovar entrega e liberar pagamento" onClick={()=>onAction("approved")} v="green" full />}
        {role==="brand"&&proposal.status==="paid"&&<Btn label="▶️ Iniciar serviço" onClick={()=>onAction("in_progress")} v="purple" full />}
        {proposal.status==="approved"&&<div style={{marginTop:12,padding:"12px 16px",background:"#e8f5e9",borderRadius:14,fontSize:12,color:"#2E7D32",fontFamily:"Poppins,sans-serif",fontWeight:600,textAlign:"center"}}>⚡ Transferência PIX agendada em até 24h para {proposal.pixKey}</div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT
// ══════════════════════════════════════════════════════════════════════════════
function ChatScreen({ proposal, role, onBack, onSend }) {
  const [msg,setMsg]=useState("");
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[proposal.messages]);
  const send=()=>{if(!msg.trim())return;onSend(proposal.id,{from:role==="brand"?"brand":"inf",text:msg.trim(),time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})});setMsg("");};
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:T.bg}}>
      <Hdr title={`Chat #${proposal.id}`} sub={proposal.type} onBack={onBack} dark />
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {proposal.messages.map((m,i)=>{
          const mine=(role==="brand"&&m.from==="brand")||(role==="influencer"&&m.from==="inf");
          return <div key={i} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}><div style={{maxWidth:"75%",background:mine?T.grad1:T.white,color:mine?T.white:T.text,borderRadius:mine?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",boxShadow:"0 2px 8px rgba(0,0,0,.07)",fontFamily:"Poppins,sans-serif"}}><div style={{fontSize:13}}>{m.text}</div><div style={{fontSize:10,opacity:.7,marginTop:4,textAlign:"right"}}>{m.time}</div></div></div>;
        })}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 16px",background:T.white,borderTop:`1px solid ${T.border}`,display:"flex",gap:10}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Mensagem..." style={{flex:1,padding:"11px 16px",borderRadius:50,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none"}} />
        <button onClick={send} style={{width:42,height:42,borderRadius:"50%",background:T.grad1,border:"none",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>➤</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const submit=async()=>{setErr("");setLoading(true);await new Promise(r=>setTimeout(r,700));const u=USERS_DB[email.toLowerCase()];if(u&&u.pass===pass)onLogin(u);else setErr("Email ou senha incorretos.");setLoading(false);};
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:28,background:T.white}}>
      <div style={{textAlign:"center",marginBottom:34}}>
        <div style={{width:76,height:76,borderRadius:24,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 8px 24px rgba(108,74,182,.35)"}}><span style={{fontSize:38}}>⚡</span></div>
        <div style={{fontSize:32,fontWeight:900,background:T.grad1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"Poppins,sans-serif"}}>Influx</div>
        <div style={{fontSize:13,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Marketplace de Influenciadores</div>
      </div>
      <Inp label="Email" type="email" value={email} onChange={setEmail} placeholder="seu@email.com"/>
      <Inp label="Senha" type="password" value={pass} onChange={setPass} placeholder="••••••••"/>
      {err&&<div style={{color:T.pink,fontSize:12,fontFamily:"Poppins,sans-serif",marginBottom:10,fontWeight:600}}>⚠️ {err}</div>}
      <Btn label={loading?"Entrando...":"Entrar 🔐"} onClick={submit} v="purple" full off={loading}/>
      <div style={{marginTop:20,padding:16,background:"#f0ebff",borderRadius:14,fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif",lineHeight:1.8}}>
        <div style={{fontWeight:700,color:T.purple,marginBottom:4}}>Contas demo:</div>
        <div>🏢 Marca: marca@email.com / 123456</div>
        <div>⭐ Influencer: inf@email.com / 123456</div>
        <div>🛡️ Admin: admin@influx.com / admin123</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BRAND SCREENS
// ══════════════════════════════════════════════════════════════════════════════
function BrandHome({ user, onTab, onGo, proposals }) {
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <div style={{padding:"16px 20px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Olá,</div><div style={{fontSize:20,fontWeight:800,color:T.pink,fontFamily:"Poppins,sans-serif"}}>{user.name} 👋</div></div>
        <div style={{width:42,height:42,borderRadius:14,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:20}}>⚡</span></div>
      </div>
      <div style={{padding:"8px 20px"}}>
        <BannerCard label="Projetos Realizados" value="3 projetos" icon="📋" grad={T.grad1}/>
        <div style={{fontSize:15,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 10px"}}>Ações</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {[{icon:"📋",label:"Criar Projeto",grad:T.grad1,act:()=>onGo("create")},{icon:"👥",label:"Encontrar Influencers",grad:T.grad2,act:()=>onTab("explore")}].map((a,i)=>(
            <button key={i} onClick={a.act} style={{background:a.grad,border:"none",borderRadius:20,padding:"20px 14px",cursor:"pointer",textAlign:"left",boxShadow:"0 4px 16px rgba(108,74,182,.2)"}}>
              <span style={{fontSize:30,display:"block",marginBottom:8}}>{a.icon}</span>
              <span style={{color:T.white,fontSize:13,fontWeight:700,fontFamily:"Poppins,sans-serif",lineHeight:1.3}}>{a.label}</span>
              <span style={{color:"rgba(255,255,255,.8)",fontSize:18,display:"block",marginTop:4}}>→</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:15,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Contratações Recentes</div>
        {proposals.map((h,i)=>(
          <Card key={h.id} onClick={()=>onGo("proposal",h)} style={{display:"flex",alignItems:"center",gap:12}}>
            <Av initials={h.influencerAvatar} size={42} idx={i}/>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{h.type} 1x</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{h.date}</div></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}><div style={{fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {h.value}</div><Badge s={h.status}/></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ExploreScreen({ onInfluencer }) {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("Todos");
  const cats=["Todos","Lifestyle","Moda","Viagem","Fitness","Tech","Gastronomia","Natureza","Arte"];
  const list=INFLUENCERS_DB.filter(i=>(filter==="Todos"||i.category===filter)&&(i.username.toLowerCase().includes(search.toLowerCase())||i.category.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{flex:1,overflowY:"auto",background:T.bg}}>
      <div style={{background:T.white,padding:"0 20px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0 8px"}}>
          <span style={{fontSize:24,fontWeight:800,color:T.pink,fontFamily:"Poppins,sans-serif"}}>Explorar</span>
          <div style={{width:36,height:36,background:T.grad1,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><span>⚡</span></div>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Buscar..." style={{width:"100%",padding:"11px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{padding:"12px 20px 4px"}}>
        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>⭐ Top Influencers</div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,scrollbarWidth:"none"}}>
          {INFLUENCERS_DB.filter(i=>i.top).map((inf,i)=>(
            <button key={inf.id} onClick={()=>onInfluencer(inf)} style={{background:T.white,border:`2px solid ${T.pink}`,borderRadius:16,padding:"12px 14px",cursor:"pointer",flexShrink:0,textAlign:"center",minWidth:90}}>
              <span style={{fontSize:11,color:"#FFB800"}}>★</span>
              <div style={{margin:"4px auto"}}><Av initials={inf.avatar} size={36} idx={i}/></div>
              <div style={{fontSize:10,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>{inf.username}</div>
              <span style={{fontSize:11,color:"#FFB800"}}>★</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"6px 20px",scrollbarWidth:"none"}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{background:filter===c?T.grad1:T.white,color:filter===c?T.white:T.sub,border:`1.5px solid ${filter===c?T.purple:T.border}`,borderRadius:50,padding:"5px 12px",fontSize:11,fontFamily:"Poppins,sans-serif",fontWeight:600,cursor:"pointer",flexShrink:0}}>{c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"8px 20px 20px"}}>
        {list.map((inf,i)=>(
          <button key={inf.id} onClick={()=>onInfluencer(inf)} style={{background:T.card,borderRadius:20,padding:"16px 12px",textAlign:"center",border:"none",cursor:"pointer",boxShadow:"0 2px 12px rgba(108,74,182,.08)"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Av initials={inf.avatar} size={48} idx={i}/></div>
            <div style={{background:T.border,borderRadius:8,height:8,margin:"0 auto 10px",width:"65%"}}/>
            <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{inf.followers}</div>
            <div style={{fontSize:10,color:T.sub,fontFamily:"Poppins,sans-serif"}}>seguidores</div>
            <div style={{fontSize:13,fontWeight:700,color:T.pink,fontFamily:"Poppins,sans-serif",marginTop:3}}>{inf.engagement}%</div>
            <div style={{fontSize:10,color:T.sub,fontFamily:"Poppins,sans-serif"}}>engajamento</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BrandFinance({ proposals }) {
  const total=proposals.reduce((s,h)=>s+h.value,0);
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Finanças"/>
      <div style={{padding:"8px 20px 20px"}}>
        <BannerCard label="Investido este mês" value={`R$ ${total},00`} icon="📈" grad={T.grad1}/>
        <BannerCard label="Saldo atual" value="R$ 0,00" icon="💰" grad={T.grad2}/>
        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"18px 0 10px"}}>Adicionar saldo</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
          {[{icon:"⚡",label:"Depositar por PIX"},{icon:"🏦",label:"Depositar por Boleto"}].map((b,i)=>(
            <button key={i} onClick={()=>alert(`${b.label} — integrar com API de pagamento`)} style={{background:T.grad1,border:"none",borderRadius:18,padding:"18px 14px",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:28,display:"block",marginBottom:8}}>{b.icon}</span>
              <span style={{color:T.white,fontSize:12,fontWeight:700,fontFamily:"Poppins,sans-serif",lineHeight:1.3}}>{b.label}</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Transações</div>
        {proposals.map((h,i)=>(
          <Card key={h.id} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✓</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{h.type} 1x</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{h.influencerName}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {h.value}</div><Badge s={h.status}/></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BrandProjects({ proposals, onCreate, onView }) {
  const active=proposals.filter(p=>["paid","in_progress","upload_done"].includes(p.status));
  const done=proposals.filter(p=>["approved","completed"].includes(p.status));
  const pending=proposals.filter(p=>p.status==="created");
  const Row=({p,dim})=>(
    <Card onClick={()=>onView(p)} style={{display:"flex",alignItems:"center",gap:12,opacity:dim?.7:1}}>
      <Av initials={p.influencerAvatar} size={40} idx={1}/>
      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:dim?T.sub:T.purple,fontFamily:"Poppins,sans-serif"}}>#{p.id} | {p.type} 1x</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.date}</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><span style={{fontWeight:800,color:dim?T.sub:T.purple,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {p.value}</span><Badge s={p.status}/></div>
    </Card>
  );
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Projetos"/>
      <div style={{padding:"8px 20px 20px"}}>
        <button onClick={onCreate} style={{width:"100%",background:T.grad1,border:"none",borderRadius:20,padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{color:T.white,fontSize:15,fontWeight:700,fontFamily:"Poppins,sans-serif"}}>Criar Projeto</span><span style={{fontSize:26}}>📋</span>
        </button>
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 8px"}}>Propostas com pendências</div>
        {pending.length===0?<div style={{textAlign:"center",color:T.pink,fontSize:13,fontFamily:"Poppins,sans-serif",padding:"10px 0 18px",fontWeight:600}}>Tudo ok! Nenhuma proposta precisa da sua atenção ✅</div>:pending.map(p=><Row key={p.id} p={p}/>)}
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"8px 0"}}>Em andamento</div>
        {active.map(p=><Row key={p.id} p={p}/>)}
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 8px"}}>Realizadas</div>
        {done.map(p=><Row key={p.id} p={p} dim/>)}
      </div>
    </div>
  );
}

function CreateProject({ onBack, onDone }) {
  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [type,setType]=useState("Stories");
  const [value,setValue]=useState("");
  const net=value?Math.floor(Number(value)*.8):0;
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Criar Projeto" onBack={onBack}/>
      <div style={{padding:"8px 20px 24px"}}>
        <Inp label="Título" value={title} onChange={setTitle} placeholder="Ex: Post no feed institucional"/>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Tipo de publi</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Feed","Stories","Reels","Video"].map(t=><button key={t} onClick={()=>setType(t)} style={{background:type===t?T.grad1:T.bg,color:type===t?T.white:T.sub,border:`1.5px solid ${type===t?T.purple:T.border}`,borderRadius:50,padding:"7px 16px",fontSize:12,fontFamily:"Poppins,sans-serif",fontWeight:600,cursor:"pointer"}}>{t}</button>)}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Descrição</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descreva o que o influenciador deve fazer..." style={{width:"100%",padding:"12px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box",minHeight:80,resize:"none"}}/>
        </div>
        <Inp label="Valor da publi (R$)" type="number" value={value} onChange={setValue} placeholder="Ex: 50"/>
        {value&&<div style={{padding:"12px 16px",background:"#f0ebff",borderRadius:12,marginBottom:16,fontSize:12,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>💡 Influencer recebe R$ {net},00 (plataforma retém 20% = R$ {Number(value)-net},00)</div>}
        <Btn label="Publicar Projeto 🚀" onClick={()=>{if(!title||!value)return alert("Preencha título e valor.");onDone({id:"p"+Date.now(),title,desc,type,value:Number(value),status:"open",candidates:[],date:new Date().toLocaleDateString("pt-BR")});}} v="pink" full/>
      </div>
    </div>
  );
}

function ProfileScreen({ user, onLogout, onEdit }) {
  const items=[{icon:"✅",label:"Status da Conta",first:true},{icon:"👤",label:"Editar Perfil",action:onEdit},{icon:"⚙️",label:"Configurações"},{icon:"💬",label:"Suporte"},{icon:"🛡️",label:"Feedback"},{icon:"🚪",label:"Sair",action:onLogout,danger:true}];
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 20px",background:T.white}}>
        <Av initials={user.avatar} size={68} idx={0}/>
        <div style={{fontSize:20,fontWeight:800,color:T.pink,fontFamily:"Poppins,sans-serif",marginTop:12}}>{user.name}</div>
        <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{user.role==="brand"?"Anunciante":"Influenciador"}</div>
        <div style={{marginTop:6}}><Stars n={user.rating||5}/></div>
      </div>
      <div style={{padding:"16px 20px"}}>
        {items.map((item,i)=>(
          <button key={i} onClick={item.action||(()=>alert(`${item.label} — em breve`))} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:item.first?T.grad1:T.card,border:"none",borderRadius:16,marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:19}}>{item.icon}</span>
              <span style={{fontSize:14,fontWeight:600,color:item.first?T.white:item.danger?T.pink:T.text,fontFamily:"Poppins,sans-serif"}}>{item.label}</span>
            </div>
            <span style={{color:item.first?"rgba(255,255,255,.8)":T.sub,fontSize:18}}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INFLUENCER SCREENS
// ══════════════════════════════════════════════════════════════════════════════
function InfHome({ user, onTab, onGo, proposals }) {
  const earned=proposals.filter(p=>p.status==="completed").reduce((s,p)=>s+p.netValue,0);
  const pending=proposals.filter(p=>["paid","in_progress","upload_done"].includes(p.status)).length;
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <div style={{background:T.grad1,padding:"20px 20px 28px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.75)",fontFamily:"Poppins,sans-serif"}}>Olá,</div>
            <div style={{fontSize:20,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif"}}>{user.name} ⚡</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.8)",fontFamily:"Poppins,sans-serif",marginTop:2}}>{user.instagram}</div>
          </div>
          <Av initials={user.avatar} size={48} idx={5}/>
        </div>
      </div>
      <div style={{padding:"0 20px",marginTop:-14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <Card style={{textAlign:"center",padding:"16px 10px"}}><div style={{fontSize:21,fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {earned},00</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Total ganho</div></Card>
          <Card style={{textAlign:"center",padding:"16px 10px"}}><div style={{fontSize:21,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{pending}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Em andamento</div></Card>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {[{icon:"🔍",label:"Ver Projetos",grad:T.grad2,act:()=>onTab("projects")},{icon:"📋",label:"Minhas Propostas",grad:T.grad1,act:()=>onTab("proposals")}].map((a,i)=>(
            <button key={i} onClick={a.act} style={{background:a.grad,border:"none",borderRadius:18,padding:"18px 14px",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:28,display:"block",marginBottom:8}}>{a.icon}</span>
              <span style={{color:T.white,fontSize:12,fontWeight:700,fontFamily:"Poppins,sans-serif",lineHeight:1.3}}>{a.label}</span>
              <span style={{color:"rgba(255,255,255,.8)",fontSize:16,display:"block",marginTop:4}}>→</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Últimas atividades</div>
        {proposals.slice(0,3).map((p,i)=>(
          <Card key={p.id} onClick={()=>onGo("proposal",p)} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:12,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📄</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>Proposta #{p.id}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.type} · {p.date}</div></div>
            <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><span style={{fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif",fontSize:13}}>R$ {p.netValue}</span><Badge s={p.status}/></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfProjects({ projects, onApply, applied }) {
  const open=projects.filter(p=>p.status==="open"||p.status==="active");
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Projetos Abertos" sub="Candidate-se e ganhe!"/>
      <div style={{padding:"8px 20px 20px"}}>
        {open.length===0&&<div style={{textAlign:"center",color:T.sub,fontFamily:"Poppins,sans-serif",padding:30,fontSize:13}}>Nenhum projeto disponível no momento.</div>}
        {open.map(p=>{
          const net=Math.floor(p.value*(1-PLATFORM_FEE));
          const already=applied.includes(p.id);
          return (
            <Card key={p.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{p.title}</div>
                  <div style={{display:"flex",gap:6,marginTop:5}}>
                    <span style={{background:"#f0ebff",color:T.purple,fontSize:10,fontFamily:"Poppins,sans-serif",fontWeight:700,padding:"2px 9px",borderRadius:50}}>{p.type}</span>
                    <Badge s={p.status}/>
                  </div>
                </div>
              </div>
              <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif",lineHeight:1.5,marginBottom:12}}>{p.desc}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Você recebe (−20% plataforma)</div>
                  <div style={{fontSize:24,fontWeight:900,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {net},00</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Candidatos</div>
                  <div style={{fontSize:18,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{p.candidates.length}</div>
                </div>
              </div>
              <Btn label={already?"✅ Candidatura enviada":"🙋 Me candidatar"} onClick={()=>{if(!already)onApply(p);}} v={already?"gray":"pink"} full off={already}/>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function InfProposals({ proposals, onView }) {
  const active=proposals.filter(p=>["paid","in_progress","upload_done"].includes(p.status));
  const done=proposals.filter(p=>["approved","completed"].includes(p.status));
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Minhas Propostas"/>
      <div style={{padding:"8px 20px 20px"}}>
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Em andamento ({active.length})</div>
        {active.length===0&&<div style={{color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:12,marginBottom:16}}>Nenhuma proposta ativa.</div>}
        {active.map(p=>(
          <Card key={p.id} onClick={()=>onView(p)} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:T.grad2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📋</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>#{p.id} · {p.type}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {p.netValue}</div><Badge s={p.status}/></div>
          </Card>
        ))}
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 10px"}}>Concluídas ({done.length})</div>
        {done.map(p=>(
          <Card key={p.id} onClick={()=>onView(p)} style={{display:"flex",alignItems:"center",gap:12,opacity:.7}}>
            <div style={{width:40,height:40,borderRadius:12,background:T.grad3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏆</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>#{p.id} · {p.type}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {p.netValue}</div><Badge s={p.status}/></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfFinance({ proposals }) {
  const earned=proposals.filter(p=>p.status==="completed").reduce((s,p)=>s+p.netValue,0);
  const pending=proposals.filter(p=>p.status==="approved").reduce((s,p)=>s+p.netValue,0);
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Meus Ganhos"/>
      <div style={{padding:"8px 20px 20px"}}>
        <BannerCard label="Total ganho (líquido)" value={`R$ ${earned},00`} icon="💸" grad={T.grad3}/>
        <BannerCard label="Aguardando transferência" value={`R$ ${pending},00`} icon="⏳" grad={T.grad1}/>
        <div style={{padding:"14px 16px",background:"#fff8e1",borderRadius:16,marginBottom:16,border:`1px solid #FFD54F`}}>
          <div style={{fontSize:13,fontWeight:700,color:T.warn,fontFamily:"Poppins,sans-serif",marginBottom:4}}>⚡ Como funciona o pagamento</div>
          <div style={{fontSize:12,color:T.text,fontFamily:"Poppins,sans-serif",lineHeight:1.7}}>Após a marca aprovar sua entrega, o pagamento é enviado via <b>PIX em até 24 horas</b> automaticamente para sua chave cadastrada no perfil.</div>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Histórico de pagamentos</div>
        {proposals.map(p=>(
          <Card key={p.id} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:p.status==="completed"?"#e8f5e9":"#fff8e1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{p.status==="completed"?"✓":"⏳"}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>Proposta #{p.id} · {p.type}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {p.netValue}</div><Badge s={p.status}/></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfProfileEdit({ user, onBack }) {
  const [name,setName]=useState(user.name);
  const [ig,setIg]=useState(user.instagram||"");
  const [fol,setFol]=useState(user.followers||"");
  const [eng,setEng]=useState(user.engagement||"");
  const [cat,setCat]=useState(user.category||"Fitness");
  const [pix,setPix]=useState(user.pixKey||"");
  const [bio,setBio]=useState(user.bio||"");
  return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Meu Perfil" sub="Complete seus dados" onBack={onBack}/>
      <div style={{padding:"8px 20px 24px"}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <Av initials={user.avatar} size={66} idx={5}/>
          <button style={{display:"block",margin:"8px auto 0",background:"none",border:"none",color:T.purple,fontFamily:"Poppins,sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Alterar foto</button>
        </div>
        <Inp label="Nome completo" value={name} onChange={setName}/>
        <Inp label="Instagram" value={ig} onChange={setIg} prefix="@" placeholder="seuperfil"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Seguidores" value={fol} onChange={setFol} placeholder="Ex: 50K"/>
          <Inp label="Engajamento (%)" value={eng} onChange={setEng} placeholder="Ex: 5.2"/>
        </div>
        <Sel label="Categoria" value={cat} onChange={setCat} options={["Fitness","Lifestyle","Moda","Viagem","Tech","Gastronomia","Natureza","Arte","Outros"]}/>
        <Inp label="Chave PIX (para receber pagamentos)" value={pix} onChange={setPix} placeholder="CPF, email ou telefone"/>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Conte um pouco sobre você..." style={{width:"100%",padding:"12px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box",minHeight:80,resize:"none"}}/>
        </div>
        <div style={{padding:"12px 16px",background:"#e8f5e9",borderRadius:12,marginBottom:16,fontSize:12,color:"#2E7D32",fontFamily:"Poppins,sans-serif",fontWeight:600}}>🔐 Sua chave PIX é usada exclusivamente para transferência dos pagamentos aprovados pela marca.</div>
        <Btn label="Salvar dados ✓" onClick={()=>{alert("Perfil salvo com sucesso!");onBack();}} v="purple" full/>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ proposals, onLogout }) {
  const [tab,setTab]=useState("overview");
  const [detail,setDetail]=useState(null);
  const brands=ADMIN_USERS.filter(u=>u.role==="brand");
  const infs=ADMIN_USERS.filter(u=>u.role==="influencer");
  const revenue=proposals.filter(p=>p.status==="completed").reduce((s,p)=>s+(p.value*PLATFORM_FEE),0);
  const tabs=[{id:"overview",label:"Visão Geral",icon:"📊"},{id:"brands",label:"Marcas",icon:"🏢"},{id:"infs",label:"Influencers",icon:"⭐"},{id:"proposals",label:"Propostas",icon:"📋"}];

  if(detail) return (
    <div style={{flex:1,overflowY:"auto"}}>
      <Hdr title="Detalhes" onBack={()=>setDetail(null)}/>
      <div style={{padding:"8px 20px"}}>
        <Card style={{textAlign:"center",padding:"24px 16px"}}>
          <Av initials={detail.name.split(" ").map(n=>n[0]).join("").slice(0,2)} size={58} idx={2}/>
          <div style={{fontSize:18,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif",marginTop:10}}>{detail.name}</div>
          <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{detail.email}</div>
          <div style={{marginTop:8}}><Badge s={detail.status}/></div>
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Card style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{detail.role==="brand"?detail.projects:detail.proposals}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{detail.role==="brand"?"Projetos":"Propostas"}</div></Card>
          <Card style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {detail.role==="brand"?detail.spent:detail.earned}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{detail.role==="brand"?"Investido":"Ganhos"}</div></Card>
        </div>
        <Btn label={detail.status==="active"?"⏸ Suspender conta":"✅ Ativar conta"} onClick={()=>alert("Status alterado!")} v={detail.status==="active"?"danger":"green"} full/>
        <div style={{marginTop:10}}><Btn label="💬 Enviar mensagem" onClick={()=>alert("Chat interno — em breve")} v="ghost" full/></div>
      </div>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:T.bg}}>
      <div style={{background:T.grad1,padding:"20px 20px 16px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:22,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif"}}>🛡️ Admin</div><div style={{fontSize:12,color:"rgba(255,255,255,.75)",fontFamily:"Poppins,sans-serif"}}>Painel Influx</div></div>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:10,padding:"7px 14px",color:T.white,fontFamily:"Poppins,sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>Sair</button>
        </div>
        <div style={{display:"flex",gap:8,marginTop:14,overflowX:"auto",scrollbarWidth:"none"}}>
          {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"rgba(255,255,255,.25)":"rgba(255,255,255,.1)",border:`1.5px solid ${tab===t.id?"rgba(255,255,255,.5)":"transparent"}`,borderRadius:50,padding:"6px 14px",color:T.white,fontFamily:"Poppins,sans-serif",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>{t.icon} {t.label}</button>)}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 20px"}}>
        {tab==="overview"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[{label:"Usuários",value:ADMIN_USERS.length,icon:"👥",color:T.purple},{label:"Marcas",value:brands.length,icon:"🏢",color:T.pink},{label:"Influencers",value:infs.length,icon:"⭐",color:T.warn},{label:"Receita (20%)",value:`R$${revenue}`,icon:"💰",color:T.success}].map((s,i)=>(
                <Card key={i} style={{textAlign:"center",padding:"16px 10px"}}>
                  <span style={{fontSize:26}}>{s.icon}</span>
                  <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"Poppins,sans-serif"}}>{s.value}</div>
                  <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{s.label}</div>
                </Card>
              ))}
            </div>
            <Card>
              <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:12}}>📈 Propostas por status</div>
              {STATUS_ORDER.map(status=>{
                const count=proposals.filter(p=>p.status===status).length;
                const pct=proposals.length?(count/proposals.length)*100:0;
                const label=TIMELINE.find(t=>t.key===status)?.label||status;
                return (
                  <div key={status} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontFamily:"Poppins,sans-serif",color:T.sub,marginBottom:4}}><span>{label}</span><span style={{fontWeight:700,color:T.text}}>{count}</span></div>
                    <div style={{height:6,background:T.border,borderRadius:3}}><div style={{height:6,background:T.grad1,borderRadius:3,width:`${pct}%`,minWidth:count>0?10:0,transition:"width .4s"}}/></div>
                  </div>
                );
              })}
            </Card>
          </>
        )}
        {(tab==="brands"||tab==="infs")&&(
          <>
            <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:12}}>{tab==="brands"?`🏢 Marcas (${brands.length})`:`⭐ Influenciadores (${infs.length})`}</div>
            {(tab==="brands"?brands:infs).map((u,i)=>(
              <Card key={u.id} onClick={()=>setDetail(u)} style={{display:"flex",alignItems:"center",gap:12}}>
                <Av initials={u.name.split(" ").map(n=>n[0]).join("").slice(0,2)} size={44} idx={i}/>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{u.name}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{u.email}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Desde {u.since}</div></div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}><Badge s={u.status}/><span style={{fontSize:11,fontWeight:700,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {u.role==="brand"?u.spent:u.earned}</span></div>
              </Card>
            ))}
          </>
        )}
        {tab==="proposals"&&(
          <>
            <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:12}}>📋 Todas as propostas</div>
            {proposals.map(p=>(
              <Card key={p.id} style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📄</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>#{p.id} · {p.type}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.influencerName} · {p.date}</div></div>
                <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><span style={{fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif",fontSize:13}}>R$ {p.value}</span><Badge s={p.status}/></div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("home");
  const [screen,setScreen]=useState(null);
  const [toast,setToast]=useState(null);
  const [proposals,setProposals]=useState(INIT_PROPOSALS);
  const [projects,setProjects]=useState(INIT_PROJECTS);
  const [applied,setApplied]=useState(["p1","p2"]);

  useEffect(()=>{
    if(!user)return;
    if(user.role==="influencer"){const t=setTimeout(()=>setToast({msg:"🔔 Nova publi disponível: 'Reels de lançamento' — R$ 40,00!",type:"info"}),3500);return()=>clearTimeout(t);}
    if(user.role==="brand"){const t=setTimeout(()=>setToast({msg:"⭐ 2 influencers se candidataram ao seu projeto!",type:"info"}),4000);return()=>clearTimeout(t);}
  },[user]);

  const go=useCallback((type,data=null)=>setScreen({type,data}),[]);
  const back=useCallback(()=>setScreen(null),[]);
  const logout=()=>{setUser(null);setScreen(null);setTab("home");};

  const advanceProposal=(id,newStatus)=>{
    setProposals(prev=>prev.map(p=>p.id===id?{...p,status:newStatus}:p));
    const msgs={upload_done:"✅ Serviço marcado como feito! Aguardando aprovação da marca.",approved:"💸 Entrega aprovada! Transferência PIX em até 24h.",in_progress:"▶️ Serviço iniciado!"};
    setToast({msg:msgs[newStatus]||"Status atualizado!",type:"success"});
    setScreen(prev=>prev?.type==="proposal"?{...prev,data:{...prev.data,status:newStatus}}:prev);
  };

  const sendMsg=(propId,msg)=>{
    setProposals(prev=>prev.map(p=>p.id===propId?{...p,messages:[...p.messages,msg]}:p));
    setScreen(prev=>{
      if(prev?.type==="chat"){const updated={...prev.data,messages:[...prev.data.messages,msg]};return{...prev,data:updated};}
      return prev;
    });
  };

  const addProject=(proj)=>{setProjects(prev=>[proj,...prev]);setToast({msg:"🚀 Projeto publicado com sucesso!",type:"success"});back();};
  const applyProject=(p)=>{setApplied(prev=>[...prev,p.id]);setToast({msg:`🙋 Candidatura enviada para "${p.title}"!`,type:"success"});};

  // ADMIN
  if(user?.role==="admin") return (
    <Shell toast={toast} onClearToast={()=>setToast(null)}>
      <AdminPanel proposals={proposals} onLogout={logout}/>
    </Shell>
  );

  // NOT LOGGED
  if(!user) return (
    <Shell toast={toast} onClearToast={()=>setToast(null)} white>
      <LoginScreen onLogin={u=>{setUser(u);setTab("home");}}/>
    </Shell>
  );

  const isBrand=user.role==="brand";
  const navItems=isBrand
    ?[{id:"finance",label:"Finanças",icon:"💰"},{id:"explore",label:"Explorar",icon:"🔭"},{id:"home",label:"Home",icon:"🏠"},{id:"projects",label:"Projetos",icon:"📋"},{id:"profile",label:"Perfil",icon:"👤"}]
    :[{id:"home",label:"Início",icon:"🏠"},{id:"projects",label:"Projetos",icon:"🔍"},{id:"proposals",label:"Propostas",icon:"📋"},{id:"finance",label:"Ganhos",icon:"💸"},{id:"profile",label:"Perfil",icon:"👤"}];

  const renderContent=()=>{
    if(screen){
      if(screen.type==="proposal"){const live=proposals.find(p=>p.id===screen.data.id)||screen.data;return <ProposalTimeline proposal={live} role={user.role} onAction={s=>advanceProposal(live.id,s)} onChat={()=>go("chat",live)}/>;}
      if(screen.type==="chat"){const live=proposals.find(p=>p.id===screen.data.id)||screen.data;return <ChatScreen proposal={live} role={user.role} onBack={back} onSend={sendMsg}/>;}
      if(screen.type==="create") return <CreateProject onBack={back} onDone={addProject}/>;
      if(screen.type==="edit-profile") return isBrand
        ?<div style={{flex:1,overflowY:"auto"}}><Hdr title="Editar Perfil" onBack={back}/><div style={{padding:"8px 20px"}}><Inp label="Nome" value={user.name} onChange={()=>{}}/><Btn label="Salvar ✓" onClick={()=>{alert("Salvo!");back();}} v="purple" full/></div></div>
        :<InfProfileEdit user={user} onBack={back}/>;
      if(screen.type==="inf-detail") return (
        <div style={{flex:1,overflowY:"auto"}}>
          <Hdr title="Perfil do Influencer" onBack={back}/>
          <div style={{padding:"16px 20px"}}>
            <Card style={{textAlign:"center",padding:24}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><Av initials={screen.data.avatar} size={64} idx={3}/></div>
              <div style={{fontSize:18,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{screen.data.name}</div>
              <div style={{fontSize:13,color:T.sub,fontFamily:"Poppins,sans-serif",marginBottom:6}}>{screen.data.username}</div>
              <span style={{background:"#f0ebff",color:T.purple,fontSize:11,fontFamily:"Poppins,sans-serif",fontWeight:700,padding:"3px 12px",borderRadius:50}}>{screen.data.category}</span>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <Card style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{screen.data.followers}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Seguidores</div></Card>
              <Card style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:T.pink,fontFamily:"Poppins,sans-serif"}}>{screen.data.engagement}%</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Engajamento</div></Card>
            </div>
            <Btn label="Contratar →" onClick={()=>alert("Selecione um projeto para contratar!")} v="pink" full/>
          </div>
        </div>
      );
    }
    if(isBrand){
      if(tab==="home") return <BrandHome user={user} onTab={setTab} onGo={go} proposals={proposals}/>;
      if(tab==="explore") return <ExploreScreen onInfluencer={inf=>go("inf-detail",inf)}/>;
      if(tab==="finance") return <BrandFinance proposals={proposals}/>;
      if(tab==="projects") return <BrandProjects proposals={proposals} onCreate={()=>go("create")} onView={p=>go("proposal",p)}/>;
      if(tab==="profile") return <ProfileScreen user={user} onLogout={logout} onEdit={()=>go("edit-profile")}/>;
    } else {
      if(tab==="home") return <InfHome user={user} onTab={setTab} onGo={go} proposals={proposals}/>;
      if(tab==="projects") return <InfProjects projects={projects} onApply={applyProject} applied={applied}/>;
      if(tab==="proposals") return <InfProposals proposals={proposals} onView={p=>go("proposal",p)}/>;
      if(tab==="finance") return <InfFinance proposals={proposals}/>;
      if(tab==="profile") return <ProfileScreen user={user} onLogout={logout} onEdit={()=>go("edit-profile")}/>;
    }
  };

  const hideNav=screen?.type==="chat";
  return (
    <Shell toast={toast} onClearToast={()=>setToast(null)}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>{renderContent()}</div>
      {!hideNav&&(
        <div style={{display:"flex",background:T.purple,padding:"10px 0 16px",flexShrink:0,borderTop:`2px solid ${T.purpleDark}`}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>{setTab(n.id);setScreen(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",color:tab===n.id&&!screen?"#fff":"rgba(255,255,255,.5)",transition:"all .2s"}}>
              <span style={{fontSize:tab===n.id&&!screen?22:19,transition:"all .2s"}}>{n.icon}</span>
              <span style={{fontSize:9,fontWeight:tab===n.id&&!screen?700:400,fontFamily:"Poppins,sans-serif"}}>{n.label}</span>
              {tab===n.id&&!screen&&<div style={{width:4,height:4,borderRadius:"50%",background:T.pink}}/>}
            </button>
          ))}
        </div>
      )}
    </Shell>
  );
}

// Shell wrapper
function Shell({ children, toast, onClearToast, white }) {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#f0ebff",fontFamily:"Poppins,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <div style={{width:390,height:844,background:white?T.white:T.bg,borderRadius:40,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(108,74,182,.28)",position:"relative"}}>
        {toast&&<Toast msg={toast.msg} type={toast.type} onClose={onClearToast}/>}
        {children}
      </div>
    </div>
  );
}
