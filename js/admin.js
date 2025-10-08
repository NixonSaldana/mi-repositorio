// admin.js
async function fetchUsers(){
  try{
    const resp = await fetch('data/users.json');
    if(!resp.ok) throw new Error('No users');
    const data = await resp.json();
    return data;
  }catch(e){
    console.warn('Could not load users.json', e);
    return [{email:'admin@politech.co', password:'PoliTech123'}];
  }
}
(async function(){
  const users = await fetchUsers();
  function auth(email,pw){ return users.find(u=> u.email===email && u.password===pw); }
  const loginBtn = document.getElementById('login-btn');
  if(loginBtn){
    loginBtn.addEventListener('click', function(){
      const email = document.getElementById('email').value.trim();
      const pw = document.getElementById('password').value.trim();
      const msg = document.getElementById('msg');
      if(!auth(email,pw)){
        msg.innerText = 'Credenciales incorrectas.'; return;
      }
      localStorage.setItem('pt_admin', email);
      location.href = 'admin.html';
    });
  }
  function getServices(){ return JSON.parse(localStorage.getItem('pt_services')||'[]'); }
  function setServices(arr){ localStorage.setItem('pt_services', JSON.stringify(arr)); }
  const logout = document.getElementById('logout');
  if(logout){
    logout.addEventListener('click', ()=>{ localStorage.removeItem('pt_admin'); location.href='index.html'; });
  }
  if(location.pathname.endsWith('admin.html')){
    const admin = localStorage.getItem('pt_admin');
    if(!admin){ alert('Acceso no autorizado. Redirigiendo a login.'); location.href='login.html'; }
    const tabla = document.getElementById('tabla');
    function renderTabla(){
      const arr = getServices();
      tabla.innerHTML = `<table class="table table-striped"><thead><tr><th></th><th>ID</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Promoción</th><th>Acciones</th></tr></thead><tbody>`+
        arr.map(s=> `
          <tr>
            <td><img src="assets/default.png" /></td>
            <td>${s.id}</td>
            <td>${s.nombre}</td>
            <td>${s.precio.toLocaleString()}</td>
            <td>${s.cantidad}</td>
            <td>${s.promo? 'Sí':'No'}</td>
            <td>
              <button class="btn btn-sm btn-primary edit" data-id="${s.id}">Editar</button>
              <button class="btn btn-sm btn-danger delete" data-id="${s.id}">Eliminar</button>
            </td>
          </tr>
        `).join('') + `</tbody></table>`;
      document.querySelectorAll('.edit').forEach(b=> b.addEventListener('click', e=> openEdit(e.target.dataset.id)));
      document.querySelectorAll('.delete').forEach(b=> b.addEventListener('click', e=> removeService(e.target.dataset.id)));
    }
    function openEdit(id){
      const arr = getServices();
      const s = arr.find(x=> x.id==id);
      document.getElementById('modal-title').innerText = 'Editar servicio';
      document.getElementById('serv-id').value = s.id;
      document.getElementById('serv-nombre').value = s.nombre;
      document.getElementById('serv-desc').value = s.descripcion;
      document.getElementById('serv-precio').value = s.precio;
      document.getElementById('serv-cant').value = s.cantidad;
      document.getElementById('serv-promo').value = s.promo? 'true':'false';
      var myModal = new bootstrap.Modal(document.getElementById('modalForm'));
      myModal.show();
    }
    function removeService(id){
      if(!confirm('¿Eliminar servicio?')) return;
      let arr = getServices();
      arr = arr.filter(x=> x.id!=id);
      setServices(arr);
      renderTabla();
    }
    document.getElementById('crear-serv').addEventListener('click', ()=>{
      document.getElementById('modal-title').innerText = 'Crear servicio';
      document.getElementById('form-serv').reset();
      document.getElementById('serv-id').value = '';
      var myModal = new bootstrap.Modal(document.getElementById('modalForm'));
      myModal.show();
    });
    document.getElementById('save-serv').addEventListener('click', ()=>{
      const id = document.getElementById('serv-id').value;
      const nombre = document.getElementById('serv-nombre').value.trim();
      const desc = document.getElementById('serv-desc').value.trim();
      const precio = Number(document.getElementById('serv-precio').value) || 0;
      const cant = Number(document.getElementById('serv-cant').value) || 0;
      const promo = document.getElementById('serv-promo').value === 'true';
      let arr = getServices();
      if(id){
        const idx = arr.findIndex(x=> x.id==id);
        arr[idx].nombre = nombre; arr[idx].descripcion = desc; arr[idx].precio = precio; arr[idx].cantidad = cant; arr[idx].promo = promo;
      } else {
        const nid = arr.reduce((m,x)=> Math.max(m,x.id),0)+1;
        arr.push({id:nid,nombre:nombre,descripcion:desc,precio:precio,cantidad:cant,promo:promo});
      }
      setServices(arr);
      renderTabla();
      var myModalEl = document.getElementById('modalForm');
      var modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();
    });
    renderTabla();
  }
})();