// Background service worker: choose two stories per day and (optionally) generate images.


async function pickAndStoreDailyStories(){
try{
const res = await fetch(chrome.runtime.getURL('data/bible_stories.json'));
const all = await res.json();
// shuffle
for(let i = all.length - 1; i > 0; i--){
const j = Math.floor(Math.random() * (i + 1));
[all[i], all[j]] = [all[j], all[i]];
}
const morning = all[0];
const afternoon = all[1] || all[0];


// try to generate images (if token present)
const morningImg = await generateImageForPrompt(morning.imagePrompt).catch(() => null);
const afternoonImg = await generateImageForPrompt(afternoon.imagePrompt).catch(() => null);


const payload = {
lastFetch: new Date().toDateString(),
morningStory: { ...morning, img: morningImg },
afternoonStory: { ...afternoon, img: afternoonImg }
};


await chrome.storage.local.set(payload);
console.log('SoulVerse: stored new stories', payload);
}catch(e){
console.error('pickAndStoreDailyStories error', e);
}
}


chrome.runtime.onInstalled.addListener(() => {
pickAndStoreDailyStories();
// schedule alarm every 12 hours
chrome.alarms.create('soulverse_daily', { periodInMinutes: 12 * 60 });
});


chrome.alarms.onAlarm.addListener((alarm) => {
if(alarm.name === 'soulverse_daily') pickAndStoreDailyStories();
});


// Listen for on-demand refresh from newtab
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
if(msg && msg.action === 'refreshStories'){
pickAndStoreDailyStories().then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
return true; // indicate async response
}
});