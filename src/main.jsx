import { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";

// ══════════════════════════════════════════════════════════════════════════════
// THEME & CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════
const T = {
  purple:"#6C4AB6",purpleLight:"#8B6FD4",purpleDark:"#4A2F8A",
  pink:"#FF006E",white:"#FFFFFF",bg:"#F5F5F5",card:"#FFFFFF",
  text:"#1A1A2E",sub:"#7B7B9A",border:"#E8E8F0",
  success:"#00C896",warn:"#FF8C00",danger:"#FF3B30",
  grad1:"linear-gradient(135deg,#6C4AB6,#8B6FD4)",
  grad2:"linear-gradient(135deg,#FF006E,#FF4D9B)",
  grad3:"linear-gradient(135deg,#00C896,#00A878)",
};
const PAL = ["#6C4AB6","#FF006E","#00C896","#FF8C00","#0099FF","#9C27B0","#E91E63","#4CAF50"];
const FEE = 0.20;
const LS = (k,d) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):d; } catch{ return d; } };
const SS = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch{} };

const ALL_CATS = ["Fitness","Lifestyle","Moda","Viagem","Tech","Gastronomia","Natureza","Arte","Beleza","Educação","Humor","Games","Música","Esportes","Negócios","Pets","Outros"];

const INIT_USERS = {
  "marca@email.com":  {id:"u1",name:"Jedivan Andrade",email:"marca@email.com",  pass:"123456", role:"brand",     rating:5,since:2022,avatar:"JA",photo:null,balance:0},
  "inf@email.com":    {id:"u2",name:"Ana Fitness",    email:"inf@email.com",    pass:"123456", role:"influencer",rating:4,since:2023,avatar:"AF",photo:null,balance:0,instagram:"@fitlife_ana",followers:"1.01K",engagement:"13.74",category:"Fitness",pixKey:"ana@pix.com",bio:"Criadora de conteúdo fitness 💪"},
  "admin@influx.com": {id:"u0",name:"Admin Influx",   email:"admin@influx.com", pass:"admin123",role:"admin",    avatar:"AD",photo:null},
};

const INIT_PROPOSALS = [
  {id:"3477",type:"Feed",  value:10,netValue:8, status:"in_progress",date:"25/03/2026 17:13",influencerName:"Ana Fitness",influencerAvatar:"AF",pixKey:"ana@pix.com",content:null,messages:[{from:"brand",text:"Aguardando sua entrega 😊",time:"17:15"},{from:"inf",text:"Preparando o conteúdo!",time:"17:20"}]},
  {id:"3476",type:"Stories",value:10,netValue:8,status:"upload_done",date:"25/03/2026 10:40",influencerName:"Ana Fitness",influencerAvatar:"AF",pixKey:"ana@pix.com",content:null,messages:[{from:"inf",text:"Fiz o upload! Pode verificar 🎉",time:"11:00"}]},
  {id:"3475",type:"Feed",  value:20,netValue:16,status:"completed",  date:"20/03/2026 14:00",influencerName:"Ana Fitness",influencerAvatar:"AF",pixKey:"ana@pix.com",content:null,messages:[]},
];

const INIT_PROJECTS = [
  {id:"p1",title:"1 vídeo story",        desc:"Vídeo selfie apresentando o app.",              value:10,type:"Stories",status:"active",candidates:["i5","i3","i6"],date:"2026-03-20"},
  {id:"p2",title:"Publicação para story",desc:"Vídeo mostrando as funções. www.influx.com.br.",value:10,type:"Stories",status:"active",candidates:["i4","i6"],     date:"2026-03-18"},
  {id:"p3",title:"Post no feed",         desc:"Foto no feed com legenda criativa.",             value:20,type:"Feed",   status:"done",  candidates:[],               date:"2026-03-10"},
  {id:"p4",title:"Reels de lançamento",  desc:"Reels criativo mostrando o produto.",            value:50,type:"Reels",  status:"open",  candidates:[],               date:"2026-03-25"},
];

const INFLUENCERS_DB = [
  {id:"i1",username:"@mariagomes",  name:"Maria Gomes",    followers:"11.2M",engagement:"0.26", avatar:"MG",category:"Lifestyle",top:true },
  {id:"i2",username:"@lucas.art",   name:"Lucas Art",      followers:"3.13M",engagement:"0.06", avatar:"LA",category:"Arte",     top:false},
  {id:"i3",username:"@natureza_br", name:"Natureza BR",    followers:"2.48M",engagement:"3.16", avatar:"NB",category:"Natureza", top:true },
  {id:"i4",username:"@beazau",      name:"Bea Zau",        followers:"1.83M",engagement:"3.45", avatar:"BZ",category:"Moda",     top:true },
  {id:"i5",username:"@turistandoslz",name:"Turistando SLZ",followers:"127K", engagement:"22.91",avatar:"TS",category:"Viagem",   top:true },
  {id:"i6",username:"@fitlife_ana", name:"Ana Fitness",    followers:"1.01K",engagement:"13.74",avatar:"FA",category:"Fitness",  top:false},
  {id:"i7",username:"@techbr",      name:"Tech BR",        followers:"2.24K",engagement:"2.14", avatar:"TB",category:"Tech",     top:false},
  {id:"i8",username:"@cozinhando_br",name:"Cozinhando BR", followers:"890K", engagement:"5.2",  avatar:"CB",category:"Gastronomia",top:false},
];

const STATUS_STEPS = [
  {key:"created",    label:"Proposta Criada",  desc:"A proposta foi criada.",                   icon:"📄"},
  {key:"paid",       label:"Pagamento Feito",  desc:"Pagamento confirmado via PIX.",             icon:"💰"},
  {key:"in_progress",label:"Em Andamento",     desc:"Aguardando o influencer realizar o serviço.",icon:"⏳"},
  {key:"upload_done",label:"Upload Feito",     desc:"Influencer enviou o conteúdo.",             icon:"📤"},
  {key:"approved",   label:"Aprovado",         desc:"Aprovado! Transferência PIX em até 24h.",   icon:"✅"},
  {key:"completed",  label:"Concluído!",       desc:"Proposta finalizada com sucesso.",           icon:"🏆"},
];
const S_ORDER = STATUS_STEPS.map(s=>s.key);

// ══════════════════════════════════════════════════════════════════════════════
// SHARED UI
// ══════════════════════════════════════════════════════════════════════════════
function Av({src,initials,size=42,idx=0}) {
  if(src) return <img src={src} alt="" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>;
  return <div style={{width:size,height:size,borderRadius:"50%",background:PAL[idx%PAL.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*.34,flexShrink:0,fontFamily:"Poppins,sans-serif"}}>{initials}</div>;
}
function Stars({n=5}){return <span style={{color:"#FFB800",fontSize:15,letterSpacing:2}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;}
function Card({children,style={},onClick}){return <div onClick={onClick} style={{background:T.card,borderRadius:20,padding:18,boxShadow:"0 2px 16px rgba(108,74,182,.08)",marginBottom:12,cursor:onClick?"pointer":"default",...style}}>{children}</div>;}
function BCard({label,value,icon,grad}){return <div style={{background:grad,borderRadius:20,padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,boxShadow:"0 6px 20px rgba(108,74,182,.2)"}}><div><div style={{color:"rgba(255,255,255,.85)",fontSize:13,fontFamily:"Poppins,sans-serif",marginBottom:4}}>{label}</div><div style={{color:T.white,fontSize:26,fontWeight:800,fontFamily:"Poppins,sans-serif"}}>{value}</div></div><span style={{fontSize:38}}>{icon}</span></div>;}
function Btn({label,onClick,v="purple",sm=false,full=false,off=false}){
  const bgs={purple:T.grad1,pink:T.grad2,green:T.grad3,ghost:"transparent",danger:"linear-gradient(135deg,#FF3B30,#FF6B6B)",gray:"#ddd"};
  const clr={ghost:T.purple,gray:T.sub};
  return <button onClick={onClick} disabled={off} style={{background:bgs[v]||T.grad1,color:clr[v]||T.white,border:v==="ghost"?`1.5px solid ${T.purple}`:"none",borderRadius:50,padding:sm?"8px 16px":"13px 22px",fontSize:sm?11:14,fontWeight:700,fontFamily:"Poppins,sans-serif",cursor:off?"not-allowed":"pointer",width:full?"100%":"auto",opacity:off?.55:1,boxShadow:v!=="ghost"&&v!=="gray"?"0 4px 14px rgba(108,74,182,.25)":"none",transition:"all .2s"}}>{label}</button>;
}
function Inp({label,type="text",value,onChange,placeholder,prefix}){
  return <div style={{marginBottom:14}}>{label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{label}</label>}<div style={{position:"relative"}}>{prefix&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:14}}>{prefix}</span>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:prefix?"13px 16px 13px 36px":"13px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:14,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=T.purple} onBlur={e=>e.target.style.borderColor=T.border}/></div></div>;
}
function Hdr({title,sub,onBack,right,dark}){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 12px",background:dark?T.purple:T.white,borderBottom:dark?"none":`1px solid ${T.border}`,flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:10}}>{onBack&&<button onClick={onBack} style={{background:dark?"rgba(255,255,255,.2)":"none",border:"none",cursor:"pointer",fontSize:17,color:dark?T.white:T.purple,padding:dark?"6px 10px":0,borderRadius:10}}>←</button>}<div><div style={{fontSize:onBack?19:23,fontWeight:800,color:dark?T.white:T.pink,fontFamily:"Poppins,sans-serif",lineHeight:1.1}}>{title}</div>{sub&&<div style={{fontSize:11,color:dark?"rgba(255,255,255,.7)":T.sub,fontFamily:"Poppins,sans-serif",marginTop:1}}>{sub}</div>}</div></div>{right}</div>;
}
function Toast({msg,type="info",onClose}){
  useEffect(()=>{const t=setTimeout(onClose,4000);return()=>clearTimeout(t);},[onClose]);
  const bg=type==="success"?T.success:type==="warn"?T.warn:T.purpleDark;
  return <div style={{position:"absolute",top:14,left:14,right:14,background:bg,color:T.white,borderRadius:14,padding:"12px 16px",zIndex:999,fontFamily:"Poppins,sans-serif",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.25)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{msg}</span><button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:16}}>✕</button></div>;
}
function Badge({s}){
  const m={created:["🟣","#ede7f6","#6C4AB6"],paid:["💰","#e8f5e9","#00C896"],in_progress:["⏳","#e3f2fd","#1565C0"],upload_done:["📤","#fff8e1","#FF8C00"],approved:["✅","#e8f5e9","#00A878"],completed:["🏆","#f3e5f5","#7B1FA2"],open:["🟢","#e8f5e9","#00C896"],active:["🔵","#e3f2fd","#1565C0"],done:["✓","#f5f5f5","#888"],pending:["⏸","#fff8e1","#FF8C00"]};
  const [icon,bg,fg]=m[s]||["·","#eee","#555"];
  return <span style={{background:bg,color:fg,fontSize:10,fontWeight:700,fontFamily:"Poppins,sans-serif",padding:"3px 9px",borderRadius:50,display:"inline-flex",alignItems:"center",gap:3}}>{icon} {s}</span>;
}

// Photo picker
function PhotoPicker({current,onPick,size=72}){
  const ref=useRef();
  const pick=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onPick(ev.target.result);r.readAsDataURL(f);};
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:16}}>
    <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:"50%",background:current?"transparent":T.grad1,overflow:"hidden",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",border:`3px solid ${T.purple}`,position:"relative"}}>
      {current?<img src={current} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:size*.4}}>📷</span>}
      <div style={{position:"absolute",bottom:0,right:0,background:T.pink,borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✏️</div>
    </div>
    <input ref={ref} type="file" accept="image/*" onChange={pick} style={{display:"none"}}/>
    <span style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Toque para {current?"alterar":"adicionar"} foto</span>
  </div>;
}

// PIX Modal — for hire payment (fixed amount) and deposit (custom amount)
const PIX_KEY="2d970c88-833f-441d-bbe1-a0777afaa629";
function PixModal({amount,label,onPay,onClose,mode="pay"}){
  const [copied,setCopied]=useState(false);
  const [customAmt,setCustomAmt]=useState(amount||"");
  const [comprovante,setComprovante]=useState("");
  const [step,setStep]=useState(1); // 1=show key, 2=confirm
  const copy=()=>{navigator.clipboard?.writeText(PIX_KEY).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2500);};
  const finalAmt=mode==="deposit"?customAmt:amount;
  const confirm=()=>{
    if(mode==="deposit"&&!customAmt)return alert("Informe o valor depositado.");
    onPay(Number(finalAmt),comprovante);
  };
  return <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",zIndex:900,display:"flex",alignItems:"flex-end"}}>
    <div style={{background:T.white,borderRadius:"24px 24px 0 0",padding:24,width:"100%",boxSizing:"border-box",maxHeight:"85vh",overflowY:"auto"}}>
      <div style={{fontSize:18,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:4}}>
        {mode==="deposit"?"💰 Depositar via PIX":"⚡ Pagar influencer via PIX"}
      </div>
      {mode==="pay"&&label&&<div style={{fontSize:13,color:T.sub,fontFamily:"Poppins,sans-serif",marginBottom:4}}>{label}</div>}
      {mode==="pay"&&<div style={{fontSize:26,fontWeight:900,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:16}}>R$ {amount},00</div>}
      {mode==="deposit"&&<div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Valor a depositar (R$)</label>
        <input type="number" value={customAmt} onChange={e=>setCustomAmt(e.target.value)} placeholder="Ex: 100" style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`2px solid ${T.purple}`,fontSize:18,fontWeight:700,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.purple,outline:"none",boxSizing:"border-box"}}/>
      </div>}
      <div style={{background:"#f0ebff",borderRadius:14,padding:"14px 16px",marginBottom:14}}>
        <div style={{fontSize:10,color:T.sub,fontFamily:"Poppins,sans-serif",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Chave PIX — Influx</div>
        <div style={{fontSize:12,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",wordBreak:"break-all"}}>{PIX_KEY}</div>
      </div>
      <Btn label={copied?"✅ Copiado!":"📋 Copiar chave PIX"} onClick={copy} v="purple" full off={copied}/>
      <div style={{height:12}}/>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>
          {mode==="deposit"?"Número do comprovante (opcional)":"Número do comprovante (opcional)"}
        </label>
        <input type="text" value={comprovante} onChange={e=>setComprovante(e.target.value)} placeholder="Cole aqui o ID ou número do comprovante"
          style={{width:"100%",padding:"11px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{padding:"10px 14px",background:"#fff8e1",borderRadius:12,marginBottom:14,fontSize:12,color:T.warn,fontFamily:"Poppins,sans-serif",fontWeight:600}}>
        ⚠️ Após clicar em "Já paguei", o admin irá confirmar o pagamento em até 1h.
      </div>
      <Btn label="✅ Já paguei! Avisar admin" onClick={confirm} v="green" full/>
      <div style={{height:10}}/>
      <Btn label="Cancelar" onClick={onClose} v="ghost" full/>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// PULL TO REFRESH
// ══════════════════════════════════════════════════════════════════════════════
function PullRefresh({onRefresh,children}){
  const [pulling,setPulling]=useState(false);
  const startY=useRef(0);
  const onTouchStart=e=>startY.current=e.touches[0].clientY;
  const onTouchEnd=e=>{
    const diff=e.changedTouches[0].clientY-startY.current;
    if(diff>80){setPulling(true);setTimeout(()=>{onRefresh();setPulling(false);},800);}
  };
  return <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{flex:1,overflowY:"auto"}}>
    {pulling&&<div style={{textAlign:"center",padding:12,color:T.purple,fontFamily:"Poppins,sans-serif",fontSize:13,fontWeight:600}}>🔄 Atualizando...</div>}
    {children}
  </div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN + CADASTRO
// ══════════════════════════════════════════════════════════════════════════════
function AuthScreen({onLogin,usersDB,setUsersDB}){
  const [mode,setMode]=useState("login"); // login | register
  const [role,setRole]=useState("brand");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [name,setName]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const login=async()=>{
    setErr("");setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const u=usersDB[email.toLowerCase()];
    if(u&&u.pass===pass)onLogin(u);
    else setErr("Email ou senha incorretos.");
    setLoading(false);
  };

  const register=async()=>{
    setErr("");
    if(!name||!email||!pass)return setErr("Preencha todos os campos.");
    if(pass.length<6)return setErr("Senha deve ter pelo menos 6 caracteres.");
    if(usersDB[email.toLowerCase()])return setErr("Email já cadastrado.");
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const id="u"+Date.now();
    const newUser={id,name,email:email.toLowerCase(),pass,role,rating:5,since:new Date().getFullYear(),avatar:name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),photo:null,balance:0,
      ...(role==="influencer"?{instagram:"",followers:"",engagement:"",category:"Fitness",pixKey:"",bio:""}:{})
    };
    const updated={...usersDB,[email.toLowerCase()]:newUser};
    setUsersDB(updated);
    SS("influx_users",updated);
    onLogin(newUser);
    setLoading(false);
  };

  return <PullRefresh onRefresh={()=>{}}>
    <div style={{padding:28,display:"flex",flexDirection:"column",justifyContent:"center",minHeight:"100%",background:T.white,boxSizing:"border-box"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:76,height:76,borderRadius:24,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 8px 24px rgba(108,74,182,.35)"}}><span style={{fontSize:38}}>⚡</span></div>
        <div style={{fontSize:32,fontWeight:900,background:T.grad1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"Poppins,sans-serif"}}>Influx</div>
        <div style={{fontSize:13,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Marketplace de Influenciadores</div>
      </div>

      {/* Tabs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:T.bg,borderRadius:14,padding:4,marginBottom:20}}>
        {["login","register"].map(m=><button key={m} onClick={()=>{setMode(m);setErr("");}} style={{background:mode===m?T.white:"transparent",border:"none",borderRadius:11,padding:"10px 0",fontWeight:700,fontSize:13,fontFamily:"Poppins,sans-serif",color:mode===m?T.purple:T.sub,cursor:"pointer",boxShadow:mode===m?"0 2px 8px rgba(108,74,182,.15)":"none",transition:"all .2s"}}>{m==="login"?"Entrar":"Cadastrar"}</button>)}
      </div>

      {mode==="register"&&(
        <>
          <Inp label="Nome completo" value={name} onChange={setName} placeholder="Seu nome"/>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:8,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Tipo de conta</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{v:"brand",icon:"🏢",label:"Marca / Empresa"},{v:"influencer",icon:"⭐",label:"Influenciador"}].map(r=>(
                <button key={r.v} onClick={()=>setRole(r.v)} style={{background:role===r.v?T.grad1:T.bg,border:`2px solid ${role===r.v?T.purple:T.border}`,borderRadius:16,padding:"14px 10px",cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:24,marginBottom:4}}>{r.icon}</div>
                  <div style={{fontSize:11,fontWeight:700,color:role===r.v?T.white:T.sub,fontFamily:"Poppins,sans-serif"}}>{r.label}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <Inp label="Email" type="email" value={email} onChange={setEmail} placeholder="seu@email.com"/>
      <Inp label="Senha" type="password" value={pass} onChange={setPass} placeholder="••••••••"/>
      {err&&<div style={{color:T.pink,fontSize:12,fontFamily:"Poppins,sans-serif",marginBottom:10,fontWeight:600}}>⚠️ {err}</div>}
      <Btn label={loading?"Aguarde...":(mode==="login"?"Entrar 🔐":"Criar conta 🚀")} onClick={mode==="login"?login:register} v="purple" full off={loading}/>

      {mode==="login"&&(
        <div style={{marginTop:20,padding:16,background:"#f0ebff",borderRadius:14,fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif",lineHeight:1.9}}>
          <div style={{fontWeight:700,color:T.purple,marginBottom:4}}>Contas demo:</div>
          <div>🏢 marca@email.com / 123456</div>
          <div>⭐ inf@email.com / 123456</div>
          <div>🛡️ admin@influx.com / admin123</div>
        </div>
      )}
    </div>
  </PullRefresh>;
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT SCREEN (fully working)
// ══════════════════════════════════════════════════════════════════════════════
function ChatScreen({proposal,role,onBack,onSend}){
  const [msg,setMsg]=useState("");
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[proposal.messages]);
  const send=()=>{
    if(!msg.trim())return;
    onSend(proposal.id,{from:role==="brand"?"brand":"inf",text:msg.trim(),time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})});
    setMsg("");
  };
  return <div style={{flex:1,display:"flex",flexDirection:"column",background:T.bg}}>
    <Hdr title={`Chat #${proposal.id}`} sub={`${proposal.type} · ${proposal.influencerName}`} onBack={onBack} dark/>
    <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
      {proposal.messages.length===0&&<div style={{textAlign:"center",color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:13,marginTop:20}}>Nenhuma mensagem ainda. Diga olá! 👋</div>}
      {proposal.messages.map((m,i)=>{
        const mine=(role==="brand"&&m.from==="brand")||(role==="influencer"&&m.from==="inf");
        return <div key={i} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}>
          <div style={{maxWidth:"78%",background:mine?T.grad1:T.white,color:mine?T.white:T.text,borderRadius:mine?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",boxShadow:"0 2px 8px rgba(0,0,0,.07)",fontFamily:"Poppins,sans-serif"}}>
            <div style={{fontSize:13}}>{m.text}</div>
            <div style={{fontSize:10,opacity:.7,marginTop:4,textAlign:"right"}}>{m.time}</div>
          </div>
        </div>;
      })}
      <div ref={endRef}/>
    </div>
    <div style={{padding:"10px 16px",background:T.white,borderTop:`1px solid ${T.border}`,display:"flex",gap:10}}>
      <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Digite uma mensagem..." style={{flex:1,padding:"11px 16px",borderRadius:50,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none"}}/>
      <button onClick={send} style={{width:44,height:44,borderRadius:"50%",background:T.grad1,border:"none",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>➤</button>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// PROPOSAL TIMELINE
// ══════════════════════════════════════════════════════════════════════════════

// Status label/color helpers for influencer banner
const INF_STATUS_INFO = {
  created:     { icon:"⏳", label:"Aguardando pagamento da marca",      color:T.warn,    bg:"#fff8e1" },
  paid:        { icon:"💰", label:"Pagamento confirmado! Prepare sua publi.", color:"#1565C0", bg:"#e3f2fd" },
  in_progress: { icon:"🚀", label:"Em andamento — envie o conteúdo abaixo!", color:T.purple,  bg:"#f0ebff" },
  upload_done: { icon:"📤", label:"Conteúdo enviado! Aguardando aprovação.", color:T.warn,   bg:"#fff8e1" },
  approved:    { icon:"✅", label:"Aprovado! PIX em até 24h para sua chave.", color:"#2E7D32", bg:"#e8f5e9" },
  completed:   { icon:"🏆", label:"Proposta concluída com sucesso!",          color:T.purple,  bg:"#f3e5f5" },
};

function ProposalTimeline({proposal,role,onAction,onChat,onBack}){
  const [showPix,setShowPix]=useState(false);
  const fileRef=useRef();
  const curIdx=S_ORDER.indexOf(proposal.status);
  const statusInfo=INF_STATUS_INFO[proposal.status]||{icon:"📄",label:proposal.status,color:T.sub,bg:T.bg};

  const handleContentUpload=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>onAction("upload_done",ev.target.result);
    r.readAsDataURL(f);
  };

  return <div style={{flex:1,overflowY:"auto",background:T.bg,position:"relative"}}>
    {showPix&&<PixModal amount={proposal.value} onPay={()=>{setShowPix(false);onAction("paid");}} onClose={()=>setShowPix(false)}/>}

    <Hdr title="Proposta" sub={`#${proposal.id} · ${proposal.type}`} onBack={onBack} dark/>

    {/* ── Influencer status banner ── */}
    {role==="influencer"&&(
      <div style={{margin:"14px 20px 0",padding:"14px 16px",background:statusInfo.bg,borderRadius:16,border:`1.5px solid ${statusInfo.color}22`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:26}}>{statusInfo.icon}</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:statusInfo.color,fontFamily:"Poppins,sans-serif"}}>{statusInfo.label}</div>
            {(proposal.status==="paid"||proposal.status==="in_progress")&&(
              <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif",marginTop:2}}>⏰ Você tem 24 horas para enviar o conteúdo</div>
            )}
          </div>
        </div>
      </div>
    )}

    <div style={{padding:"14px 20px 20px"}}>

      {/* Value card */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          {role==="brand"
            ?<div><div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Valor total</div><div style={{fontSize:22,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {proposal.value},00</div></div>
            :<div><div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Você vai receber</div><div style={{fontSize:28,fontWeight:900,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {proposal.netValue},00</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif",marginTop:2}}>Pago via PIX após aprovação da marca</div></div>
          }
          <Badge s={proposal.status}/>
        </div>
        {role==="influencer"&&proposal.pixKey&&(
          <div style={{marginTop:10,padding:"8px 12px",background:"#f0ebff",borderRadius:10,fontSize:11,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>
            🔑 Chave PIX cadastrada: {proposal.pixKey}
          </div>
        )}
      </Card>

      {/* ── Influencer action area (prominent, before timeline) ── */}
      {role==="influencer"&&(
        <div style={{marginBottom:14}}>
          {proposal.status==="in_progress"&&(
            <div style={{background:T.grad2,borderRadius:18,padding:"18px 18px",marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif",marginBottom:4}}>📤 Sua vez de agir!</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.85)",fontFamily:"Poppins,sans-serif",marginBottom:14}}>Faça a publi e envie o conteúdo aqui para a marca aprovar.</div>
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleContentUpload} style={{display:"none"}}/>
              <Btn label="📎 Enviar imagem/vídeo da publi" onClick={()=>fileRef.current.click()} v="purple" full/>
            </div>
          )}
          {proposal.status==="paid"&&(
            <div style={{background:T.grad1,borderRadius:18,padding:"18px 18px",marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif",marginBottom:4}}>💰 Pagamento confirmado!</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.85)",fontFamily:"Poppins,sans-serif",marginBottom:14}}>Realize a publi e envie o conteúdo. Você tem 24h! ⏰</div>
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleContentUpload} style={{display:"none"}}/>
              <Btn label="📎 Já fiz! Enviar conteúdo" onClick={()=>fileRef.current.click()} v="green" full/>
            </div>
          )}
          {proposal.status==="created"&&(
            <div style={{background:"#fff8e1",borderRadius:16,padding:"14px 16px",border:`1.5px solid #FFD54F`}}>
              <div style={{fontSize:13,fontWeight:700,color:T.warn,fontFamily:"Poppins,sans-serif",marginBottom:4}}>⏳ Aguardando pagamento</div>
              <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>A marca está processando o pagamento. Você será notificado assim que for confirmado.</div>
            </div>
          )}
          {proposal.status==="upload_done"&&(
            <div style={{background:"#e3f2fd",borderRadius:16,padding:"14px 16px",border:`1.5px solid #90CAF9`}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1565C0",fontFamily:"Poppins,sans-serif",marginBottom:4}}>📤 Conteúdo enviado!</div>
              <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Aguardando a marca revisar e aprovar. Você será avisado!</div>
            </div>
          )}
          {proposal.status==="approved"&&(
            <div style={{background:"#e8f5e9",borderRadius:16,padding:"14px 16px",border:`1.5px solid #A5D6A7`}}>
              <div style={{fontSize:13,fontWeight:700,color:"#2E7D32",fontFamily:"Poppins,sans-serif",marginBottom:4}}>✅ Aprovado! Pagamento a caminho</div>
              <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Transferência PIX de <b style={{color:T.success}}>R$ {proposal.netValue},00</b> em até 24h para {proposal.pixKey||"sua chave"}</div>
            </div>
          )}
          {proposal.status==="completed"&&(
            <div style={{background:"#f3e5f5",borderRadius:16,padding:"14px 16px",border:`1.5px solid #CE93D8`}}>
              <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:4}}>🏆 Parabéns! Publi concluída</div>
              <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Você recebeu R$ {proposal.netValue},00 via PIX. Obrigado!</div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded content preview */}
      {proposal.content&&(
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:8}}>📎 Conteúdo enviado</div>
          <img src={proposal.content} alt="conteúdo" style={{width:"100%",borderRadius:12,objectFit:"cover",maxHeight:220}}/>
        </Card>
      )}

      {/* Timeline card */}
      <Card style={{padding:"18px 16px"}}>
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:14}}>📍 Linha do Tempo</div>
        {STATUS_STEPS.map((step,i)=>{
          const done=i<curIdx, active=i===curIdx, future=i>curIdx;
          return <div key={step.key} style={{display:"flex",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:22,flexShrink:0}}>
              <div style={{
                width:20,height:20,borderRadius:"50%",
                background:done?"#FF006E":active?"#4A2F8A":"#ddd",
                border:active?`3px solid ${T.purple}`:"none",
                boxShadow:active?"0 0 0 5px rgba(108,74,182,.18)":"none",
                flexShrink:0,marginTop:5,
                display:"flex",alignItems:"center",justifyContent:"center"
              }}>
                {done&&<span style={{fontSize:10,color:T.white}}>✓</span>}
              </div>
              {i<STATUS_STEPS.length-1&&<div style={{width:2,flex:1,minHeight:24,background:done?"#FF006E":"#e0e0e0",marginTop:2}}/>}
            </div>
            <div style={{paddingBottom:i<STATUS_STEPS.length-1?14:0,paddingTop:3,flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontSize:16}}>{step.icon}</span>
                <span style={{
                  fontSize:13,fontWeight:active?800:600,
                  color:done?T.pink:active?T.purple:T.sub,
                  fontFamily:"Poppins,sans-serif"
                }}>{step.label}</span>
                {active&&<span style={{fontSize:10,background:T.purple,color:T.white,padding:"2px 7px",borderRadius:50,fontFamily:"Poppins,sans-serif",fontWeight:700}}>AGORA</span>}
              </div>
              {(active||done)&&<div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif",marginTop:2,lineHeight:1.5}}>{step.desc}</div>}
            </div>
          </div>;
        })}
      </Card>

      {/* Chat button */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Btn label="💬 Chat" onClick={onChat} v="pink"/>
        {!["completed","approved","upload_done"].includes(proposal.status)&&(
          <Btn label="🚫 Cancelar" onClick={()=>alert("Confirmar cancelamento?")} v="danger"/>
        )}
      </div>

      {/* Brand-only actions */}
      {role==="brand"&&proposal.status==="created"&&(
        <Btn label="💰 Pagar via PIX" onClick={()=>setShowPix(true)} v="green" full/>
      )}
      {role==="brand"&&proposal.status==="upload_done"&&(
        <div>
          {proposal.content&&<div style={{marginBottom:10,padding:"10px 14px",background:"#f0ebff",borderRadius:12,fontSize:12,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>👆 Veja o conteúdo acima antes de aprovar</div>}
          <Btn label="✅ Aprovar conteúdo e liberar pagamento" onClick={()=>onAction("approved")} v="green" full/>
        </div>
      )}
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// BRAND SCREENS
// ══════════════════════════════════════════════════════════════════════════════
function BrandHome({user,onTab,onGo,proposals}){
  return <PullRefresh onRefresh={()=>window.location.reload()}>
    <div style={{padding:"16px 20px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontSize:13,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Olá,</div>
        <div style={{fontSize:20,fontWeight:800,color:T.pink,fontFamily:"Poppins,sans-serif"}}>{user.name} 👋</div>
      </div>
      <Av src={user.photo} initials={user.avatar} size={44} idx={0}/>
    </div>
    <div style={{padding:"8px 20px"}}>
      <BCard label="Saldo disponível" value={`R$ ${user.balance||0},00`} icon="💰" grad={T.grad1}/>
      <div style={{fontSize:15,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 10px"}}>Ações rápidas</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[{icon:"📋",label:"Criar Projeto",grad:T.grad1,act:()=>onGo("create")},{icon:"👥",label:"Encontrar Influencers",grad:T.grad2,act:()=>onTab("explore")}].map((a,i)=>(
          <button key={i} onClick={a.act} style={{background:a.grad,border:"none",borderRadius:20,padding:"20px 14px",cursor:"pointer",textAlign:"left",boxShadow:"0 4px 16px rgba(108,74,182,.2)"}}>
            <span style={{fontSize:30,display:"block",marginBottom:8}}>{a.icon}</span>
            <span style={{color:T.white,fontSize:13,fontWeight:700,fontFamily:"Poppins,sans-serif",lineHeight:1.3}}>{a.label}</span>
          </button>
        ))}
      </div>
      <div style={{fontSize:15,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Contratações recentes</div>
      {proposals.slice(0,3).map((h,i)=>(
        <Card key={h.id} onClick={()=>onGo("proposal",h)} style={{display:"flex",alignItems:"center",gap:12}}>
          <Av initials={h.influencerAvatar} size={42} idx={i}/>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{h.type} 1x</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{h.date}</div></div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}><div style={{fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {h.value}</div><Badge s={h.status}/></div>
        </Card>
      ))}
    </div>
  </PullRefresh>;
}

function ExploreScreen({onInfluencer,userCats}){
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("Todos");
  const cats=["Todos",...ALL_CATS];
  const list=INFLUENCERS_DB.filter(i=>(filter==="Todos"||i.category===filter)&&(i.username.toLowerCase().includes(search.toLowerCase())||i.category.toLowerCase().includes(search.toLowerCase())));
  return <div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{background:T.white,padding:"0 20px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0 8px"}}>
        <span style={{fontSize:24,fontWeight:800,color:T.pink,fontFamily:"Poppins,sans-serif"}}>Explorar</span>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Buscar influenciadores..." style={{width:"100%",padding:"11px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}}/>
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
          <div style={{fontSize:12,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{inf.username}</div>
          <div style={{fontSize:11,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginTop:4}}>{inf.followers}</div>
          <div style={{fontSize:10,color:T.sub,fontFamily:"Poppins,sans-serif"}}>seguidores</div>
          <div style={{fontSize:11,fontWeight:700,color:T.pink,fontFamily:"Poppins,sans-serif",marginTop:2}}>{inf.engagement}%</div>
          <div style={{fontSize:10,color:T.sub,fontFamily:"Poppins,sans-serif"}}>engajamento</div>
        </button>
      ))}
    </div>
  </div>;
}

function BrandFinance({user,proposals,onDeposit}){
  const [showPix,setShowPix]=useState(false);
  const total=proposals.reduce((s,h)=>s+h.value,0);
  return <div style={{flex:1,overflowY:"auto",position:"relative"}}>
    {showPix&&<PixModal mode="deposit" onPay={(amt,comp)=>{onDeposit(amt,comp);setShowPix(false);}} onClose={()=>setShowPix(false)}/>}
    <Hdr title="Finanças"/>
    <div style={{padding:"8px 20px 20px"}}>
      <BCard label="Saldo disponível" value={`R$ ${user.balance||0},00`} icon="💰" grad={T.grad1}/>
      <BCard label="Investido este mês" value={`R$ ${total},00`} icon="📈" grad={T.grad2}/>
      <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"18px 0 10px"}}>Adicionar saldo</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
        <button onClick={()=>setShowPix(true)} style={{background:T.grad1,border:"none",borderRadius:18,padding:"18px 14px",cursor:"pointer",textAlign:"left"}}>
          <span style={{fontSize:28,display:"block",marginBottom:8}}>⚡</span>
          <span style={{color:T.white,fontSize:12,fontWeight:700,fontFamily:"Poppins,sans-serif"}}>Depositar por PIX</span>
        </button>
        <button onClick={()=>alert("Boleto — em breve")} style={{background:T.grad1,border:"none",borderRadius:18,padding:"18px 14px",cursor:"pointer",textAlign:"left"}}>
          <span style={{fontSize:28,display:"block",marginBottom:8}}>🏦</span>
          <span style={{color:T.white,fontSize:12,fontWeight:700,fontFamily:"Poppins,sans-serif"}}>Depositar por Boleto</span>
        </button>
      </div>
      <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Transações</div>
      {proposals.map(h=>(
        <Card key={h.id} style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✓</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{h.type} 1x</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{h.influencerName}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {h.value}</div><Badge s={h.status}/></div>
        </Card>
      ))}
    </div>
  </div>;
}

const FAKE_CANDS=[
  {id:"c1",name:"Ana Fitness",   avatar:"AF",instagram:"@fitlife_ana",  followers:"1.01K",engagement:"13.74",category:"Fitness"},
  {id:"c2",name:"Turistando SLZ",avatar:"TS",instagram:"@turistandoslz",followers:"127K",  engagement:"22.91",category:"Viagem"},
  {id:"c3",name:"Natureza BR",   avatar:"NB",instagram:"@natureza_br",  followers:"2.48M", engagement:"3.16", category:"Natureza"},
  {id:"c4",name:"Bea Zau",       avatar:"BZ",instagram:"@beazau",       followers:"1.83M", engagement:"3.45", category:"Moda"},
  {id:"c5",name:"Tech BR",       avatar:"TB",instagram:"@techbr",       followers:"2.24K", engagement:"2.14", category:"Tech"},
];
function ProjectDetail({project,onBack,onHireProposal,onHireAccept,proposals}){
  const [hiredCand,setHiredCand]=useState(null);
  const [showPix,setShowPix]=useState(false);
  const [paidCand,setPaidCand]=useState(null);
  const cands=FAKE_CANDS.slice(0,Math.max(project.candidates.length,2));
  const related=proposals.filter(p=>["created","paid","in_progress","upload_done","approved","completed"].includes(p.status));

  const handleAccept=(c)=>{setHiredCand(c);setShowPix(true);};
  const handlePaid=(amt,comprovante)=>{
    setShowPix(false);
    setPaidCand(hiredCand);
    onHireAccept(hiredCand,project,amt,comprovante);
  };

  return <div style={{flex:1,overflowY:"auto",position:"relative"}}>
    {showPix&&hiredCand&&<PixModal
      mode="pay"
      amount={project.value}
      label={`Pagamento para ${hiredCand.name} — ${project.type}`}
      onPay={handlePaid}
      onClose={()=>setShowPix(false)}
    />}
    <Hdr title="Detalhes do Projeto" onBack={onBack}/>
    <div style={{padding:"8px 20px 24px"}}>
      <Card>
        <div style={{fontWeight:700,fontSize:15,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:6}}>{project.title}</div>
        <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif",lineHeight:1.6,marginBottom:10}}>{project.desc}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
          <span style={{background:"#f0ebff",color:T.purple,fontSize:11,fontFamily:"Poppins,sans-serif",fontWeight:700,padding:"3px 12px",borderRadius:50}}>{project.type}</span>
          <Badge s={project.status}/>
        </div>
        <div style={{fontSize:22,fontWeight:900,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {project.value},00</div>
      </Card>

      {related.length>0&&<>
        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>📋 Propostas ativas</div>
        {related.map((p,i)=>(
          <Card key={p.id} onClick={()=>onHireProposal(p)} style={{display:"flex",alignItems:"center",gap:12}}>
            <Av initials={p.influencerAvatar} size={40} idx={i}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{p.influencerName}</div>
              <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.type} · {p.date}</div>
            </div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {p.value}</div><Badge s={p.status}/></div>
          </Card>
        ))}
      </>}

      <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 10px"}}>👥 Candidatos ({cands.length})</div>
      {cands.map((c,i)=>{
        const isPaid=paidCand&&paidCand.id===c.id;
        return <Card key={c.id} style={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <Av initials={c.avatar} size={48} idx={i}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:"Poppins,sans-serif"}}>{c.name}</div>
              <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{c.instagram}</div>
              <span style={{background:"#f0ebff",color:T.purple,fontSize:10,fontFamily:"Poppins,sans-serif",fontWeight:700,padding:"2px 9px",borderRadius:50}}>{c.category}</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div style={{textAlign:"center",background:T.bg,borderRadius:10,padding:"8px"}}><div style={{fontWeight:800,fontSize:14,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{c.followers}</div><div style={{fontSize:10,color:T.sub,fontFamily:"Poppins,sans-serif"}}>seguidores</div></div>
            <div style={{textAlign:"center",background:T.bg,borderRadius:10,padding:"8px"}}><div style={{fontWeight:800,fontSize:14,color:T.pink,fontFamily:"Poppins,sans-serif"}}>{c.engagement}%</div><div style={{fontSize:10,color:T.sub,fontFamily:"Poppins,sans-serif"}}>engajamento</div></div>
          </div>
          {isPaid
            ?<div style={{padding:"12px",background:"#e8f5e9",borderRadius:12,textAlign:"center",fontSize:12,fontWeight:700,color:"#2E7D32",fontFamily:"Poppins,sans-serif"}}>
              ✅ Pagamento enviado! Aguardando confirmação do admin.<br/>
              <span style={{fontWeight:400,fontSize:11}}>O influencer será notificado em breve.</span>
            </div>
            :<Btn label={`✅ Aceitar e pagar R$ ${project.value},00`} onClick={()=>handleAccept(c)} v="pink" full/>
          }
        </Card>;
      })}
    </div>
  </div>;
}
function BrandProjects({proposals,projects,onCreate,onViewProposal,onViewProject}){
  const active=proposals.filter(p=>["paid","in_progress","upload_done"].includes(p.status));
  const done=proposals.filter(p=>["approved","completed"].includes(p.status));
  const Row=({p,dim})=>(
    <Card onClick={()=>onViewProposal(p)} style={{display:"flex",alignItems:"center",gap:12,opacity:dim?.7:1}}>
      <Av initials={p.influencerAvatar} size={40} idx={1}/>
      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:dim?T.sub:T.purple,fontFamily:"Poppins,sans-serif"}}>#{p.id} | {p.type} 1x</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.date}</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><span style={{fontWeight:800,color:dim?T.sub:T.purple,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {p.value}</span><Badge s={p.status}/></div>
    </Card>
  );
  return <div style={{flex:1,overflowY:"auto"}}>
    <Hdr title="Projetos"/>
    <div style={{padding:"8px 20px 20px"}}>
      <button onClick={onCreate} style={{width:"100%",background:T.grad1,border:"none",borderRadius:20,padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{color:T.white,fontSize:15,fontWeight:700,fontFamily:"Poppins,sans-serif"}}>+ Criar Projeto</span><span style={{fontSize:26}}>📋</span>
      </button>
      {projects.length>0&&<>
        <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:8}}>📁 Meus Projetos ({projects.length})</div>
        {projects.map((p,i)=>(
          <Card key={p.id} onClick={()=>onViewProject(p)} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{p.title}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif",marginTop:2}}>{p.type} · R$ {p.value},00</div></div>
              <Badge s={p.status}/>
            </div>
            <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:12,fontWeight:700,color:p.candidates.length>0?T.pink:T.sub,fontFamily:"Poppins,sans-serif"}}>👥 {p.candidates.length} candidato(s)</span>
              <span style={{fontSize:12,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>Ver →</span>
            </div>
          </Card>
        ))}
      </>}
      <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 8px"}}>⏳ Em andamento</div>
      {active.length===0&&<div style={{color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:12,marginBottom:12}}>Nenhuma proposta ativa.</div>}
      {active.map(p=><Row key={p.id} p={p}/>)}
      <div style={{fontSize:13,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"16px 0 8px"}}>✅ Realizadas</div>
      {done.length===0&&<div style={{color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:12}}>Nenhuma concluída ainda.</div>}
      {done.map(p=><Row key={p.id} p={p} dim/>)}
    </div>
  </div>;
}

function CreateProject({onBack,onDone}){
  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [type,setType]=useState("Stories");
  const [value,setValue]=useState("");
  const net=value?Math.floor(Number(value)*.8):0;
  return <div style={{flex:1,overflowY:"auto"}}>
    <Hdr title="Criar Projeto" onBack={onBack}/>
    <div style={{padding:"8px 20px 24px"}}>
      <Inp label="Título" value={title} onChange={setTitle} placeholder="Ex: Post no feed institucional"/>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Tipo de publi</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Feed","Stories","Reels","Video","TikTok"].map(t=><button key={t} onClick={()=>setType(t)} style={{background:type===t?T.grad1:T.bg,color:type===t?T.white:T.sub,border:`1.5px solid ${type===t?T.purple:T.border}`,borderRadius:50,padding:"7px 16px",fontSize:12,fontFamily:"Poppins,sans-serif",fontWeight:600,cursor:"pointer"}}>{t}</button>)}
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Descrição</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descreva o que o influenciador deve fazer..." style={{width:"100%",padding:"12px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box",minHeight:80,resize:"none"}}/>
      </div>
      <Inp label="Valor da publi (R$)" type="number" value={value} onChange={setValue} placeholder="Ex: 50"/>
      {value&&<div style={{padding:"12px 16px",background:"#f0ebff",borderRadius:12,marginBottom:16,fontSize:12,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>💡 Influencer recebe R$ {net},00 (plataforma retém 20%)</div>}
      <Btn label="Publicar Projeto 🚀" onClick={()=>{if(!title||!value)return alert("Preencha título e valor.");onDone({id:"p"+Date.now(),title,desc,type,value:Number(value),status:"open",candidates:[],date:new Date().toLocaleDateString("pt-BR")});}} v="pink" full/>
    </div>
  </div>;
}

function ProfileScreen({user,onLogout,onEdit}){
  const items=[{icon:"✅",label:"Status da Conta",first:true},{icon:"👤",label:"Editar Perfil",action:onEdit},{icon:"⚙️",label:"Configurações"},{icon:"💬",label:"Suporte"},{icon:"🚪",label:"Sair",action:onLogout,danger:true}];
  return <div style={{flex:1,overflowY:"auto"}}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 20px",background:T.white}}>
      <Av src={user.photo} initials={user.avatar} size={72} idx={0}/>
      <div style={{fontSize:20,fontWeight:800,color:T.pink,fontFamily:"Poppins,sans-serif",marginTop:12}}>{user.name}</div>
      <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{user.role==="brand"?"Anunciante":user.role==="influencer"?"Influenciador":"Admin"}</div>
      <div style={{marginTop:6}}><Stars n={user.rating||5}/></div>
    </div>
    <div style={{padding:"16px 20px"}}>
      {items.map((item,i)=>(
        <button key={i} onClick={item.action||(()=>alert(`${item.label} — em breve`))} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:item.first?T.grad1:T.card,border:"none",borderRadius:16,marginBottom:10,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:19}}>{item.icon}</span><span style={{fontSize:14,fontWeight:600,color:item.first?T.white:item.danger?T.pink:T.text,fontFamily:"Poppins,sans-serif"}}>{item.label}</span></div>
          <span style={{color:item.first?"rgba(255,255,255,.8)":T.sub,fontSize:18}}>›</span>
        </button>
      ))}
    </div>
  </div>;
}

function BrandEditProfile({user,onBack,onSave}){
  const [name,setName]=useState(user.name);
  const [photo,setPhoto]=useState(user.photo);
  return <div style={{flex:1,overflowY:"auto"}}>
    <Hdr title="Editar Perfil" onBack={onBack}/>
    <div style={{padding:"8px 20px 24px"}}>
      <PhotoPicker current={photo} onPick={setPhoto}/>
      <Inp label="Nome completo" value={name} onChange={setName}/>
      <Btn label="Salvar alterações ✓" onClick={()=>onSave({...user,name,photo})} v="purple" full/>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// INFLUENCER SCREENS
// ══════════════════════════════════════════════════════════════════════════════
function InfHome({user,onTab,onGo,proposals}){
  const earned=proposals.filter(p=>p.status==="completed").reduce((s,p)=>s+p.netValue,0);
  const active=proposals.filter(p=>["paid","in_progress","upload_done"].includes(p.status)).length;
  return <PullRefresh onRefresh={()=>window.location.reload()}>
    <div style={{background:T.grad1,padding:"20px 20px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.75)",fontFamily:"Poppins,sans-serif"}}>Olá,</div>
          <div style={{fontSize:20,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif"}}>{user.name} ⚡</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.8)",fontFamily:"Poppins,sans-serif",marginTop:2}}>{user.instagram||"Configure seu perfil"}</div>
        </div>
        <Av src={user.photo} initials={user.avatar} size={50} idx={5}/>
      </div>
    </div>
    <div style={{padding:"0 20px",marginTop:-14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Card style={{textAlign:"center",padding:"16px 10px"}}><div style={{fontSize:21,fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {earned},00</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Total ganho</div></Card>
        <Card style={{textAlign:"center",padding:"16px 10px"}}><div style={{fontSize:21,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{active}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Em andamento</div></Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[{icon:"🔍",label:"Ver Projetos",grad:T.grad2,act:()=>onTab("projects")},{icon:"📋",label:"Minhas Propostas",grad:T.grad1,act:()=>onTab("proposals")}].map((a,i)=>(
          <button key={i} onClick={a.act} style={{background:a.grad,border:"none",borderRadius:18,padding:"18px 14px",cursor:"pointer",textAlign:"left"}}>
            <span style={{fontSize:28,display:"block",marginBottom:8}}>{a.icon}</span>
            <span style={{color:T.white,fontSize:12,fontWeight:700,fontFamily:"Poppins,sans-serif",lineHeight:1.3}}>{a.label}</span>
          </button>
        ))}
      </div>
      <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:10}}>Últimas atividades</div>
      {proposals.slice(0,3).map((p,i)=>(
        <Card key={p.id} onClick={()=>onGo("proposal",p)} style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:12,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📄</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>Proposta #{p.id} · {p.type}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.date}</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><span style={{fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif",fontSize:13}}>R$ {p.netValue},00</span><Badge s={p.status}/></div>
        </Card>
      ))}
    </div>
  </PullRefresh>;
}

function InfProjects({projects,onApply,applied}){
  const open=projects.filter(p=>p.status==="open"||p.status==="active");
  return <div style={{flex:1,overflowY:"auto"}}>
    <Hdr title="Projetos Abertos" sub="Candidate-se e ganhe!"/>
    <div style={{padding:"8px 20px 20px"}}>
      {open.length===0&&<div style={{textAlign:"center",color:T.sub,fontFamily:"Poppins,sans-serif",padding:30,fontSize:13}}>Nenhum projeto disponível agora.</div>}
      {open.map(p=>{
        const net=Math.floor(p.value*(1-FEE));
        const already=applied.includes(p.id);
        return <Card key={p.id}>
          <div style={{fontWeight:700,fontSize:14,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:6}}>{p.title}</div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            <span style={{background:"#f0ebff",color:T.purple,fontSize:10,fontFamily:"Poppins,sans-serif",fontWeight:700,padding:"2px 9px",borderRadius:50}}>{p.type}</span>
            <Badge s={p.status}/>
          </div>
          <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif",lineHeight:1.5,marginBottom:12}}>{p.desc}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Você recebe</div>
              <div style={{fontSize:26,fontWeight:900,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {net},00</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Candidatos</div>
              <div style={{fontSize:18,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif"}}>{p.candidates.length}</div>
            </div>
          </div>
          <Btn label={already?"✅ Candidatura enviada":"🙋 Me candidatar"} onClick={()=>{if(!already)onApply(p);}} v={already?"gray":"pink"} full off={already}/>
        </Card>;
      })}
    </div>
  </div>;
}

function InfProposals({proposals,onView}){
  const active=proposals.filter(p=>["paid","in_progress","upload_done"].includes(p.status));
  const done=proposals.filter(p=>["approved","completed"].includes(p.status));
  return <div style={{flex:1,overflowY:"auto"}}>
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
  </div>;
}

function InfFinance({proposals}){
  const earned=proposals.filter(p=>p.status==="completed").reduce((s,p)=>s+p.netValue,0);
  const pending=proposals.filter(p=>p.status==="approved").reduce((s,p)=>s+p.netValue,0);
  return <div style={{flex:1,overflowY:"auto"}}>
    <Hdr title="Meus Ganhos"/>
    <div style={{padding:"8px 20px 20px"}}>
      <BCard label="Total ganho (líquido)" value={`R$ ${earned},00`} icon="💸" grad={T.grad3}/>
      <BCard label="Aguardando transferência" value={`R$ ${pending},00`} icon="⏳" grad={T.grad1}/>
      <div style={{padding:"14px 16px",background:"#fff8e1",borderRadius:16,marginBottom:16,border:`1px solid #FFD54F`}}>
        <div style={{fontSize:13,fontWeight:700,color:T.warn,fontFamily:"Poppins,sans-serif",marginBottom:4}}>⚡ Pagamento automático</div>
        <div style={{fontSize:12,color:T.text,fontFamily:"Poppins,sans-serif",lineHeight:1.7}}>Após aprovação da marca, o pagamento é enviado via <b>PIX em até 24h</b> para sua chave cadastrada.</div>
      </div>
      {proposals.map(p=>(
        <Card key={p.id} style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:p.status==="completed"?"#e8f5e9":"#fff8e1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{p.status==="completed"?"✓":"⏳"}</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>#{p.id} · {p.type}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.date}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif",fontSize:14}}>R$ {p.netValue}</div><Badge s={p.status}/></div>
        </Card>
      ))}
    </div>
  </div>;
}

function InfProfileEdit({user,onBack,onSave}){
  const [name,setName]=useState(user.name);
  const [photo,setPhoto]=useState(user.photo);
  const [ig,setIg]=useState(user.instagram||"");
  const [fol,setFol]=useState(user.followers||"");
  const [eng,setEng]=useState(user.engagement||"");
  const [cat,setCat]=useState(user.category||"Fitness");
  const [cats,setCats]=useState(user.extraCats||[]);
  const [pix,setPix]=useState(user.pixKey||"");
  const [bio,setBio]=useState(user.bio||"");
  const [showCatPicker,setShowCatPicker]=useState(false);

  const toggleCat=c=>{
    if(c===cat)return;
    setCats(prev=>prev.includes(c)?prev.filter(x=>x!==c):[...prev,c].slice(0,4));
  };

  return <div style={{flex:1,overflowY:"auto"}}>
    <Hdr title="Meu Perfil" sub="Complete seus dados" onBack={onBack}/>
    <div style={{padding:"8px 20px 24px"}}>
      <PhotoPicker current={photo} onPick={setPhoto}/>
      <Inp label="Nome completo" value={name} onChange={setName}/>
      <Inp label="Instagram" value={ig} onChange={setIg} prefix="@" placeholder="seuperfil"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Inp label="Seguidores" value={fol} onChange={setFol} placeholder="Ex: 50K"/>
        <Inp label="Engajamento (%)" value={eng} onChange={setEng} placeholder="Ex: 5.2"/>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Categoria principal</label>
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:14,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}}>
          {ALL_CATS.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <label style={{fontSize:11,fontWeight:700,color:T.sub,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Categorias extras (até 4)</label>
          <button onClick={()=>setShowCatPicker(!showCatPicker)} style={{background:T.grad1,border:"none",borderRadius:50,padding:"4px 12px",color:T.white,fontSize:11,fontWeight:700,fontFamily:"Poppins,sans-serif",cursor:"pointer"}}>+ Adicionar</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {cats.map(c=><span key={c} style={{background:"#f0ebff",color:T.purple,fontSize:11,fontFamily:"Poppins,sans-serif",fontWeight:700,padding:"4px 12px",borderRadius:50,cursor:"pointer"}} onClick={()=>toggleCat(c)}>{c} ✕</span>)}
        </div>
        {showCatPicker&&<div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
          {ALL_CATS.filter(c=>c!==cat&&!cats.includes(c)).map(c=>(
            <button key={c} onClick={()=>{toggleCat(c);}} style={{background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:50,padding:"5px 12px",fontSize:11,fontFamily:"Poppins,sans-serif",fontWeight:600,cursor:"pointer",color:T.sub}}>+ {c}</button>
          ))}
        </div>}
      </div>
      <Inp label="Chave PIX" value={pix} onChange={setPix} placeholder="CPF, email ou telefone"/>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Bio</label>
        <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Conte sobre você..." style={{width:"100%",padding:"12px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box",minHeight:80,resize:"none"}}/>
      </div>
      <div style={{padding:"12px 16px",background:"#e8f5e9",borderRadius:12,marginBottom:16,fontSize:12,color:"#2E7D32",fontFamily:"Poppins,sans-serif",fontWeight:600}}>🔐 Sua chave PIX é usada para receber pagamentos aprovados.</div>
      <Btn label="Salvar dados ✓" onClick={()=>onSave({...user,name,photo,instagram:`@${ig.replace("@","")}`,followers:fol,engagement:eng,category:cat,extraCats:cats,pixKey:pix,bio})} v="purple" full/>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
function AdminPanel({proposals,deposits,onApproveDeposit,onApproveProposal,onLogout}){
  const [tab,setTab]=useState("pix");
  const brands=Object.values(INIT_USERS).filter(u=>u.role==="brand");
  const infs=Object.values(INIT_USERS).filter(u=>u.role==="influencer");
  const revenue=proposals.filter(p=>p.status==="completed").reduce((s,p)=>s+(p.value*FEE),0);
  const pendingDeps=deposits.filter(d=>d.status==="pending");
  const pendingPay=proposals.filter(p=>p.pixPending);
  const tabs=[{id:"pix",label:"PIX ⚡",icon:"💸"},{id:"overview",label:"Visão Geral",icon:"📊"},{id:"brands",label:"Marcas",icon:"🏢"},{id:"infs",label:"Influencers",icon:"⭐"},{id:"proposals",label:"Propostas",icon:"📋"}];

  return <div style={{flex:1,display:"flex",flexDirection:"column",background:T.bg}}>
    <div style={{background:T.grad1,padding:"20px 20px 16px",flexShrink:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif"}}>🛡️ Admin Influx</div>
          {(pendingDeps.length+pendingPay.length)>0&&<div style={{fontSize:12,color:"#FFD54F",fontFamily:"Poppins,sans-serif",fontWeight:600,marginTop:2}}>⚠️ {pendingDeps.length+pendingPay.length} pagamento(s) aguardando aprovação</div>}
        </div>
        <button onClick={onLogout} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:10,padding:"7px 14px",color:T.white,fontFamily:"Poppins,sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>Sair</button>
      </div>
      <div style={{display:"flex",gap:8,marginTop:14,overflowX:"auto",scrollbarWidth:"none"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"rgba(255,255,255,.25)":"rgba(255,255,255,.1)",border:`1.5px solid ${tab===t.id?"rgba(255,255,255,.5)":"transparent"}`,borderRadius:50,padding:"6px 14px",color:T.white,fontFamily:"Poppins,sans-serif",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,position:"relative"}}>
          {t.icon} {t.label}
          {t.id==="pix"&&(pendingDeps.length+pendingPay.length)>0&&<span style={{position:"absolute",top:-4,right:-4,background:T.pink,borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:T.white}}>{pendingDeps.length+pendingPay.length}</span>}
        </button>)}
      </div>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px 20px"}}>

      {tab==="pix"&&<>
        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",marginBottom:12}}>💰 Depósitos aguardando aprovação ({pendingDeps.length})</div>
        {pendingDeps.length===0&&<div style={{color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:13,marginBottom:20}}>Nenhum depósito pendente ✅</div>}
        {pendingDeps.map((d,i)=>(
          <Card key={d.id} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:"Poppins,sans-serif"}}>{d.userName}</div>
                <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{d.date}</div>
                {d.comprovante&&<div style={{fontSize:11,color:T.purple,fontFamily:"Poppins,sans-serif",marginTop:2}}>Comprovante: {d.comprovante}</div>}
              </div>
              <div style={{fontSize:22,fontWeight:900,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {d.amount},00</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Btn label="✅ Aprovar" onClick={()=>onApproveDeposit(d.id,"approved")} v="green"/>
              <Btn label="❌ Recusar" onClick={()=>onApproveDeposit(d.id,"rejected")} v="danger"/>
            </div>
          </Card>
        ))}

        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"20px 0 12px"}}>⚡ Pagamentos de publi pendentes ({pendingPay.length})</div>
        {pendingPay.length===0&&<div style={{color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:13}}>Nenhum pagamento pendente ✅</div>}
        {pendingPay.map((p,i)=>(
          <Card key={p.id} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:"Poppins,sans-serif"}}>Proposta #{p.id}</div>
                <div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.influencerName} · {p.type}</div>
                {p.pixComprovante&&<div style={{fontSize:11,color:T.purple,fontFamily:"Poppins,sans-serif",marginTop:2}}>Comprovante: {p.pixComprovante}</div>}
              </div>
              <div style={{fontSize:20,fontWeight:900,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {p.value},00</div>
            </div>
            <Badge s={p.status}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
              <Btn label="✅ Confirmar PIX" onClick={()=>onApproveProposal(p.id,"paid")} v="green"/>
              <Btn label="❌ Recusar" onClick={()=>onApproveProposal(p.id,"created")} v="danger"/>
            </div>
          </Card>
        ))}

        <div style={{fontSize:14,fontWeight:700,color:T.purple,fontFamily:"Poppins,sans-serif",margin:"20px 0 12px"}}>📊 Depósitos aprovados</div>
        {deposits.filter(d=>d.status!=="pending").map((d,i)=>(
          <Card key={d.id} style={{display:"flex",alignItems:"center",gap:12,opacity:.7}}>
            <div style={{width:36,height:36,borderRadius:10,background:d.status==="approved"?"#e8f5e9":"#fce4ec",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{d.status==="approved"?"✓":"✕"}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{d.userName}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{d.date}</div></div>
            <div style={{fontWeight:800,color:d.status==="approved"?T.success:T.danger,fontFamily:"Poppins,sans-serif"}}>R$ {d.amount}</div>
          </Card>
        ))}
      </>}

      {tab==="overview"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          {[{label:"Usuários",value:Object.keys(INIT_USERS).length,icon:"👥",color:T.purple},{label:"Marcas",value:brands.length,icon:"🏢",color:T.pink},{label:"Influencers",value:infs.length,icon:"⭐",color:T.warn},{label:"Receita 20%",value:`R$${revenue}`,icon:"💰",color:T.success}].map((s,i)=>(
            <Card key={i} style={{textAlign:"center",padding:"16px 10px"}}>
              <span style={{fontSize:26}}>{s.icon}</span>
              <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"Poppins,sans-serif"}}>{s.value}</div>
              <div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{s.label}</div>
            </Card>
          ))}
        </div>
      </>}
      {(tab==="brands"||tab==="infs")&&(tab==="brands"?brands:infs).map((u,i)=>(
        <Card key={u.id} style={{display:"flex",alignItems:"center",gap:12}}>
          <Av src={u.photo} initials={u.avatar} size={44} idx={i}/>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>{u.name}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{u.email}</div></div>
          <Badge s="active"/>
        </Card>
      ))}
      {tab==="proposals"&&proposals.map(p=>(
        <Card key={p.id} style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:12,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📄</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text,fontFamily:"Poppins,sans-serif"}}>#{p.id} · {p.type}</div><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>{p.influencerName} · {p.date}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif",fontSize:13}}>R$ {p.value}</div><Badge s={p.status}/></div>
        </Card>
      ))}
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
const now=()=>new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});

function App(){
  const [usersDB,setUsersDB]=useState(()=>({...INIT_USERS,...LS("influx_users",{})}));
  const [user,setUser]=useState(()=>LS("influx_current",null));
  const [tab,setTab]=useState("home");
  const [screen,setScreen]=useState(null);
  const [toast,setToast]=useState(null);
  const [proposals,setProposals]=useState(()=>LS("influx_proposals",INIT_PROPOSALS));
  const [projects,setProjects]=useState(()=>LS("influx_projects",INIT_PROJECTS));
  const [applied,setApplied]=useState(()=>LS("influx_applied",["p1","p2"]));
  const [deposits,setDeposits]=useState(()=>LS("influx_deposits",[]));
  // Inf notifications: list of {id,msg,read}
  const [infNotifs,setInfNotifs]=useState(()=>LS("influx_inf_notifs",[]));

  // Persist
  useEffect(()=>SS("influx_proposals",proposals),[proposals]);
  useEffect(()=>SS("influx_projects",projects),[projects]);
  useEffect(()=>SS("influx_applied",applied),[applied]);
  useEffect(()=>SS("influx_current",user),[user]);
  useEffect(()=>SS("influx_deposits",deposits),[deposits]);
  useEffect(()=>SS("influx_inf_notifs",infNotifs),[infNotifs]);

  // Show pending notif to influencer on login
  useEffect(()=>{
    if(!user)return;
    if(user.role==="influencer"){
      const unread=infNotifs.filter(n=>!n.read);
      if(unread.length>0){
        setToast({msg:unread[0].msg,type:"warn"});
        setInfNotifs(prev=>prev.map(n=>({...n,read:true})));
      } else {
        const t=setTimeout(()=>setToast({msg:"🔔 Nova publi disponível: 'Reels' — R$ 40,00!",type:"info"}),3500);
        return()=>clearTimeout(t);
      }
    }
    if(user.role==="brand"){
      const t=setTimeout(()=>setToast({msg:"⭐ 2 influencers se candidataram ao seu projeto!",type:"info"}),4000);
      return()=>clearTimeout(t);
    }
  },[user]);

  const go=useCallback((type,data=null)=>setScreen({type,data}),[]);
  const back=useCallback(()=>setScreen(null),[]);
  const logout=()=>{setUser(null);SS("influx_current",null);setScreen(null);setTab("home");};
  const login=(u)=>{setUser(u);setTab("home");};

  const advanceProposal=(id,newStatus,content=null)=>{
    setProposals(prev=>prev.map(p=>p.id===id?{...p,status:newStatus,...(content?{content}:{}),pixPending:newStatus==="created"?false:undefined}:p));
    const msgs={upload_done:"📤 Conteúdo enviado! Aguardando aprovação.",approved:"💸 Aprovado! PIX em até 24h.",paid:"💰 Pagamento confirmado! Influencer notificado.",in_progress:"▶️ Serviço iniciado!"};
    setToast({msg:msgs[newStatus]||"Status atualizado!",type:"success"});
    setScreen(prev=>prev?.type==="proposal"?{...prev,data:{...prev.data,status:newStatus,...(content?{content}:{})}}:prev);
  };

  const sendMsg=(propId,msg)=>{
    setProposals(prev=>prev.map(p=>p.id===propId?{...p,messages:[...p.messages,msg]}:p));
    setScreen(prev=>{
      if(prev?.type==="chat")return{...prev,data:{...prev.data,messages:[...prev.data.messages,msg]}};
      return prev;
    });
  };

  const saveUser=(updated)=>{
    setUser(updated);
    setUsersDB(prev=>{const n={...prev,[updated.email]:updated};SS("influx_users",n);return n;});
    setToast({msg:"✅ Perfil salvo!",type:"success"});
    back();
  };

  const addProject=(proj)=>{
    setProjects(prev=>[proj,...prev]);
    setToast({msg:"🚀 Projeto publicado!",type:"success"});
    back();
  };

  // Deposit: user registers deposit → pending for admin approval
  const registerDeposit=(amount,comprovante)=>{
    const dep={id:"dep"+Date.now(),userId:user.id,userName:user.name,amount,comprovante,status:"pending",date:now()};
    setDeposits(prev=>[dep,...prev]);
    setToast({msg:`⏳ Depósito de R$ ${amount},00 registrado! Aguardando aprovação do admin.`,type:"warn"});
  };

  // Admin approves deposit → adds balance to user
  const approveDeposit=(depId,newStatus)=>{
    setDeposits(prev=>prev.map(d=>d.id===depId?{...d,status:newStatus}:d));
    if(newStatus==="approved"){
      const dep=deposits.find(d=>d.id===depId);
      if(dep){
        setUsersDB(prev=>{
          const u=prev[Object.keys(prev).find(k=>prev[k].id===dep.userId)];
          if(!u)return prev;
          const updated={...u,balance:(u.balance||0)+dep.amount};
          const n={...prev,[u.email]:updated};
          SS("influx_users",n);
          return n;
        });
        setToast({msg:`✅ Depósito de R$ ${dep.amount},00 aprovado!`,type:"success"});
      }
    } else {
      setToast({msg:"❌ Depósito recusado.",type:"warn"});
    }
  };

  // Brand hires influencer: mark proposal as pixPending, notify influencer
  const hireAccept=(cand,project,amount,comprovante)=>{
    // Create new proposal for this hire
    const newProp={
      id:String(Date.now()).slice(-4),
      type:project.type,
      value:amount,
      netValue:Math.floor(amount*0.8),
      status:"created",
      pixPending:true,
      pixComprovante:comprovante||"",
      date:now(),
      influencerName:cand.name,
      influencerAvatar:cand.avatar,
      pixKey:PIX_KEY,
      content:null,
      messages:[],
    };
    setProposals(prev=>[newProp,...prev]);
    // Notify influencer (stored for next login)
    setInfNotifs(prev=>[{id:"n"+Date.now(),msg:`🎉 Você foi selecionado para "${project.title}"! Você tem 24h para enviar o conteúdo.`,read:false},...prev]);
    setToast({msg:"✅ Pagamento registrado! Admin irá confirmar em breve.",type:"success"});
    // Go to the new proposal timeline
    setTimeout(()=>go("proposal",newProp),400);
  };

  // Admin approves/rejects PIX payment for proposal
  const approveProposalPix=(propId,newStatus)=>{
    setProposals(prev=>prev.map(p=>p.id===propId?{...p,status:newStatus,pixPending:false}:p));
    setToast({msg:newStatus==="paid"?"✅ PIX aprovado! Influencer notificado.":"❌ PIX recusado.",type:newStatus==="paid"?"success":"warn"});
    if(newStatus==="paid"){
      // notify influencer
      const prop=proposals.find(p=>p.id===propId);
      if(prop) setInfNotifs(prev=>[{id:"n"+Date.now(),msg:`💰 Pagamento confirmado para proposta #${propId}! Você tem 24h para enviar o conteúdo. 🚀`,read:false},...prev]);
    }
  };

  const applyProject=(p)=>{
    setApplied(prev=>[...prev,p.id]);
    setProjects(prev=>prev.map(pr=>pr.id===p.id?{...pr,candidates:[...pr.candidates,"me"]}:pr));
    setToast({msg:`🙋 Candidatura enviada para "${p.title}"!`,type:"success"});
  };

  // ADMIN
  if(user?.role==="admin") return <Shell toast={toast} onClear={()=>setToast(null)}>
    <AdminPanel proposals={proposals} deposits={deposits} onApproveDeposit={approveDeposit} onApproveProposal={approveProposalPix} onLogout={logout}/>
  </Shell>;

  // NOT LOGGED
  if(!user) return <Shell toast={toast} onClear={()=>setToast(null)} white>
    <AuthScreen onLogin={login} usersDB={usersDB} setUsersDB={setUsersDB}/>
  </Shell>;

  const isBrand=user.role==="brand";
  const navItems=isBrand
    ?[{id:"finance",label:"Finanças",icon:"💰"},{id:"explore",label:"Explorar",icon:"🔭"},{id:"home",label:"Home",icon:"🏠"},{id:"projects",label:"Projetos",icon:"📋"},{id:"profile",label:"Perfil",icon:"👤"}]
    :[{id:"home",label:"Início",icon:"🏠"},{id:"projects",label:"Projetos",icon:"🔍"},{id:"proposals",label:"Propostas",icon:"📋"},{id:"finance",label:"Ganhos",icon:"💸"},{id:"profile",label:"Perfil",icon:"👤"}];

  const getLiveProposal=(data)=>proposals.find(p=>p.id===data.id)||data;

  const renderContent=()=>{
    if(screen){
      if(screen.type==="proposal"){const live=getLiveProposal(screen.data);return <ProposalTimeline proposal={live} role={user.role} onBack={back} onAction={(s,c)=>advanceProposal(live.id,s,c)} onChat={()=>go("chat",getLiveProposal(screen.data))}/>;}
      if(screen.type==="chat"){return <ChatScreen proposal={getLiveProposal(screen.data)} role={user.role} onBack={back} onSend={sendMsg}/>;}
      if(screen.type==="create") return <CreateProject onBack={back} onDone={addProject}/>;
      if(screen.type==="project-detail") return <ProjectDetail project={screen.data} proposals={proposals} onBack={back} onHireProposal={p=>go("proposal",p)} onHireAccept={hireAccept}/>;
      if(screen.type==="edit-profile") return isBrand
        ?<BrandEditProfile user={user} onBack={back} onSave={saveUser}/>
        :<InfProfileEdit user={user} onBack={back} onSave={saveUser}/>;
      if(screen.type==="inf-detail") return (
        <div style={{flex:1,overflowY:"auto"}}>
          <Hdr title="Perfil" onBack={back}/>
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
      if(tab==="finance") return <BrandFinance user={user} proposals={proposals} onDeposit={registerDeposit}/>;
      if(tab==="projects") return <BrandProjects proposals={proposals} projects={projects} onCreate={()=>go("create")} onViewProposal={p=>go("proposal",p)} onViewProject={p=>go("project-detail",p)}/>;
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
  return <Shell toast={toast} onClear={()=>setToast(null)}>
    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>{renderContent()}</div>
    {!hideNav&&<div style={{display:"flex",background:T.purple,padding:"10px 0 16px",flexShrink:0,borderTop:`2px solid ${T.purpleDark}`}}>
      {navItems.map(n=>(
        <button key={n.id} onClick={()=>{setTab(n.id);setScreen(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",color:tab===n.id&&!screen?"#fff":"rgba(255,255,255,.5)",transition:"all .2s"}}>
          <span style={{fontSize:tab===n.id&&!screen?22:19,transition:"all .2s"}}>{n.icon}</span>
          <span style={{fontSize:9,fontWeight:tab===n.id&&!screen?700:400,fontFamily:"Poppins,sans-serif"}}>{n.label}</span>
          {tab===n.id&&!screen&&<div style={{width:4,height:4,borderRadius:"50%",background:T.pink}}/>}
        </button>
      ))}
    </div>}
  </Shell>;
}

function Shell({children,toast,onClear,white}){
  return <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#f0ebff",fontFamily:"Poppins,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <div style={{width:390,height:844,background:white?T.white:T.bg,borderRadius:40,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(108,74,182,.28)",position:"relative"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={onClear}/>}
      {children}
    </div>
  </div>;
}

// Mount
const rootEl=document.getElementById("root");
if(rootEl)createRoot(rootEl).render(<App/>);
export default App;
