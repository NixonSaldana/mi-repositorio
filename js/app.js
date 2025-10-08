// app.js
(async function(){
  async function fetchSeed(){
    try{
      const resp = await fetch('data/services.json');
      if(!resp.ok) throw new Error('No se pudo cargar services.json');
      const data = await resp.json();
      localStorage.setItem('pt_services', JSON.stringify(data));
      return data;
    }catch(e){
      console.warn('Fetch seed failed:', e);
      return null;
    }
  }
  function getServices(){ return JSON.parse(localStorage.getItem('pt_services')||'[]'); }
  if(!localStorage.getItem('pt_services')){
    await fetchSeed();
  }
  // destacados
  const destacados = document.getElementById('destacados');
  if(destacados){
    const items = getServices().slice(0,4);
    destacados.innerHTML = items.map(s=>`<div class="col-md-3"><div class="card p-2 h-100"><div class="badge bg-warning text-dark mb-2">${s.promo? 'Promoción':''}</div><h5>${s.nombre}</h5><p class="mb-1">COP ${s.precio.toLocaleString()}</p><a class="btn btn-sm btn-primary" href="detalle.html?id=${s.id}">Ver detalle</a></div></div>`).join('');
  }
  const lista = document.getElementById('lista-servicios');
  const buscar = document.getElementById('buscar');
  const filtro = document.getElementById('filtro');
  function renderLista(){
    if(!lista) return;
    const q = buscar.value.toLowerCase();
    const f = filtro.value;
    let items = getServices().filter(s=> s.nombre.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q));
    if(f==='promo') items = items.filter(s=> s.promo);
    lista.innerHTML = items.map(s=>`<div class="col-md-4"><div class="card p-3 h-100"><div class="mb-2"><strong>${s.nombre}</strong></div><div class="mb-2">COP ${s.precio.toLocaleString()}</div><p class="small">${s.descripcion}</p><div class="d-flex justify-content-between align-items-center"><a class="btn btn-sm btn-outline-primary" href="detalle.html?id=${s.id}">Ver</a></div></div></div>`).join('');
  }
  if(buscar) buscar.addEventListener('input', renderLista);
  if(filtro) filtro.addEventListener('change', renderLista);
  renderLista();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(id && document.getElementById('nombre-servicio')){
    const s = getServices().find(x=> x.id==id);
    if(s){
      document.getElementById('nombre-servicio').innerText = s.nombre;
      document.getElementById('descripcion-servicio').innerText = s.descripcion;
      document.getElementById('cantidad-servicio').innerText = s.cantidad;
      document.getElementById('precio-servicio').innerText = 'COP ' + s.precio.toLocaleString();
      document.getElementById('breadcrumb').innerText = 'Inicio / Servicios / ' + s.nombre;
    } else {
      document.getElementById('nombre-servicio').innerText = 'Servicio no encontrado';
    }
  }
})();