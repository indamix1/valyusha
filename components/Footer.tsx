import { getTranslations } from 'next-intl/server'

export default async function Footer() {
  const t = await getTranslations('footer')
  const b = await getTranslations('brand')
  return (
<footer className="foot" id="foot">
  <div className="wrap">
    <div className="foot-grid">
      <div>
        <a href="#" className="brand"><span className="name">Valyusha</span><span className="sub">{b('sub')}</span></a>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', marginTop: '16px', maxWidth: '34ch' }}>{t('tagline')}</p>
      </div>
      <div>
        <h5>{t('contactTitle')}</h5>
        <ul>
          <li><svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9V20a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.7 3a2 2 0 0 1-.5 1.9L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.9-.5l3 .7a2 2 0 0 1 1.8 2z"/></svg>+81 80-3360-5724</li>
          <li><svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4zM4 4l8 7 8-7"/></svg>valentynaodawara@gmail.com</li>
          <li><svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>valentynaodawara</li>
        </ul>
      </div>
      <div className="foot-cta">
        <span className="foot-tagline">{t('ctaTagline')}</span>
        <a href="https://wa.me/818033605724" className="btn btn-rose"><svg className="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z"/></svg>{t('whatsapp')}</a>
      </div>
    </div>
    <div className="foot-bot">
      <span>{t('copyright')}</span>
      <span>{t('rights')}</span>
    </div>
  </div>
</footer>
  )
}
