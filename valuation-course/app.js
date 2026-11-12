/* The Young Investor's Guide
   Plain JavaScript, no build step. Course text lives in MISSIONS, QUIZ, GLOSSARY below. */
(() => {
'use strict';

/* ================= helpers and saved progress ================= */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, attrs = {}, html = '') => { const n = document.createElement(tag); for (const k in attrs) { if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]); } if (html) n.innerHTML = html; return n; };
const eur = n => '€' + Math.round(n).toLocaleString('en-GB');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY = 'pelykh.course.v2';
let S = { done: {}, got: {}, lemons: 0, name: '', pitch: {}, best: 0 };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const track = (name, props) => { try { if (window.plausible) window.plausible(name, { props }); } catch (e) {} };

function purse(bump) {
  const p = $('#purse'); p.textContent = '🍋 ' + S.lemons;
  if (bump) { p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
}
// each reward can be earned once, so replaying a mission is free practice
function award(key, n = 1) { if (S.got[key]) return; S.got[key] = 1; S.lemons += n; save(); purse(true); }
const g = (key, text) => `<button type="button" class="g" data-g="${key}">${text || key}</button>`;

/* ================= glossary ================= */
const GLOSSARY = {
  'cash flow': 'The real money that comes in minus the real money that goes out. Not promises, not paper profit: cash.',
  'comparable': 'A similar business you can compare with. Two sneaker brands are comparable. A sneaker brand and a car maker are not.',
  'compounding': 'When the money you earn starts earning money too. It snowballs: slow at first, then surprisingly fast.',
  'DCF': 'Discounted cash flow. Guess the cash a business will make each year, shrink each amount back to today, and add it all up.',
  'discount rate': 'How fast future money shrinks when you bring it back to today. It is roughly the yearly return you could get somewhere else. Riskier promise, higher rate.',
  'earnings': 'Another word for profit: what is left after a business pays all its costs.',
  'expectations': 'What most investors already believe will happen. Prices already include it.',
  'growth rate': 'How much bigger something gets each year, as a percentage. From €100 to €120 is 20% growth.',
  'guidance': 'A company’s own forecast of how it will do next. Investors listen to it very closely.',
  'intrinsic value': 'What something is worth because of the cash it will make for its owner, whatever the price tag says.',
  'market value': 'What people are paying for something right now.',
  'moat': 'A lasting advantage that keeps rivals away, like a brand people love or a secret recipe.',
  'multiple': 'A shortcut: price divided by something simple, usually profit. "10 times profit" is a multiple.',
  'noise': 'News that sounds exciting but does not change the cash a business will make.',
  'P/E': 'Price divided by earnings. A P/E of 20 means people pay €20 for every €1 of yearly profit.',
  'personal value': 'What something is worth to you in particular. Real, but nobody else has to agree.',
  'present value': 'What a future amount of money is worth today, after shrinking it with the discount rate.',
  'price': 'The number on the tag: what you have to hand over.',
  'profit': 'Money in minus money out.',
  'revenue': 'All the money that comes in from sales, before paying any costs.',
  'rule of 72': 'A mental trick: 72 divided by the yearly growth rate is roughly how many years it takes to double.',
  'signal': 'News that really changes how much cash a business will make, and for a long time.',
  'terminal value': 'One number that stands for all the years after your forecast ends. It is usually the biggest and wobbliest part of a DCF.',
  'value': 'What something is really worth. For investors: the cash it will bring its owner over time.'
};
let pop = null;
document.addEventListener('click', e => {
  if (pop) { pop.remove(); pop = null; }
  const b = e.target.closest('.g'); if (!b) return;
  const k = b.dataset.g, r = b.getBoundingClientRect();
  pop = el('div', { class: 'gpop', role: 'tooltip' }, `<b>${k}</b>${GLOSSARY[k] || ''}`);
  document.body.appendChild(pop);
  const w = pop.offsetWidth;
  pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left)) + scrollX + 'px';
  pop.style.top = r.bottom + scrollY + 8 + 'px';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && pop) { pop.remove(); pop = null; } });

/* ================= the stand, which grows as missions are finished ================= */
function stand(level) {
  const L = n => level >= n ? '' : 'display:none';
  const stripes = (x, y, w, h, n, a, b) => Array.from({ length: n }, (_, i) => `<rect x="${x + i * w / n}" y="${y}" width="${w / n + .5}" height="${h}" fill="${i % 2 ? a : b}"/>`).join('');
  const person = (x, c, hgt) => `<g><rect x="${x - 13}" y="${250 - hgt}" width="26" height="${hgt}" rx="13" fill="${c}" stroke="#1f2440" stroke-width="3"/><circle cx="${x}" cy="${238 - hgt}" r="12" fill="#ffe0c2" stroke="#1f2440" stroke-width="3"/></g>`;
  return `<svg class="stand" viewBox="0 0 440 300" role="img" aria-label="Your lemonade stand, upgrade level ${level} of 7">
  <ellipse cx="220" cy="262" rx="215" ry="26" fill="#12805c"/>
  <g style="${L(6)}">${person(372, '#ff5d8a', 46)}${person(402, '#dff1ff', 58)}${person(344, '#ffd93b', 38)}</g>
  <g style="${L(1)}"><rect x="96" y="62" width="8" height="186" fill="#1f2440"/><rect x="316" y="62" width="8" height="186" fill="#1f2440"/>
    <clipPath id="aw"><path d="M78 50h264l14 44q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0z"/></clipPath>
    <g clip-path="url(#aw)">${stripes(64, 44, 300, 70, 12, '#ff5d8a', '#ffffff')}</g>
    <path d="M78 50h264l14 44q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0q-12 14-24 0z" fill="none" stroke="#1f2440" stroke-width="4" stroke-linejoin="round"/></g>
  <g style="${L(3)}"><path d="M100 118q120 34 220 0" fill="none" stroke="#1f2440" stroke-width="2.5"/>
    ${[[128, 126, '#ffd93b'], [164, 133, '#dff1ff'], [200, 136, '#ff5d8a'], [236, 135, '#ffd93b'], [272, 131, '#dff1ff'], [302, 124, '#ff5d8a']].map(([x, y, c]) => `<path d="M${x - 9} ${y}h18l-9 17z" fill="${c}" stroke="#1f2440" stroke-width="2.5" stroke-linejoin="round"/>`).join('')}</g>
  <g style="${L(7)}"><path d="M210 4l8 17 19 2-14 13 4 19-17-10-17 10 4-19-14-13 19-2z" fill="#ffd93b" stroke="#1f2440" stroke-width="3.5" stroke-linejoin="round"/></g>
  <rect x="84" y="176" width="252" height="12" rx="4" fill="#c98b4a" stroke="#1f2440" stroke-width="4"/>
  <clipPath id="cl"><rect x="92" y="188" width="236" height="62"/></clipPath>
  <g clip-path="url(#cl)">${stripes(92, 188, 236, 62, 10, '#ffd93b', '#ffffff')}</g>
  <rect x="92" y="188" width="236" height="62" fill="none" stroke="#1f2440" stroke-width="4"/>
  <rect x="140" y="200" width="140" height="36" rx="8" fill="#fff" stroke="#1f2440" stroke-width="3.5"/>
  <text x="210" y="225" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="19" fill="#1f2440">LEMONADE</text>
  <g><rect x="150" y="128" width="40" height="48" rx="8" fill="#fff" stroke="#1f2440" stroke-width="3.5"/><rect x="154" y="144" width="32" height="28" rx="5" fill="#ffd93b"/><path d="M190 140q16 2 14 14t-14 10" fill="none" stroke="#1f2440" stroke-width="3.5"/></g>
  <g style="${L(2)}"><path d="M228 160h52q-2 16-26 16t-26-16z" fill="#dff1ff" stroke="#1f2440" stroke-width="3.5"/><circle cx="242" cy="154" r="10" fill="#ffd93b" stroke="#1f2440" stroke-width="3"/><circle cx="262" cy="152" r="10" fill="#ffd93b" stroke="#1f2440" stroke-width="3"/><circle cx="252" cy="142" r="10" fill="#ffd93b" stroke="#1f2440" stroke-width="3"/>
    <path d="M110 150h22l-3 26h-16z" fill="#fff" stroke="#1f2440" stroke-width="3"/><path d="M108 140h26l-2 10h-22z" fill="#fff" stroke="#1f2440" stroke-width="3"/></g>
  <g style="${L(4)}"><rect x="288" y="136" width="32" height="40" rx="7" fill="#fff" stroke="#1f2440" stroke-width="3.5"/><rect x="292" y="150" width="24" height="22" rx="4" fill="#ff5d8a"/></g>
  <g style="${L(5)}"><rect x="18" y="176" width="58" height="76" rx="6" fill="#1f2440"/><text x="47" y="204" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="15" fill="#ffd93b">OPEN</text><text x="47" y="228" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="700" font-size="14" fill="#fff">50c</text><text x="47" y="244" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="700" font-size="11" fill="#fff">a cup</text></g>
</svg>`;
}
const UPGRADES = ['Bare table and one jug. Every empire starts somewhere.', 'New: a striped awning.', 'New: fresh lemons and proper cups.', 'New: bunting. Very professional.', 'New: pink lemonade on the menu.', 'New: a price board.', 'New: an actual queue.', 'New: a gold star. You run the best stand in town.'];

/* ================= the six missions ================= */
const BASE = { cups: 40, margin: 0.5, days: 200, growth: 5, rate: 10 };
const dcf = ({ cups, margin, days, growth, rate }) => {
  const r = rate / 100, gr = growth / 100, cf0 = cups * margin * days, years = []; let sum = 0, cf = cf0;
  for (let t = 1; t <= 5; t++) { cf *= 1 + gr; const pv = cf / Math.pow(1 + r, t); years.push({ cf, pv }); sum += pv; }
  const tv = cf * 1.02 / (r - 0.02), tvPv = tv / Math.pow(1 + r, 5);
  return { cf0, years, tvPv, total: sum + tvPv };
};
const BASEVAL = dcf(BASE).total;

const MISSIONS = [
/* ---------------------------------------------------------------- 1 */
{ title: 'Price is not value', badge: 'Price Detective', mins: 8, blurb: 'Why the number on the tag and what something is worth are two different things.',
  steps: [
    { t: 'pick', kind: 'predict', h: 'The €20 skin', q: 'Imagine a game studio spends €500 designing a rare skin. Then 10 million players buy it for €20 each. That is €200 million from a €500 drawing. What do you call that?',
      opts: [['A rip-off', ''], ['Genius', ''], ['A bit of both', '']],
      after: `<b>Everyone has a point.</b> It cost almost nothing to make, and players still happily paid. That only works if the skin is worth €20 <em>to them</em>. So there are two questions hiding here: what does it ${g('price', 'cost')}, and what is it ${g('value', 'worth')}? This mission pulls them apart.` },
    { t: 'w', name: 'sneaker', h: 'One sneaker, five numbers', intro: 'Meet the Comet 1, a made-up limited sneaker. Only 5,000 pairs exist. Before you see anything else: what would <em>you</em> pay for a pair?' },
    { t: 'say', h: 'Three kinds of worth', html: `<p>People use the word "worth" for three different things.</p>
      <div class="trio"><div><b>Market value</b>What people are paying for it right now.</div><div><b>Personal value</b>What it is worth to you, and maybe only you.</div><div><b>Intrinsic value</b>The cash it will make for whoever owns it.</div></div>
      <p style="margin-top:.9rem">Investors care most about the third one. Then they compare it with the first.</p>` },
    { t: 'w', name: 'kinds', h: 'Which kind is it?', intro: 'Tap the kind of value each sentence is talking about.' },
    { t: 'w', name: 'pairs', h: 'Instinct test', intro: 'Three quick choices. In each pair, which would you rather own? Go with your gut, then see what an investor would say.' },
    { t: 'pick', kind: 'predict', h: 'Now it is your turn to own something', q: 'You run a lemonade stand. It earns you €4,000 of profit every year. A neighbour offers to buy it from you for €3,000. Do you sell?',
      opts: [['Yes, €3,000 is a lot of money', 'Careful! The stand hands you €4,000 <em>every year</em>. For €3,000 your neighbour would earn their money back in nine months and keep the stand forever.'], ['No way', 'Good instinct. The stand hands you €4,000 <em>every year</em>. Selling it for less than one year of profit would be a gift to your neighbour.'], ['I need to know what it is really worth first', 'That is exactly the investor’s answer. And here is a clue: the stand hands you €4,000 <em>every year</em>, so €3,000 is far too low.']],
      after: 'But what is the right number? €10,000? €50,000? Working that out is the whole point of this course. You will have the answer by the end of mission 3.' },
    { t: 'rule', html: `<p>Price is the tag. Value is what it is really worth. Investors hunt for the gap between them.</p><p>If the value is higher than the price, that might be a bargain. If the price is higher than the value, walk away.</p>` },
    { t: 'pick', kind: 'check', h: 'Quick check', q: 'A stand that will bring its owner about €50,000 of cash over time is on sale for €30,000. What would an investor think?',
      opts: [['Too expensive', 'Not quite. Compare what you pay (€30,000) with what you get (€50,000).'], ['Possibly a bargain: the value is above the price', 'Yes. Paying €30,000 for something worth €50,000 is the gap investors look for.', 1], ['Impossible to say anything', 'You can say something: you know both the price and a value estimate. Compare them.']] },
    { t: 'pick', kind: 'check', q: 'Which of these is a sentence about <em>intrinsic</em> value?',
      opts: [['"That signed shirt means the world to me."', 'That is personal value: real, but only to you.'], ['"Those shares are trading at €87 right now."', 'That is market value: the price right now.'], ['"This car wash earns its owner €9,000 a year."', 'Right. Intrinsic value comes from the cash something makes for its owner.', 1]] },
    { t: 'dinner', q: 'What is something our family owns that is worth far more to us than anyone would pay for it? Why?', why: 'Asking this at dinner makes you the teacher, and teaching is the fastest way to remember. Listen for personal value hiding in the answers.' },
    { t: 'ai', h: 'How does a company really make money?', prompt: `Explain [company]'s business like I'm 13.\n1. How does money actually come in?\n2. What do they have that rivals can't easily copy?\n3. What could hurt this business in the next 10 years?\nUse simple words, and tell me which numbers I should double-check.` }
  ] },
/* ---------------------------------------------------------------- 2 */
{ title: 'The time machine', badge: 'Time Traveller', mins: 9, blurb: 'Why €100 today beats €100 next year, and how to send money through time.',
  steps: [
    { t: 'pick', kind: 'recall', h: 'Warm-up from mission 1', q: 'Before the new stuff: what do investors hunt for?', opts: [['The lowest price tag in the shop', 'A low price can still be too high if the thing is worth even less.'], ['The gap between price and value', 'Exactly. Hold on to that; it comes back in every mission.', 1], ['Whatever everyone else is buying', 'Popular things are often the most expensive. Investors look for the gap between price and value.']] },
    { t: 'pick', kind: 'predict', h: 'The football star’s offer', q: 'A famous striker likes you and offers a gift. You must choose one. Both are 100% guaranteed.',
      opts: [['A: €1,000,000 today', ''], ['B: €1,200,000 in five years', '']],
      after: 'Locked in. B is €200,000 more, but you wait five years for it. Whether that is worth the wait depends on one thing: what money can do while it waits. Let us find out.' },
    { t: 'w', name: 'grower', h: 'The money grower', intro: `Put money somewhere it grows by the same percentage every year, and something odd happens. Play with the sliders and watch the pink part. That is ${g('compounding')}: your earnings earning their own earnings.` },
    { t: 'say', h: 'Three reasons money today wins', html: `<div class="trio"><div><b>It can grow</b>Money you hold today can start growing today, as you just saw.</div><div><b>Prices creep up</b>The same €500 usually buys a bit less in five years.</div><div><b>Later is a promise</b>Today is certain. A lot can happen before "later".</div></div>` },
    { t: 'w', name: 'timemachine', h: 'The time machine', intro: `Growing sends money into the future. You can also run it backwards and ask: what is future money worth <em>today</em>? That is its ${g('present value')}. The speed of the shrinking is the ${g('discount rate')}: the yearly growth you could get somewhere else.` },
    { t: 'rule', html: `<p>Money in the future is worth less than money today. To compare them, shrink the future money back to today.</p><p>Today’s value = future money ÷ (1 + rate), once for every year you wait.</p>` },
    { t: 'pick', kind: 'check', h: 'Quick check', q: 'Someone promises you €110 one year from now. You could earn 10% a year elsewhere. What is that promise worth today?',
      opts: [['€110', 'That would mean waiting costs nothing. Shrink it: €110 ÷ 1.10.'], ['€100', 'Yes: €110 ÷ 1.10 = €100. Put €100 away at 10% and you would have €110 in a year, so they are worth the same.', 1], ['€121', 'That is growing it forward. Going back to today means dividing: €110 ÷ 1.10.']] },
    { t: 'pick', kind: 'check', q: 'The promise gets riskier, so you use a higher discount rate. What happens to its value today?',
      opts: [['It goes down', 'Right. A higher rate shrinks future money faster. Risky promises are worth less.', 1], ['It goes up', 'Other way round. A higher rate shrinks future money more, so it is worth less today.'], ['Nothing changes', 'It does change: the rate is the speed of the shrinking.']] },
    { t: 'dinner', q: 'If you could get a whole year of pocket money today instead of week by week, how much less would you accept to have it all now?', why: 'Whatever number you say reveals your own personal discount rate. Ask the adults for theirs too. It is usually different.' },
    { t: 'ai', h: 'See compounding with your own numbers', prompt: `Make a year-by-year table of €[amount] growing at [X]% a year for [Y] years.\nThen tell me:\n1. How many times bigger did it get?\n2. How much of the final amount is growth on top of earlier growth?\n3. What changes if the rate is 2 points higher or lower?` }
  ] },
/* ---------------------------------------------------------------- 3 */
{ title: 'What is your stand worth?', badge: 'Stand Tycoon', mins: 10, blurb: 'Build the tool professional investors use, on a lemonade stand.',
  steps: [
    { t: 'pick', kind: 'recall', h: 'Warm-up from mission 2', q: 'You are promised €1,000 in three years. What is it worth today?', opts: [['Exactly €1,000', 'Future money shrinks when you bring it back to today.'], ['Less than €1,000', 'Yes. You have to shrink it once for every year of waiting.', 1], ['More than €1,000', 'That is what €1,000 of today grows into. Going backwards, it shrinks.']] },
    { t: 'pick', kind: 'predict', h: 'Your first valuation', q: 'Your stand makes €4,000 of profit a year. Take a guess: what is the whole stand worth?',
      opts: [['About €4,000', ''], ['About €20,000', ''], ['About €60,000', ''], ['About €1,000,000', '']],
      after: 'Guess saved. No peeking ahead. You are about to work it out properly, and then we will see how close your gut was.' },
    { t: 'say', h: 'The one big idea', html: `<p><b>A business is worth all the cash it will ever hand its owner, shrunk back to today.</b></p><p>The grown-up name is ${g('DCF')}, short for discounted cash flow. It sounds scary. It is three steps you already know:</p><ol><li>Guess the cash for each coming year.</li><li>Shrink each year’s cash back to today (mission 2).</li><li>Add it all up.</li></ol>` },
    { t: 'pick', kind: 'check', h: 'First, what counts as cash?', q: `A small video channel has money coming in and going out each month. What is its monthly ${g('cash flow')}?<table class="t"><tr><th>Item</th><th>Per month</th></tr><tr><td>Ad money</td><td>+€5,000</td></tr><tr><td>Sponsor</td><td>+€2,000</td></tr><tr><td>Camera gear</td><td>−€500</td></tr><tr><td>Video editor</td><td>−€1,500</td></tr><tr><td>Software</td><td>−€200</td></tr></table>`,
      opts: [['€7,000', 'That is everything coming in. Now take away what goes out.'], ['€4,800', 'Yes: €7,000 in, €2,200 out, €4,800 left. That is the money the owner can actually use.', 1], ['€2,200', 'That is the money going out. Cash flow is money in minus money out.']] },
    { t: 'w', name: 'dcf', h: 'The stand machine', intro: `This is a real ${g('DCF')} for your stand. The dark bars are the cash you expect each year. The green bars are what that cash is worth today. The last bar stands for every year after year 5 (its name is ${g('terminal value')}). Move things and watch the total.` },
    { t: 'w', name: 'reveal3', h: 'So, how was your gut?' },
    { t: 'rule', html: `<p>A valuation is a guess wearing a calculator’s clothes.</p><p>Change one assumption a little and the answer moves a lot. So never trust the last digit. Trust the thinking, and always ask: what would I have to believe for this number to be true?</p>` },
    { t: 'pick', kind: 'check', h: 'Quick check', q: `Your careful estimate says the stand is worth about ${eur(Math.round(BASEVAL / 1000) * 1000)}. A buyer offers €75,000 in cash. What now?`,
      opts: [['Refuse, the stand is my baby', 'That is personal value talking, and it is allowed! But as an investor, €75,000 is well above your estimate.'], ['Sell: the price is above my value estimate', 'Right. The same gap as in mission 1, now from the seller’s side. You could even start two new stands with the money.', 1], ['Ask for exactly my estimate instead', 'Why ask for less than you were offered? Compare price with value: €75,000 is above your estimate.']] },
    { t: 'pick', kind: 'check', q: 'Two friends value the same stand. One gets €40,000, the other €80,000. Neither made a maths mistake. How?',
      opts: [['One of them cheated', 'No need. Think about what you changed in the stand machine.'], ['They used different assumptions about the future', 'Exactly. When people disagree about value, they are really disagreeing about growth, risk and how long the good times last.', 1], ['Calculators are unreliable', 'The calculator is fine. The guesses going into it are what differ.']] },
    { t: 'dinner', q: 'Which company do you think will be much bigger in ten years? What would have to be true for that to happen?', why: 'This is forecasting cash in disguise. Every reason someone gives is an assumption you could put into a stand machine.' },
    { t: 'ai', h: 'Build a simple DCF with help', prompt: `Help me build a very simple 5-year DCF for [company], explained for a 13-year-old.\nShow a small table: expected cash each year, and what it is worth today.\nExplain every assumption in one sentence.\nThen tell me which single assumption changes the answer the most.\nRemind me which numbers I should verify myself.` }
  ] },
/* ---------------------------------------------------------------- 4 */
{ title: 'The shortcut', badge: 'Street Smart', mins: 8, blurb: 'Value something in ten seconds by looking at what similar things sold for.',
  steps: [
    { t: 'pick', kind: 'recall', h: 'Warm-up from mission 3', q: 'In a DCF, what do you add up?', opts: [['Last year’s sales', 'Sales are not cash, and last year is the past. A DCF looks forward.'], ['All the future cash, shrunk back to today', 'Yes. Guess it, shrink it, add it.', 1], ['The price tags of everything the business owns', 'A business is worth what it will earn, which can be far more than its tables and jugs.']] },
    { t: 'pick', kind: 'predict', h: 'Three stands just got sold', q: `Big news on your street. Look at the pattern, then guess: your stand makes €4,000 a year. What would a buyer probably pay?<table class="t"><tr><th>Stand</th><th>Yearly profit</th><th>Sold for</th></tr><tr><td>Sunny’s</td><td>€2,000</td><td>€20,000</td></tr><tr><td>Fizz Corner</td><td>€5,000</td><td>€50,000</td></tr><tr><td>Zest Bros</td><td>€3,000</td><td>€30,000</td></tr></table>`,
      opts: [['About €4,000', 'Look again: each stand sold for much more than one year of profit.'], ['About €40,000', 'You spotted it. Every stand sold for 10 times its yearly profit.'], ['About €400,000', 'A bit too excited. Each stand sold for 10 times its profit, not 100.']],
      after: `Every stand sold for <b>10 times its profit</b>. So yours is probably worth about 10 × €4,000 = €40,000. That "10 times" is called a ${g('multiple')}. With profit, its nickname is ${g('P/E')}: price divided by ${g('earnings')}.` },
    { t: 'pick', kind: 'check', h: 'Your turn', q: 'A sneaker company is valued at €60 billion. It makes €3 billion of profit a year. What is its P/E?',
      opts: [['3', 'Divide price by profit: 60 ÷ 3.'], ['20', 'Yes, 60 ÷ 3 = 20. Buyers pay €20 for every €1 of yearly profit.', 1], ['180', 'That is multiplying. A multiple is a division: 60 ÷ 3.']] },
    { t: 'w', name: 'updown', h: 'Why are some multiples higher?', intro: 'On your street everything sold at 10 times profit. In real life some businesses sell for 30 times and others for 5. For each fact, decide: would buyers pay a higher or a lower multiple?' },
    { t: 'pick', kind: 'check', h: 'Apples with apples', q: `A shortcut only works if you compare similar things. You want to value a music streaming app. Which is the best ${g('comparable')}?`,
      opts: [['A fizzy drinks giant', 'Totally different business: bottles and factories, not subscriptions.'], ['Another subscription streaming app', 'Right. Same kind of customers, same way of making money.', 1], ['A car maker', 'Cars and playlists have very little in common as businesses.']] },
    { t: 'say', h: 'Hang on. Two answers?', html: `<p>Your stand machine said about <b>${eur(Math.round(BASEVAL / 1000) * 1000)}</b>. The street says about <b>€40,000</b>. Which one is right?</p><p>Neither is "right". They are two different ways of guessing. The machine depends on your assumptions. The street depends on what other buyers happened to pay, and they might have been wrong too.</p><p>Professionals use both and end up with a range, like "somewhere between €40,000 and €60,000". If a price is far outside the range, that is when it gets interesting.</p><p>And when a young company has no profit yet? People divide the price by ${g('revenue', 'sales')} instead. Same trick, different number underneath.</p>` },
    { t: 'rule', html: `<p>A multiple is a shortcut: what do similar things sell for, per €1 of profit?</p><p>Fast and useful, as long as you compare apples with apples and ask why one deserves a higher multiple than another.</p>` },
    { t: 'pick', kind: 'check', h: 'Quick check', q: 'Two ice-cream shops each make €10,000 a year. Shop A sells for 8 times profit, shop B for 15 times. What is the most likely reason?',
      opts: [['Buyers expect shop B to grow faster or be safer', 'Yes. A higher multiple is the price of better expectations.', 1], ['Shop B has a nicer logo', 'A logo alone will not do it. Think about what buyers expect the profit to do next.'], ['Shop A is the better business', 'Then buyers would pay more for A. The higher multiple usually goes to the business with the better future.']] },
    { t: 'dinner', q: 'Why can some brands charge ten times more for almost the same product?', why: 'Listen for words like trust, habit, cool, quality. Those are the reasons investors pay higher multiples too.' },
    { t: 'ai', h: 'Compare two companies', prompt: `Compare [company A] and [company B] for a 13-year-old.\nMake a small table: sales, profit, how fast each is growing, and their P/E.\nExplain in plain words why one has a higher multiple.\nTell me which numbers might be out of date so I can check them.` }
  ] },
/* ---------------------------------------------------------------- 5 */
{ title: 'News detective', badge: 'Signal Spotter', mins: 9, blurb: 'Most headlines do not matter. Learn to spot the few that do.',
  steps: [
    { t: 'pick', kind: 'recall', h: 'Warm-up from mission 4', q: 'A company is valued at €50 million and makes €5 million of profit. What is its P/E?', opts: [['10', 'Yes: price ÷ profit = 50 ÷ 5.', 1], ['45', 'That is subtracting. A multiple is price divided by profit.'], ['250', 'That is multiplying. Divide instead: 50 ÷ 5.']] },
    { t: 'pick', kind: 'predict', h: 'A true story', q: 'April 2022. Netflix has about 221 million subscribers. It announces that over three months it lost 200,000 of them. That is less than one in a thousand. What happened to its share price the next day?',
      opts: [['Barely moved', ''], ['Fell about 5%', ''], ['Fell about 35%', '']],
      after: `<b>It fell about 35% in a single day.</b> Why so brutal for such a tiny loss? Because nobody expected a loss at all. Netflix itself had said it would <em>gain</em> 2.5 million subscribers. The surprise was huge, even though the number was small.` },
    { t: 'w', name: 'surprise', h: 'The surprise meter', intro: `Prices already include what everyone ${g('expectations', 'expects')}. So a price moves on the <em>difference</em> between what happened and what was expected.` },
    { t: 'say', h: 'Three detective questions', html: `<p>When a headline shouts at you, ask:</p><div class="trio"><div><b>1. Is it new?</b>If everyone already knew, the price already includes it.</div><div><b>2. Does it change the cash?</b>Value is future cash. No change in cash, no change in value.</div><div><b>3. Will it last?</b>One rainy week is different from a road closed forever.</div></div><p style="margin-top:.9rem">Three times yes: that is ${g('signal')}. Otherwise it is probably ${g('noise')}.</p>` },
    { t: 'w', name: 'headlines', h: 'Signal or noise?', intro: 'Eight headlines from the Lemon Lane Gazette, all about your stand’s street. Use the three questions.' },
    { t: 'pick', kind: 'predict', h: 'Ten minutes to decide', q: 'You own shares in a drinks company. A headline flashes: "Company loses its biggest supplier, effective today." The price is already falling. What do you do in the next ten minutes?',
      opts: [['Sell everything, fast', ''], ['Buy more while it is cheap', ''], ['Wait and find out more', '']],
      after: 'Most professionals would <b>wait</b>. In the first minutes nobody knows whether a new supplier can be found by Friday or never. People who rush usually pay for it. Doing nothing while you think is a real decision, and often the best one.' },
    { t: 'rule', html: `<p>News only matters if it changes the cash a business will make. And prices move on surprises, not on events.</p><p>Is it new? Does it change the cash? Will it last? When in doubt, do nothing.</p>` },
    { t: 'pick', kind: 'check', h: 'Quick check', q: 'A company announces record profits, up 20%. The share price drops. What is the best explanation?',
      opts: [['The stock market makes no sense', 'It feels that way! But there is a logic: think about what people expected.'], ['Investors had expected even more than 20%', 'Right. Good news that is worse than expected is bad news for the price.', 1], ['Profits are bad for share prices', 'Profits are good. The catch is what was already expected.']] },
    { t: 'pick', kind: 'check', q: 'Which headline is most likely signal?',
      opts: [['"Boss gives a cheerful speech at a conference"', 'Speeches rarely change the cash a business makes.'], ['"A report from last year is going viral again"', 'Old news. The price already includes it.'], ['"New law bans the company’s main product from next year"', 'Yes. New, hits the cash directly, and lasts.', 1]] },
    { t: 'dinner', q: 'Pick one business headline from this week. Is it signal or noise, and why?', why: 'Run the three questions out loud together. You will be surprised how much news turns out to be noise.' },
    { t: 'ai', h: 'Put a headline on trial', prompt: `Here is a headline: "[paste headline]"\nFor [company], answer simply:\n1. Is this really new, or did people already expect it?\n2. Does it change how much money the company will make? Roughly how much?\n3. Is the effect short or long lasting?\n4. What else would I need to know before having an opinion?` }
  ] },
/* ---------------------------------------------------------------- 6 */
{ title: 'Your AI lab', badge: 'Lab Chief', mins: 10, blurb: 'Turn an AI chatbot into a research helper, and write your first investment pitch.',
  steps: [
    { t: 'pick', kind: 'recall', h: 'Warm-up from mission 5', q: 'What makes a share price move?', opts: [['Any exciting headline', 'Most exciting headlines are noise.'], ['The gap between what happened and what was expected', 'Yes. Surprises move prices.', 1], ['How confident the boss sounds', 'Confidence is free. Changes in future cash are what count.']] },
    { t: 'pick', kind: 'predict', h: 'Straight question', q: 'Can an AI chatbot tell you which shares to buy to get rich?',
      opts: [['Yes, it knows everything', ''], ['No', ''], ['Only the expensive ones can', '']],
      after: `<b>No.</b> Nobody can, human or machine, and anyone who promises it is selling something. AI can also state wrong or out-of-date numbers with total confidence. What it <em>is</em> brilliant at: explaining a business in plain words, building a table in seconds, and arguing against your idea so you can test it. You stay the detective. It is your very fast assistant.` },
    { t: 'pick', kind: 'check', h: 'Asking well: round 1', q: 'Which request will get the more useful answer?',
      opts: [['"Tell me about that sneaker company."', 'Too vague. The AI has to guess what you want, so you get a boring summary.'], ['"Explain how that sneaker company makes money, like I’m 13. Then name two things that could hurt it."', 'Yes. Say exactly what you want and who it is for.', 1]] },
    { t: 'pick', kind: 'check', h: 'Asking well: round 2', q: 'And here?',
      opts: [['"Give me the best arguments for AND against this company, and say how sure you are of each."', 'Yes. Asking for both sides forces an honest answer instead of a sales pitch.', 1], ['"Should I buy this company’s shares?"', 'This asks the AI to decide for you, which it cannot do well. Ask for both sides instead.']] },
    { t: 'w', name: 'promptkit', h: 'Your prompt kit', intro: 'Type a company you are curious about and your five research prompts are ready to copy. Check the age rules of any AI tool with a parent first, and double-check any number that matters.' },
    { t: 'w', name: 'pitch', h: 'Final project: the €1,000 pitch', intro: 'You have €1,000 of pretend money and may put it into one company for five years. Fill in your pitch. Short answers are fine. It is saved on this device, so you can come back to it.' },
    { t: 'say', h: 'Keep the muscle', html: `<p>One company a week is enough:</p><ol><li><b>Monday:</b> how does it make money?</li><li><b>Wednesday:</b> what is it roughly worth, and what did I have to assume?</li><li><b>Friday:</b> did anything in the news this week change the cash?</li></ol><p>Do that for three months and you will understand a dozen businesses better than most adults do.</p>` },
    { t: 'rule', html: `<p>AI makes your thinking faster. It does not do the thinking.</p><p>Ask clear questions, demand both sides, and check the numbers that matter. Real investing with real money is for later, with an adult, and never with money you cannot afford to lose.</p>` },
    { t: 'dinner', q: 'If our family had €500 to put into one company for ten years, which would each of us pick, and why?', why: 'Give your pitch. Then ask everyone for the strongest reason against their own pick. That last part is where the learning is.' }
  ] }
];

/* ================= widgets ================= */
function slider(root, label, min, max, step, val, fmt) {
  const w = el('div', { class: 'ctl' }), id = 's' + Math.random().toString(36).slice(2, 8);
  w.innerHTML = `<label for="${id}"><span>${label}</span><output>${fmt(val)}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}">`;
  root.appendChild(w);
  const input = $('input', w), out = $('output', w);
  input.addEventListener('input', () => { out.textContent = fmt(+input.value); });
  return { input, set(v) { input.value = v; out.textContent = fmt(+v); }, get value() { return +input.value; } };
}
const fb = (root, html, cls = '') => { let f = $(':scope > .fb', root); if (!f) { f = el('div', { class: 'fb', role: 'status' }); root.appendChild(f); } f.className = 'fb ' + cls; f.innerHTML = html; return f; };

const WIDGETS = {
  sneaker(root, done) {
    const s = slider(root, 'I would pay', 0, 2000, 10, 200, eur);
    const b = el('button', { class: 'btn quiet', type: 'button' }, 'Lock in my number'); root.appendChild(b);
    b.addEventListener('click', () => {
      b.remove(); s.input.disabled = true;
      const rows = [['What it costs to make', 30], ['Price in the shop', 180], ['Price from resellers', 1500], ['Worth to someone who hates sneakers', 20], ['Worth to you', s.value, 'me']];
      const box = el('div', { class: 'hbars' });
      rows.forEach(([l, v, c]) => box.appendChild(el('div', { class: 'hbar ' + (c || '') }, `<span><span>${l}</span><span>${eur(v)}</span></span><i style="width:0%"></i>`)));
      root.appendChild(box);
      requestAnimationFrame(() => box.querySelectorAll('i').forEach((i, k) => { i.style.width = Math.max(1.5, rows[k][1] / 2000 * 100) + '%'; }));
      fb(root, `<b>Same shoe. Five numbers.</b> Only two of them are prices: the shop’s and the resellers’. The rest are different answers to "what is it worth?", and they depend on who is asking.${s.value > 1500 ? ' You value it above even the resale price, so to you it would be a bargain.' : s.value < 180 ? ' You value it below the shop price, so for you it is not worth buying at all. A perfectly good answer.' : ''}`);
      done();
    });
  },
  kinds(root, done, award) {
    const items = [['"My old console would sell for €150 online today."', 0], ['"I would never sell it. All my best saves are on it."', 1], ['"That vending machine earns its owner €600 a year."', 2], ['"One share of the company costs €87 this second."', 0]];
    const names = ['Market', 'Personal', 'Intrinsic'], why = ['Market value: what people pay right now.', 'Personal value: worth it to you in particular.', 'Intrinsic value: the cash it makes for its owner.'];
    const rows = el('div', { class: 'rows' }); root.appendChild(rows); let left = items.length, clean = true;
    items.forEach(([text, ans]) => {
      const r = el('div', { class: 'rowq' }, `<p>${text}</p><div class="chips"></div>`), chips = $('.chips', r);
      names.forEach((n, i) => { const c = el('button', { class: 'chip', type: 'button' }, n); chips.appendChild(c);
        c.addEventListener('click', () => {
          if (i === ans) { c.classList.add('yes'); chips.querySelectorAll('.chip').forEach(x => x.disabled = true); r.appendChild(el('div', { class: 'why' }, why[ans])); if (!--left) { if (clean) award('kinds', 2); done(); } }
          else { c.classList.add('no'); c.disabled = true; clean = false; }
        }); });
      rows.appendChild(r);
    });
  },
  pairs(root, done) {
    const P = [
      { a: 'An account with 10 million followers. All of them are bots.', b: 'An account with 500,000 real fans who buy what it recommends.', fa: 'Tempting number, but bots buy nothing. A brand would pay €0 to reach them.', fb: 'Yes. Value comes from real people who act, and brands pay well to reach them.', right: 'b' },
      { a: 'A shop making €500,000 profit a year, the same every year.', b: 'A shop making €100,000 a year, growing 50% every year.', fa: 'A fair choice: more cash right now, and it is steady.', fb: 'A fair choice: if the growth holds, it overtakes the big shop in four years.', both: 'There is no single right answer here. It depends on how long that 50% growth can last, and that is exactly what investors argue about.' },
      { a: '100% of a lemonade stand making €4,000 a year.', b: '0.001% of a giant company worth €3 trillion.', fa: 'Owning all of something feels bigger. But do the sum.', fb: 'Yes. Tiny slice, enormous pie.', right: 'b', both: '0.001% of €3 trillion is €30 million. The stand would need 7,500 years to earn that.' }
    ];
    let n = 0; const host = el('div'); root.appendChild(host);
    const show = () => {
      const p = P[n]; host.innerHTML = `<p><b>Pair ${n + 1} of 3</b></p><div class="duo"><button class="opt" type="button" data-k="a">${p.a}</button><button class="opt" type="button" data-k="b">${p.b}</button></div>`;
      host.querySelectorAll('.opt').forEach(o => o.addEventListener('click', () => {
        host.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (p.right && x.dataset.k === p.right) x.classList.add('yes'); });
        o.classList.add('picked');
        const f = fb(host, `${o.dataset.k === 'a' ? p.fa : p.fb} ${p.both || ''}`, p.right && o.dataset.k !== p.right ? 'try' : '');
        if (++n < P.length) { const nx = el('button', { class: 'btn quiet', type: 'button', style: 'margin-top:.8rem' }, 'Next pair'); f.after(nx); nx.addEventListener('click', show); nx.focus(); }
        else done();
      }));
    };
    show();
  },
  grower(root, done, award) {
    const rate = slider(root, 'Grows each year by', 1, 20, 1, 4, v => v + '%'), yrs = slider(root, 'Years you wait', 1, 40, 1, 10, v => v + (v === 1 ? ' year' : ' years'));
    const out = el('div', { class: 'readout' }), bars = el('div', { class: 'bars', 'aria-hidden': 'true' });
    root.append(out, bars, el('div', { class: 'legend' }, '<span><i style="background:#1f2440"></i>your €100 plus plain interest</span><span><i style="background:#ff5d8a"></i>growth on top of growth</span>'));
    const q = el('ul', { class: 'quests' }, '<li><span>Challenge: set growth to <b>7%</b>. How many years until your €100 has doubled to €200?</span></li>'); root.appendChild(q);
    const hint = el('button', { class: 'link', type: 'button', style: 'margin-top:.6rem' }, 'Stuck? Show me'); root.appendChild(hint);
    let solved = false;
    const solve = byHint => { if (solved) return; solved = true; hint.remove(); const li = $('li', q); li.classList.add('ok');
      li.appendChild(el('small', {}, 'At 7% it takes just over 10 years, so the bar first passes €200 in year 11. There is a mental trick for this, the <b>rule of 72</b>: divide 72 by the growth rate and you get the years to double. 72 ÷ 7 ≈ 10. At 10% it takes about 7 years. At 2%, 36 years.'));
      if (!byHint) award('grower', 2); done(); };
    hint.addEventListener('click', () => { rate.set(7); yrs.set(11); draw(); solve(true); });
    function draw() {
      const r = rate.value / 100, n = yrs.value, final = 100 * Math.pow(1 + r, n), simple = 100 + 100 * r * n;
      out.innerHTML = `<small>€100 becomes</small><span class="big">${eur(final)}</span><div>${eur(final - simple)} of that is growth on top of growth.</div>`;
      bars.innerHTML = '';
      for (let t = 0; t <= n; t++) { const v = 100 * Math.pow(1 + r, t), s = 100 + 100 * r * t; bars.appendChild(el('div', { class: 'b' }, `<i style="height:${s / final * 11}rem"></i><i class="extra" style="height:${(v - s) / final * 11}rem"></i>`)); }
      if (rate.value === 7 && final >= 200 && 100 * Math.pow(1 + r, n - 1) < 200) solve(false);
    }
    rate.input.addEventListener('input', draw); yrs.input.addEventListener('input', draw); draw();
  },
  timemachine(root, done, award) {
    root.appendChild(el('p', {}, 'Back to the striker’s offer. Option B is <b>€1,200,000 in five years</b>. Slide the discount rate and see what B is worth today.'));
    const rate = slider(root, 'Discount rate', 0, 15, 0.5, 0, v => v + '%'), out = el('div', { class: 'readout' }), box = el('div', { class: 'hbars' });
    box.innerHTML = '<div class="hbar"><span><span>A: cash today</span><span>€1,000,000</span></span><i style="width:83.3%"></i></div><div class="hbar me"><span><span>B: worth today</span><span id="tmv"></span></span><i id="tmb"></i></div>';
    root.append(out, box);
    const q = el('ul', { class: 'quests' }, '<li><span>Challenge: find the rate where the winner flips from B to A.</span></li>'); root.appendChild(q);
    let seenA = false, seenB = false, solved = false;
    function draw() {
      const pv = 1200000 / Math.pow(1 + rate.value / 100, 5); $('#tmv', box).textContent = eur(pv); $('#tmb', box).style.width = pv / 1200000 * 100 + '%';
      const aWins = pv < 1000000; if (rate.value > 0) { if (aWins) seenA = true; else seenB = true; }
      out.innerHTML = `<small>At ${rate.value}% a year, €1,200,000 in five years is worth today</small><span class="big">${eur(pv)}</span><div><b>${aWins ? 'A wins. Take the million now.' : 'B wins. Worth the wait.'}</b></div>`;
      if (seenA && seenB && !solved) { solved = true; const li = $('li', q); li.classList.add('ok');
        li.appendChild(el('small', {}, 'The flip is just under 4%. If you can grow money faster than about 3.7% a year, take the million today: you would turn it into more than €1.2 million yourself. At 7%, option B is only worth about €856,000. So your first answer depends on your rate. Neither choice was silly.'));
        award('timemachine', 2); done(); }
    }
    rate.input.addEventListener('input', draw); draw();
  },
  dcf(root, done, award) {
    const f = { cups: slider(root, 'Cups sold per day', 10, 150, 5, BASE.cups, v => v), margin: slider(root, 'Profit per cup', 0.2, 2, 0.1, BASE.margin, v => '€' + v.toFixed(2)),
      days: slider(root, 'Days open per year', 50, 300, 10, BASE.days, v => v), growth: slider(root, 'Growth each year (years 1 to 5)', -10, 30, 1, BASE.growth, v => (v > 0 ? '+' : '') + v + '%'), rate: slider(root, 'Discount rate (how risky is it?)', 5, 20, 1, BASE.rate, v => v + '%') };
    const out = el('div', { class: 'readout' }), bars = el('div', { class: 'bars', 'aria-hidden': 'true' }), labels = el('div', { class: 'barlabels', 'aria-hidden': 'true' }, '<span>Y1</span><span>Y2</span><span>Y3</span><span>Y4</span><span>Y5</span><span>after</span>');
    root.append(out, bars, labels, el('div', { class: 'legend' }, '<span><i style="background:#1f2440"></i>cash that year</span><span><i style="background:#12805c"></i>worth today</span><span>After year 5 it keeps growing slowly, 2% a year.</span>'));
    const reset = el('button', { class: 'btn quiet', type: 'button', style: 'margin-top:.9rem' }, 'Reset the sliders'); root.appendChild(reset);
    const q = el('ul', { class: 'quests' }, `<li data-q="hi"><span>Make your stand worth more than <b>€100,000</b>.</span></li><li data-q="lo"><span>Now make it worth less than <b>€20,000</b>.</span></li><li data-q="rate"><span>Reset, then change <b>only</b> the discount rate from 10% to 12%.</span></li>`); root.appendChild(q);
    root.appendChild(el('p', { style: 'margin-top:.7rem;font-size:1rem' }, 'Finish any two challenges to continue.'));
    const got = {}; const tick = (k, note) => { if (got[k]) return; got[k] = 1; const li = $(`[data-q=${k}]`, q); li.classList.add('ok'); li.appendChild(el('small', {}, note)); award('dcf-' + k, 1); if (Object.keys(got).length >= 2) done(); };
    const read = () => ({ cups: f.cups.value, margin: f.margin.value, days: f.days.value, growth: f.growth.value, rate: f.rate.value });
    function draw() {
      const v = read(), d = dcf(v), max = Math.max(d.tvPv, ...d.years.map(y => y.cf));
      out.innerHTML = `<small>Your stand makes ${eur(d.cf0)} a year now. It is worth about</small><span class="big">${eur(d.total)}</span><div>${eur(d.total - d.tvPv)} from the next five years, ${eur(d.tvPv)} from all the years after.</div>`;
      bars.innerHTML = d.years.map(y => `<div class="b" style="flex-direction:row;align-items:flex-end;gap:2px"><i style="height:${y.cf / max * 11}rem;flex:1"></i><i class="pv" style="height:${y.pv / max * 11}rem;flex:1"></i></div>`).join('') + `<div class="b"><i class="pv" style="height:${d.tvPv / max * 11}rem"></i></div>`;
      if (d.total > 100000) tick('hi', 'Look at what you had to believe to get here. Is that realistic for one stand? Big valuations need big assumptions.');
      if (d.total < 20000) tick('lo', 'Same stand, same lemons. A gloomier view of the future made most of the value vanish.');
      const same = ['cups', 'margin', 'days', 'growth'].every(k => Math.abs(v[k] - BASE[k]) < 1e-9);
      if (same && v.rate === 12) tick('rate', `Two small percentage points and the value fell from ${eur(BASEVAL)} to ${eur(d.total)}. That is ${eur(BASEVAL - d.total)} gone because of one assumption.`);
    }
    Object.values(f).forEach(s => s.input.addEventListener('input', draw));
    reset.addEventListener('click', () => { for (const k in f) f[k].set(BASE[k]); draw(); });
    draw();
  },
  reveal3(root, done) {
    const guess = S.guess3, opts = ['About €4,000', 'About €20,000', 'About €60,000', 'About €1,000,000'];
    const said = guess != null ? `You guessed <b>${opts[guess].toLowerCase()}</b>. ` : '';
    const verdict = guess === 2 ? 'Spot on. Your gut is already thinking like an investor.' : guess === 0 ? 'That is one single year of profit. But the stand keeps paying you year after year, so it is worth many years of profit.' : guess === 1 ? 'Not bad at all, just a little shy. The years after year 5 add a lot.' : guess === 3 ? 'Ambitious! For that, your stand would have to become a chain. The machine says: not yet.' : '';
    root.appendChild(el('p', {}, `With the starting settings, the machine says your stand is worth about <b>${eur(BASEVAL)}</b>. That is roughly 14 years of today’s profit. ${said}${verdict}`));
    root.appendChild(el('p', {}, 'Remember the neighbour who offered €3,000 in mission 1? Now you can tell them exactly how far off they were.'));
    done();
  },
  updown(root, done, award) {
    const items = [['Profit has grown 40% a year for three years.', 1, 'Fast growth means much more cash later. Buyers pay up for that.'], ['Half of all sales come from one single customer.', 0, 'If that customer leaves, half the business leaves too. Risk lowers the multiple.'], ['Customers love the brand and happily pay extra.', 1, 'A loved brand is a moat. It protects future profits.'], ['Last year’s profit came from one freak heatwave.', 0, 'That profit may never repeat, so buyers will not pay many times over for it.'], ['The owner is the only one who knows the recipe, and wants to retire.', 0, 'When the business depends on one person, it is fragile.'], ['It sells in 20 towns, so one bad summer in one town barely hurts.', 1, 'Spread-out, steady profits are safer, and safer earns a higher multiple.']];
    const rows = el('div', { class: 'rows' }); root.appendChild(rows); let left = items.length, clean = true;
    items.forEach(([text, ans, why]) => {
      const r = el('div', { class: 'rowq' }, `<p>${text}</p><div class="chips"></div>`), chips = $('.chips', r);
      ['Lower ↓', 'Higher ↑'].forEach((n, i) => { const c = el('button', { class: 'chip', type: 'button' }, n); chips.appendChild(c);
        c.addEventListener('click', () => { chips.querySelectorAll('.chip').forEach(x => x.disabled = true); if (i === ans) c.classList.add('yes'); else { c.classList.add('no'); chips.children[ans].classList.add('yes'); clean = false; }
          r.appendChild(el('div', { class: 'why' }, why)); if (!--left) { if (clean) award('updown', 2); root.appendChild(el('div', { class: 'fb' }, '<b>The pattern:</b> more growth and less risk push a multiple up. Less growth and more risk push it down.')); done(); } }); });
      rows.appendChild(r);
    });
  },
  surprise(root, done, award) {
    const ex = slider(root, 'Everyone expected growth of', -10, 30, 1, 10, v => (v > 0 ? '+' : '') + v + '%'), ac = slider(root, 'What actually happened', -10, 30, 1, 10, v => (v > 0 ? '+' : '') + v + '%');
    const out = el('div', { class: 'readout' }); root.appendChild(out);
    const q = el('ul', { class: 'quests' }, '<li data-q="a"><span>Make the price <b>drop</b> even though the company <b>grew</b>.</span></li><li data-q="b"><span>Make the price <b>jump</b> even though the company <b>shrank</b>.</span></li>'); root.appendChild(q);
    const got = {};
    function draw() {
      const d = ac.value - ex.value, cls = d > 2 ? 'up' : d < -2 ? 'down' : '';
      out.innerHTML = `<small>Surprise: ${d > 0 ? '+' : ''}${d} points</small><div class="meter ${cls}">${d > 10 ? 'The price leaps ⬆' : d > 2 ? 'The price rises ↑' : d < -10 ? 'The price crashes ⬇' : d < -2 ? 'The price falls ↓' : 'The price shrugs →'}</div><div>${Math.abs(d) <= 2 ? 'No surprise, no move. The price already included this.' : d > 0 ? 'Better than expected.' : 'Worse than expected.'}</div>`;
      if (d < -2 && ac.value > 0 && !got.a) { got.a = 1; const li = $('[data-q=a]', q); li.classList.add('ok'); li.appendChild(el('small', {}, 'Growing is not enough. It has to grow more than people already expected.')); award('surprise-a', 1); done(); }
      if (d > 2 && ac.value < 0 && !got.b) { got.b = 1; const li = $('[data-q=b]', q); li.classList.add('ok'); li.appendChild(el('small', {}, 'Bad, but less bad than feared. That counts as good news for the price.')); award('surprise-b', 1); done(); }
    }
    ex.input.addEventListener('input', draw); ac.input.addEventListener('input', draw); draw();
  },
  headlines(root, done, award) {
    const H = [['City bans all street stands from next month', 1, 'Signal. New, wipes out the cash, and lasts.'], ['Stand owner wears a funny hat on local TV', 0, 'Noise. Fun, but it does not change how many cups get sold next year.'], ['School with 800 pupils to open across the street', 1, 'Signal. Hundreds of thirsty new customers, every school day, for years.'], ['Heatwave expected this weekend', 0, 'Mostly noise. Two great days, then back to normal. It does not last.'], ['Lemon prices double for good after orchard disease', 1, 'Signal. Costs go up for years, so every cup earns less.'], ['Blogger declares lemonade "so last summer"', 0, 'Noise. One opinion. Wait and see whether customers actually stop coming.'], ['That famous report from last year is trending again', 0, 'Noise. Old news is already in the price.'], ['Drinks giant opens next door with half-price cups', 1, 'Signal. A strong rival, right there, probably for a long time.']];
    let n = 0, score = 0; const host = el('div'); root.appendChild(host);
    const show = () => {
      const [t, ans, why] = H[n];
      host.innerHTML = `<p><b>Headline ${n + 1} of ${H.length}</b></p><div class="card-news">${t}</div><div class="duo" style="margin-top:.8rem"><button class="opt" type="button" data-k="1" style="text-align:center">Signal</button><button class="opt" type="button" data-k="0" style="text-align:center">Noise</button></div>`;
      host.querySelectorAll('.opt').forEach(o => o.addEventListener('click', () => {
        const ok = +o.dataset.k === ans; if (ok) score++;
        host.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.k === ans) x.classList.add('yes'); else if (x === o) x.classList.add('no'); });
        const f = fb(host, `<b>${ok ? 'Yes.' : 'Not this time.'}</b> ${why}`, ok ? '' : 'try');
        if (++n < H.length) { const nx = el('button', { class: 'btn quiet', type: 'button', style: 'margin-top:.8rem' }, 'Next headline'); f.after(nx); nx.addEventListener('click', show); nx.focus(); }
        else { f.after(el('div', { class: 'readout' }, `<small>Your score</small><span class="big">${score} / ${H.length}</span><div>${score >= 7 ? 'Sharp eyes. The Gazette cannot fool you.' : score >= 5 ? 'Good detective work. The tricky ones are the news that does not last.' : 'Tricky, right? Replay it later and it will click. The three questions do the work.'}</div>`)); if (score >= 6) award('headlines', 3); done(); }
      }));
    };
    show();
  },
  promptkit(root, done) {
    const inp = el('input', { type: 'text', placeholder: 'A company you are curious about', 'aria-label': 'Company name', maxlength: 40 }); inp.value = S.pitch.company || ''; root.appendChild(inp);
    const list = el('div'); root.appendChild(list);
    const P = [['How it makes money', c => `Explain ${c}'s business like I'm 13. How does money actually come in? What do they have that rivals can't easily copy? What could hurt them in the next 10 years?`],
      ['The numbers that matter', c => `What are the 5 most important numbers to know about ${c}? For each one: the latest figure, what it means in plain words, and whether it is good or bad for this kind of company. Tell me where I can check each number.`],
      ['A simple valuation', c => `Help me build a very simple 5-year DCF for ${c}. Show a small table and explain each assumption in one sentence. Which assumption changes the answer the most?`],
      ['Both sides', c => `Give me the three strongest arguments for owning ${c} for ten years and the three strongest against. Say how confident you are in each one and why.`],
      ['News check', c => `What is the most important news about ${c} from the last few months? For each item: is it really new, does it change how much money they will make, and will it last? Tell me if your information might be out of date.`]];
    function draw() {
      const c = inp.value.trim() || '[company]'; list.innerHTML = '';
      P.forEach(([h, fn]) => { const text = fn(c), box = el('div', { class: 'rowq', style: 'margin-top:.7rem' }, `<p>${h}</p><div style="font-size:1rem;margin-bottom:.5rem"></div>`); box.children[1].textContent = text;
        const b = el('button', { class: 'chip', type: 'button' }, 'Copy'); box.appendChild(b);
        b.addEventListener('click', () => copy(text, b)); list.appendChild(box); });
    }
    inp.addEventListener('input', () => { S.pitch.company = inp.value; save(); draw(); }); draw(); done();
  },
  pitch(root, done, award) {
    const F = [['company', 'The company', 'input', 'Which one?'], ['what', 'What it does and why people love it', 'area', 'Two or three sentences.'], ['numbers', 'Three numbers that matter', 'area', 'For example: sales, profit, how fast it is growing.'], ['worth', 'What I think it is worth, and how I got there', 'area', 'A multiple, a simple DCF, or both.'], ['risks', 'What could go wrong', 'area', 'What would make me change my mind?']];
    const form = el('div'); root.appendChild(form);
    F.forEach(([k, label, kind, ph]) => { const id = 'p-' + k, w = el('div', { class: 'ctl' }, `<label for="${id}"><span>${label}</span></label>`);
      const i = kind === 'input' ? el('input', { id, type: 'text', placeholder: ph, maxlength: 60 }) : el('textarea', { id, placeholder: ph, maxlength: 400 }); i.value = S.pitch[k] || '';
      i.addEventListener('input', () => { S.pitch[k] = i.value; save(); }); w.appendChild(i); form.appendChild(w); });
    const vr = el('div', { class: 'ctl' }, '<label><span>My verdict</span></label><div class="chips"></div>'); form.appendChild(vr);
    ['Buy', 'Watch and wait', 'Avoid'].forEach(v => { const c = el('button', { class: 'chip' + (S.pitch.verdict === v ? ' yes' : ''), type: 'button' }, v); $('.chips', vr).appendChild(c);
      c.addEventListener('click', () => { S.pitch.verdict = v; save(); vr.querySelectorAll('.chip').forEach(x => x.classList.toggle('yes', x === c)); }); });
    const go = el('button', { class: 'btn lemon', type: 'button', style: 'margin-top:.6rem' }, 'Make my pitch'); root.appendChild(go);
    const outWrap = el('div'); root.appendChild(outWrap);
    go.addEventListener('click', () => {
      const p = S.pitch; if (!(p.company || '').trim()) { fb(root, 'Give your company a name first.', 'try'); return; }
      const f = $(':scope > .fb', root); if (f) f.remove();
      outWrap.innerHTML = ''; const card = el('div', { class: 'cert', style: 'text-align:left' });
      const add = (h, t) => { if (!(t || '').trim()) return; const hh = el('p', { style: 'font-family:var(--display);font-weight:800;margin:.9rem 0 .1rem' }); hh.textContent = h; const pp = el('p', { style: 'white-space:pre-wrap' }); pp.textContent = t; card.append(hh, pp); };
      const title = el('div', { class: 'who', style: 'text-align:left' }); title.textContent = p.company; card.appendChild(el('div', { class: 'what' }, 'My €1,000 pitch')); card.appendChild(title);
      add('What it does', p.what); add('The numbers', p.numbers); add('What it is worth', p.worth); add('What could go wrong', p.risks); add('Verdict', p.verdict);
      outWrap.appendChild(card);
      const pr = el('button', { class: 'btn quiet noprint', type: 'button', style: 'margin-top:.8rem' }, 'Print my pitch'); outWrap.appendChild(pr); pr.addEventListener('click', () => printOne(card));
      award('pitch', 5); done();
    });
    root.appendChild(el('p', { style: 'margin-top:.8rem;font-size:1rem' }, 'Not ready yet? You can skip the pitch for now and come back to it.'));
    const skip = el('button', { class: 'link', type: 'button' }, 'Skip for now'); root.appendChild(skip); skip.addEventListener('click', () => { skip.remove(); done(); });
  }
};
function copy(text, btn) {
  const ok = () => { const o = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = o; }, 1400); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  function fallback() { const ta = el('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) {} ta.remove(); }
}
function printOne(node) {
  const holder = el('div', { class: 'print-holder' }); holder.appendChild(node.cloneNode(true)); document.body.appendChild(holder);
  document.body.classList.add('print-one'); window.print();
  setTimeout(() => { document.body.classList.remove('print-one'); holder.remove(); }, 800);
}

/* ================= step renderers ================= */
function renderStep(step, mi, si, done) {
  const key = `m${mi + 1}s${si}`, box = el('section', { class: 'step' + (['rule', 'dinner', 'ai'].includes(step.t) ? ' ' + step.t : '') });
  const tags = { recall: 'Warm-up', predict: 'Your guess first', check: 'Check', rule: 'The rule', dinner: 'Dinner-table question', ai: 'AI lab' };
  const tag = tags[step.kind] || tags[step.t]; if (tag && !(step.t === 'pick' && step.kind === 'check' && !step.h)) box.appendChild(el('span', { class: 'tag' }, tag));
  if (step.h) box.appendChild(el('h2', {}, step.h));
  if (step.t === 'say') { box.appendChild(el('div', {}, step.html)); done(); }
  else if (step.t === 'rule') { box.appendChild(el('div', {}, step.html)); done(); }
  else if (step.t === 'dinner') { box.appendChild(el('p', { class: 'q' }, '“' + step.q + '”')); box.appendChild(el('p', {}, step.why)); done(); }
  else if (step.t === 'ai') { box.appendChild(el('p', {}, 'Optional, and best with a parent nearby. Copy this into an AI chatbot and swap in your own company. AI can get numbers wrong, so check the ones that matter.')); const pre = el('pre'); pre.textContent = step.prompt; box.appendChild(pre); const b = el('button', { class: 'btn quiet', type: 'button' }, 'Copy the prompt'); box.appendChild(b); b.addEventListener('click', () => copy(step.prompt, b)); done(); }
  else if (step.t === 'w') { if (step.intro) box.appendChild(el('p', {}, step.intro)); const host = el('div'); box.appendChild(host); WIDGETS[step.name](host, done, award); }
  else if (step.t === 'pick') {
    box.appendChild(el('div', {}, step.q)); const opts = el('div', { class: 'opts' }); box.appendChild(opts); let tries = 0;
    step.opts.forEach(([label, note, right], i) => { const o = el('button', { class: 'opt', type: 'button' }, label); opts.appendChild(o);
      o.addEventListener('click', () => {
        if (step.kind === 'predict') { opts.querySelectorAll('.opt').forEach(x => x.disabled = true); o.classList.add('picked'); if (key === 'm3s1') { S.guess3 = i; save(); } fb(box, `${note ? note + ' ' : ''}${step.after || ''}`); done(); return; }
        tries++;
        if (right) { o.classList.add('yes'); opts.querySelectorAll('.opt').forEach(x => x.disabled = true); fb(box, `<b>${tries === 1 ? 'Nailed it.' : 'There it is.'}</b> ${note}`); if (tries === 1) award(key, 1); done(); }
        else { o.classList.add('no'); o.disabled = true; fb(box, `<b>Not yet.</b> ${note} Have another go.`, 'try'); }
      }); });
  }
  return box;
}

/* ================= views ================= */
const app = $('#app');
const doneCount = () => MISSIONS.filter((_, i) => S.done[i + 1]).length;
const level = () => doneCount() + (S.best >= 9 ? 1 : 0);

function home() {
  const n = doneCount(), next = MISSIONS.findIndex((_, i) => !S.done[i + 1]), lv = level();
  const cta = next === 0 && !S.lemons ? ['Start mission 1', '#/m/1'] : next >= 0 ? [`Continue: mission ${next + 1}`, `#/m/${next + 1}`] : ['Take the boss quiz', '#/quiz'];
  app.innerHTML = `<section class="hero"><div class="wrap"><div class="copy"><h1>What is anything really worth?</h1>
    <p class="sub">Six short missions. One lemonade stand. By the end you can work out what a business is worth, the way investors do.</p>
    <a class="btn" href="${cta[1]}">${cta[0]}</a><p class="meta">Free. No sign-up. About 10 minutes per mission.</p></div>
    <div>${stand(lv)}<p class="standnote">${UPGRADES[lv]}</p></div></div></section>
  <div class="wrap" style="max-width:48rem"><h2 class="section-h">The missions</h2>
    <p style="margin-top:.6rem">Do them in order. Every mission you finish upgrades your stand.</p>
    <ol class="path">${MISSIONS.map((m, i) => `<li class="${S.done[i + 1] ? 'done' : i === next ? 'next' : ''}"><a href="#/m/${i + 1}"><span class="num">${i + 1}</span><span><h3>${m.title}</h3><p>${m.blurb}</p></span><span class="state">${S.done[i + 1] ? '✓ ' + m.badge : m.mins + ' min'}</span></a></li>`).join('')}
      <li class="boss"><a href="#/quiz"><span class="num">★</span><span><h3>The boss quiz</h3><p>Twelve questions on everything. Earn your certificate.</p></span><span class="state">${S.best ? 'Best: ' + S.best + ' / 12' : n < 6 ? 'After mission 6' : 'Ready'}</span></a></li></ol>
    <div class="cols"><a class="tile" href="#/cheats"><h3>Cheat sheet</h3><p>Every rule and formula on one page. Printable.</p></a><a class="tile" href="#/words"><h3>Glossary</h3><p>Every money word in plain English.</p></a></div>
    <section class="grownups"><h2>For grown-ups</h2>
      <p>This is a free course for curious young people, roughly 11 to 15. Each mission opens with a guess, lets them discover the idea by playing with it, and ends with a question to bring to the dinner table. Please do get asked. Progress is stored only in this browser; nothing is sent anywhere. The AI exercises are optional: check the age rules of whichever AI tool you use. Nothing here is financial advice.</p>
      <p style="margin-top:.8rem"><button class="link" type="button" id="reset">Reset all progress on this device</button></p></section></div>`;
  $('#reset').addEventListener('click', () => { if (confirm('Erase all progress, lemons and your pitch on this device?')) { try { localStorage.removeItem(KEY); } catch (e) {} S = { done: {}, got: {}, lemons: 0, name: '', pitch: {}, best: 0 }; purse(); home(); } });
}

function mission(n) {
  const mi = n - 1, m = MISSIONS[mi]; if (!m) return home();
  track('Module View', { module: String(n) });
  app.innerHTML = `<section class="mhead"><div class="wrap"><p class="kicker"><a href="#/">Course map</a> / Mission ${n} of 6</p><h1>${m.title}</h1><p class="blurb">${m.blurb}</p><div class="dots" aria-hidden="true">${m.steps.map(() => '<i></i>').join('')}</div></div></section>
    <div class="wrap"><div class="steps" id="steps"></div><div class="go"><button class="btn" id="go" type="button" disabled>Continue</button></div></div>`;
  const steps = $('#steps'), go = $('#go'), dots = app.querySelectorAll('.dots i'); let i = -1;
  const ready = () => { go.disabled = false; };
  function nextStep() {
    i++; go.disabled = true;
    if (i >= m.steps.length) return finish();
    dots[i].classList.add('on');
    const node = renderStep(m.steps[i], mi, i, ready); steps.appendChild(node);
    go.textContent = i === m.steps.length - 1 ? 'Finish the mission' : 'Continue';
    if (i > 0) node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  function finish() {
    const first = !S.done[n]; S.done[n] = 1; save(); if (first) { award('mission' + n, 5); track('Module Complete', { module: String(n) }); }
    go.parentElement.remove(); celebrate();
    const lv = level(), box = el('section', { class: 'step finish' }, `<span class="tag">Mission ${n} complete</span><p>You earned the badge</p><p class="badge">${m.badge}</p>${stand(lv)}<p><b>${UPGRADES[lv]}</b></p>
      <div class="acts">${n < 6 ? `<a class="btn" href="#/m/${n + 1}">Mission ${n + 1}: ${MISSIONS[n].title}</a>` : '<a class="btn" href="#/quiz">Take the boss quiz</a>'}<a class="btn quiet" href="#/">Course map</a></div>`);
    steps.appendChild(box); box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }
  go.addEventListener('click', nextStep); nextStep();
}
function celebrate() {
  if (reduced) return;
  for (let k = 0; k < 16; k++) { const d = el('span', { class: 'drop', 'aria-hidden': 'true' }, '🍋'); d.style.left = Math.random() * 96 + 'vw'; d.style.animationDuration = 1.6 + Math.random() * 1.6 + 's'; d.style.animationDelay = Math.random() * 0.5 + 's'; document.body.appendChild(d); setTimeout(() => d.remove(), 4200); }
}

/* ================= boss quiz ================= */
const QUIZ = [
  ['A studio spends €500 designing a game skin and sells millions at €20. What does that show?', ['The price of something and the cost of making it can be far apart', 'Digital things have no value', 'The skin’s intrinsic value is exactly €20'], 0, 'Players pay what it is worth to them. Cost, price and value are three different numbers.'],
  ['Which kind of value do investors compare with the market price?', ['Personal value', 'Intrinsic value', 'Sticker value'], 1, 'Intrinsic value is the cash something will make for its owner. The gap between that and the price is the opportunity.'],
  ['Why is €100 today worth more than €100 next year?', ['Bank notes wear out', 'It can grow, prices creep up, and later is only a promise', 'It is not: they are worth the same'], 1, 'Three reasons: growth, rising prices and risk.'],
  ['You put €1,000 somewhere that grows 10% a year. About how much after 3 years?', ['€1,300', '€1,331', '€1,100'], 1, '€1,000 × 1.1 × 1.1 × 1.1 = €1,331. The extra €31 is growth on growth.'],
  ['Rule of 72: money growing 8% a year doubles in about…', ['4 years', '9 years', '72 years'], 1, '72 ÷ 8 = 9.'],
  ['In a DCF, what does "discounting" mean?', ['Giving customers money off', 'Shrinking future cash back to what it is worth today', 'Ignoring small numbers'], 1, 'Future money is worth less than money today, so each year’s cash gets shrunk.'],
  ['You raise the discount rate in a DCF. The value…', ['goes down', 'goes up', 'stays the same'], 0, 'A higher rate shrinks future cash faster.'],
  ['What is terminal value?', ['The value on the day a company closes', 'One number for all the years after the forecast ends', 'The cost of starting the company'], 1, 'It stands in for "everything after year 5", and it is often the biggest piece.'],
  ['A company valued at €200 million makes €10 million profit. Its P/E is…', ['20', '2', '190'], 0, 'Price ÷ earnings = 200 ÷ 10.'],
  ['Which is the worst comparable for a music streaming app?', ['A video streaming service', 'A podcast app', 'A cola company'], 2, 'Compare apples with apples. Cola is a completely different business.'],
  ['Profits rise 10%, yet the share price falls. Most likely because…', ['investors expected more than 10%', 'profits are bad', 'prices move at random'], 0, 'Prices move on the gap between what happened and what was expected.'],
  ['An AI chatbot gives you a company’s profit figure. What should you do?', ['Trust it, it sounded confident', 'Check the number in a reliable source', 'Use a longer prompt'], 1, 'AI can be confidently wrong or out of date. Check the numbers that matter.']
];
function quiz() {
  let i = 0, score = 0;
  app.innerHTML = `<section class="mhead"><div class="wrap"><p class="kicker"><a href="#/">Course map</a> / The boss quiz</p><h1>Show what you know</h1><p class="blurb">Twelve questions, one at a time. You get one shot at each, so think first.</p><div class="dots" aria-hidden="true">${QUIZ.map(() => '<i></i>').join('')}</div></div></section><div class="wrap"><div class="steps" id="steps"></div></div>`;
  const steps = $('#steps'), dots = app.querySelectorAll('.dots i');
  function ask() {
    const [q, opts, ans, why] = QUIZ[i]; dots[i].classList.add('on');
    const box = el('section', { class: 'step' }, `<span class="tag">Question ${i + 1} of ${QUIZ.length}</span><h2>${q}</h2><div class="opts"></div>`); steps.innerHTML = ''; steps.appendChild(box);
    const order = opts.map((_, k) => k).sort(() => Math.random() - 0.5);      // shuffle so the right answer has no favourite spot
    order.forEach(k => { const b = el('button', { class: 'opt', type: 'button' }, opts[k]); if (k === ans) b.dataset.right = '1'; $('.opts', box).appendChild(b);
      b.addEventListener('click', () => { const ok = k === ans; if (ok) score++; box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.right) x.classList.add('yes'); else if (x === b) x.classList.add('no'); });
        fb(box, `<b>${ok ? 'Correct.' : 'Not this one.'}</b> ${why}`, ok ? '' : 'try');
        const nx = el('button', { class: 'btn', type: 'button', style: 'margin-top:1rem' }, i === QUIZ.length - 1 ? 'See my result' : 'Next question'); box.appendChild(nx); nx.focus();
        nx.addEventListener('click', () => { i++; i < QUIZ.length ? ask() : result(); }); }); });
    if (i) box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  function result() {
    const firstPass = S.best < 9 && score >= 9; if (score > S.best) { S.best = score; save(); } if (score >= 9) award('boss', 10);
    track('Quiz Complete', { score: String(score) });
    const rank = score === 12 ? 'Lemon Legend' : score >= 9 ? 'Street Tycoon' : score >= 6 ? 'Stand Manager' : 'Apprentice Squeezer';
    steps.innerHTML = ''; const box = el('section', { class: 'step finish' }, `<span class="tag">Result</span><p class="big">${score} / 12</p><p class="badge">${rank}</p><p>${score >= 9 ? 'You passed. That is a real understanding of how value works.' : 'Nine or more earns the certificate. Replay the missions that felt wobbly, then try again. Second attempts are where it sticks.'}</p>`);
    steps.appendChild(box);
    if (score >= 9) { if (firstPass) celebrate();
      const form = el('div', { class: 'ctl noprint', style: 'max-width:22rem;margin:1.2rem auto 0;text-align:left' }, '<label for="nm"><span>Name for your certificate</span></label><input id="nm" type="text" maxlength="40" placeholder="Your name">'); box.appendChild(form);
      const cert = el('div', { class: 'cert' }); box.appendChild(cert); const nm = $('#nm', form); nm.value = S.name || '';
      const draw = () => { cert.innerHTML = '<div class="what">The Young Investor’s Guide certifies that</div><div class="who"></div><div class="what">can tell price from value, send money through time,<br>value a lemonade stand and spot signal in the noise.</div><p style="margin-top:.9rem"></p>'; $('.who', cert).textContent = nm.value.trim() || 'Your name here'; $('p', cert).textContent = `${rank} · ${score} / 12 · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`; };
      nm.addEventListener('input', () => { S.name = nm.value; save(); draw(); }); draw();
      const pr = el('button', { class: 'btn lemon noprint', type: 'button', style: 'margin-top:1rem' }, 'Print my certificate'); box.appendChild(pr); pr.addEventListener('click', () => printOne(cert));
    }
    const acts = el('div', { class: 'acts noprint' }, '<button class="btn quiet" type="button" id="again">Try again</button><a class="btn quiet" href="#/">Course map</a>'); box.appendChild(acts); $('#again', acts).addEventListener('click', quiz);
    scrollTo(0, 0);
  }
  ask();
}

/* ================= cheat sheet and glossary ================= */
function cheats() {
  app.innerHTML = `<section class="mhead"><div class="wrap"><p class="kicker"><a href="#/">Course map</a></p><h1>Cheat sheet</h1><p class="blurb">The whole course on one page.</p></div></section>
  <div class="wrap sheet"><p class="noprint" style="margin-top:1.2rem"><button class="btn quiet" type="button" id="pr">Print this page</button></p>
  <h2>1. Price is not value</h2><div class="f">Price is the tag. Value is what it is really worth.</div><p>Market value: what people pay now. Personal value: worth to you. Intrinsic value: the cash it makes for its owner. Investors look for a gap between intrinsic value and price.</p>
  <h2>2. Money and time</h2><div class="f">Future money = today’s money × (1 + rate), once per year</div><div class="f">Today’s value = future money ÷ (1 + rate), once per year</div><p>Rule of 72: years to double ≈ 72 ÷ growth rate. A higher discount rate means future money is worth less today.</p>
  <h2>3. DCF: what a business is worth</h2><ol><li>Guess the cash for each coming year.</li><li>Shrink each year back to today.</li><li>Add one number for all the years after (terminal value).</li><li>Add it all up.</li></ol><p>Small changes in assumptions move the answer a lot. Always ask: what would I have to believe?</p>
  <h2>4. Multiples: the shortcut</h2><div class="f">P/E = price ÷ yearly profit</div><p>Compare only with similar businesses. More growth and less risk earn a higher multiple. Use the DCF and the multiple together to get a range.</p>
  <h2>5. News</h2><div class="f">Price move = what happened − what was expected</div><ol><li>Is it new?</li><li>Does it change the cash?</li><li>Will it last?</li></ol><p>Three times yes is signal. Otherwise it is probably noise. When in doubt, do nothing.</p>
  <h2>6. AI</h2><ul><li>Say exactly what you want and who it is for.</li><li>Ask for both sides.</li><li>Check the numbers that matter.</li><li>You do the thinking.</li></ul></div>`;
  $('#pr').addEventListener('click', () => window.print());
}
function words() {
  app.innerHTML = `<section class="mhead"><div class="wrap"><p class="kicker"><a href="#/">Course map</a></p><h1>Glossary</h1><p class="blurb">Every money word in the course, in plain English.</p></div></section><div class="wrap"><dl class="gl">${Object.keys(GLOSSARY).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).map(k => `<dt>${k.charAt(0).toUpperCase() + k.slice(1)}</dt><dd>${GLOSSARY[k]}</dd>`).join('')}</dl></div>`;
}

/* ================= router ================= */
function route() {
  if (pop) { pop.remove(); pop = null; }
  const h = location.hash.replace(/^#\/?/, ''), m = h.match(/^m\/(\d)$/);
  if (m) mission(+m[1]); else if (h === 'quiz') quiz(); else if (h === 'cheats') cheats(); else if (h === 'words') words(); else home();
  scrollTo(0, 0); purse();
}
addEventListener('hashchange', route); route();
})();
