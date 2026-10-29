import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.scss';
import './styles/demo.css';
import homeHtml from './content/home.html?raw';
import guideHtml from './content/guide.html?raw';
import { services } from './data.mjs';
import { Header, Footer } from './components.jsx';
import { Marketplace, ServiceDetail } from './marketplace.jsx';
import { Timebank, Members, Organizations, About, Terms, Missing } from './community.jsx';
import { Login, Publish, Transfer, EditProfile } from './forms.jsx';

function Page() {
  const path=window.location.pathname.replace(/\/$/,'')||'/';
  if(path==='/') return <div dangerouslySetInnerHTML={{__html:homeHtml}}/>;
  if(path==='/offers'||path==='/inquiries') return <Marketplace kind={path==='/offers'?'offer':'inquiry'}/>;
  if(path==='/offers/new'||path==='/inquiries/new') return <Publish kind={path==='/offers/new'?'offer':'inquiry'}/>;
  if(/^\/(offers|inquiries)\/[^/]+$/.test(path)) {const s=services.find(s=>s.id===path.split('/')[2]&&s.kind===(path.startsWith('/offers/')?'offer':'inquiry'));return s?<ServiceDetail service={s}/>:<Missing/>;}
  if(path==='/course/guide') return <><div dangerouslySetInnerHTML={{__html:guideHtml}}/><div className="demo-print-action"><button className="nh-button" onClick={()=>window.print()}>打印线下登记卡</button></div></>;
  if(['/users/sign_in','/users/sign_up','/login','/members/signup'].includes(path)) return <Login/>;
  if(path==='/timebank'||path==='/account') return <Timebank/>;
  if(path==='/members') return <Members/>;
  if(/^\/members\/[^/]+\/edit$/.test(path)) return <EditProfile id={path.split('/')[2]}/>;
  if(/^\/members\/[^/]+$/.test(path)) return <Timebank residentId={path.split('/')[2]}/>;
  if(path==='/transfers/new') return <Transfer/>;
  if(path==='/organizations'||path==='/select_organization'||path==='/organizations/demo') return <Organizations/>;
  if(path==='/about'||path==='/pages/about') return <About/>;
  if(path==='/terms'||path==='/documents/terms') return <Terms/>;
  return <Missing/>;
}
function App() {
  useEffect(()=>{
    const h=document.querySelector('h1');if(h) document.title=`${h.textContent.trim()} · 邻里时光`;
    if(window.location.hash) requestAnimationFrame(()=>document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView());
  },[]);
  return <><Header/><main id="main-content" className="container content"><div className="container-fluid"><Page/></div></main><Footer/></>;
}
createRoot(document.getElementById('root')).render(<App/>);
