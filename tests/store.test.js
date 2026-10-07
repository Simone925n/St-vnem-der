import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,weekends,dateKey,getDay,stage,toggleAvailability,commit,loadState} from '../src/store.js';
test('calendar contains only Thursday–Sunday, including cross-month weekends',()=>{
 for(let month=0;month<12;month++) for(const ws of weekends(2026,month)) assert.deepEqual(ws.map(d=>d.getDay()),[4,5,6,0]);
 assert.equal(dateKey(weekends(2026,9).at(-1).at(-1)),'2026-11-01');
});
test('availability can be added and removed independently of commitment',()=>{
 const s=createState(); assert.equal(getDay(s,'2026-10-24').available.length,3);
 assert.deepEqual(toggleAvailability(s,'2026-10-24'),{before:'available',after:'match'});
 assert.equal(getDay(s,'2026-10-24').committed.length,0);
 toggleAvailability(s,'2026-10-24'); assert.equal(stage(getDay(s,'2026-10-24')),'available');
 assert.throws(()=>toggleAvailability(s,'2026-10-26'),/Only Thursday/);
});
test('partial availability is not a match and cannot receive commitments',()=>{
 const s=createState();for(let n=0;n<4;n++){s.days['2026-10-10']={available:['simone','naja','katrine'].slice(0,n),committed:[]};assert.equal(stage(getDay(s,'2026-10-10')),'available');commit(s,'2026-10-10');assert.equal(getDay(s,'2026-10-10').committed.length,0);}
});
test('each unique individual commitment counts and only four confirm',()=>{
 const s=createState(),key='2026-10-24';toggleAvailability(s,key);
 for(const [index,id] of ['simone','katrine','naja','cille'].entries()){
 commit(s,key,id);commit(s,key,id);assert.equal(getDay(s,key).committed.length,index+1);assert.equal(stage(getDay(s,key)),index===3?'confirmed':'match');
 }
 toggleAvailability(s,key);assert.equal(stage(getDay(s,key)),'available');assert.equal(getDay(s,key).committed.length,0);
});
test('local persistence reloads progress and recovers from corrupt data',()=>{
 const s=createState();toggleAvailability(s,'2026-10-24');commit(s,'2026-10-24');
 assert.deepEqual(loadState({getItem:()=>JSON.stringify(s)}),s);
 assert.deepEqual(loadState({getItem:()=>'{broken'}),createState());
});
