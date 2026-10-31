(function(root){
'use strict';
const GRADES=['A','B','C','D','E','F','G','G+'];
const LIMITS=[.64,.70,.76,.82,.88,.94,1,1.1];
const COLORS=['#006600','#009900','#33CC33','#E5E51B','#F6BB00','#E66914','#C00000','#800000'];
const C=[167,163,157,150], D=[224,217,210,204];
function number(x,label,min=0){if(x===''||x===null||x===undefined||!Number.isFinite(Number(x))||Number(x)<min)throw Error(label+' نامعتبر است.');return Number(x)}
function format3(value){
 const n=Number(value);if(!Number.isFinite(n))throw Error('عدد نامعتبر است.');
 const negative=n<0,parts=Math.abs(n).toString().toLowerCase().split('e'),exp=Number(parts[1]||0),dot=parts[0].indexOf('.'),digits=parts[0].replace('.',''),point=(dot<0?parts[0].length:dot)+exp;
 const whole=point<=0?'0':(digits.slice(0,point)+'0'.repeat(Math.max(0,point-digits.length))),fraction=point<0?'0'.repeat(-point)+digits:digits.slice(Math.max(0,point));
 const out=whole+'.'+(fraction+'000').slice(0,3);return negative&&/[1-9]/.test(out)?'-'+out:out;
}
function group(g){if(!['M1','M2','N1','N2'].includes(g))throw Error('گروه خودرو نامعتبر است.');return g==='M1'}
function stage(s,max){s=number(s,'مرحله',1);if(!Number.isInteger(s)||s>max)throw Error('مرحله نامعتبر است.');return s}
function grade(e,g){e=number(e,'انتشار');if(!(g>0))throw Error('معیار باید مثبت باشد.');const i=LIMITS.findIndex(l=>e<=g*l+1e-10);return i<0?'خارج از محدوده':GRADES[i]}
function product(p){const m1=group(p.group),s=stage(p.stage,2),m=number(p.mass,'جرم',.1),e=number(p.co2,'انتشار');const m0=m1?1278:1431;const base=(m1?C:D)[s-1]+(m1?.0267:.09)*(m-m0);const count=[p.van,p.automatic,p.awd].filter(Boolean).length;
// Table 1 explicitly says each case. Table 2 does not: default to a single 5% allowance, exposing the alternative interpretation.
const perCase=m1||p.table2PerCase===true;const allowance=.05*(perCase?count:Math.min(count,1));const raw=base*(1+allowance),g=raw;if(g<=0)throw Error('جرم واردشده معیار مثبت ایجاد نمی‌کند.');
return {m0,base,count,allowance,raw,g,grade:grade(e,g),ratio:e/g,bands:GRADES.map((name,i)=>({name,color:COLORS[i],low:i?LIMITS[i-1]*g:0,high:LIMITS[i]*g,lowInclusive:i===0,highInclusive:true}))}}
function equivalent(range,gas,petrol){range=number(range,'پیمایش گاز');gas=number(gas,'انتشار گاز');petrol=number(petrol,'انتشار بنزین');const f=range<240?.5:range>=300?1:.6+(Math.max(range,240)-240)/150;return {f,co2:f*gas+(1-f)*petrol,formula:range<240?1:2}}
function credit(row,p){switch(row.tech){case 'ice':return row.co2<100&&p.grade==='A'?2:1;case 'gas':return 1.5;case 'mild':return 2;case 'hybrid':return 2.5;case 'electric':if(row.co2!==0)throw Error('انتشار مستقیم خودروی برقی باید صفر باشد.');return 3;default:throw Error('فناوری نامعتبر است.')}}
function fleet(rows,s,productStage=1){s=stage(s,4);productStage=stage(productStage,2);if(!rows.length)throw Error('حداقل یک مدل وارد کنید.');const checked=rows.map(r=>{group(r.group);let n=number(r.n,'تعداد شماره‌گذاری');if(!Number.isInteger(n))throw Error('تعداد شماره‌گذاری باید عدد صحیح باشد.');const mass=number(r.mass,'جرم',.1),co2=number(r.co2,'انتشار');const p=product({...r,stage:s<=2?s:productStage,mass,co2});const v=r.fallback?1:credit({...r,co2},p);return {...r,n,mass,co2,v,N:n*v,p}});
function summary(a){const n=a.reduce((t,r)=>t+r.n,0),N=a.reduce((t,r)=>t+r.N,0);if(!n)return null;const massNumerator=a.reduce((t,r)=>t+r.n*r.mass,0),emissionNumerator=a.reduce((t,r)=>t+r.N*r.co2,0);const M=massNumerator/n,P=emissionNumerator/N,T6=C[s-1]+.0267*(M-1278),T7=D[s-1]+.09*(M-1431);return {n,N,M,P,T6,T7,massNumerator,emissionNumerator}};
return {rows:checked,all:summary(checked),m1:summary(checked.filter(r=>r.group==='M1')),commercial:summary(checked.filter(r=>r.group!=='M1')),C:C[s-1],D:D[s-1],stage:s}}
const api={GRADES,LIMITS,COLORS,C,D,format3,grade,product,equivalent,fleet};if(typeof module!=='undefined')module.exports=api;root.CO2=api;
})(typeof globalThis==='undefined'?this:globalThis);
