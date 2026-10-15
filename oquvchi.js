// O'quvchi sahifalari (kabinet, darslarim): faqat kirgan odam ko'radi; ism va guruh ombordan olinadi.
(function(){
  var TARIF = { standart: "Standart", pro: "Pro", premium: "Premium" };
  var token = TB.token();
  if (!token) { location.replace("kirish.html"); return; }

  // Kabinetdagi «To'lov» kartasi: shu oy summa, to'langani, qarzi va to'lovlar tarixi
  var OYLAR = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
  function som(n){ return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return "&#" + c.charCodeAt(0) + ";"; }); }
  function tolovim(m){
    var el = document.getElementById("tolovim"); if (!el) return;
    if (m.rol !== "oquvchi"){ el.innerHTML = '<p style="color:var(--soft);margin:0">Bu karta faqat o\'quvchiga ko\'rinadi.</p>'; return; }
    TB.rpc("mening_tolovim", { p_token: token }).then(function(d){
      var j = d.joriy || {}, h = "";
      if (j.hisob == null) h += '<p style="color:var(--soft);margin:0">Hali hisob yo\'q.</p>';
      else {
        var oy = d.hisoblar[0] ? OYLAR[+d.hisoblar[0].oy.split("-")[1] - 1] : "Shu oy";
        var holat = j.holat === "tolangan" ? '<span class="tag ok">✓ To\'langan</span>'
                  : j.holat === "qarzdor" ? '<span class="tag wait" style="background:#F7D0C9;color:#9E2A1E">Muddati o\'tgan</span>'
                  : '<span class="tag wait">' + j.muddat + ' gacha</span>';
        h += '<div class="row"><div class="g"><b>' + oy + ': ' + som(j.hisob) + '</b><span>To\'landi: ' + som(j.tolangan) + (j.qoldiq ? ' · qoldi ' + som(j.qoldiq) : "") + '</span></div>' + holat + '</div>';
      }
      if (j.qarz > 0) h += '<div class="row"><div class="g"><b style="color:#B3261E">Qarz: ' + som(j.qarz) + '</b><span>Iltimos, administrator bilan bog\'laning</span></div></div>';
      else if (j.balans > 0) h += '<div class="row"><div class="g"><b>Oldindan to\'langan: ' + som(j.balans) + '</b><span>Keyingi oyga o\'tadi</span></div></div>';
      d.tolovlar.slice(0, 5).forEach(function(t){
        h += '<div class="row"><div class="g"><b>' + som(t.summa) + '</b><span>' + esc(t.sana) + (t.izoh ? " · " + esc(t.izoh) : "") + '</span></div><span class="tag ok">✓</span></div>';
      });
      el.innerHTML = h;
    }).catch(function(){ el.innerHTML = '<p style="color:var(--soft);margin:0">Yuklab bo\'lmadi.</p>'; });
  }

  function kirishga(){ TB.chiq().then(function(){ location.replace("kirish.html"); }); }

  TB.rpc("men", { p_token: token }).then(function(m){
    if (!m) return kirishga();
    var me = document.querySelector(".me");
    if (me){
      me.querySelector(".ava").textContent = m.ism.charAt(0).toUpperCase();
      me.querySelector("b").textContent = m.ism;
      var izoh = m.guruh ? m.guruh + " · " + TARIF[m.tarif] : (TB.xodim(m.rol) ? "Ko'rib chiqish rejimi" : "Guruhga qo'shilmagan");
      me.querySelector("small").innerHTML = "";
      me.querySelector("small").append(izoh + " · ");
      var a = document.createElement("a");
      a.href = "#"; a.textContent = "Chiqish"; a.style.textDecoration = "underline";
      a.addEventListener("click", function(e){ e.preventDefault(); kirishga(); });
      me.querySelector("small").append(a);
    }
    tolovim(m);
    var dv = document.getElementById("mening-dav");
    if (dv && m.rol === "oquvchi") TB.rpc("mening_davomatim", { p_token: token }).then(function(d){ dv.textContent = d && d.foiz != null ? d.foiz + "%" : "—"; }).catch(function(){});
    var h1 = document.querySelector(".top h1");
    if (h1 && /Assalomu alaykum/.test(h1.textContent)) h1.textContent = "Assalomu alaykum, " + m.ism.split(" ")[0] + " 😊";
  }).catch(function(){});
})();
