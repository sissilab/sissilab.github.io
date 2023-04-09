const lang = document.getElementById('langlang')?.value;
if (lang && window.location.pathname === '/')  window.location.href = '/' + lang;
