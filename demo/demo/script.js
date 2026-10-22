// Oreo's Cafe script.
// Edit the menu below: [name, price, category, emoji, hue (0-360), rating, description, image]
// IMAGES: the 8th item is the photo for that drink. Put the files in an 'images' folder next to index.html with these names.
// A missing file just shows the emoji, so you can add photos one at a time.
const MENU=[
 ['Oat Latte',4.5,'Coffee','☕',28,4.8,'Smooth espresso with steamed oat milk.','images/oat-latte.jpg'],
 ['Flat White',4,'Coffee','🥛',38,4.7,'Double ristretto with velvety microfoam.','images/flat-white.jpg'],
 ['Iced Caramel',5,'Coffee','🧋',22,4.6,'Cold espresso, milk and caramel over ice.','images/iced-caramel.jpg'],
 ['Cold Brew',4.8,'Coffee','🧊',205,4.9,'Steeped for 18 hours and served over ice.','images/cold-brew.jpg'],
 ['Matcha Latte',5.2,'Tea','🍵',125,4.8,'Ceremonial matcha whisked with milk.','images/matcha-latte.jpg'],
 ['Masala Chai',3.5,'Tea','🫖',18,4.7,'Black tea simmered with warm spices.','images/masala-chai.jpg'],
 ['Mocha',5,'Coffee','🍫',20,4.7,'Espresso, steamed milk and dark chocolate.','images/mocha.jpg'],
 ['Iced Lemon Tea',4.2,'Tea','🍋',52,4.6,'Black tea shaken with lemon over ice.','images/iced-lemon-tea.jpg'],
 ['Butter Croissant',3.8,'Pastry','🥐',36,4.9,'Flaky, golden and baked at 6am.','images/butter-croissant.jpg'],
 ['Glazed Donut',3.2,'Pastry','🍩',330,4.6,'Soft and fluffy with a sugar glaze.','images/glazed-donut.jpg'],
 ['Chocolate Muffin',3.6,'Pastry','🧁',15,4.8,'Rich, moist and loaded with chocolate chips.','images/chocolate-muffin.jpg'],
 ['Blueberry Cheesecake',5.5,'Pastry','🍰',335,4.9,'Creamy slice with a blueberry compote.','images/blueberry-cheesecake.jpg'],
 ['Cappuccino',4.2,'Coffee','☕',30,4.8,'Equal parts espresso, steamed milk and foam.','images/cappuccino.jpg'],
 ['Americano',3.5,'Coffee','☕',25,4.5,'Espresso topped with hot water.','images/americano.jpg'],
 ['Vanilla Latte',4.8,'Coffee','🍦',48,4.7,'Espresso and milk with house vanilla syrup.','images/vanilla-latte.jpg'],
 ['Caramel Macchiato',5.2,'Coffee','🍯',32,4.8,'Vanilla milk marked with espresso and caramel.','images/caramel-macchiato.jpg'],
 ['Affogato',5.6,'Coffee','🍨',15,4.9,'Vanilla ice cream drowned in hot espresso.','images/affogato.jpg'],
 ['Jasmine Green Tea',3.8,'Tea','🍃',110,4.6,'Light green tea scented with jasmine.','images/jasmine-green-tea.jpg'],
 ['Chamomile Tea',3.6,'Tea','🌼',55,4.5,'Calming and caffeine free.','images/chamomile-tea.jpg'],
 ['Peach Iced Tea',4.4,'Tea','🍑',14,4.7,'Black tea with peach, served over ice.','images/peach-iced-tea.jpg'],
 ['Apple Pie',4.2,'Pastry','🥧',38,4.7,'Cinnamon apples under a buttery crust.','images/apple-pie.jpg'],
 ['Chocolate Chip Cookie',2.8,'Pastry','🍪',28,4.8,'Crisp edges, soft middle, big chocolate chunks.','images/chocolate-chip-cookie.jpg'],
 ['Sesame Bagel',3.4,'Pastry','🥯',42,4.5,'Chewy, toasted and served with cream cheese.','images/sesame-bagel.jpg'],
 ['Belgian Waffle',5,'Pastry','🧇',45,4.8,'Crisp waffle with maple syrup and butter.','images/belgian-waffle.jpg']
];
const art=m=>m[3]+(m[7]?`<img src="${m[7]}" alt="">`:'');   // emoji underneath, photo on top (removed if the file is missing)
const THEMES=[
 ['paper','Paper','#f3ebda','#ddd0b6','#3b2a1e'],['espresso','Espresso','#130e0b','#2c211a','#f3e9dc'],
 ['snow','Snow','#ffffff','#e8e8ea','#111111'],['midnight','Midnight','#070b16','#1a2440','#e8ecf7'],
 ['forest','Forest','#08120d','#183025','#e6f0ea'],['wine','Wine','#150709','#331a20','#f5e6e8']
];
const ACCENTS=['#d98b73','#e5734f','#c9453c','#d9a066','#e8b04a','#7fb88a','#4fb3a5','#6fa8d6','#8c8fe0','#b79ae0','#e08ab8'];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement;
const slug=m=>m[0].toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');   // 'Oat Latte' becomes 'oat-latte' (used in shared drink links)
let prevHash='';   // the page hash before a drink popup opened
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};

/* menu: the homepage grid and the full menu page use the same cards */
// how many cards fit per row at this screen width (matches the grid columns in style.css)
const cols=()=>matchMedia('(max-width:560px)').matches?2:matchMedia('(max-width:760px)').matches?3:matchMedia('(max-width:980px)').matches?4:matchMedia('(max-width:1180px)').matches?5:6;
// the homepage shows two full rows (three on phones). The rest is behind the "View menu" pill
const homeLimit=()=>cols()===2?6:cols()*2;
const pageSize=()=>cols()===2?8:Infinity;   // full menu page on phones: 8 at a time, then "Show more"
const favs=new Set((()=>{try{return JSON.parse(store.get('oc-favs')||'[]')}catch(e){return []}})());   // saved drinks (by name)
const cardHTML=(m,i)=>`<article class="card rv" data-i="${i}" tabindex="0" role="button" aria-label="${m[0]}, $${m[1].toFixed(2)}. Open details" data-c="${m[2]}" style="--h:${m[4]}">
  <div class="img" aria-hidden="true">${art(m)}</div>
  <button class="fav" data-fav="${i}" aria-label="Save ${m[0]}" aria-pressed="${favs.has(m[0])}"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.600-7 10-7 10Z"/></svg></button>
  <button class="add" data-i="${i}" aria-label="Add ${m[0]} to order"><svg viewBox="0 0 24 24"><path class="plus" d="M12 5v14M5 12h14"/><path class="tick" d="M5 13l4 4L19 7"/></svg></button>
  <div class="meta"><h3>${m[0]}</h3><p><span>${m[2]}</span><span>$${m[1].toFixed(2)}</span><span class="rt"><svg viewBox="0 0 24 24"><polygon points="12,2 15.1,8.6 22,9.3 16.8,14 18.2,21 12,17.5 5.8,21 7.2,14 2,9.3 8.9,8.6"/></svg>${m[5]}</span></p></div></article>`;
function setupMenu(gridEl,filtersEl,countEl,o){   // o: {limit, search, more, page, pill}
  let cards=[], cat='All', q='', lim=0, vis=Infinity;
  const none=gridEl.parentElement&&gridEl.parentElement.querySelector('.nomatch');
  function show(pop){   // decides which cards are visible right now
    let total=0, shown=0;
    cards.forEach(c=>{
      const m=MENU[c.dataset.i];
      const hit=(cat==='All'||(cat==='Top'?m[5]>=4.8:cat==='Saved'?favs.has(m[0]):c.dataset.c===cat))&&(!q||(m[0]+' '+m[2]).toLowerCase().includes(q));
      if(hit)total++;
      const on=hit&&total<=vis;
      c.classList.toggle('hidden',!on); c.classList.remove('pop');
      if(on&&pop){void c.offsetWidth;c.style.animationDelay=(shown++*45)+'ms';c.classList.add('pop')}
    });
    countEl.textContent=total+' items'; if(none)none.hidden=total>0;
    if(o.more)o.more.hidden=total<=vis;
  }
  function apply(){gridEl.classList.add('swap');setTimeout(()=>{show(true);gridEl.classList.remove('swap')},150)}
  function render(){   // draws the cards, and again if the screen size changes how many should show
    const l=o.limit(); if(l===lim) return;
    const first=!lim; lim=l; vis=o.page?o.page():Infinity;
    gridEl.innerHTML=MENU.slice(0,l).map(cardHTML).join('');
    cards=[...gridEl.querySelectorAll('.card')];
    if(!first) cards.forEach(c=>c.classList.add('in'));
    show(false);
    if(o.pill) o.pill.hidden=MENU.length<=l;
  }
  filtersEl.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    filtersEl.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    slide(filtersEl); cat=b.dataset.f; vis=o.page?o.page():Infinity; apply();
  });
  if(o.search) o.search.addEventListener('input',()=>{q=o.search.value.trim().toLowerCase();vis=o.page?o.page():Infinity;apply()});
  if(o.more) o.more.addEventListener('click',()=>{vis+=o.page();apply()});
  let t; addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(render,150)});
  render();
}
const grid=$('#grid'), grid2=$('#grid2');
setupMenu(grid,$('#filters'),$('#menuCount'),{limit:homeLimit,pill:$('#moreWrap')});
setupMenu(grid2,$('#filters2'),$('#menuCount2'),{limit:()=>MENU.length,search:$('#menuSearch'),more:$('#loadWrap'),page:pageSize});
/* order */
// cart key = 'drinkIndex:size:addons', e.g. '0:2:1' = Oat Latte, large, extra shot
const cart={}; const cartEl=$('#cart');
const MAXQ=20, reduceMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;
const SIZES=[['Small',-.5],['Medium',0],['Large',.7]];                                // [name, price change]
const ADDONS=[['Extra shot',.8,['Coffee']],['Oat milk',.6,['Coffee','Tea']]];         // [name, price, categories it applies to]
let inflight=0;   // items still flying to the cart. The badge counts them once they land
const money=n=>'$'+n.toFixed(2);
const parse=k=>{const [i,s,a]=k.split(':').map(Number);return{i,s,a}};
function unit(k){const {i,s,a}=parse(k), m=MENU[i]; return m[1]+(m[2]==='Pastry'?0:SIZES[s][1])+ADDONS.reduce((t,o,j)=>t+(a>>j&1?o[1]:0),0)}
function label(k){const {i,s,a}=parse(k), m=MENU[i], x=[]; if(m[2]!=='Pastry'&&s!==1)x.push(SIZES[s][0]); ADDONS.forEach((o,j)=>{if(a>>j&1)x.push(o[0])}); return m[0]+(x.length?' ('+x.join(', ')+')':'')}
function totals(){let n=0,t=0; for(const k in cart){n+=cart[k];t+=cart[k]*unit(k)} return{n,t}}
function drawCart(){
  const {n,t}=totals();
  const rows=Object.keys(cart).map(k=>`<li data-k="${k}"><span>${label(k)}</span><span class="qty"><button data-q="-1" data-k="${k}" aria-label="Remove one">&minus;</button><b>${cart[k]}</b><button data-q="1" data-k="${k}" aria-label="Add one"${cart[k]>=MAXQ?' disabled':''}>+</button></span><span class="price">${money(cart[k]*unit(k))}</span></li>`).join('');
  store.set('oc-cart',JSON.stringify(cart));   // the cart survives a refresh
  $('#count').textContent=Math.max(0,n-inflight);
  cartEl.innerHTML=`<h3>Your order</h3>`+(n?`<ul>${rows}</ul><div class="tot"><span>Total ${money(t)}</span><button class="btn" id="clear" style="padding:8px 16px;font-size:13px;background:var(--surface2)">Clear</button></div><button class="btn solid" id="place" style="width:100%;justify-content:center;margin-top:12px">Place order</button>`:`<p class="empty">Nothing yet. Tap + on any item.</p>`);
}
function bump(){const ob=$('#orderBtn'); ob.classList.remove('bump'); void ob.offsetWidth; ob.classList.add('bump')}
function showNav(){nav.classList.remove('hide');blur.classList.remove('slim');navLock=Date.now()+1100}
// adds one item right away (cart state is always correct), then plays the flight. The badge updates when it lands
function addToCart(k,from){
  if((cart[k]||0)>=MAXQ) return;
  cart[k]=(cart[k]||0)+1;
  if(reduceMotion||$$('.fly').length>=8){drawCart();bump();return}
  inflight++; drawCart(); showNav();
  fly(from,MENU[parse(k).i],()=>{inflight--;drawCart();bump()});
}
// the flying thumbnail: curved path, small pull-back first, stretches with speed, shrinks into the cart icon
function fly(from,m,done){
  const r=from.getBoundingClientRect(), el=document.createElement('div');
  el.className='fly'; el.style.setProperty('--h',m[4]); el.innerHTML=art(m);
  document.body.appendChild(el);
  const x0=r.left+r.width/2, y0=r.top+r.height/2, t0=performance.now(), D=600;
  let px=x0, py=y0;
  (function step(now){
    const t=Math.min(1,(now-t0)/D), tr=$('#orderBtn').getBoundingClientRect();
    const x2=tr.left+tr.width/2, y2=tr.top+tr.height/2;   // target is read every frame, so scrolling or the nav sliding in can't break it
    const cx=x0+(x2-x0)*.15, cy=Math.min(y0,y2)-90;       // curve control point
    const e=t*t*(2.7*t-1.7), u=1-e;                        // ease-in-back: tiny pull-back, then it accelerates
    const x=u*u*x0+2*u*e*cx+e*e*x2, y=u*u*y0+2*u*e*cy+e*e*y2;
    const v=Math.min(1,Math.hypot(x-px,y-py)/40), a=Math.atan2(y-py,x-px)*180/Math.PI, s=1-.6*Math.min(1,e);
    el.style.transform=`translate(${x-20}px,${y-20}px) rotate(${a}deg) scale(${s*(1+.5*v)},${s*(1-.25*v)}) rotate(${-a}deg)`;
    el.style.opacity=t>.88?(1-t)/.12:1;
    el.style.filter='blur('+(v*2.2).toFixed(1)+'px)';   // motion blur, stronger the faster it moves
    px=x; py=y;
    if(t<1)requestAnimationFrame(step); else{el.remove();done()}
  })(t0);
}
const onCardClick=e=>{
  const f=e.target.closest('.fav'); if(f){toggleFav(+f.dataset.fav);return}
  const b=e.target.closest('.add'), card=e.target.closest('.card');
  if(b){
    // liquid squish: squashes wide, stretches tall, then settles
    b.animate([{transform:'scale(1)'},{transform:'scale(1.3,.75)',offset:.2},{transform:'scale(.82,1.25)',offset:.45},{transform:'scale(1.08,.94)',offset:.7},{transform:'scale(1)'}],{duration:420,easing:'ease-out'});
    addToCart(b.dataset.i+':1:0',b);   // the flight starts at the + button
  }else if(card) openModal(+card.dataset.i,card);
};
[grid,grid2].forEach(g=>g.addEventListener('click',onCardClick));
[grid,grid2].forEach(g=>g.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('card'))openModal(+e.target.dataset.i,e.target)}));
$('#orderBtn').addEventListener('click',e=>{$('#menuPop').classList.remove('open');const o=cartEl.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});
let removing=false;   // true while rows animate out. Clicks are ignored so the cart can't get out of sync
function removeRows(keys,done){   // plays the exit animation, then runs done() to really remove the items
  const rows=keys.map(k=>cartEl.querySelector('li[data-k="'+k+'"]')).filter(Boolean);
  if(reduceMotion||!rows.length){done();return}
  removing=true;
  rows.forEach((r,i)=>{r.style.animationDelay=(i*50)+'ms';r.classList.add('leaving')});
  setTimeout(()=>{done();removing=false},230+(rows.length-1)*50);
}
cartEl.addEventListener('click',e=>{
  if(removing) return;
  if(e.target.id==='clear'){cartEl.classList.add('clearing');removeRows(Object.keys(cart),()=>{for(const k in cart)delete cart[k];cartEl.classList.remove('clearing');drawCart()});return}
  if(e.target.id==='place'){cartEl.classList.remove('open');openCheckout();return}
  const q=e.target.closest('[data-q]'); if(!q) return;
  const k=q.dataset.k, n=(cart[k]||0)+Number(q.dataset.q);
  if(n<=0){removeRows([k],()=>{delete cart[k];drawCart()});return}
  cart[k]=Math.min(MAXQ,n); drawCart();
});
const pop=$('#menuPop'), moreBtn=$('#moreBtn');
moreBtn.addEventListener('click',()=>{const o=pop.classList.toggle('open');moreBtn.setAttribute('aria-expanded',o);cartEl.classList.remove('open')});
document.addEventListener('click',e=>{if(!e.target.isConnected)return;if(!e.target.closest('.order'))cartEl.classList.remove('open');if(!e.target.closest('.more')){pop.classList.remove('open');moreBtn.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){pop.classList.remove('open');cartEl.classList.remove('open');closeModal();closeCheckout();closeSearch();closeKeys();closeLightbox()}});
try{const saved=JSON.parse(store.get('oc-cart')||'{}'); for(const k in saved){const {i,s,a}=parse(k); if(MENU[i]&&s>=0&&s<=2&&a>=0&&a<4&&saved[k]>0)cart[k]=Math.min(MAXQ,saved[k]|0)}}catch(e){}
drawCart();

/* drink popup */
const modal=$('#modal'); let modalI=0, modalFrom=null, mSize=1, mAdds=0;
const lock=on=>root.classList.toggle('lock',on);   // stops the page scrolling behind a popup
const modalKey=()=>modalI+':'+mSize+':'+mAdds;
const updModal=()=>{$('#mPrice').textContent=money(unit(modalKey()))};
function openModal(i,from){
  const m=MENU[i]; modalI=i; modalFrom=from; mSize=1; mAdds=0;
  $('#mImg').style.setProperty('--h',m[4]); $('#mImg').innerHTML=art(m);
  $('#mTitle').textContent=m[0]; $('#mMeta').textContent=m[2]+', rated '+m[5]; $('#mDesc').textContent=m[6];
  $('#mOpts').style.display=m[2]==='Pastry'?'none':'';
  $$('#mSizes button').forEach(b=>b.classList.toggle('on',b.dataset.s==='1'));
  $('#mAdds').innerHTML=ADDONS.map((o,j)=>o[2].includes(m[2])?`<button class="tog" data-j="${j}" aria-pressed="false">${o[0]} +${money(o[1])}</button>`:'').join('');
  updModal(); slide($('#mSizes')); lock(true); drawPair(i); setDrinkHash(i);
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); $('#mClose').focus();
}
function closeModal(){
  if(!modal.classList.contains('open')) return;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); lock(false); clearDrinkHash();
  if(modalFrom) modalFrom.focus({preventScroll:true});
}
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
$('#mClose').addEventListener('click',closeModal);
$('#mSizes').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; mSize=+b.dataset.s; $$('#mSizes button').forEach(x=>x.classList.toggle('on',x===b)); slide($('#mSizes')); updModal()});
$('#mAdds').addEventListener('click',e=>{const b=e.target.closest('.tog'); if(!b) return; const j=+b.dataset.j; mAdds^=1<<j; b.setAttribute('aria-pressed',String(!!(mAdds>>j&1))); updModal()});
$('#mAdd').addEventListener('click',()=>{addToCart(modalKey(),$('#mAdd'));setTimeout(closeModal,140)});
let icsUrl='';
$('#resForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target, start=new Date(f.date.value+'T'+f.time.value), end=new Date(start.getTime()+90*60000), link=$('#icsLink');
  const z=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  if(icsUrl) URL.revokeObjectURL(icsUrl);
  if(isNaN(start)){link.style.display='none'}
  else{   // a calendar file for the reservation request
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Oreos Cafe//EN','BEGIN:VEVENT','UID:'+Date.now()+'@oreoscafe','DTSTAMP:'+z(new Date()),'DTSTART:'+z(start),'DTEND:'+z(end),"SUMMARY:Table at Oreo's Cafe",'LOCATION:12 Garden Road','DESCRIPTION:Reservation request for '+f.guests.value+'. Confirmed only after the cafe contacts you.','END:VEVENT','END:VCALENDAR'].join('\r\n');
    icsUrl=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); link.href=icsUrl; link.style.display='';
  }
  f.reset(); const ok=$('#resOk'); ok.classList.remove('show'); void ok.offsetWidth; ok.classList.add('show');
});

/* search: icon in the nav pill, or Ctrl K. Arrow keys + Enter, or click a result */
const sr=$('#sr'), srIn=$('#srIn'), srList=$('#srList'); let srSel=0, srHits=[];
function srDraw(){
  const q=srIn.value.trim().toLowerCase();
  srHits=MENU.map((m,i)=>i).filter(i=>!q||(MENU[i][0]+' '+MENU[i][2]+' '+MENU[i][6]).toLowerCase().includes(q)).slice(0,6); srSel=0;
  srList.innerHTML=srHits.length?srHits.map((i,n)=>`<li data-i="${i}" class="${n?'':'sel'}"><span class="em" style="--h:${MENU[i][4]}">${MENU[i][3]}</span>${MENU[i][0]}<small>${MENU[i][2]}, ${money(MENU[i][1])}</small></li>`).join(''):'<li class="srempty">No drinks found</li>';
}
function openSearch(){closeModal(); sr.classList.add('open'); sr.setAttribute('aria-hidden','false'); lock(true); srIn.value=''; srDraw(); srIn.focus()}
function closeSearch(){if(!sr.classList.contains('open')) return; sr.classList.remove('open'); sr.setAttribute('aria-hidden','true'); lock(false)}
function srPick(i){closeSearch(); openModal(i,null)}
$('#srBtn').addEventListener('click',openSearch);
sr.addEventListener('click',e=>{if(e.target===sr)closeSearch()});
srIn.addEventListener('input',srDraw);
srIn.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&srHits.length) srPick(srHits[srSel]);
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    e.preventDefault(); srSel=(srSel+(e.key==='ArrowDown'?1:-1)+srHits.length)%(srHits.length||1);
    srList.querySelectorAll('li').forEach((li,n)=>li.classList.toggle('sel',n===srSel));
  }
});
srList.addEventListener('click',e=>{const li=e.target.closest('li[data-i]'); if(li)srPick(+li.dataset.i)});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});

/* checkout (fake: nothing is charged, stored or sent anywhere) */
const co=$('#co'), coBody=$('#coBody'); let paying=false;
function showCo(html){coBody.innerHTML=html; coBody.classList.remove('swapin'); void coBody.offsetWidth; coBody.classList.add('swapin')}
const lines=()=>Object.keys(cart).map(k=>`<li><span>${cart[k]} x ${label(k)}</span><span>${money(cart[k]*unit(k))}</span></li>`).join('');
function openCheckout(){
  const {t}=totals(); if(!t) return;
  showCo(`<h3>Checkout</h3>
  <div class="ccard"><div class="cchip"></div><div class="cnum" id="pvNum">•••• •••• •••• ••••</div><div class="crow"><span id="pvName">YOUR NAME</span><span id="pvExp">MM/YY</span></div></div>
  <ul class="sum">${lines()}</ul><div class="sumrow"><span>Total</span><strong>${money(t)}</strong></div>
  <form class="form" id="payForm">
    <label class="full">Name on card<input id="cName" autocomplete="off" required></label>
    <label class="full">Card number<input id="cNum" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" pattern="\\d{4} \\d{4} \\d{4} \\d{4}" title="16 digits" required></label>
    <label>Expiry<input id="cExp" placeholder="MM/YY" autocomplete="off" pattern="(0[1-9]|1[0-2])/\\d{2}" title="MM/YY" required></label>
    <label>CVC<input id="cCvc" inputmode="numeric" autocomplete="off" placeholder="123" pattern="\\d{3}" title="3 digits" required></label>
    <p class="note full">Demo only. Nothing is charged or saved. Please don't type a real card number.</p>
    <button class="btn solid full" type="submit">Pay ${money(t)}</button>
  </form>`);
  co.classList.add('open'); co.setAttribute('aria-hidden','false'); lock(true); $('#cName').focus();
}
function closeCheckout(){
  if(paying||!co.classList.contains('open')) return;
  co.classList.remove('open'); co.setAttribute('aria-hidden','true'); lock(false);
}
coBody.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='cNum')t.value=t.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  if(t.id==='cExp'){const v=t.value.replace(/\D/g,'').slice(0,4); t.value=v.length>2?v.slice(0,2)+'/'+v.slice(2):v}
  if(t.id==='cCvc')t.value=t.value.replace(/\D/g,'').slice(0,3);
  if(!$('#pvNum')) return;   // live preview on the card
  $('#pvNum').textContent=$('#cNum').value.replace(/\D/g,'').padEnd(16,'•').replace(/(.{4})/g,'$1 ').trim();
  $('#pvName').textContent=($('#cName').value||'YOUR NAME').toUpperCase();
  $('#pvExp').textContent=$('#cExp').value||'MM/YY';
});
coBody.addEventListener('submit',e=>{
  e.preventDefault(); if(paying) return; paying=true;
  const last4=$('#cNum').value.slice(-4), {t}=totals(), items=lines();
  showCo(`<div class="proc"><div class="spin"></div><p>Processing payment...</p></div>`);
  setTimeout(()=>{
    const no='OC-'+(1000+Math.floor(Math.random()*9000)), stampMsg=addStamp();
    showCo(`<div class="proc"><svg class="okmark" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 14-16"/></svg><h3>Order placed</h3><p class="mmeta" id="trTxt">Order ${no}. Order placed.</p></div><ol class="otrack" id="otrack"><li class="on">Placed</li><li>Preparing</li><li>Ready</li></ol><p class="stampnote">${stampMsg}</p><ul class="sum">${items}</ul><div class="sumrow"><span>Paid with card ending ${last4}</span><strong>${money(t)}</strong></div><button class="btn solid" id="coDone" style="width:100%;justify-content:center;margin-top:18px">Done</button>`);
    for(const k in cart)delete cart[k]; drawCart(); paying=false; trackOrder();
  },1500);
});
coBody.addEventListener('click',e=>{if(e.target.id==='coDone')closeCheckout()});
co.addEventListener('click',e=>{if(e.target===co)closeCheckout()});
$('#coClose').addEventListener('click',closeCheckout);

/* light / dark button in the hero */
$('#themeBtn').addEventListener('click',()=>{
  const cur=root.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'espresso':'paper');
  setTheme(['paper','snow'].includes(cur)?'espresso':'paper');
});

/* themes */
$('#sws').innerHTML=THEMES.map(t=>`<button class="sw" data-t="${t[0]}" aria-pressed="false" style="background:${t[2]};color:${t[4]}"><span class="mini" style="background:${t[3]}"><i></i><u></u></span>${t[1]}</button>`).join('');
$('#dots').innerHTML=ACCENTS.map(c=>`<button data-c="${c}" aria-pressed="false" aria-label="Accent ${c}" style="background:${c}"></button>`).join('');
const sysSw=$('#sysSw');
function mark(){
  const t=root.dataset.theme||null;
  const eff=t||(matchMedia('(prefers-color-scheme:dark)').matches?'espresso':'paper');   // follow-system still highlights the theme in use
  $$('.sw').forEach(s=>s.setAttribute('aria-pressed',String(s.dataset.t===eff)));
  sysSw.setAttribute('aria-checked',String(!t));
  const a=root.style.getPropertyValue('--accent');
  $$('#dots button').forEach(d=>d.setAttribute('aria-pressed',String(d.dataset.c===a)));
}
function setTheme(t){
  root.style.removeProperty('--accent'); store.del('oc-accent2');
  if(t){root.dataset.theme=t;store.set('oc-theme2',t)}else{delete root.dataset.theme;store.set('oc-theme2','system')}
  mark(); setHero();
}
$('#sws').addEventListener('click',e=>{const b=e.target.closest('.sw'); if(b) setTheme(b.dataset.t)});
sysSw.addEventListener('click',()=>{ if(root.dataset.theme) setTheme(null); else setTheme(matchMedia('(prefers-color-scheme:dark)').matches?'espresso':'paper'); });
$('#dots').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; root.style.setProperty('--accent',b.dataset.c); store.set('oc-accent2',b.dataset.c); mark();});
const st=store.get('oc-theme2'), sa=store.get('oc-accent2');
if(st==='system') delete root.dataset.theme; else if(st) root.dataset.theme=st;
if(sa) root.style.setProperty('--accent',sa);
mark();

/* top bar: always visible, the glass gets thicker as you scroll */
const nav=$('#nav'), blur=$('#blur'); let last=0, tick=false, curIdx=0, lastSc=-1, navLock=0;
const spy=$$('#links a'), secs=spy.map(a=>$(a.getAttribute('href')));
function onScroll(){
  const y=window.scrollY;
  last=y;
  const sc=Math.min(1,y/240);   // nav glass gets thicker as you scroll (see --sc in style.css)
  if(Math.abs(sc-lastSc)>.02||sc===0||sc===1){lastSc=sc;nav.style.setProperty('--sc',sc.toFixed(2))}
  let cur=0; secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<window.innerHeight*.4)cur=i});
  if(cur!==curIdx&&!document.body.classList.contains('v-settings')&&!document.body.classList.contains('v-menu')){curIdx=cur;spy.forEach((a,i)=>a.classList.toggle('on',i===cur));moveSlider()}
  tick=false;
}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});

/* sliding pill, used by the nav and every .filters group */
function slide(box){
  const s=box.querySelector('.slider'), a=box.querySelector('a.on,button.on');
  if(!s) return;
  if(!a||!a.offsetWidth){s.style.opacity=0;return}
  if(!s.dataset.ready)s.style.transition='none';
  const x=a.offsetLeft, dx=x-(s._x||0); s._x=x;
  if(s.dataset.ready&&!reduceMotion&&Math.abs(dx)>2)   // motion blur: smears while it travels, then sharpens
    s.animate([{filter:'blur(0px)'},{filter:'blur('+Math.min(3,1+Math.abs(dx)/50).toFixed(1)+'px)',offset:.35},{filter:'blur(0px)'}],{duration:450,easing:'ease-out'});
  s.style.opacity=1;s.style.width=a.offsetWidth+'px';s.style.transform='translateX('+x+'px)';
  if(!s.dataset.ready){void s.offsetWidth;s.style.transition='';s.dataset.ready=1}
}
function moveSlider(){$$('.links,.filters').forEach(slide)}
addEventListener('resize',moveSlider);addEventListener('load',moveSlider);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(moveSlider);

/* pages: home and settings */
$$('#menuPop .it').find(b=>b.textContent.trim().startsWith('Settings')).addEventListener('click',()=>{pop.classList.remove('open');location.hash='#/settings'});
$$('.switch.dummy').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'))));
/* text size: saved, applied through data-ts on <html> (see --ts in style.css). Click or drag across the pill */
function setSize(s){
  root.dataset.ts=s; store.set('oc-ts',s);
  $$('#sizes button').forEach(x=>x.classList.toggle('on',x.dataset.s===s));
  slide($('#sizes')); setTimeout(moveSlider,350);   // buttons resize while the text eases
}
let dragging=false;
const pick=e=>{const b=$$('#sizes button').find(x=>{const r=x.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right}); if(b&&!b.classList.contains('on'))setSize(b.dataset.s)};
$('#sizes').addEventListener('pointerdown',e=>{dragging=true;pick(e)});
addEventListener('pointermove',e=>{if(dragging)pick(e)});
addEventListener('pointerup',()=>{dragging=false});
addEventListener('pointercancel',()=>{dragging=false});
$('#sizes').addEventListener('click',e=>{const b=e.target.closest('button'); if(b)setSize(b.dataset.s)});
setSize(store.get('oc-ts')||'medium');
const VIEWS={'#/settings':'v-settings','#/menu':'v-menu'};   // pages besides the home page
const viewOf=()=>VIEWS[location.hash]||'';
function applyRoute(){
  const dm=location.hash.match(/^#\/drink\/(.+)$/);   // a shared link to one drink
  if(dm){const i=MENU.findIndex(m=>slug(m)===dm[1]); if(i>=0&&!(modal.classList.contains('open')&&modalI===i))openModal(i,null); moveSlider(); return}
  const h=location.hash, v=viewOf();
  document.body.classList.remove('v-settings','v-menu'); if(v)document.body.classList.add(v);
  nav.classList.remove('hide');blur.classList.remove('slim');
  if(v){window.scrollTo(0,0);spy.forEach(a=>a.classList.toggle('on',v==='v-menu'&&a.getAttribute('href')==='#menu'));curIdx=-1}
  else{
    const t=h.length>1?document.getElementById(h.slice(1)):null;
    if(t)t.scrollIntoView();else window.scrollTo(0,0);
    curIdx=-1;onScroll();
  }
  moveSlider();
}
let routed=false;
function route(){
  const main=$('main'), cur=['v-settings','v-menu'].find(c=>document.body.classList.contains(c))||'';
  if(routed&&viewOf()!==cur){
    main.classList.add('fade');
    setTimeout(()=>{applyRoute();main.classList.remove('fade')},180);
  }else applyRoute();
  routed=true;
}
addEventListener('hashchange',route);

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);setTimeout(()=>{en.target.style.transitionDelay=''},900)}}),{threshold:.12});
$$('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*60+'ms';io.observe(el)});
route();
/* hero photo follows the theme: images/hero-<theme>.jpg, then images/hero.jpg, then the emoji. Add or swap photos in the images folder */
const heroBg=$('.hero-bg'); let heroSrc='';
function setHero(){
  const t=root.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'espresso':'paper');
  const list=['images/hero-'+t+'.jpg','images/hero.jpg'];
  (function tryNext(i){
    if(i>=list.length||list[i]===heroSrc) return;
    const img=new Image(); img.alt=''; img.decoding='async'; img.className='hero-photo';
    img.onload=()=>{
      if(list[i]===heroSrc) return;
      heroSrc=list[i]; heroBg.appendChild(img);
      requestAnimationFrame(()=>img.classList.add('in'));
      setTimeout(()=>heroBg.querySelectorAll('.hero-photo').forEach(o=>{if(o!==img)o.remove()}),700);
    };
    img.onerror=()=>tryNext(i+1);
    img.src=list[i];
  })(0);
}
setHero();

/* performance mode: turns off blur and glass (see data-perf in style.css). Saved, and switched on automatically for low-end devices */
const perfSw=$('#perfSw');
const syncPerf=()=>perfSw.setAttribute('aria-checked',String(root.dataset.perf==='on'));
perfSw.addEventListener('click',()=>{const on=root.dataset.perf!=='on'; root.dataset.perf=on?'on':'off'; store.set('oc-perf',on?'1':'0'); syncPerf()});
syncPerf();
/* ===== extras ===== */
const toastEl=$('#toast'); let toastT;
function toast(msg){toastEl.textContent=msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>toastEl.classList.remove('show'),2800)}

/* favorites (heart on every card, saved in this browser) */
function toggleFav(i){
  const n=MENU[i][0], on=!favs.has(n); on?favs.add(n):favs.delete(n);
  store.set('oc-favs',JSON.stringify([...favs]));
  document.querySelectorAll('.fav[data-fav="'+i+'"]').forEach(f=>{f.setAttribute('aria-pressed',String(on));f.classList.remove('pulse');void f.offsetWidth;f.classList.add('pulse')});
  ['#filters','#filters2'].forEach(q=>{const b=$(q+' button.on'); if(b&&b.dataset.f==='Saved') b.click()});   // refresh the Saved view
}

/* "Open now" chip uses the real time (8am to 1am) and today's row in the hours list */
function updOpen(){const h=new Date().getHours(), open=h>=8||h<1; $('#openTxt').textContent=open?'Open now':'Closed, opens at 8am'; $('#openDot').style.background=open?'#4ec27a':'#d9604c'}
updOpen(); setInterval(updOpen,60000);
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
$('#hours').innerHTML=DAYS.map((d,n)=>`<li class="${n===new Date().getDay()?'today':''}"><span>${d}</span><span>8am to 1am</span></li>`).join('');

/* goes well with: one tap pairing in the drink popup */
function drawPair(i){
  const want=MENU[i][2]==='Pastry'?'Coffee':'Pastry', pool=MENU.map((x,k)=>k).filter(k=>MENU[k][2]===want);
  if(!pool.length){$('#mPair').innerHTML='';return}
  const k=pool[i%pool.length], p=MENU[k];
  $('#mPair').innerHTML=`<span>Goes well with</span><button class="pairbtn" data-k="${k}"><span class="pe">${p[3]}</span>${p[0]}<small>${money(p[1])}</small><b>+</b></button>`;
}
$('#mPair').addEventListener('click',e=>{
  const b=e.target.closest('.pairbtn'); if(!b) return;
  b.animate([{transform:'scale(1)'},{transform:'scale(1.12,.88)',offset:.3},{transform:'scale(.94,1.08)',offset:.6},{transform:'scale(1)'}],{duration:360,easing:'ease-out'});
  addToCart(b.dataset.k+':1:0',b);
});

/* each drink has its own link (#/drink/oat-latte) and a share button */
function setDrinkHash(i){try{if(!location.hash.startsWith('#/drink/'))prevHash=location.hash; history.replaceState(null,'',location.pathname+location.search+'#/drink/'+slug(MENU[i]))}catch(e){}}
function clearDrinkHash(){try{if(location.hash.startsWith('#/drink/'))history.replaceState(null,'',location.pathname+location.search+prevHash)}catch(e){}}
$('#mShare').addEventListener('click',()=>{
  const m=MENU[modalI], url=location.href.split('#')[0]+'#/drink/'+slug(m);
  if(navigator.share) navigator.share({title:m[0]+" at Oreo's Cafe",url}).catch(()=>{});
  else if(navigator.clipboard) navigator.clipboard.writeText(url).then(()=>toast('Link copied'),()=>toast(url));
  else toast(url);
});

/* loyalty card: every fake order earns a stamp, 10 stamps = free drink */
const stampCount=()=>+store.get('oc-stamps')||0;
function drawStamps(){
  const n=stampCount(), k=n%10||(n?10:0);
  $('#stamps').innerHTML=Array.from({length:10},(_,i)=>`<span class="${i<k?'on':''}">☕</span>`).join('');
  $('#stampTxt').textContent=n&&n%10===0?'Free drink unlocked! Show this at the counter.':k+' of 10 stamps. Every order earns one.';
}
function addStamp(){const n=stampCount()+1; store.set('oc-stamps',String(n)); drawStamps(); return n%10===0?'Stamp 10 of 10: free drink unlocked!':'Stamp card: '+(n%10)+' of 10'}
drawStamps();

/* order tracker on the receipt: Placed, then Preparing, then Ready */
function trackOrder(){
  const msg=['Preparing your order...','Ready for pickup!'];
  [2200,4800].forEach((ms,n)=>setTimeout(()=>{
    const t=$('#otrack'); if(!t||!co.classList.contains('open')) return;
    t.querySelectorAll('li').forEach((li,k)=>li.classList.toggle('on',k<=n+1));
    const x=$('#trTxt'); if(x) x.textContent=msg[n];
  },ms));
}

/* photo gallery with a lightbox (images/gallery-1.jpg to gallery-6.jpg, emoji until you add them) */
const GALLERY=[['☕','Morning pour',28],['🥐','Fresh from the oven',38],['🪴','The window seats',110],['🎶','Late night sessions',250],['🍰','Slice of the day',335],['🌙','Open till 1am',230]];
$('#gal').innerHTML=GALLERY.map((g,n)=>`<button class="gtile" data-g="${n}" style="--h:${g[2]}" aria-label="${g[1]}">${g[0]}<img src="images/gallery-${n+1}.jpg" alt=""><span class="gcap">${g[1]}</span></button>`).join('');
const lb=$('#lb'); let lbI=0;
function lbShow(n){lbI=(n+GALLERY.length)%GALLERY.length; const g=GALLERY[lbI]; $('#lbImg').style.setProperty('--h',g[2]); $('#lbImg').innerHTML=g[0]+`<img src="images/gallery-${lbI+1}.jpg" alt="">`; $('#lbCap').textContent=g[1]}
function openLightbox(n){lbShow(n); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); lock(true); $('#lbClose').focus()}
function closeLightbox(){if(!lb.classList.contains('open')) return; lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); lock(false)}
$('#gal').addEventListener('click',e=>{const t=e.target.closest('.gtile'); if(t)openLightbox(+t.dataset.g)});
$('#lbClose').addEventListener('click',closeLightbox);
$('#lbPrev').addEventListener('click',()=>lbShow(lbI-1));
$('#lbNext').addEventListener('click',()=>lbShow(lbI+1));
lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});
document.addEventListener('keydown',e=>{if(lb.classList.contains('open')){if(e.key==='ArrowLeft')lbShow(lbI-1); if(e.key==='ArrowRight')lbShow(lbI+1)}});

/* reviews strip (placeholder reviews, edit the text here) */
const REVIEWS=[['Ayesha K.','The oat latte is the best I have had. Cozy, quiet and always warm.'],['Daniel R.','Croissants are out by six and they are unreal. My new morning stop.'],['Mina S.','Perfect for late night study sessions. Great Wi-Fi and comfy chairs.'],['Omar T.','The cold brew is smooth and strong. Staff remembered my order on day two.'],['Lena P.','Matcha latte, window seat, rain outside. Does not get better.'],['Hamza A.','Friendly team and the cheesecake is dangerous. Booked a table for my birthday.']];
$('#revTrack').innerHTML=[...REVIEWS,...REVIEWS].map(r=>`<figure class="rev"><div class="stars" aria-label="5 stars">★★★★★</div><blockquote>${r[1]}</blockquote><figcaption>${r[0]}</figcaption></figure>`).join('');

/* keyboard shortcuts panel, plus / and ? keys */
const ks=$('#ks');
function openKeys(){closeModal(); ks.classList.add('open'); ks.setAttribute('aria-hidden','false'); lock(true); $('#ksClose').focus()}
function closeKeys(){if(!ks.classList.contains('open')) return; ks.classList.remove('open'); ks.setAttribute('aria-hidden','true'); lock(false)}
$('#ksClose').addEventListener('click',closeKeys);
ks.addEventListener('click',e=>{if(e.target===ks)closeKeys()});
document.addEventListener('keydown',e=>{
  const tag=document.activeElement&&document.activeElement.tagName;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(tag)||e.ctrlKey||e.metaKey||e.altKey) return;
  if(e.key==='/'){e.preventDefault();openSearch()}
  if(e.key==='?'){e.preventDefault();openKeys()}
});

/* three-dot menu items that do something now */
function surprise(){   // scrolls to a random drink and highlights it
  const go=()=>{const list=[...grid.querySelectorAll('.card:not(.hidden)')], c=list[Math.floor(Math.random()*list.length)]; if(!c) return; c.scrollIntoView({block:'center',behavior:'smooth'}); c.classList.remove('spot'); void c.offsetWidth; c.classList.add('spot'); setTimeout(()=>c.classList.remove('spot'),1800)};
  if(document.body.classList.contains('v-settings')||document.body.classList.contains('v-menu')){location.hash='#menu'; setTimeout(go,550)} else go();
}
let installEvt=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault(); installEvt=e});
function installApp(){if(installEvt){installEvt.prompt(); installEvt=null} else toast('To install: open your browser menu and choose Install app or Add to Home Screen')}
const MENU_ACTIONS={
  'Categories':()=>{location.hash='#/menu'},
  'Best sellers':()=>{location.hash='#/menu'; setTimeout(()=>{const b=$('#filters2 [data-f="Top"]'); if(b)b.click()},450)},
  'Surprise me':surprise, 'Install app':installApp, 'Keyboard shortcuts':openKeys
};
$$('#menuPop .it').forEach(b=>{
  const k=Object.keys(MENU_ACTIONS).find(n=>b.textContent.trim().startsWith(n));
  if(k) b.addEventListener('click',()=>{pop.classList.remove('open'); moreBtn.setAttribute('aria-expanded','false'); MENU_ACTIONS[k]()});
});
if(typeof navigator!=='undefined'&&'serviceWorker' in navigator&&(location.protocol||'').startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

/* a photo that fails to load is removed so the emoji underneath shows */
document.addEventListener('error',e=>{if(e.target.tagName==='IMG')e.target.remove()},true);
$$('img').forEach(i=>{if(i.complete&&!i.naturalWidth)i.remove()});
