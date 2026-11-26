/* تحميل بيانات الموقع (الأقسام والمنتجات والأسعار والعروض) مع نسخة احتياطية للعمل بدون إنترنت */
async function loadData(){
  try{const r=await fetch('site-data.json',{cache:'no-cache'});if(!r.ok)throw 0;const d=await r.json();try{localStorage.qd=JSON.stringify(d)}catch(e){}return d}
  catch(e){const s=localStorage.qd;if(s)return JSON.parse(s);throw e}
}
