(function(){
var $=function(i){return document.getElementById(i)},QA=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var K="hfr2:";
function ld(k,d){try{var v=localStorage.getItem(K+k);return v?JSON.parse(v):d}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(K+k,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var num=function(x){return parseFloat(x)||0},fmt=function(n){return String(+n.toFixed(2))},nz=function(n){return n?fmt(n):"Nil"};
var DISC=["Adhesive","Tile grout","Ready mix","Waterproofing","Payment follow-up","Complaint / service","Other"];
var F=["date","emp","des","reg","mgr","newvis","newadd","mkt","rm","pend","key","col","old","out","top","pv","pc","pe","pf"];
var rows=$("rows"),C=["name","addr","phone","disc","sec","pri"];
function toast(m){var t=$("toast");t.textContent=m;t.className="on";setTimeout(function(){t.className=""},2200)}
function today(){return new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10)}
function addRow(v){v=v||{};var tr=document.createElement("tr");
 tr.innerHTML='<td class="c"></td><td><input data-c="name" list="dl" placeholder="Dealer name"></td><td><input data-c="addr"></td><td><input data-c="phone" inputmode="tel"></td>'+
 '<td><select data-c="disc">'+DISC.map(function(d){return "<option>"+d+"</option>"}).join("")+'</select></td>'+
 '<td class="c"><input type="checkbox" data-c="prod" aria-label="Productive"></td><td><input data-c="sec" type="number" step="any" min="0"></td><td><input data-c="pri" type="number" step="any" min="0"></td><td class="c"><button class="rm" type="button" aria-label="Remove row">×</button></td>';
 C.forEach(function(c){tr.querySelector('[data-c="'+c+'"]').value=v[c]==null?(c==="disc"?DISC[0]:""):v[c]});
 tr.querySelector('[data-c="prod"]').checked=!!v.prod;
 tr.querySelector(".rm").onclick=function(){tr.remove();num_();calc();draft()};
 tr.querySelector('[data-c="name"]').onchange=function(){var d=ld("dealers",{})[this.value.trim().toLowerCase()];
  if(d){var a=tr.querySelector('[data-c="addr"]'),p=tr.querySelector('[data-c="phone"]');if(!a.value)a.value=d.addr||"";if(!p.value)p.value=d.phone||""}draft()};
 rows.appendChild(tr);num_()}
function num_(){QA("tr",rows).forEach(function(r,i){r.firstChild.textContent=i+1})}
function get(){var r={rows:[]};F.forEach(function(i){r[i]=$(i).value});
 QA("tr",rows).forEach(function(tr){var o={};C.forEach(function(c){o[c]=tr.querySelector('[data-c="'+c+'"]').value});o.prod=tr.querySelector('[data-c="prod"]').checked;r.rows.push(o)});return r}
function set(r){F.forEach(function(i){$(i).value=r[i]||""});rows.innerHTML="";(r.rows||[]).forEach(addRow);while(rows.children.length<7)addRow();calc()}
function tot(r){var f=r.rows.filter(function(x){return x.name.trim()});var t={v:f.length,p:f.filter(function(x){return x.prod}).length,ss:0,ps:0,col:num(r.col)};
 f.forEach(function(x){t.ss+=num(x.sec);t.ps+=num(x.pri)});t.np=t.v-t.p;return t}
function calc(){var t=tot(get());var m={visits:t.v,prod:t.p,np:t.np,ss:fmt(t.ss),ps:fmt(t.ps),col:fmt(t.col)};
 Object.keys(m).forEach(function(k){QA(".v-"+k).forEach(function(e){e.textContent=m[k]})})}
function draft(){calc();sv("draft",get())}
function blank(){var p=ld("profile",{});set({date:today(),emp:p.emp,des:p.des,reg:p.reg,mgr:p.mgr,rows:[]})}
function check(r){var e=[];if(!r.date)e.push("Date is required.");if(!r.emp.trim())e.push("Employee name is required.");
 if(!r.reg.trim())e.push("Region / Territory is required.");if(!r.mgr.trim())e.push("Reporting manager is required.");
 var f=0;r.rows.forEach(function(x,i){var any=x.name.trim()||x.addr.trim()||x.phone.trim()||x.sec||x.pri;if(!any)return;
  if(!x.name.trim())e.push("Row "+(i+1)+": dealer name is missing.");else{f++;if(!x.addr.trim())e.push("Row "+(i+1)+": address is missing.")}
  if(x.phone.trim()&&!/^[+\d][\d\s-]{6,}$/.test(x.phone.trim()))e.push("Row "+(i+1)+": phone number looks invalid.")});
 if(!f)e.push("Add at least one dealer visit.");var b=$("errs");
 if(e.length){b.innerHTML="<b>Fix these first:</b><ul>"+e.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ul>";b.className="errs";b.scrollIntoView({block:"nearest"})}else b.className="errs hide";
 return !e.length}
function save(){var r=get();if(!check(r))return;var R=ld("reports",{}),D=ld("dealers",{});R[r.date]=r;
 r.rows.forEach(function(x){if(x.name.trim())D[x.name.trim().toLowerCase()]={name:x.name.trim(),addr:x.addr,phone:x.phone}});
 sv("reports",R);sv("dealers",D);dl();toast("Report saved")}
function dl(){var D=ld("dealers",{});$("dl").innerHTML=Object.keys(D).map(function(k){return '<option value="'+esc(D[k].name)+'">'}).join("")}
function build(r){var t=tot(r);var z=function(v){return v?esc(v):"–"};
 var rr=r.rows.filter(function(x){return x.name.trim()}).map(function(x,i){return "<tr><td>"+(i+1)+"</td><td>"+esc(x.name)+"</td><td>"+esc(x.addr)+"</td><td>"+esc(x.phone)+"</td><td>"+esc(x.disc)+"</td><td>"+(x.prod?"Yes":"No")+"</td><td>"+(num(x.sec)?fmt(num(x.sec)):"Nil")+"</td><td>"+(num(x.pri)?fmt(num(x.pri)):"Nil")+"</td></tr>"}).join("");
 var kv=function(a){return '<div class="kv">'+a.map(function(p){return "<div><b>"+p[0]+":</b> "+p[1]+"</div>"}).join("")+"</div>"};
 return '<div class="hd">'+'<img src="'+LOGO+'" alt="Himalayan Adhesives">'+'<h1>Daily Field Report</h1></div>'+
 '<h3>Basic information</h3>'+kv([["Date",esc(r.date.split("-").reverse().join("/"))],["Employee",z(r.emp)],["Designation",z(r.des)],["Region / Territory",z(r.reg)],["Reporting manager",z(r.mgr)]])+
 '<h3>Dealer / distributor visits</h3><table><thead><tr><th>S.No</th><th>Dealer / Distributor</th><th>Address</th><th>Phone</th><th>Discussion</th><th>Productive</th><th>Secondary (L)</th><th>Primary (L)</th></tr></thead><tbody>'+rr+'</tbody></table>'+
 '<h3>Daily working details</h3>'+kv([["Total visits",t.v],["Productive calls",t.p],["Non-productive calls",t.np],["New dealer / outlet visited",z(r.newvis)],["New outlet added",z(r.newadd)],["Market development",z(r.mkt)]])+
 '<h3>Sales / order update</h3>'+kv([["Primary sales (L)",nz(t.ps)],["Secondary sales (L)",nz(t.ss)],["Project / Ready Mix (L)",num(r.rm)?fmt(num(r.rm)):"Nil"],["Pending order follow-up",z(r.pend)],["Key order confirmed",z(r.key)]])+
 '<h3>Collection update</h3>'+kv([["Collection today (L)",num(r.col)?fmt(num(r.col)):"Nil"],["Old overdue collected (L)",num(r.old)?fmt(num(r.old)):"Nil"],["Outstanding follow-up",z(r.out)],["Top overdue dealers visited",z(r.top)]])+
 '<h3>Plan for next day</h3>'+kv([["Planned visits",z(r.pv)],["Planned collections",z(r.pc)],["Expected orders",z(r.pe)],["Focus area",z(r.pf)]])+
 '<div class="sg"><div>Employee signature</div><div>Manager signature</div></div>'}
function printPdf(r){var t=document.title;document.title="Daily Field Report "+r.date+" "+r.emp;$("pr").innerHTML=build(r);
 var b=function(){document.title=t;window.removeEventListener("afterprint",b)};window.addEventListener("afterprint",b);window.print()}

function dmy(d){return d?d.split("-").reverse().join("/"):""}
function makePdf(r){
 var J=window.jspdf.jsPDF,doc=new J({unit:"mm",format:"a4"}),W=210,H=297,M=12,t=tot(r),y;
 var BL=[4,69,150],RD=[228,32,38],GR=[245,243,240],LN=[160,160,160];
 var z=function(v){return v&&String(v).trim()?String(v):"-"};
 doc.addImage(LOGO,"PNG",M,9,54,54/3.004);
 doc.setTextColor(BL[0],BL[1],BL[2]);doc.setFont("helvetica","bold");doc.setFontSize(19);doc.text("Daily Field Report",W-M,19,{align:"right"});
 doc.setTextColor(80);doc.setFont("helvetica","normal");doc.setFontSize(9.5);doc.text("Date: "+dmy(r.date),W-M,25,{align:"right"});
 doc.setDrawColor(RD[0],RD[1],RD[2]);doc.setLineWidth(.9);doc.line(M,29,W-M,29);y=35;
 function sec(s){if(y>H-50){doc.addPage();y=16}doc.setFont("helvetica","bold");doc.setFontSize(11);doc.setTextColor(RD[0],RD[1],RD[2]);doc.text(s,M,y);y+=2.5}
 function kv(p){var b=[];for(var i=0;i<p.length;i+=2)b.push([p[i][0],p[i][1],p[i+1]?p[i+1][0]:"",p[i+1]?p[i+1][1]:""]);
  doc.autoTable({startY:y,body:b,theme:"grid",margin:{left:M,right:M},styles:{fontSize:9,cellPadding:2,lineColor:LN,lineWidth:.2,textColor:30},
   columnStyles:{0:{fontStyle:"bold",fillColor:GR,cellWidth:40},1:{cellWidth:53},2:{fontStyle:"bold",fillColor:GR,cellWidth:40},3:{cellWidth:53}}});y=doc.lastAutoTable.finalY+7}
 sec("Basic information");
 kv([["Employee",z(r.emp)],["Designation",z(r.des)],["Region / Territory",z(r.reg)],["Reporting manager",z(r.mgr)]]);
 sec("Dealer / distributor visits");
 var body=r.rows.filter(function(x){return x.name.trim()}).map(function(x,i){return [i+1,x.name,z(x.addr),z(x.phone),x.disc,x.prod?"Yes":"No",nz(num(x.sec)),nz(num(x.pri))]});
 doc.autoTable({startY:y,theme:"grid",margin:{left:M,right:M},
  head:[["S.No","Dealer / Distributor","Address","Phone","Discussion","Productive","Secondary (L)","Primary (L)"]],body:body,
  foot:[["","Total","","","",t.p+" / "+t.v,nz(t.ss),nz(t.ps)]],showFoot:"lastPage",
  styles:{fontSize:8.5,cellPadding:1.8,lineColor:LN,lineWidth:.2,textColor:30,overflow:"linebreak"},
  headStyles:{fillColor:BL,textColor:255,halign:"center",fontSize:8},footStyles:{fillColor:GR,textColor:30,fontStyle:"bold"},
  columnStyles:{0:{cellWidth:12,halign:"center"},1:{cellWidth:34},2:{cellWidth:32},3:{cellWidth:24},4:{cellWidth:28},5:{cellWidth:20,halign:"center"},6:{cellWidth:18,halign:"right"},7:{cellWidth:18,halign:"right"}}});
 y=doc.lastAutoTable.finalY+7;
 sec("Daily working details");
 kv([["Total visits",String(t.v)],["Productive calls",String(t.p)],["Non-productive calls",String(t.np)],["New dealer / outlet visited",z(r.newvis)],["New outlet added",z(r.newadd)],["Market development",z(r.mkt)]]);
 sec("Sales / order update");
 kv([["Primary sales (L)",nz(t.ps)],["Secondary sales (L)",nz(t.ss)],["Project / Ready Mix (L)",nz(num(r.rm))],["Pending order follow-up",z(r.pend)],["Key order confirmed",z(r.key)]]);
 sec("Collection update");
 kv([["Collection today (L)",nz(num(r.col))],["Old overdue collected (L)",nz(num(r.old))],["Outstanding follow-up",z(r.out)],["Top overdue dealers visited",z(r.top)]]);
 sec("Plan for next day");
 kv([["Planned dealer visits",z(r.pv)],["Planned collections",z(r.pc)],["Orders expected",z(r.pe)],["Focus area",z(r.pf)]]);
 if(y>H-40){doc.addPage();y=20}y+=14;doc.setDrawColor(0);doc.setLineWidth(.3);
 doc.line(M,y,M+62,y);doc.line(W-M-62,y,W-M,y);doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(60);
 doc.text("Employee signature",M+31,y+5,{align:"center"});doc.text("Manager signature",W-M-31,y+5,{align:"center"});
 var n=doc.getNumberOfPages();for(var i=1;i<=n;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(120);doc.text("Himalayan Adhesives - Daily Field Report   |   Page "+i+" of "+n,W/2,H-7,{align:"center"})}
 return doc}
function dlBlob(blob,name){var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
 setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},4000)}
function exportPdf(r){
 var odd=/[^\u0000-\u00ff\u2013\u2014\u2018\u2019\u201c\u201d\u2022]/.test(JSON.stringify(r));
 if(odd||!(window.jspdf&&window.jspdf.jsPDF)){toast(odd?"Hindi text found, using print layout":"PDF tool not loaded, using print layout");return printPdf(r)}
 var blob,name="Daily-Field-Report_"+r.date+"_"+(r.emp||"").trim().replace(/[^A-Za-z0-9]+/g,"-")+".pdf";
 try{blob=makePdf(r).output("blob")}catch(e){toast("PDF failed, using print layout");return printPdf(r)}
 dlBlob(blob,name);toast("PDF downloaded")}
function hist(){var R=ld("reports",{}),k=Object.keys(R).sort().reverse();
 $("hist").innerHTML=k.length?k.map(function(d){var t=tot(R[d]);return '<div class="item"><div><b>'+esc(d.split("-").reverse().join("/"))+'</b> – '+esc(R[d].emp)+'<br><small>'+t.v+' visits · '+t.p+' productive · Sec '+fmt(t.ss)+' L · Pri '+fmt(t.ps)+' L · Coll '+fmt(t.col)+' L</small></div><div class="bar" style="margin:0"><button class="btn o" data-a="open" data-d="'+d+'">Open</button><button class="btn o" data-a="pdf" data-d="'+d+'">PDF</button><button class="btn o" data-a="del" data-d="'+d+'">Delete</button></div></div>'}).join(""):"<p>No saved reports yet. Fill today’s report and choose Save report.</p>"}
function dlist(){var D=ld("dealers",{}),k=Object.keys(D).sort();
 $("dlist").innerHTML=k.length?k.map(function(x){return '<div class="item"><div><b>'+esc(D[x].name)+'</b><br><small>'+esc(D[x].addr)+' · '+esc(D[x].phone)+'</small></div><button class="btn o" data-k="'+esc(x)+'">Remove</button></div>'}).join(""):"<p>No dealers saved yet.</p>"}
function tab(n){["report","history","dealers","profile"].forEach(function(x){$("t-"+x).className=x===n?"":"hide"});
 QA("nav .bt").forEach(function(b){b.className="bt"+(b.dataset.t===n?" on":"")});if(n==="history")hist();if(n==="dealers")dlist();window.scrollTo(0,0)}
QA("nav .bt").forEach(function(b){b.onclick=function(){tab(b.dataset.t)}});
$("hist").onclick=function(e){var b=e.target.closest("button");if(!b)return;var R=ld("reports",{}),d=b.dataset.d;
 if(b.dataset.a==="open"){set(R[d]);tab("report")}else if(b.dataset.a==="pdf")exportPdf(R[d]);
 else if(confirm("Delete the report for "+d+"?")){delete R[d];sv("reports",R);hist()}};
$("dlist").onclick=function(e){var b=e.target.closest("button");if(!b)return;var D=ld("dealers",{});delete D[b.dataset.k];sv("dealers",D);dl();dlist()};
["input","change"].forEach(function(ev){document.addEventListener(ev,function(e){if(e.target.closest("#t-report"))draft()})});
$("addRow").onclick=function(){addRow();draft()};$("save").onclick=save;
$("pdf").onclick=function(){var r=get();if(check(r))exportPdf(r)};
$("print").onclick=function(){var r=get();if(check(r))printPdf(r)};
$("new").onclick=function(){if(confirm("Start a new report? Unsaved changes will be lost.")){blank();sv("draft",null)}};
$("psave").onclick=function(){var p={emp:$("p-emp").value,des:$("p-des").value,reg:$("p-reg").value,mgr:$("p-mgr").value};sv("profile",p);
 ["emp","des","reg","mgr"].forEach(function(k){if(p[k])$(k).value=p[k]});toast("Profile saved")};
$("bk").onclick=function(){var d={app:"himalayan-field-report",version:1,profile:ld("profile",{}),dealers:ld("dealers",{}),reports:ld("reports",{})};
 dlBlob(new Blob([JSON.stringify(d,null,1)],{type:"application/json"}),"field-report-backup-"+today()+".json");toast("Backup downloaded")};
$("rs").onchange=function(){var f=this.files[0],inp=this;if(!f)return;var fr=new FileReader();fr.onload=function(){
 try{var d=JSON.parse(fr.result);if(d.app!=="himalayan-field-report")throw 0;
  var D=ld("dealers",{}),R=ld("reports",{});Object.assign(D,d.dealers||{});Object.assign(R,d.reports||{});sv("dealers",D);sv("reports",R);
  if(d.profile&&d.profile.emp){sv("profile",d.profile);["emp","des","reg","mgr"].forEach(function(k){$("p-"+k).value=d.profile[k]||""})}
  dl();toast("Backup restored")}catch(e){toast("That is not a valid backup file")}inp.value=""};fr.readAsText(f)};
var p=ld("profile",{});["emp","des","reg","mgr"].forEach(function(k){$("p-"+k).value=p[k]||""});
dl();var d=ld("draft",null);if(d&&d.date)set(d);else blank();
if("serviceWorker" in navigator&&/^https?:/.test(location.protocol)){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}
})();
