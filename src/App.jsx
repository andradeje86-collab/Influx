import { useState, useEffect, useCallback, useRef } from "react";

// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
// TEMA
// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
const T = {
  roxo: "#6C4AB6", roxo claro: "#8B6FD4", roxo escuro: "#4A2F8A",
  rosa: "#FF006E", rosa claro: "#FF4D9B",
  branco: "#FFFFFF", fundo: "#F5F5F5", cartão: "#FFFFFF",
  texto: "#1A1A2E", sub: "#7B7B9A", borda: "#E8E8F0",
  sucesso: "#00C896", aviso: "#FF8C00", perigo: "#FF3B30",
  grad1: "linear-gradient(135deg, #6C4AB6, #8B6FD4)",
  grad2: "linear-gradient(135deg, #FF006E, #FF4D9B)",
  grad3: "linear-gradient(135deg, #00C896, #00A878)",
};
const PAL = ["#6C4AB6","#FF006E","#00C896","#FF8C00","#0099FF","#9C27B0","#E91E63","#4CAF50"];
const PLATFORM_FEE = 0.20;

// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
// DADOS SIMULADOS
// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
const USERS_DB = {
  "marca@email.com": { id:"u1", name:"Jedivan Andrade", email:"marca@email.com", pass:"123456", role:"brand", rating:5, since:2022, avatar:"JA" },
  "inf@email.com": { id:"u2", nome:"Ana Fitness", email:"inf@email.com", senha:"123456", função:"influencer", classificação:4, desde:2023, avatar:"AF", instagram:"@fitlife_ana", seguidores:"1.01K", engajamento:"13.74", categoria:"Fitness", pixKey:"ana@pix.com", bio:"Criadora de conteúdo fitness ðŸ'ª" },
  "admin@influx.com": { id:"u0", name:"Admin Influx", email:"admin@influx.com", pass:"admin123",role:"admin", avatar:"AD" },
};

const INFLUENCERS_DB = [
  { id:"i1", username:"@mariagomes", name:"Maria Gomes", followers:"11.2M", engagement:"0.26", avatar:"MG", category:"Lifestyle", top:true },
  { id:"i2", username:"@lucas.art", name:"Lucas Art", followers:"3.13M", engagement:"0.06", avatar:"LA", category:"Arte", top:false },
  { id:"i3", username:"@natureza_br", name:"Natureza BR", followers:"2.48M", engagement:"3.16", avatar:"NB", category:"Natureza", top:true },
  { id:"i4", username:"@beazau", name:"Bea Zau", followers:"1.83M", engagement:"3.45", avatar:"BZ", category:"Moda", top:true },
  { id:"i5", username:"@turistandoslz",name:"Turistando SLZ", followers:"127K", engagement:"22.91", avatar:"TS", category:"Viagem", top:true },
  { id:"i6", username:"@fitlife_ana", name:"Ana Fitness", followers:"1.01K", engagement:"13.74", avatar:"FA", category:"Fitness", top:false },
  { id:"i7", username:"@techbr", name:"Tech BR", followers:"2.24K", engagement:"2.14", avatar:"TB", category:"Tech", top:false },
  { id:"i8", nome de usuário:"@cozinhando_br",nome:"Cozinhando BR", seguidores:"890K", engajamento:"5.2", avatar:"CB", categoria:"Gastronomia",top:false},
];

const INIT_PROPOSALS = [
  { id:"3477", type:"Feed", value:10, netValue:8, status:"in_progress", date:"25/03/2026 17:13", influencerName:"Ana Fitness", influencerAvatar:"AF", pixKey:"ana@pix.com",
    messages:[{from:"brand",text:"Olá! Aguardando sua entrega ðŸ˜Š",time:"17:15"},{from:"inf",text:"Já estou preparando o conteúdo!",time:"17:20"}] },
  { id:"3476", type:"Stories",value:10, netValue:8, status:"upload_done", date:"25/03/2026 10:40", influencerName:"Ana Fitness", influencerAvatar:"AF", pixKey:"ana@pix.com",
    messages:[{from:"inf",text:"Fiz o upload! Pode verificar ðŸŽ‰",time:"11:00"}] },
  { id:"3475", type:"Feed", value:20, netValue:16, status:"completed", date:"20/03/2026 14:00", influencerName:"Ana Fitness", influencerAvatar:"AF", pixKey:"ana@pix.com",
    mensagens:[] },
];

const INIT_PROJECTS = [
  { id:"p1", title:"1 vídeo story", desc:"Criar um vídeo em modo selfie apresentando as funcionalidades do app.", value:10, type:"Stories", status:"active", candidates:["i5","i3","i6","i7","i8"], date:"2026-03-20" },
  { id:"p2", title:"Publicação para story", desc:"Vídeo em modo selfie, falando das funções do app. Referência: www.influx.com.br.", valor:10, type:"Stories", status:"ativo", candidatos:["i4","i6"], data:"2026-03-18" },
  { id:"p3", title:"Post no feed institucional", desc:"Foto no feed apresentando o produto com legenda criativa.", valor:20, type:"Feed", status:"concluído", candidatos:[], data:"2026-03-10" },
  { id:"p4", title:"Reels de lançamento", desc:"Reels criativo mostrando o produto em uso no dia a dia.", value:50, type:"Reels", status:"open", candidate:[], date:"2026-03-25" },
];

const ADMIN_USERS = [
  { id:"u1", name:"Jedivan Andrade", email:"marca@email.com", role:"brand", status:"active", since:"Jan 2022", projects:3, spent:40 },
  { id:"u2", name:"Ana Fitness", email:"inf@email.com", role:"influencer", status:"active", since:"Mar 2023", proposals:3, earn:24 },
  { id:"u3", name:"Maria Gomes", email:"maria@email.com", role:"influencer", status:"active", since:"Fev 2022", proposals:12,earned:320},
  { id:"u4", name:"Lucas Art", email:"lucas@email.com", role:"influencer", status:"pending", since:"Mar 2026", proposals:0, earned:0 },
  { id:"u5", name:"TechStartup BR", email:"tech@brand.com", role:"brand", status:"active", since:"Dez 2025", projects:8, spent:250 },
];

const STATUS_ORDER = ["criado","pago","em_andamento","upload_concluído","aprovado","concluído"];
const TIMELINE = [
  { key:"created", label:"Proposta Criada", desc:"A proposta foi criada pelo anunciante.", icon:"ðŸ“„" },
  { key:"paid", label:"Proposta Paga", desc:"A proposta foi paga pelo anunciante via PIX.", icon:"ðŸ'°" },
  { key:"in_progress", label:"Em Andamento", desc:"Aguardando o influenciador realizar o serviço.", icon:"â ³" },
  { key:"upload_done", label:"Upload Feito", desc:"O influenciador invejoso o conteúdo para aprovação.", icon:"ðŸ“¤" },
  { key:"aprovado", label:"Aprovado", desc:"Marca aprovada. Transferência PIX em até 24h.", icon:"âœ…" },
  { key:"completed", label:"Tudo Feito!", desc:"A proposta foi concluída com sucesso.", icon:"ðŸ †" },
];

// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
// INTERFACE DE USUÁRIO COMPARTILHADA
// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
função Av({ iniciais, tamanho=42, idx=0 }) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:PAL[idx%PAL.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*.34,flexShrink:0,fontFamily:"Poppins,sans-serif"}}>{iniciais}</div>;
}
function Stars({ n=5 }) { return <span style={{color:"#FFB800",fontSize:15,letterSpacing:2}}>{"â˜…".repeat(n)}{"â˜†".repeat(5-n)}</span>; }
função Card({ filhos, estilo={}, onClick }) {
  return <div onClick={onClick} style={{background:T.card,borderRadius:20,padding:18,boxShadow:"0 2px 16px rgba(108,74,182,.08)",marginBottom:12,cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}
função BannerCard({ label, value, icon, grad }) {
  return <div style={{background:grad,borderRadius:20,padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,boxShadow:"0 6px 20px rgba(108,74,182,.2)"}}><div><div style={{color:"rgba(255,255,255,.85)",fontSize:13,fontFamily:"Poppins,sans-serif",marginBottom:4}}>{label}</div><div style={{color:T.white,fontSize:26,fontWeight:800,fontFamily:"Poppins,sans-serif"}}>{value}</div></div><span style={{fontSize:38}}>{iconnxspan></div>;
}
function Btn({ label, onClick, v="purple", sm=false, full=false, off=false }) {
  const bgs = {roxo:T.grad1,rosa:T.grad2,verde:T.grad3,fantasma:"transparente",perigo:"gradiente-linear(135deg,#FF3B30,#FF6B6B)",cinza:"#ddd"};
  const clr = {ghost:T.purple,gray:T.sub};
  retornar <button onClick={onClick} disabled={off} style={{background:bgs[v]||T.grad1,color:clr[v]||T.white,border:v==="ghost"?`1.5px solid ${T.purple}`:"none",borderRadius:50,padding:sm?"8px 16px":"13px 22px",fontSize:sm?11:14,fontWeight:700,fontFamily:"Poppins,sans-serif",cursor:off?"not-allowed":"pointer",width:full?"100%":"auto",opacity:off?.55:1,boxShadow:v!=="ghost"&&v!=="gray"?"0 4px 14px rgba(108,74,182,.25)":"nenhum",transition:"todos .2s"}}>{label}</button>;
}
function Inp({ label, type="text", value, onChange, placeholder, prefix }) {
  return <div style={{marginBottom:14}}>{label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{label}</label>}<div style={{position:"relative"}}>{prefix&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.sub,fontFamily:"Poppins,sans-serif",fontSize:14}}>{prefix}</span>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:prefix?"13px 16px 13px 36px":"13px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:14,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=T.purple} onBlur={e=>e.target.style.borderColor=T.border} /></div></div>;
}
função Sel({ rótulo, valor, onChange, opções }) {
  return <div style={{marginBottom:14}}>{label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.sub,marginBottom:5,fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontSize:14,fontFamily:"Poppins,sans-serif",background:T.bg,color:T.text,outline:"none",boxSizing:"border-box"}}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></div>;
}
função Hdr({ título, sub, onBack, direita, escuro }) {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 12px",background:dark?T.purple:T.white,borderBottom:dark?"none":`1px solid ${T.border}`,flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:10}}>{onBack&&<button onClick={onBack} style={{background:dark?"rgba(255,255,255,.2)":"none",border:"none",cursor:"pointer",fontSize:17,color:dark?T.white:T.purple,padding:dark?"6px 10px":0,borderRadius:10}}> â† </button>}<div><div style={{fontSize:onBack?19:23,fontWeight:800,color:dark?T.white:T.pink,fontFamily:"Poppins,sans-serif",lineHeight:1.1}}>{title}</div>{sub&&<div style={{fontSize:11,color:dark?"rgba(255,255,255,.7)":T.sub,fontFamily:"Poppins,sans-serif",marginTop:1}}>{sub}</div>}</div></div>{right}</div>;
}
function Toast({ msg, type="info", onClose }) {
  useEffect(()=>{const t=setTimeout(onClose,3800);return()=>clearTimeout(t);},[onClose]);
  const bg = type==="success"?T.success:type==="warn"?T.warn:T.purpleDark;
  return <div style={{position:"absolute",top:14,left:14,right:14,background:bg,color:T.white,borderRadius:14,padding:"12px 16px",zIndex:999,fontFamily:"Poppins,sans-serif",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.25)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{msg}</span><button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:16}}>âœ•</button></div>;
}
função Badge({ s }) {
  const m = {created:["ðŸŸ£","#ede7f6","#6C4AB6"],paid:["ðŸ'°","#e8f5e9","#00C896"],in_progress:["â ³","#e3f2fd","#1565C0"],upload_done:["ðŸ“¤","#fff8e1","#FF8C00"],approved:["âœ…","#e8f5e9","#00A878"],completed:["ðŸ †","#f3e5f5","#7B1FA2"],aberto:["ðŸŸ¢","#e8f5e9","#00C896"],ativo:["ðŸ”µ","#e3f2fd","#1565C0"],concluído:["âœ“","#f5f5f5","#888"],pendente:["â ¸","#fff8e1","#FF8C00"]};
  const [ícone,bg,fg]=m[s]||["Â·","#eee","#555"];
  return <span style={{background:bg,color:fg,fontSize:10,fontWeight:700,fontFamily:"Poppins,sans-serif",padding:"3px 9px",borderRadius:50,display:"inline-flex",alignItems:"center",gap:3}}>{icon} {s}</span>;
}

// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
// CRONOGRAMA DA PROPOSTA
// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
function ProposalTimeline({ proposal, role, onAction, onChat }) {
  const curIdx = STATUS_ORDER.indexOf(proposal.status);
  retornar (
    <div style={{flex:1,overflowY:"auto",background:T.bg}}>
      <div style={{background:T.purple,padding:"16px 20px 22px"}}>
        <div style={{fontSize:20,fontWeight:800,color:T.white,fontFamily:"Poppins,sans-serif",marginBottom:14}}>Resumo da Proposta</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["STATUS", TIMELINE.find(s=>s.key===proposal.status)?.label],["PROPOSTA NÂº", proposal.id]].map(([l,v])=>(
            <div key={l} style={{background:"rgba(255,255,255,.15)",borderRadius:14,padding:"10px 14px"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.7)",fontFamily:"Poppins,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
              <div style={{fontSize:14,fontWeight:700,color:T.white,fontFamily:"Poppins,sans-serif",marginTop:2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"18px 20px 8px"}}>
        {/* Linha do tempo */}
        <Card style={{padding:"20px 16px"}}>
          {TIMELINE.map((step,i)=>{
            const done=i<curIdx, active=i===curIdx, future=i>curIdx;
            retornar (
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
        </Cartão>
        {/* Valor */}
        <Cartão>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Valor total</div><div style={{fontSize:22,fontWeight:800,color:T.purple,fontFamily:"Poppins,sans-serif"}}>R$ {proposal.value},00</div></div>
            {role==="influencer"&&<div style={{textAlign:"right"}}><div style={{fontSize:11,color:T.sub,fontFamily:"Poppins,sans-serif"}}>Você recebe (âˆ'20%)</div><div style={{fontSize:20,fontWeight:800,color:T.success,fontFamily:"Poppins,sans-serif"}}>R$ {proposal.netValue},00</div></div>}
          </div>
          {role==="influencer"&&<div style={{marginTop:10,padding:"8px 12px",background:"#f0ebff",borderRadius:10,fontSize:11,color:T.purple,fontFamily:"Poppins,sans-serif",fontWeight:600}}>ðŸ”' PIX: {proposal.pixKey}</div>}
        </Cartão>
        {/* Botões */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <Btn label="ðŸ“„ Conteúdo" onClick={()=>alert("Ver conteúdo enviado")} v="purple" />
          <Btn label="„¹ï¸ Info & AçÃ§Ãµes" onClick={()=>alert("InformaçÃ§Ãµes")} v="purple" />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <Btn label="ðŸ'¬ Chat" onClick={onChat} v="pink" />
          {!["completed","approved"].includes(proposal.status)&&<Btn label="ðŸš« Cancelar" onClick={()=>alert("Cancelar proposta?")} v="danger" />}
        </div>
        {role==="influencer"&&proposal.status==="in_progress"&&<Btn label="ðŸ“¤ Avisar que fiz o serviço" onClick={()=>onAction("upload_done")} v="green" full />}
        {role==="brand"&&proposal.status==="upload_done"&&<Btn label="âœ… Aprovar entrega e liberar pagamento" onClick={()=>onAction("approved")} v="green" full />}
        {role==="brand"&&proposal.status==="paid"&&<Btn label="â–¶ï¸ Iniciar serviço" onClick={()=>onAction("in_progress")} v="purple" full />}
        {proposal.status==="approved"&&<div style={{marginTop:12,padding:"12px 16px",background:"#e8f5e9",borderRadius:14,fontSize:12,color:"#2E7D32",fontFamily:"Poppins,sans-serif",fontWeight:600,textAlign:"center"}}>âš¡ Transferência PIX agendada em até 24h para {proposal.pixKey}</div>}
      </div>
    </div>
  );
}

// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
// BATER PAPO
// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•
função ChatScreen({ proposta, função, onBack, onSend }) {
  const [msg,setMsg]=useState("");
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[proposal.messages]);
  const send=()=>{if(!msg.trim())return;onSend(proposal.id,{from:role==="brand"?"brand":"inf",text:msg.trim(),time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})});setMsg("");};
  retornar (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:T.bg}}>
      <Hdr title={`Chat #${proposal.id}`} sub={proposal.type} onBack={onBack} dark />
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {proposal.messages.map((m,i)=>{
          const mine=(role==="brand"&&m.from==="brand")||(role==="influencer"&&m.from==="inf");
          return <div key={i} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}><div style={{maxWidth:"75%",background:mine?T.grad1:T.white,color:mine?T.white:T.text,borderRadius:mine?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",boxShadow:"0 2px 8px rgba(0,0,0,.07)",fontFamily:"Poppins,sans-serif"}}><div style={{fontSize:13}}>{m.text}</div><div style={{fontSize:10,opacity:.7,marginTop:4,textAlign:"right"}}>{m.time}</div></div></div>;
        })}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 16px",background:T
