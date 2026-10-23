'use strict';
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeButton, activeCard, pressed, frame;
  const resetButton = () => {if(!activeButton)return;activeButton.classList.remove('is-near');['--mx','--my','--mr'].forEach(key=>activeButton.style.removeProperty(key));activeButton=null;};
  const resetCard = () => {if(!activeCard)return;activeCard.classList.remove('is-tilting');['--tilt-x','--tilt-y','--tilt-z'].forEach(key=>activeCard.style.removeProperty(key));activeCard=null;};
  document.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||reduce.matches)return;
    if(frame)cancelAnimationFrame(frame);
    const {clientX:x,clientY:y}=event;
    frame=requestAnimationFrame(()=>{
      frame=null;
      if(reduce.matches)return;
      let nearest=null,nearestDistance=Infinity;
      document.querySelectorAll('.button:not(:disabled)').forEach(button=>{
        const r=button.getBoundingClientRect();
        if(!r.width||!r.height||r.bottom<0||r.top>window.innerHeight)return;
        const dx=Math.max(r.left-x,0,x-r.right),dy=Math.max(r.top-y,0,y-r.bottom),distance=Math.hypot(dx,dy);
        if(distance<45&&distance<nearestDistance){nearest=button;nearestDistance=distance;}
      });
      if(activeButton!==nearest){resetButton();activeButton=nearest;}
      if(nearest){const r=nearest.getBoundingClientRect();const dx=x-r.left-r.width/2,dy=y-r.top-r.height/2;nearest.style.setProperty('--mx',`${Math.max(-7,Math.min(7,dx*.055))}px`);nearest.style.setProperty('--my',`${Math.max(-5,Math.min(5,dy*.06))}px`);nearest.style.setProperty('--mr',`${Math.max(-2,Math.min(2,dx*.015))}deg`);nearest.classList.add('is-near');}
      const card=event.target.closest('[data-tilt]');
      if(activeCard!==card){resetCard();activeCard=card;}
      if(card){const r=card.getBoundingClientRect(),dx=(x-r.left)/r.width-.5,dy=(y-r.top)/r.height-.5;card.style.setProperty('--tilt-x',`${-dy*9}deg`);card.style.setProperty('--tilt-y',`${dx*10}deg`);card.style.setProperty('--tilt-z',`${dx*3}deg`);card.classList.add('is-tilting');}
    });
  },{passive:true});
  const release=()=>{if(pressed){const element=pressed;pressed=null;setTimeout(()=>element.classList.remove('is-pressed'),160);}};
  document.addEventListener('pointerdown',event=>{if(reduce.matches)return;const target=event.target.closest('.button:not(:disabled),.option,[data-tilt]');if(target){release();pressed=target;target.classList.add('is-pressed');}},{passive:true});
  document.addEventListener('pointerup',release,{passive:true});
  document.addEventListener('pointercancel',release,{passive:true});
  const resetMotion=()=>{if(frame)cancelAnimationFrame(frame);frame=null;resetButton();resetCard();release();};
  document.addEventListener('pointerleave',resetMotion);
  window.addEventListener('scroll',resetMotion,{passive:true});
  window.addEventListener('blur',resetMotion);
  reduce.addEventListener('change',resetMotion);
})();
