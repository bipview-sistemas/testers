// Convocação dos 10 Testers da BipView (MKT, 26/10/2026).
// A cadeira vem do endereço que o Denis manda (testers.bipview.com/#07): só o número, nunca o nome.
// O "aceito" fica guardado só neste celular, para a pessoa ver os próximos passos quando voltar do WhatsApp.
(function () {
  'use strict';
  var NOITE = new Date(2026, 10, 30);   // a noite de lançamento, 30/11/2026, hora local
  var CHAVE = 'bv-convocacao';

  function todos(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  // pelo atributo, e não por el.hidden: o selo é SVG, e elemento SVG não tem a propriedade hidden
  function mostrar(el, sim) { if (sim) el.removeAttribute('hidden'); else el.setAttribute('hidden', ''); }

  // 1. a cadeira (01 a 10)
  var m = /^#?(\d{1,2})$/.exec(location.hash || '');
  var n = m ? parseInt(m[1], 10) : 0;
  var cadeira = n >= 1 && n <= 10 ? (n < 10 ? '0' + n : String(n)) : '';
  if (cadeira) {
    document.documentElement.classList.add('com-cadeira');
    todos('[data-cadeira]', function (el) { el.textContent = cadeira; });
    todos('[data-so-cadeira]', function (el) { mostrar(el, true); });
    todos('[data-sem-cadeira]', function (el) { mostrar(el, false); });
  }

  // 2. quantos dias faltam para a noite
  var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  var dias = Math.round((NOITE - hoje) / 864e5);
  todos('[data-contagem]', function (el) {
    if (dias < 1) { mostrar(el, false); return; }
    var b = el.querySelector('b'); if (b) b.textContent = String(dias);
    var t = el.querySelector('[data-dias-palavra]'); if (t) t.textContent = dias === 1 ? 'dia' : 'dias';
  });

  // 3. aceitar: o WhatsApp abre com a resposta pronta; a pessoa escolhe a conversa com o Denis e envia
  function resposta(celular) {
    return 'TOPO! Aceito a convocação dos Testers da BipView' +
      (cadeira ? ' (cadeira nº ' + cadeira + ')' : '') + '. Meu celular é ' + celular + '.';
  }
  function lerAceite() { try { return JSON.parse(localStorage.getItem(CHAVE) || 'null'); } catch (e) { return null; } }
  function gravarAceite(celular) {
    try { localStorage.setItem(CHAVE, JSON.stringify({ celular: celular, cadeira: cadeira })); } catch (e) { /* sem armazenamento: só nesta visita */ }
  }
  function mostrarAceite(celular, animar) {
    var raiz = document.documentElement;
    if (!animar) raiz.classList.add('sem-animacao');
    raiz.classList.add('aceito');
    todos('[data-boas-vindas]', function (el) { mostrar(el, true); });
    todos('[data-so]', function (el) { mostrar(el, el.getAttribute('data-so') === celular); });
    todos('[data-cta-heroi]', function (a) { a.textContent = 'Ver os próximos passos'; });
    todos('[data-reenviar]', function (a) { a.href = 'https://wa.me/?text=' + encodeURIComponent(resposta(celular)); });
  }

  todos('[data-aceitar]', function (a) {
    var celular = a.getAttribute('data-aceitar');
    a.href = 'https://wa.me/?text=' + encodeURIComponent(resposta(celular));
    // sem preventDefault: o toque abre o WhatsApp na hora (atrasar faz o iPhone abrir a página do wa.me em vez do app)
    a.addEventListener('click', function () { gravarAceite(celular); mostrarAceite(celular, true); });
  });

  var salvo = lerAceite();
  if (salvo && salvo.celular && (!salvo.cadeira || salvo.cadeira === cadeira)) mostrarAceite(salvo.celular, false);
})();
