/* القاسم – التنقل والعرض والمنتجات والسلة وتثبيت التطبيق */
const $=s=>document.querySelector(s),ph="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#eef3f7"/><rect x="11" y="12" width="18" height="16" rx="2.5" fill="none" stroke="#b4c5d4" stroke-width="1.6"/><circle cx="16" cy="17.5" r="1.8" fill="#b4c5d4"/><path d="M12 27l6-6 4 4 3-3 4 4" fill="none" stroke="#b4c5d4" stroke-width="1.6" stroke-linejoin="round"/></svg>');
const im=s=>`<img src="${s||ph}" onerror="this.src='${ph}'" loading="lazy" alt="">`,fmt=n=>(+n).toLocaleString('en-US'),vis=a=>(a||[]).filter(x=>!x.hidden);
let D,ip,OF=[],P,cart=JSON.parse(localStorage.qc||'[]');
const total=()=>cart.reduce((a,x)=>a+x.p*x.q,0);
function m(h){$('#md').innerHTML=h;$('#ov').style.display='flex'}function cm(){$('#ov').style.display='none'}
function tm(){$('#mn').classList.toggle('on');$('#mo').classList.toggle('on')}
function cmn(){$('#mn').classList.remove('on');$('#mo').classList.remove('on')}
/* التنقل */
function go(){cmn();const h=decodeURIComponent(location.hash.slice(1)).split('/'),v=$('#v'),s=D.sections.find(x=>x.id==h[0]);document.body.className=s?'in':'home';scrollTo(0,0);nav();
 if(!s)return home();
 const b=s.subs.find(x=>x.id==h[1]);
 if(!b){v.innerHTML=`<h2>${s.name}</h2><div class="g">${vis(s.subs).map(b=>`<a class="c" href="#${s.id}/${b.id}">${im(b.img)}${b.name}</a>`).join('')}</div>`;return}
 v.innerHTML=`<h2>${b.name}</h2><div class="g">${vis(b.items).map(i=>`<a class="c" href="javascript:pop('${s.id}','${b.id}','${i.id}')">${im(i.img)}${i.name}</a>`).join('')}</div>`}
const nz=s=>(s||'').toLowerCase().replace(/[\u064b-\u0652ـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
function ft(){const L=[];D.sections.forEach(s=>vis(s.subs).forEach(b=>vis(b.items).forEach(i=>{if(i.featured)L.push([s,b,i])})));return L}
function from(i){const v=vis(i.variants),ps=[];if(v.length)v.forEach(x=>(x.opts&&x.opts.length?x.opts.map(o=>o.p):[x.p]).forEach(p=>ps.push(p)));else(i.opts||[]).forEach(o=>ps.push(o.p));const q=ps.filter(p=>p>0);if(!q.length)return'';const mn=Math.min(...q);return(Math.max(...q)>mn?'من ':'')+fmt(mn)+' ج'}
function nav(){const cur=decodeURIComponent(location.hash.slice(1)).split('/')[0];$('#nl').innerHTML=`<a href="#" class="${cur?'':'on'}">الرئيسية</a>`+D.sections.map(s=>`<a href="#${s.id}" class="${cur==s.id?'on':''}">${s.name}</a>`).join('')+`<a onclick="goo()">عروض خاصة</a><a href="tel:${D.shop.phone}">اتصل بنا</a>`}
function gt(id){const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})}
function goo(){if(document.body.classList.contains('home'))gt('ofr');else{location.hash='';setTimeout(()=>gt('ofr'),200)}}
function home(){OF=vis(D.offers);const F=ft();$('#v').innerHTML=`<section class="hero"><div class="hb"></div><div class="ht"><h1>حلول متكاملة<br>للبناء والديكور</h1><button class="cta" onclick="gt('cats')">تسوق الآن</button></div></section>
<div class="wrap"><h2 id="cats">الأقسام</h2><div class="cg">${D.sections.map((s,i)=>`<a class="cc${i==4?' w':''}" href="#${s.id}"><img src="${s.tile}" alt="" loading="lazy"><b>${s.name}</b></a>`).join('')}</div>
${F.length?`<h2>المنتجات المميزة</h2><div class="fg">${F.map(([s,b,i])=>`<a class="fc" href="javascript:pop('${s.id}','${b.id}','${i.id}')">${im(i.img)}<b>${i.name}</b><span>${from(i)}</span></a>`).join('')}</div>`:''}
${OF.length?`<h2 id="ofr">عروض وخصومات</h2><div id="cf">${OF.map((o,k)=>`<div class="o" onclick="ofc(${k})"><div class="oi">${im(o.img)}<div class="op"><b>${o.t}</b><span><s>${fmt(o.old)}</s> <em>${fmt(o.p)} ج</em></span></div></div></div>`).join('')}</div><div id="od"></div>`:''}</div>`;
 sv_();const c=$('#cf');if(c){c.onscroll=cf;setTimeout(()=>{c.scrollLeft=c.children[Math.floor(OF.length/2)].offsetLeft-(c.clientWidth-c.children[0].offsetWidth)/2;cf()},60)}}
/* البحث وتلوين فوري */
function srch(){m(`<h3>بحث</h3><input id="sq" placeholder="ابحث عن منتج أو نوع أو ملحق..." oninput="sq_()" autocomplete="off"><div id="sr"></div><div class="r"><button class="b2" onclick="cm()">إغلاق</button></div>`);setTimeout(()=>$('#sq').focus(),80)}
function sq_(){const q=nz($('#sq').value.trim());if(!q){$('#sr').innerHTML='';return}const R=[];
 D.sections.forEach(s=>vis(s.subs).forEach(b=>vis(b.items).forEach(i=>{const t=nz([i.name,s.name,b.name,...vis(i.variants).map(v=>v.n),...vis(i.acc).map(a=>a.n)].join(' '));if(t.includes(q))R.push([s,b,i])})));
 $('#sr').innerHTML=R.length?R.slice(0,30).map(([s,b,i])=>`<button class="sr" onclick="cm();pop('${s.id}','${b.id}','${i.id}')">${im(i.img)}<span>${i.name}<small>${s.name} › ${b.name}</small></span></button>`).join(''):'<p>لا توجد نتائج</p>'}
function tl(){m(`<h3>تلوين فوري</h3><p>اكتب اللون أو رقمه وسنجهزه لك.</p><input id="tq" placeholder="اسم اللون أو رقمه"><div class="r"><button class="b g2" onclick="tq_()">إرسال على واتساب</button><button class="b2" onclick="cm()">إغلاق</button></div>`)}
function tq_(){const v=$('#tq').value.trim();open(`https://wa.me/${D.shop.wa}?text=${encodeURIComponent('مرحبًا، أريد خدمة تلوين فوري'+(v?'\nاللون المطلوب: '+v:''))}`)}
/* العروض: Coverflow */
function cf(){const r=$('#cf');if(!r)return;const c=r.getBoundingClientRect(),mid=c.left+c.width/2;let best=0,bd=1e9;
 [...r.children].forEach((e,k)=>{const w=e.offsetWidth,b=e.getBoundingClientRect(),x=b.left+b.width/2-mid,a=Math.abs(x),d=Math.min(2.4,a/(w*.4));if(a<bd){bd=a;best=k}
  e.style.transform=`scale(${1-Math.min(d,1.6)*.11}) rotateY(${(x<0?1:-1)*Math.min(d,1)*36}deg)`;e.style.zIndex=100-Math.round(a/8);e.style.opacity=Math.max(.5,1-d*.2)});
 const o=OF[best],od=$('#od');if(o&&od.dataset.k!=best){od.dataset.k=best;od.innerHTML=`<b>${o.t}</b>${o.d?'<br>'+o.d:''}`}}
function ofc(k){const c=$('#cf'),e=c.children[k],r=c.getBoundingClientRect(),b=e.getBoundingClientRect();if(Math.abs(b.left+b.width/2-(r.left+r.width/2))>b.width*.25)return e.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});off(k)}
function off(k){const o=OF[k];m(`<h3>${o.t}</h3><div class="pim">${im(o.img)}</div><p>${o.d||''}</p><p><s>${fmt(o.old)} ج</s> <span class="pr">${fmt(o.p)} ج</span></p><div class="r"><button class="b" onclick="add({n:'${o.t}',d:'عرض',p:${o.p},q:1,inq:''})">أضف للسلة</button><button class="b2" onclick="cm()">إغلاق</button></div>`)}
/* صفحة المنتج: أنواع + ملحقات */
const pal=it=>D.colors.filter(c=>!c.hidden&&(!it.cset||it.cset.includes(c.id)));
const cur=()=>{const v=vis(P.it.variants);return v.length?v[Math.min(P.vi,v.length-1)]:null};
const accs=()=>{const v=cur();return vis(P.it.acc).concat(v?vis(v.acc):[])};
function pop(a,b,c){P={it:D.sections.find(x=>x.id==a).subs.find(x=>x.id==b).items.find(x=>x.id==c),vi:0,oi:null,k:'',cu:'',q:1,qr:{},ac:null};rp()}
function rp(){const it=P.it,V=vis(it.variants),v=cur(),os=v?(v.opts||[]):(it.opts||[]),qr=it.qrows&&!v,ol=v?(v.ol||'الاختيار'):'الحجم',as=accs();
 if(os.length==1&&P.oi==null)P.oi=0;const t=$('#md').scrollTop;
 m(`<h3>${it.name}</h3><div class="pim">${im((v&&v.img)||it.img)}</div>
 ${V.length?`<div class="lb">الأنواع المتاحة</div><div class="nums">${V.map((x,k)=>`<button class="nb${k==P.vi?' on':''}" onclick="sv2(${k})" aria-label="${x.n}">${k+1}</button>`).join('')}</div><div class="vd"><b>${v.n}</b>${v.d?`<p>${v.d}</p>`:''}${os.length?'':`<div class="pr">${fmt(v.p)} ج</div>`}</div>`:(it.d?`<p>${it.d}</p>`:'')}
 ${qr?`<div class="qr">${os.map((x,k)=>`<div class="qrow"><span>${x.l}<small>${fmt(x.p)} ج</small></span><div class="st"><button onclick="qs(${k},-1)">−</button><b id="q${k}">${P.qr[k]||0}</b><button onclick="qs(${k},1)">+</button></div></div>`).join('')}</div>`
  :os.length?`<div class="lb">${ol}</div><div class="ch">${os.map((x,k)=>`<button class="chp${k==P.oi?' on':''}" onclick="so(${k})">${x.l}${x.p?`<small>${fmt(x.p)} ج</small>`:''}</button>`).join('')}</div>`:''}
 ${it.colors?`<div class="lb">اللون</div><div class="cl">${pal(it).map((c,k)=>`<button class="sw${P.k==c.n?' on':''}" onclick="sk(${k})"><i style="background:${c.h}"></i>${c.n}</button>`).join('')}</div><input id="cu" placeholder="أو اكتب اللون الذي تبحث عنه" oninput="P.cu=this.value;if(this.value){P.k='';document.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'))}">`:''}
 ${qr?'':`<div class="qb"><span>الكمية</span><div class="st"><button onclick="qq(-1)">−</button><b id="qv">${P.q}</b><button onclick="qq(1)">+</button></div></div>`}
 <div class="er" id="er"></div><div class="r"><button class="b" onclick="ap()">أضف للسلة</button><button class="b2" onclick="cm()">إغلاق</button></div>
 ${as.length?`<div class="lb">ملحقات</div><div class="acs">${as.map((x,k)=>`<button class="ac${P.ac===k?' on':''}" onclick="sa(${k})">${im(x.img)}<span>${x.n}</span></button>`).join('')}</div>${P.ac!=null&&as[P.ac]?`<div class="ad"><b>${as[P.ac].n}</b>${as[P.ac].d?`<p>${as[P.ac].d}</p>`:''}<div class="pr">${fmt(as[P.ac].p)} ج</div><button class="b" onclick="aa(${P.ac})">أضف الملحق للسلة</button></div>`:''}`:''}`);
 if($('#cu'))$('#cu').value=P.cu;$('#md').scrollTop=t}
function sv2(k){P.vi=k;P.oi=null;P.ac=null;rp()}
function so(k){P.oi=k;rp()}
function sk(k){P.k=pal(P.it)[k].n;P.cu='';rp()}
function sa(k){P.ac=P.ac===k?null:k;rp()}
function qq(d){P.q=Math.max(1,P.q+d);$("#qv").textContent=P.q}
function qs(k,d){P.qr[k]=Math.max(0,(P.qr[k]||0)+d);$('#q'+k).textContent=P.qr[k]}
function er(t,s){const e=$('#er');e.style.color='';e.textContent=t;e.classList.remove('sh');void e.offsetWidth;e.classList.add('sh');const g=document.querySelector(s);if(g){g.classList.remove('miss');void g.offsetWidth;g.classList.add('miss');g.scrollIntoView({block:'center',behavior:'smooth'})}}
function ap(){const it=P.it,v=cur(),os=v?(v.opts||[]):(it.opts||[]),qr=it.qrows&&!v,cu=P.cu.trim();
 if(qr){if(!os.some((x,k)=>P.qr[k]>0))return er('حدد الكمية المطلوبة','.qr')}
 else if(os.length>1&&P.oi==null)return er('اختر '+(v?(v.ol||'الاختيار'):'الحجم')+' المناسب','.ch');
 if(it.colors&&!P.k&&!cu)return er('اختر اللون المناسب','.cl');
 const dc=it.colors&&!cu?' – '+P.k:'';
 if(qr)os.forEach((x,k)=>{if(P.qr[k]>0)add({n:it.name,d:x.l+dc,p:x.p,q:P.qr[k],inq:cu},1)});
 else{const o=os.length?os[P.oi==null?0:P.oi]:null;add({n:v?v.n:it.name,d:(o?o.l:'')+dc,p:o?o.p:(v?v.p:0),q:P.q,inq:cu},1)}
 cm()}
function aa(k){const x=accs()[k];add({n:x.n,d:'ملحق',p:x.p,q:1,inq:''},1);const e=$('#er');e.style.color='#1f8f4e';e.textContent='تمت إضافة «'+x.n+'» للسلة';setTimeout(()=>{e.style.color='';e.textContent=''},2200)}
/* السلة */
function sv_(){localStorage.qc=JSON.stringify(cart);const n=cart.reduce((a,x)=>a+x.q,0);document.querySelectorAll('.bd').forEach(e=>{e.textContent=n;e.style.display=n?'':'none'});$('#bl').textContent=n?fmt(total())+' ج':'السلة'}
function add(x,quiet){const k=cart.find(c=>c.n==x.n&&c.d==x.d&&c.inq==x.inq);k?k.q+=x.q:cart.push(x);sv_();if(!quiet)cm()}
function cart_(){const t=total();
 m(`<h3>سلة الطلبات</h3>${cart.length?cart.map((x,k)=>`<div class="ci"><div><b>${x.n}</b><br><small>${x.d}${x.p?(x.d?' – ':'')+fmt(x.p)+' ج':''}</small>${x.inq?`<div class="iq">استفسار العميل: ${x.inq}</div>`:''}</div><button onclick="q_(${k},-1)">−</button><b>${x.q}</b><button onclick="q_(${k},1)">+</button><button onclick="q_(${k},0)">✕</button></div>`).join('')+`<p><b>الإجمالي: ${fmt(t)} ج</b></p><div class="r"><button class="b g2" onclick="wa()">إرسال الطلب على واتساب</button></div>`:'<p>السلة فارغة</p>'}<div class="r"><button class="b2" onclick="cm()">إغلاق</button></div>`)}
function q_(k,d){d?(cart[k].q+=d,cart[k].q<1&&cart.splice(k,1)):cart.splice(k,1);sv_();cart_()}
function wa(){const t=total(),s='مرحبًا، أريد طلب:\n'+cart.map(x=>`- ${x.n}${x.d?' ('+x.d+')':''} × ${x.q}${x.p?' = '+fmt(x.p*x.q)+' ج':''}${x.inq?'\n  استفسار العميل: '+x.inq:''}`).join('\n')+(t?'\nالإجمالي: '+fmt(t)+' ج':'');open(`https://wa.me/${D.shop.wa}?text=${encodeURIComponent(s)}`)}
/* التثبيت والبداية */
addEventListener('beforeinstallprompt',e=>{e.preventDefault();ip=e});
function hi(){$('#ins').style.display='none'}
function inst(){if(matchMedia('(display-mode:standalone)').matches||navigator.standalone)return;$('#ins').style.display='flex'}
function sp(){const s=$('#sp');if(!s)return;s.style.opacity=0;setTimeout(()=>{s.remove();inst()},600)}
$('#sv').onended=sp;$('#sv').onerror=sp;setTimeout(sp,6000);
loadData().then(d=>{D=d;const s=d.shop;$('#mp').href=s.map||`https://www.google.com/maps?q=${s.lat},${s.lng}(${encodeURIComponent('القاسم للدهانات – ١٨ شارع خالد بن الوليد، سيدي بشر')})`;$('#ln').append(s.land);$('#ln').href='tel:'+s.land;$('#mb').append(s.phone);$('#mb').href='tel:'+s.phone;$('#fm').href=$('#mp').href;$('#ft').href='tel:'+s.phone;$('#ft').append(' '+s.phone);go()});
addEventListener('hashchange',()=>D&&go());
if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');
