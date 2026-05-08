// share.js - Universal share button component
// Usage: addShareButtons(levelName, levelSlug) or addPackShareButtons(packName, packId)

export function addShareButtons(container, title, url) {
  const fullURL = `https://radl-three.vercel.app${url}`;
  const twitterURL = `https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(title)} on RADL!&url=${encodeURIComponent(fullURL)}`;
  const discordText = `**${title}** on RADL\n${fullURL}`;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: center;
    max-width: 680px;
    margin: 0 auto 32px auto;
    flex-wrap: wrap;
  `;

  wrapper.innerHTML = `
    <a href="${twitterURL}" target="_blank" rel="noopener" style="
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      background: #1da1f2;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      transition: opacity 0.2s;
    " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
      𝕏 Share on Twitter
    </a>

    <button onclick="
      navigator.clipboard.writeText('${discordText}').then(() => {
        this.textContent = '✅ Copied!';
        setTimeout(() => this.textContent = '🎮 Copy for Discord', 2000);
      });
    " style="
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      background: #5865F2;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s;
    " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
      🎮 Copy for Discord
    </button>

    <button onclick="
      navigator.clipboard.writeText('${fullURL}').then(() => {
        this.textContent = '✅ Copied!';
        setTimeout(() => this.textContent = '🔗 Copy Link', 2000);
      });
    " style="
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    " onmouseover="this.style.borderColor='var(--accent2)'" onmouseout="this.style.borderColor='var(--border)'">
      🔗 Copy Link
    </button>
  `;

  container.appendChild(wrapper);
}
