export const friends = [{id:'simone',name:'Simone',initial:'S',color:'peach'},{id:'naja',name:'Naja',initial:'N',color:'lavender'},{id:'katrine',name:'katrine',initial:'K',color:'sage'},{id:'cille',name:'Cille',initial:'C',color:'butter'}];
export const currentUser = 'simone';
export const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function weekends(year,month) {
 const result=[];
 for(let day=1;day<=new Date(year,month+1,0).getDate();day++) {
  const d=new Date(year,month,day);
  if(d.getDay()===4) result.push(Array.from({length:4},(_,i)=>new Date(year,month,day+i)));
 }
 return result;
}
export function createState() {
 const days={};
 for(let month=9;month<16;month++) for(const weekend of weekends(2026,month)) for(const d of weekend) {
  const key=dateKey(d),seed=d.getDate()+d.getMonth();
  days[key]={available: friends.filter((_,i)=>(seed+i*3)%5<3).map(f=>f.id),committed:[]};
 }
 days['2026-10-10']={available:['simone','cille'],committed:[]};
 days['2026-10-11']={available:['simone','naja','katrine'],committed:[]};
 days['2026-10-18']={available:['cille'],committed:[]};
 days['2026-10-24']={available:['naja','katrine','cille'],committed:[]};
 days['2026-10-17']={available:['simone','naja','katrine','cille'],committed:['katrine']};
 return {days};
}
export function getDay(state,key) { return state.days[key] ??= {available:[],committed:[]}; }
export function stage(day) {return day.available.length===4 ? (day.committed.length===4?'confirmed':'match'):'available';}
export function toggleAvailability(state,key,id=currentUser) {
 const d=new Date(`${key}T12:00:00`);
 if(![0,4,5,6].includes(d.getDay())) throw new Error('Only Thursday through Sunday are supported');
 const day=getDay(state,key),before=stage(day);
 if(day.available.includes(id)) {day.available=day.available.filter(x=>x!==id);day.committed=[];}
 else day.available.push(id);
 return {before,after:stage(day)};
}
export function commit(state,key,id=currentUser) {
 const day=getDay(state,key),before=stage(day);
 if(day.available.length!==4 || !day.available.includes(id)) return {before,after:before};
 if(!day.committed.includes(id)) day.committed.push(id);
 return {before,after:stage(day)};
}
export function loadState(storage) {
 try {const parsed=JSON.parse(storage.getItem('sunday-club-v1')); if(parsed?.days && Object.values(parsed.days).every(d=>Array.isArray(d.available)&&Array.isArray(d.committed)&&d.available.every(id=>friends.some(f=>f.id===id))&&new Set(d.available).size===d.available.length&&d.committed.every(id=>d.available.includes(id))&&new Set(d.committed).size===d.committed.length)) return parsed;} catch {}
 return createState();
}
