/* لوحة تحكم القاسم: دخول بالتوكن، ثم تعديل site-data.json على GitHub */
const $=s=>document.querySelector(s),LS=localStorage,OP=new Set();
let D,sha,REPO,TOK,tab='p',si=0,bi=0,dirty=false;
const h=(g,a,...c)=>{if(a==null)a={};else if(typeof a!='object'||a.nodeType||Array.isArray(a)){c.unshift(a);a={}}const e=document.createElement(g);for(const k in a){k.startsWith('on')?e[k]=a[k]:k=='class'?e.className=a[k]:e.setAttribute(k,a[k])}c.flat().forEach(x=>e.append(x&&x.nodeType?x:document.createTextNode(x??'')));return e};
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const api=(p='',o={})=>fetch('https://api.github.com/repos/'+REPO+(p?'/'+p:''),{...o,headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github+json',...(o.headers||{})}});
const b64=s=>btoa(unescape(encodeURIComponent(s))),unb=s=>decodeURIComponent(escape(atob(s.replace(/\n/g,''))));
const say=s=>$('#sm').textContent=s,chg=()=>{dirty=true;$('#bs2').classList.add('dty')};
onbeforeunload=e=>{if(dirty){e.preventDefault();return e.returnValue=''}};
/* الدخول */
function norm(d){d.colors.forEach((c,k)=>{c.id=c.id||'c'+(k+1);c.hidden=!!c.hidden});d.sections.forEach(s=>s.subs.forEach(b=>{b.hidden=!!b.hidden;b.items.forEach(i=>{i.hidden=!!i.hidden;i.featured=!!i.featured;i.opts=i.opts||[];i.variants=i.variants||[];i.acc=i.acc||[];i.d=i.d||'';i.variants.forEach(v=>{v.opts=v.opts||[];v.acc=v.acc||[];v.d=v.d||'';v.ol=v.ol||'';v.hidden=!!v.hidden;v.id=v.id||uid('v')});i.acc.forEach(a=>{a.hidden=!!a.hidden;a.id=a.id||uid('a')})})}));d.offers.forEach(f=>f.hidden=!!f.hidden);d.shop.map=d.shop.map||'';return d}
async function load(){const x=await api('contents/site-data.json');if(!x.ok)throw'تعذر تحميل بيانات الموقع من المستودع';const j=await x.json();sha=j.sha;D=norm(JSON.parse(unb(j.content)));dirty=false;$('#bs2').classList.remove('dty')}
async function login(auto){const r=$('#lr').value.trim(),t=$('#lt').value.trim(),M=$('#lm');M.textContent='';
 if(!/^[\w.-]+\/[\w.-]+$/.test(r))return M.textContent='اكتب المستودع بالشكل: اسم_المستخدم/اسم_المستودع';if(!t)return M.textContent='اكتب رمز الدخول (التوكن)';
 REPO=r;TOK=t;$('#lb').disabled=true;$('#lb').textContent='جارٍ التحقق...';
 try{const x=await api('');if(x.status==401)throw'رمز الدخول غير صحيح أو منتهي';if(x.status==404||x.status==403)throw'المستودع غير موجود أو الرمز لا يملك صلاحية الوصول إليه';if(!x.ok)throw'تعذر الاتصال بـ GitHub ('+x.status+')';
  const j=await x.json();if(j.permissions&&!j.permissions.push)throw'الرمز لا يملك صلاحية الكتابة على هذا المستودع';
  await load();$('#lk').checked?LS.qa=JSON.stringify({r,t}):LS.removeItem('qa');$('#lg').hidden=true;$('#app').hidden=false;draw()}
 catch(e){TOK=null;M.textContent=typeof e=='string'?e:'تعذر الاتصال، تحقق من الإنترنت'}
 $('#lb').disabled=false;$('#lb').textContent='🔓 دخول'}
function logout(){if(dirty&&!confirm('توجد تعديلات غير محفوظة، تأكيد الخروج؟'))return;dirty=false;LS.removeItem('qa');location.reload()}
$('#lb').onclick=()=>login();$('#lt').onkeydown=e=>{if(e.key=='Enter')login()};$('#ey').onclick=()=>{const i=$('#lt');i.type=i.type=='password'?'text':'password'};$('#bx').onclick=logout;
$('#br').onclick=async()=>{if(dirty&&!confirm('سيتم فقد التعديلات غير المحفوظة، متابعة؟'))return;try{await load();draw();say('تم التحديث من GitHub')}catch(e){say(e)}};
$('#bs').onclick=$('#bs2').onclick=save;
try{const s=JSON.parse(LS.qa||'null');if(s){$('#lr').value=s.r;$('#lt').value=s.t;login(true)}}catch(e){}
/* الحفظ */
function bad(){const L=[];D.sections.forEach(s=>s.subs.forEach(b=>b.items.forEach(i=>{if(i.colors&&!D.colors.some(c=>!c.hidden&&(!i.cset||i.cset.includes(c.id))))L.push(i.name||'(بدون اسم)')})));return L}
async function save(){const L=bad();if(L.length)return say('اختر لونًا واحدًا على الأقل لـ: '+L.join('، '));say('جارٍ الحفظ...');
 const x=await api('contents/site-data.json',{method:'PUT',body:JSON.stringify({message:'update',content:b64(JSON.stringify(D,null,1)),sha})});
 if(x.ok){sha=(await x.json()).content.sha;dirty=false;$('#bs2').classList.remove('dty');say('✓ تم الحفظ، يظهر على الموقع خلال دقيقة')}
 else say(x.status==409||x.status==422?'تم تعديل الملف من مكان آخر، اضغط تحديث ثم أعد التعديل':'فشل الحفظ، تأكد أن صلاحية Contents: Read and write مفعلة للتوكن')}
async function up(f,p,k){say('جارٍ رفع الصورة...');const b=await createImageBitmap(f),c=h('canvas'),s=Math.min(1,1000/b.width);c.width=b.width*s;c.height=b.height*s;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(b,0,0,c.width,c.height);
 const n='assets/uploads/'+Date.now()+'.jpg',y=await api('contents/'+n,{method:'PUT',body:JSON.stringify({message:'img',content:c.toDataURL('image/jpeg',.85).split(',')[1]})});
 if(y.ok){p[k]=n;chg();draw();say('تم رفع الصورة، اضغط حفظ')}else say('فشل رفع الصورة')}
/* عناصر الواجهة */
const T=(p,k,ph)=>h('input',{type:'text',placeholder:ph,value:p[k]??'',oninput:e=>{p[k]=e.target.value;chg()}});
const N=(p,k,ph)=>h('input',{type:'number',placeholder:ph,value:p[k]??0,oninput:e=>{p[k]=+e.target.value;chg()}});
const B=(txt,fn,c='g')=>h('button',{class:c,onclick:fn},txt);
const CB=(p,k,txt,cb)=>h('label',{class:'ck'},h('input',{type:'checkbox',...(p[k]?{checked:''}:{}),onchange:e=>{p[k]=e.target.checked;chg();cb&&cb()}}),h('span',{},txt));
const IMG=(p,k)=>{const pv=h('img',{class:'th',alt:'',...(p[k]?{src:p[k]}:{}),onerror:e=>e.target.removeAttribute('src')});
 return h('div',{class:'rw'},pv,h('input',{type:'text',placeholder:'رابط الصورة أو مسارها',value:p[k]||'',oninput:e=>{p[k]=e.target.value;chg();e.target.value?pv.src=e.target.value:pv.removeAttribute('src')}}),h('label',{class:'fl'},'📤 رفع ',h('input',{type:'file',accept:'image/*',onchange:e=>up(e.target.files[0],p,k)})))};
const det=(key,title,...c)=>{const d=h('details',{},h('summary',{},title),...c);if(OP.has(key))d.open=true;d.ontoggle=()=>d.open?OP.add(key):OP.delete(key);return d};
const del=(arr,k,msg)=>B('🗑 حذف',()=>{if(confirm(msg||'حذف؟')){arr.splice(k,1);chg();draw()}},'x');
function sel(list,i,fn){return h('select',{onchange:e=>fn(+e.target.value)},list.map((x,k)=>h('option',{value:k,...(k==i?{selected:''}:{})},(x.name||'')+(x.hidden?' (مخفي)':''))))}
const optRows=arr=>h('div',{},arr.map((x,k)=>h('div',{class:'rw'},T(x,'l','الاسم'),N(x,'p','السعر'),B('✕',()=>{arr.splice(k,1);chg();draw()},'x'))),B('+ إضافة',()=>{arr.push({l:'',p:0});chg();draw()}));
const accList=(arr,key)=>h('div',{},arr.map((a,k)=>h('div',{class:'cd in'},h('div',{class:'rw'},T(a,'n','اسم الملحق'),CB(a,'hidden','إخفاء'),del(arr,k,'حذف الملحق؟')),IMG(a,'img'),h('div',{class:'rw'},T(a,'d','وصف الملحق'),N(a,'p','السعر')))),B('+ ملحق جديد',()=>{arr.push({id:uid('a'),n:'',img:'',d:'',p:0,hidden:false});OP.add(key);chg();draw()}));
const varCard=(v,k,arr)=>h('div',{class:'cd in'},h('div',{class:'rw'},h('b',{class:'nm'},k+1),T(v,'n','اسم النوع'),CB(v,'hidden','إخفاء'),del(arr,k,'حذف النوع؟')),IMG(v,'img'),h('div',{class:'rw'},T(v,'d','وصف النوع'),N(v,'p','السعر')),
 det(v.id+'o','اختيارات داخل النوع (مثل اللون)',h('div',{class:'rw'},T(v,'ol','عنوان الاختيار (مثال: اللون)')),optRows(v.opts)),det(v.id+'a','ملحقات هذا النوع',accList(v.acc,v.id+'a')));
/* ألوان المنتج */
const on=(it,c)=>!c.hidden&&(!it.cset||it.cset.includes(c.id));
function palPanel(it){const tg=c=>{const cur=it.cset||D.colors.map(x=>x.id);it.cset=cur.includes(c.id)?cur.filter(x=>x!=c.id):cur.concat(c.id);chg();draw()};
 return h('div',{},h('div',{class:'hint'},'اضغط على اللون لإظهاره أو إخفائه في هذا المنتج. يجب اختيار لون واحد على الأقل.'),h('div',{class:'chips'},D.colors.map(c=>h('button',{class:'chip'+(on(it,c)?' on':'')+(c.hidden?' gh':''),onclick:()=>tg(c)},h('i',{style:'background:'+c.h}),c.n+(c.hidden?' (مخفي عامًا)':'')))),
  h('div',{class:'rw'},B('تحديد الكل',()=>{it.cset=D.colors.map(x=>x.id);chg();draw()}),B('إلغاء الكل',()=>{it.cset=[];chg();draw()})))}
const itemCard=(it,k,arr)=>h('div',{class:'cd'+(it.colors&&!D.colors.some(c=>on(it,c))?' warn':'')},h('div',{class:'rw'},T(it,'name','اسم المنتج'),CB(it,'hidden','إخفاء'),del(arr,k,'حذف المنتج بكل أنواعه؟')),IMG(it,'img'),h('div',{class:'rw'},T(it,'d','وصف (اختياري)')),
 h('div',{class:'rw'},CB(it,'featured','⭐ منتج مميز (يظهر في الرئيسية)'),CB(it,'colors','🎨 يُطلب اختيار لون',draw),CB(it,'qrows','كميات منفصلة لكل وحدة (شيكارة وكيلو)')),
 it.colors?det(it.id+'k','🎨 الألوان المتاحة لهذا المنتج ('+D.colors.filter(c=>on(it,c)).length+')',palPanel(it)):'',
 det(it.id+'v','الأنواع ('+it.variants.length+') – كل نوع بصورته ووصفه وسعره',it.variants.map((v,i)=>varCard(v,i,it.variants)),B('+ نوع جديد',()=>{it.variants.push({id:uid('v'),n:'',img:'',d:'',p:0,opts:[],ol:'',acc:[],hidden:false});OP.add(it.id+'v');chg();draw()})),
 det(it.id+'s','الأحجام / الدرجات والأسعار (للمنتج بدون أنواع)',optRows(it.opts)),det(it.id+'c','الملحقات ('+it.acc.length+')',accList(it.acc,it.id+'c')));
/* التبويبات */
function colorsTab(){let nm='',hx='#c8702a';const add=h('div',{class:'cd'},h('h4','➕ إضافة لون جديد'),h('div',{class:'hint'},'لو اللون مش موجود في القائمة، اكتب اسمه واختر درجته.'),
  h('div',{class:'rw'},h('input',{type:'color',value:hx,style:'width:58px;height:46px;padding:0;border:0;background:none',oninput:e=>hx=e.target.value}),h('input',{type:'text',placeholder:'اسم اللون (مثال: روز)',oninput:e=>nm=e.target.value}),
  B('➕ إضافة',()=>{if(!nm.trim())return say('اكتب اسم اللون');const c={id:uid('c'),n:nm.trim(),h:hx,hidden:false};D.colors.push(c);D.sections.forEach(s=>s.subs.forEach(b=>b.items.forEach(i=>{if(i.cset)i.cset.push(c.id)})));chg();draw();say('تمت إضافة اللون «'+c.n+'» لكل المنتجات التي بها ألوان')},'b')));
 const grid=h('div',{class:'cd'},h('h4','🎨 كل الألوان ('+D.colors.length+')'),h('div',{class:'hint'},'👁 يخفي اللون أو يظهره عند العملاء في كل المنتجات. اللون المخفي يظهر باهتًا.'),
  h('div',{class:'cg'},D.colors.map((c,k)=>h('div',{class:'cc'+(c.hidden?' hid':'')},h('input',{type:'color',value:c.h,oninput:e=>{c.h=e.target.value;chg()}}),T(c,'n','اسم اللون'),h('div',{class:'rw'},B(c.hidden?'👁 إظهار':'🙈 إخفاء',()=>{c.hidden=!c.hidden;chg();draw()}),B('🗑',()=>{if(confirm('حذف اللون «'+c.n+'»؟')){D.colors.splice(k,1);chg();draw()}},'x'))))));
 return[add,grid]}
function draw(){if(!D)return;$('#tabs').replaceChildren(...[['p','📦 المنتجات'],['c','🎨 الألوان'],['f','🔥 العروض'],['s','🏪 بيانات المحل']].map(([k,n])=>h('button',{class:tab==k?'on':'',onclick:()=>{tab=k;draw()}},n)));const out=[];
 if(tab=='p'){const S=D.sections[si],Bs=S.subs;bi=Math.min(bi,Bs.length-1);const sb=Bs[bi];
  out.push(h('div',{class:'cd'},h('h4','القسم'),h('div',{class:'rw'},sel(D.sections,si,i=>{si=i;bi=0;draw()}),sel(Bs,bi,i=>{bi=i;draw()})),
   sb?h('div',{},h('div',{class:'rw'},T(sb,'name','اسم القسم الفرعي'),CB(sb,'hidden','إخفاء'),del(Bs,bi,'حذف هذا القسم الفرعي بكل منتجاته؟')),IMG(sb,'img')):'',
   B('+ قسم فرعي جديد',()=>{Bs.push({id:uid('b'),name:'قسم جديد',img:'',hidden:false,items:[]});bi=Bs.length-1;chg();draw()})));
  if(sb){sb.items.forEach((it,k)=>out.push(itemCard(it,k,sb.items)));out.push(B('+ منتج جديد',()=>{sb.items.push({id:uid('i'),name:'منتج جديد',img:'',d:'',opts:[{l:'الوحدة',p:0}],colors:false,featured:false,qrows:false,variants:[],acc:[],hidden:false});chg();draw()},'b'))}}
 if(tab=='c')out.push(...colorsTab());
 if(tab=='f'){D.offers.forEach((f,k)=>out.push(h('div',{class:'cd'},h('div',{class:'rw'},T(f,'t','عنوان العرض'),CB(f,'hidden','إخفاء'),del(D.offers,k,'حذف العرض؟')),IMG(f,'img'),h('div',{class:'rw'},T(f,'d','وصف العرض')),h('div',{class:'rw'},N(f,'old','السعر الأصلي'),N(f,'p','سعر العرض')))));
  out.push(B('+ عرض جديد',()=>{D.offers.push({id:uid('o'),img:'',t:'عرض جديد',d:'',old:0,p:0,hidden:false});chg();draw()},'b'))}
 if(tab=='s'){const s=D.shop;out.push(h('div',{class:'cd'},[['wa','رقم واتساب (بصيغة دولية)'],['phone','رقم الموبايل'],['land','الرقم الأرضي'],['map','رابط الموقع على خرائط جوجل (اختياري)']].map(([k,n])=>h('div',{},h('div',{class:'hint'},n),T(s,k,n)))))}
 $('#o').replaceChildren(...out)}
