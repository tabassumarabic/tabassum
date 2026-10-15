// Ombor (Supabase) bilan aloqa. Bu kalit OCHIQ — saytda turishi normal; maxfiy kalitlar bu yerga qo'yilmaydi.
(function(){
  var URL = "https://qubrgtzfjmpyojaltfnf.supabase.co";
  var KEY = "sb_publishable_32_AlXAqmxrZ0pr9UjFZJQ_XiNjsCy_";

  function rpc(nom, args){
    return fetch(URL + "/rest/v1/rpc/" + nom, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(args || {})
    }).then(function(r){
      return r.text().then(function(t){
        var d = t ? JSON.parse(t) : null;
        if (!r.ok) throw new Error((d && d.message) || ("HTTP " + r.status));
        return d;
      });
    });
  }

  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k, v){ try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch(e){} }

  window.TB = {
    rpc: rpc,
    token: function(){ return get("tb_token"); },
    saqla: function(d){ set("tb_token", d.token); set("tb_ism", d.ism); set("tb_rol", d.rol); },
    chiq: function(){
      var t = get("tb_token");
      set("tb_token", null); set("tb_ism", null); set("tb_rol", null);
      return t ? rpc("chiqish", { p_token: t }).catch(function(){}) : Promise.resolve();
    },
    xodim: function(rol){ return rol && rol !== "oquvchi"; }
  };
})();
