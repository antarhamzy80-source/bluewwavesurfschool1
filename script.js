const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));


/* ===== Kids photos + registration windows ===== */
(()=>{
  const WA='212614222911';
  const bodyEl=document.body;
  const openModal=id=>{const d=document.getElementById(id);if(!d)return;if(!d.open)d.showModal();bodyEl.classList.add('modal-open')};

  document.addEventListener('click',e=>{
    const opener=e.target.closest('[data-open]');
    if(opener){e.preventDefault();opener.closest('dialog')?.close();openModal(opener.dataset.open);return}
    const closer=e.target.closest('[data-close]');
    if(closer)closer.closest('dialog').close();
  });
  document.querySelectorAll('dialog.modal').forEach(d=>{
    d.addEventListener('click',e=>{if(e.target===d)d.close()});
    d.addEventListener('close',()=>{if(!document.querySelector('dialog.modal[open]'))bodyEl.classList.remove('modal-open')});
  });

  /* ---- Photo viewer ---- */
  const photosDlg=document.getElementById('photos-modal');
  const items=[...photosDlg.querySelectorAll('.kp-item')];
  const viewer=photosDlg.querySelector('.viewer');
  const vImg=viewer.querySelector('img');
  const vCap=viewer.querySelector('figcaption');
  let idx=0;
  const show=i=>{
    idx=(i+items.length)%items.length;
    const img=items[idx].querySelector('img');
    vImg.src=img.currentSrc||img.src;vImg.alt=img.alt;
    vCap.textContent=`${items[idx].dataset.caption}  ·  ${idx+1} / ${items.length}`;
  };
  const openViewer=i=>{show(i);viewer.hidden=false;viewer.querySelector('.viewer-close').focus()};
  const closeViewer=()=>{viewer.hidden=true;items[idx]?.focus()};
  items.forEach((b,i)=>b.addEventListener('click',()=>openViewer(i)));
  viewer.querySelector('.viewer-close').addEventListener('click',closeViewer);
  viewer.querySelector('.prev').addEventListener('click',()=>show(idx-1));
  viewer.querySelector('.next').addEventListener('click',()=>show(idx+1));
  viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});
  photosDlg.addEventListener('cancel',e=>{if(!viewer.hidden){e.preventDefault();closeViewer()}});
  photosDlg.addEventListener('close',()=>{viewer.hidden=true});
  photosDlg.addEventListener('keydown',e=>{
    if(viewer.hidden)return;
    if(e.key==='ArrowLeft')show(idx-1);
    if(e.key==='ArrowRight')show(idx+1);
  });
  let sx=null;
  viewer.addEventListener('pointerdown',e=>{sx=e.clientX});
  viewer.addEventListener('pointerup',e=>{
    if(sx===null)return;const dx=e.clientX-sx;sx=null;
    if(Math.abs(dx)>50)show(dx<0?idx+1:idx-1);
  });

  /* ---- Registration form -> WhatsApp ---- */
  const form=document.getElementById('reg-form');
  const done=document.querySelector('.reg-done');
  const errBox=form.querySelector('.form-error');
  const dateInput=form.querySelector('[name=date]');
  dateInput.min=new Date().toISOString().slice(0,10);

  const clearInvalid=()=>form.querySelectorAll('.invalid').forEach(x=>x.classList.remove('invalid'));
  form.addEventListener('input',e=>{e.target.classList?.remove('invalid');e.target.closest?.('.chips')?.classList.remove('invalid')});

  form.addEventListener('submit',e=>{
    e.preventDefault();clearInvalid();
    if(!form.checkValidity()){
      const bad=[...form.elements].filter(x=>x.willValidate&&!x.validity.valid);
      bad.forEach(x=>{x.classList.add('invalid');x.closest('.chips')?.classList.add('invalid')});
      errBox.textContent='Please complete the highlighted fields.';errBox.hidden=false;
      bad[0].focus();return;
    }
    errBox.hidden=true;
    const f=new FormData(form);const g=k=>(f.get(k)||'').toString().trim();
    const lines=[
      'Hello Blue Wave! I would like to register my child for a kids surf class.',
      '',
      `Child: ${g('child')} (${g('age')} years old)`,
      `Surf level: ${g('level')}`,
      `Can swim: ${g('swim')}`,
      g('date')?`Preferred date: ${g('date')}`:null,
      `Parent / guardian: ${g('parent')}`,
      `Phone: ${g('phone')}`,
      g('email')?`Email: ${g('email')}`:null,
      g('notes')?`Notes: ${g('notes')}`:null
    ].filter(l=>l!==null);
    const url=`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`;
    document.getElementById('reg-wa').href=url;
    window.open(url,'_blank','noopener');
    form.hidden=true;done.hidden=false;done.focus();
    form.closest('.reg-body').scrollTop=0;
  });

  document.getElementById('reg-again').addEventListener('click',()=>{
    form.reset();clearInvalid();done.hidden=true;form.hidden=false;form.querySelector('input').focus();
  });
})();
