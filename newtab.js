(async function () {
  // Ethiopian date
 // Ethiopian date
try {
  const dateText = window.getEthiopianDateString();
  document.getElementById("ethiopian-date").innerText = dateText;
} catch (e) {
  console.error(e);
  document.getElementById("ethiopian-date").innerText = "ቀን መጫን አልተቻለም";
}


  // Icons
  const topIcons = [
    { name: 'Google', url: 'https://www.google.com', icon: 'icons/google.png' },
    { name: 'Gmail', url: 'https://mail.google.com', icon: 'icons/gmail.png' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'icons/chatgpt.png' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'icons/youtube.png' }
  ];
  const topIconsContainer = document.getElementById('top-icons');
  topIcons.forEach(i => {
    const a = document.createElement('a');
    a.href = i.url;
    a.target = '_blank';
    const img = document.createElement('img');
    img.src = i.icon;
    a.appendChild(img);
    topIconsContainer.appendChild(a);
  });

  // Bible stories
  let stories = [];
  try {
    const res = await fetch(chrome.runtime.getURL('data/bible_stories.json'));
    stories = await res.json();
  } catch (e) {
    console.error('Error loading stories:', e);
  }

  const hour = new Date().getHours();
  const story = hour < 12 ? stories[0] : (stories[1] || stories[0]);

  document.getElementById('story-title').innerText = story?.title || "SoulVerse";
  document.getElementById('story-text').innerText = story?.text || "No story available today.";
  const ref = document.getElementById('story-ref');
  ref.innerHTML = story?.ref
    ? `<a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(story.ref)}&version=NIV" target="_blank">${story.ref}</a>`
    : "";

  // Background
  const imgs = ['images/default1.jpg', 'images/default2.jpg', 'images/default3.jpg'];
  const selected = imgs[Math.floor(Math.random() * imgs.length)];
  document.body.style.backgroundImage = `url('${selected}')`;
})();
