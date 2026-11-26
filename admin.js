/* لوحة التحكم: الأقسام والمنتجات والأنواع والملحقات والألوان والعروض */
let D,sha,tab='p',si=0,bi=0;const $=s=>document.querySelector(s),OP=new Set();
const r=$('#r'),t=$('#t'),m=$('#m'),o=$('#o');r.value=localStorage.r||'';t.value=localStorage.t||'';
const H=()=>({Authorization:'Bearer '+t.value,Accept:'application/vnd.github+json'}),U=p=>`https://api.github.com/repos/${r.value}/contents/${p}`,b64=s=>btoa(unescape(encodeURIComponent(s)));
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const h=(g,a={},...c)=>{const e=document.createElement(g);for(const k in a){k.startsWith('on')?e[k]=a[k]:k=='class'?e.className=a[k]:e.setAttribute(k,a[k])}c.flat().forEach(x=>e.append(x&&x.nodeType?x:document.createTextNode(x??'')));return e};
const say=s=>m.textContent=s;
function norm(d){d.sections.forEach(s=>s.subs.forEach(b=>{b.hidden=!!b.hidden;b.items.forEach(i=>{i.hidden=!!i.hidden;i.featured=!!i.featured;i.opts=i.opts||[];i.variants=i.variants||[];i.acc=i.acc||[];i.d=i.d||'';i.variants.forEach(v=>{v.opts=v.opts||[];v.acc=v.acc||[];v.d=v.d||'';v.ol=v.ol||'';v.hidden=!!v.hidden;v.id=v.id||uid('v')});i.acc.forEach(a=>{a.hidden=!!a.hidden;a.id=a.id||uid('a')})})}));d.offers.forEach(f=>f.hidden=!!f.hidden);return d}
async function ld(){localStorage.r=r.value;localStorage.t=t.value;
 try{if(r.value&&t.value){const x=await fetch(U('site-data.json'),{headers:H()});if(!x.ok)throw 0;const j=await x.json();sha=j.sha;D=norm(JSON.parse(decodeURIComponent(escape(atob(j.content.replace(/\n/g,'')))))); say('تم التحميل من GitHub')}
 else{D=norm(await(await fetch('site-data.json')).json());sha=null;say('تم تحميل النسخة المحلية')}draw()}catch(e){say('تعذر التحميل، راجع بيانات الربط')}}
async function sv(){if(!D)return;const txt=JSON.stringify(D,null,1);
 if(!sha){const a=h('a',{href:URL.createObjectURL(new Blob([txt],{type:'application/json'})),download:'site-data.json'});a.click();say('تم تنزيل الملف، استبدل به site-data.json');return}
 const x=await fetch(U('site-data.json'),{method:'PUT',headers:H(),body:JSON.stringify({message:'update',content:b64(txt),sha})});
 if(x.ok){sha=(await x.json()).content.sha;say('تم الحفظ، يظهر على الموقع خلال دقيقة')}else say('فشل الحفظ، راجع التوكن')}
async function up(f,p,k){if(!sha){say('رفع الصور يحتاج ربط GitHub، أو الصق رابط صورة');return}say('جارٍ رفع الصورة...');const b=await createImageBitmap(f),c=h('canvas'),s=Math.min(1,1000/b.width);c.width=b.width*s;c.height=b.height*s;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(b,0,0,c.width,c.height);
 const n='assets/uploads/'+Date.now()+'.jpg',y=await fetch(U(n),{method:'PUT',headers:H(),body:JSON.stringify({message:'img',content:c.toDataURL('image/jpeg',.85).split(',')[1]})});
 if(y.ok){p[k]=n;draw();say('تم رفع الصورة، اضغط حفظ ونشر')}else say('فشل رفع الصورة')}
/* عناصر الواجهة */
const T=(p,k,ph)=>h('input',{type:'text',placeholder:ph,value:p[k]??'',oninput:e=>p[k]=e.target.value});
const N=(p,k,ph)=>h('input',{type:'number',placeholder:ph,value:p[k]??0,oninput:e=>p[k]=+e.target.value});
const B=(txt,fn,c='')=>h('button',{class:c,onclick:fn},txt);
const CB=(p,k,txt)=>h('label',{class:'fl'},h('input',{type:'checkbox',...(p[k]?{checked:''}:{}),onchange:e=>p[k]=e.target.checked}),' '+txt);
const IMG=(p,k)=>{const pv=h('img',{class:'th',alt:'',...(p[k]?{src:p[k]}:{}),onerror:e=>e.target.removeAttribute('src')});
 return h('div',{class:'rw'},pv,h('input',{type:'text',placeholder:'رابط الصورة أو مسارها',value:p[k]||'',oninput:e=>{p[k]=e.target.value;e.target.value?pv.src=e.target.value:pv.removeAttribute('src')}}),h('label',{class:'fl'},'رفع: ',h('input',{type:'file',accept:'image/*',onchange:e=>up(e.target.files[0],p,k)})))};
const det=(key,title,...c)=>{const d=h('details',{},h('summary',{},title),...c);if(OP.has(key))d.open=true;d.ontoggle=()=>d.open?OP.add(key):OP.delete(key);return d};
const del=(arr,k,msg)=>B('حذف',()=>{if(confirm(msg||'حذف؟')){arr.splice(k,1);draw()}},'x');
function sel(list,i,fn){return h('select',{onchange:e=>fn(+e.target.value)},list.map((x,k)=>h('option',{value:k,...(k==i?{selected:''}:{})},(x.name||'')+(x.hidden?' (مخفي)':''))))}
const optRows=arr=>h('div',{},arr.map((x,k)=>h('div',{class:'rw'},T(x,'l','الاسم'),N(x,'p','السعر'),B('✕',()=>{arr.splice(k,1);draw()},'x'))),B('+ إضافة',()=>{arr.push({l:'',p:0});draw()},'g'));
const accList=(arr,key)=>h('div',{},arr.map((a,k)=>h('div',{class:'cd in'},h('div',{class:'rw'},T(a,'n','اسم الملحق'),CB(a,'hidden','إخفاء'),del(arr,k,'حذف الملحق؟')),IMG(a,'img'),h('div',{class:'rw'},T(a,'d','وصف الملحق'),N(a,'p','السعر')))),B('+ ملحق جديد',()=>{arr.push({id:uid('a'),n:'',img:'',d:'',p:0,hidden:false});OP.add(key);draw()},'g'));
const varCard=(v,k,arr,it)=>h('div',{class:'cd in'},h('div',{class:'rw'},h('b',{class:'nm'},k+1),T(v,'n','اسم النوع'),CB(v,'hidden','إخفاء'),del(arr,k,'حذف النوع؟')),IMG(v,'img'),h('div',{class:'rw'},T(v,'d','وصف النوع'),N(v,'p','السعر')),
  det(v.id+'o','اختيارات داخل النوع (مثل اللون)',h('div',{class:'rw'},T(v,'ol','عنوان الاختيار (مثال: اللون)')),optRows(v.opts)),det(v.id+'a','ملحقات هذا النوع',accList(v.acc,v.id+'a')));
const itemCard=(it,k,arr)=>h('div',{class:'cd'},h('div',{class:'rw'},T(it,'name','اسم المنتج'),CB(it,'hidden','إخفاء'),del(arr,k,'حذف المنتج بكل أنواعه؟')),IMG(it,'img'),h('div',{class:'rw'},T(it,'d','وصف (اختياري)')),
  h('div',{class:'rw'},CB(it,'featured','منتج مميز (يظهر في الرئيسية)'),CB(it,'colors','يُطلب اختيار لون'),CB(it,'qrows','كميات منفصلة لكل وحدة (مثل شيكارة وكيلو)')),
  det(it.id+'v','الأنواع ('+it.variants.length+') – كل نوع بصورته ووصفه وسعره',it.variants.map((v,i)=>varCard(v,i,it.variants,it)),B('+ نوع جديد',()=>{it.variants.push({id:uid('v'),n:'',img:'',d:'',p:0,opts:[],ol:'',acc:[],hidden:false});OP.add(it.id+'v');draw()},'g')),
  det(it.id+'s','الأحجام / الدرجات والأسعار (للمنتج بدون أنواع)',optRows(it.opts)),
  det(it.id+'c','الملحقات ('+it.acc.length+')',accList(it.acc,it.id+'c')));
function draw(){if(!D){o.replaceChildren();return}
 $('#tabs').replaceChildren(...[['p','المنتجات'],['c','الألوان'],['f','العروض'],['s','بيانات المحل']].map(([k,n])=>h('button',{class:tab==k?'on':'',onclick:()=>{tab=k;draw()}},n)));
 const out=[];
 if(tab=='p'){const S=D.sections[si],Bs=S.subs;bi=Math.min(bi,Bs.length-1);const sb=Bs[bi];
  out.push(h('div',{class:'cd'},h('h4','القسم'),h('div',{class:'rw'},sel(D.sections,si,i=>{si=i;bi=0;draw()}),sel(Bs,bi,i=>{bi=i;draw()})),
   sb?h('div',{},h('div',{class:'rw'},T(sb,'name','اسم القسم الفرعي'),CB(sb,'hidden','إخفاء'),del(Bs,bi,'حذف هذا القسم الفرعي بكل منتجاته؟')),IMG(sb,'img')):'',
   B('+ قسم فرعي جديد',()=>{Bs.push({id:uid('b'),name:'قسم جديد',img:'',hidden:false,items:[]});bi=Bs.length-1;draw()},'g')));
  if(sb){sb.items.forEach((it,k)=>out.push(itemCard(it,k,sb.items)));out.push(B('+ منتج جديد',()=>{sb.items.push({id:uid('i'),name:'منتج جديد',img:'',d:'',opts:[{l:'الوحدة',p:0}],colors:false,featured:false,qrows:false,variants:[],acc:[],hidden:false});draw()}))}}
 if(tab=='c'){out.push(h('div',{class:'cd'},D.colors.map((c,k)=>h('div',{class:'rw'},h('input',{type:'color',class:'sw',value:c.h,oninput:e=>c.h=e.target.value}),T(c,'n','اسم اللون'),B('✕',()=>{D.colors.splice(k,1);draw()},'x'))),B('+ إضافة لون جديد',()=>{D.colors.push({n:'',h:'#cccccc'});draw()},'g')))}
 if(tab=='f'){D.offers.forEach((f,k)=>out.push(h('div',{class:'cd'},h('div',{class:'rw'},T(f,'t','عنوان العرض'),CB(f,'hidden','إخفاء'),del(D.offers,k,'حذف العرض؟')),IMG(f,'img'),h('div',{class:'rw'},T(f,'d','وصف العرض')),h('div',{class:'rw'},N(f,'old','السعر الأصلي'),N(f,'p','سعر العرض')))));
  out.push(B('+ عرض جديد',()=>{D.offers.push({id:uid('o'),img:'',t:'عرض جديد',d:'',old:0,p:0,hidden:false});draw()}))}
 if(tab=='s'){const s=D.shop;out.push(h('div',{class:'cd'},[['wa','رقم واتساب (بصيغة دولية)'],['phone','رقم الموبايل'],['land','الرقم الأرضي'],['map','رابط الموقع على خرائط جوجل (اختياري)']].map(([k,n])=>h('div',{class:'rw'},h('span',{class:'fl'},n),T(s,k,n)))))}
 o.replaceChildren(...out)}
ld();
