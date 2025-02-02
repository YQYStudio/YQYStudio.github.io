import{main as e}from"../main.js";import{initTOC as t}from"../layouts/toc.js";export function initHBE(){const n=window.crypto||window.msCrypto,r=window.localStorage,o="hexo-blog-encrypt:#"+window.location.pathname,a=textToArray("too young too simple"),i=textToArray("sometimes naive!"),c=document.getElementById("hexo-blog-encrypt"),s=c.dataset.wpm,l=c.dataset.whm,y=c.getElementsByTagName("script").hbeData,d=y.innerText,u=y.dataset.hmacdigest;function hexToArray(e){return new Uint8Array(e.match(/[\da-f]{2}/gi).map((e=>parseInt(e,16))))}function textToArray(e){for(var t=e.length,n=0,r=new Array,o=0;o<t;){var a=e.codePointAt(o);a<128?(r[n++]=a,o++):a>127&&a<2048?(r[n++]=a>>6|192,r[n++]=63&a|128,o++):a>2047&&a<65536?(r[n++]=a>>12|224,r[n++]=a>>6&63|128,r[n++]=63&a|128,o++):(r[n++]=a>>18|240,r[n++]=a>>12&63|128,r[n++]=a>>6&63|128,r[n++]=63&a|128,o+=2)}return new Uint8Array(r)}function arrayBufferToHex(e){if("object"!=typeof e||null===e||"number"!=typeof e.byteLength)throw new TypeError("Expected input to be an ArrayBuffer");for(var t,n=new Uint8Array(e),r="",o=0;o<n.length;o++)r+=1===(t=n[o].toString(16)).length?"0"+t:t;return r}async function convertHTMLToElement(e){let t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll("script").forEach((async e=>{e.replaceWith(await async function getExecutableScript(e){let t=document.createElement("script");return["type","text","src","crossorigin","defer","referrerpolicy"].forEach((n=>{e[n]&&(t[n]=e[n])})),t}(e))})),t}async function decrypt(r,a,i){let c=hexToArray(d);return await n.subtle.decrypt({name:"AES-CBC",iv:a},r,c.buffer).then((async r=>{const a=(new TextDecoder).decode(r);if(!a.startsWith("<hbe-prefix></hbe-prefix>"))throw"Decode successfully but not start with KnownPrefix.";const c=document.createElement("button");c.textContent="Encrypt again",c.type="button",c.classList.add("hbe-button"),c.addEventListener("click",(()=>{window.localStorage.removeItem(o),window.location.reload()})),document.getElementById("hexo-blog-encrypt").style.display="inline",document.getElementById("hexo-blog-encrypt").innerHTML="",document.getElementById("hexo-blog-encrypt").appendChild(await convertHTMLToElement(a)),document.getElementById("hexo-blog-encrypt").appendChild(c),document.querySelectorAll("img").forEach((e=>{e.getAttribute("data-src")&&!e.src&&(e.src=e.getAttribute("data-src"))})),e.refresh(),t();var s=new Event("hexo-blog-decrypt");return window.dispatchEvent(s),await async function verifyContent(e,t){const r=(new TextEncoder).encode(t);let o=hexToArray(u);const a=await n.subtle.verify({name:"HMAC",hash:"SHA-256"},e,o,r);return console.log(`Verification result: ${a}`),a||(alert(l),console.log(`${l}, got `,o," but proved wrong.")),a}(i,a)})).catch((e=>(alert(s),console.log(e),!1)))}!function hbeLoader(){const e=JSON.parse(r.getItem(o));if(e){console.log(`Password got from localStorage(${o}): `,e);const t=hexToArray(e.iv).buffer,a=e.dk,i=e.hmk;n.subtle.importKey("jwk",a,{name:"AES-CBC",length:256},!0,["decrypt"]).then((e=>{n.subtle.importKey("jwk",i,{name:"HMAC",hash:"SHA-256",length:256},!0,["verify"]).then((n=>{decrypt(e,t,n).then((e=>{e||r.removeItem(o)}))}))}))}c.addEventListener("keydown",(async e=>{if(e.isComposing||"Enter"===e.key){const e=document.getElementById("hbePass").value,t=await function getKeyMaterial(e){let t=new TextEncoder;return n.subtle.importKey("raw",t.encode(e),{name:"PBKDF2"},!1,["deriveKey","deriveBits"])}(e),c=await function getHmacKey(e){return n.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:a.buffer,iterations:1024},e,{name:"HMAC",hash:"SHA-256",length:256},!0,["verify"])}(t),s=await function getDecryptKey(e){return n.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:a.buffer,iterations:1024},e,{name:"AES-CBC",length:256},!0,["decrypt"])}(t),l=await function getIv(e){return n.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:i.buffer,iterations:512},e,128)}(t);decrypt(s,l,c).then((e=>{console.log(`Decrypt result: ${e}`),e&&n.subtle.exportKey("jwk",s).then((e=>{n.subtle.exportKey("jwk",c).then((t=>{const n={dk:e,iv:arrayBufferToHex(l),hmk:t};r.setItem(o,JSON.stringify(n))}))}))}))}}))}()}
//# sourceMappingURL=hbe.js.map