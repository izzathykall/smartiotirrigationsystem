/* Inline SVG icons, so the website also works from a local folder. */
(() => {
const paths={
home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/>',
book:'<path d="M12 5C8 2 4 3 2 4v15c3-1 6-1 10 2 4-3 7-3 10-2V4c-2-1-6-2-10 1zm0 0v16M5 8l4 1m-4 4 4 1m6-5 4-1m-4 6 4-1"/>',
clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m8 11 1 1 2-2m2 1h3m-8 6h8"/>',
folder:'<path d="M3 9V5a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v2M2 10h20l-3 11H5z"/>',
video:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m10 9 5 3-5 3z"/>',
gallery:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="8" r="2"/><path d="m3 18 6-6 4 4 3-3 5 5"/>',
flag:'<path d="M5 22V3m0 1q4-4 8-1t7-1v11q-3 3-7 0t-8 1"/>',
heart:'<path d="M12 21 3 12C-3 5 7-1 12 6c5-7 15-1 9 6z"/>',
external:'<path d="M14 3h7v7m-1-6-10 10M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
right:'<path d="M4 12h16m-6-6 6 6-6 6"/>',left:'<path d="M20 12H4m6-6-6 6 6 6"/>',up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',plus:'<path d="M12 4v16M4 12h16"/>',
sparkle:'<path d="M12 2q1 9 10 10-9 1-10 10Q11 13 2 12q9-1 10-10z"/>',
flower:'<path d="M12 7c-6-12-14 1-5 5-12 6 1 14 5 5 6 12 14-1 5-5 12-6-1-14-5-5z"/><circle cx="12" cy="12" r="3"/>',
headphones:'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="12" width="5" height="9" rx="2"/><rect x="17" y="12" width="5" height="9" rx="2"/>',
mic:'<rect x="8" y="2" width="8" height="13" rx="4"/><path d="M4 10v2a8 8 0 0 0 16 0v-2m-8 10v3m-4 0h8"/>',
music:'<path d="M9 18V5l12-3v13M9 9l12-3"/><ellipse cx="5" cy="19" rx="4" ry="3"/><ellipse cx="17" cy="16" rx="4" ry="3"/>',
leaf:'<path d="M12 22V11m0 7C-2 19-1 5 1 4q12-1 11 14zm0-5C10 0 21 0 23 1q2 12-11 12z"/>',
film:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 8h5m-5 8h5M17 8h5m-5 8h5"/>',
ticket:'<path d="M3 4h18v5a3 3 0 0 0 0 6v5H3v-5a3 3 0 0 0 0-6zm12 1v2m0 3v2m0 3v2"/>',
palette:'<path d="M12 2C-1 2-2 22 11 22c6 0-1-7 5-7 10 0 7-13-4-13z"/><circle cx="7" cy="8" r="1"/><circle cx="13" cy="6" r="1"/><circle cx="18" cy="9" r="1"/><circle cx="5" cy="14" r="1"/>',
friends:'<circle cx="8" cy="7" r="3"/><circle cx="18" cy="8" r="3"/><path d="M1 21v-4a7 7 0 0 1 14 0v4m2-8a6 6 0 0 1 6 6v2"/>',
menu:'<path d="M3 5h18M3 12h18M3 19h18"/>',
bus:'<rect x="2" y="4" width="20" height="15" rx="4" fill="#efbd72"/><path d="M3 13h18M8 4v9m8-9v9"/><circle cx="6" cy="20" r="2" fill="#75618c"/><circle cx="18" cy="20" r="2" fill="#75618c"/><path d="M6 16h1m10 0h1"/>',
star:'<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z"/>'
};
document.body.insertAdjacentHTML('afterbegin',`<svg xmlns="http://www.w3.org/2000/svg" class="svg-defs" aria-hidden="true"><defs>${Object.entries(paths).map(([name,path])=>`<symbol id="i-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</symbol>`).join('')}</defs></svg>`);
window.hubIcon=(name,extra='')=>`<svg class="ui-icon ${extra}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
})();
