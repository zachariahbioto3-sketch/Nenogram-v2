import { Link } from 'react-router-dom'
import './LandingPage.css'

const Arrow = () => <svg viewBox='0 0 24 24'><path d='M5 12h14M13 6l6 6-6 6' /></svg>
const Logo = () => <Link to='/' className='logo'><span>N</span>nenogram</Link>

function Preview() {
  return <div className='preview'>
    <aside><b>N</b><i /><i /><i /><i className='on' /><i /></aside>
    <div className='screen'>
      <header><div><small>GOOD MORNING, AMANI</small><strong>Your work, in motion.</strong></div><em>A</em></header>
      <div className='stats'><div className='balance'><small>AVAILABLE BALANCE</small><b>KSh 24,580</b><span>+12.4% this month</span></div><div><small>ACTIVE PROJECTS</small><b>04</b><span>2 due this week</span></div><div><small>NENOCOIN</small><b>2,480 NC</b><span>1 NC = KSh 10</span></div></div>
      <div className='preview-bottom'><section><div className='list-title'><b>Active contracts</b><span>View all</span></div><p><i /> <span><b>Mobile wallet redesign</b><small>Milestone 2 of 4 · KSh 18,000</small></span><strong>72%</strong></p><p><i /> <span><b>Creator portfolio site</b><small>Review in progress</small></span><strong>90%</strong></p></section><article><small>NENOGRAM TODAY</small><b>Build your next big thing.</b><p>From a note to a shipped project, your work has a home here.</p><span>Read article <Arrow /></span></article></div>
    </div>
  </div>
}

const features = [
  ['01', 'Create without friction', 'Keep code, notes and published work together in Nano—your focused digital workspace.', '</>'],
  ['02', 'Find work that fits', 'Offer your expertise, hire specialist talent, and move from opportunity to signed contract.', '↗'],
  ['03', 'Get paid with confidence', 'Use M-Pesa, KSh or NenoCoin with milestone escrow that keeps every project clear and secure.', '◎'],
]

export default function LandingPage() {
  return <main className='landing'>
    <nav className='landing-nav'><Logo /><div className='nav-links'><a href='#platform'>Platform</a><a href='#how'>How it works</a><a href='#community'>Community</a></div><div className='nav-actions'><Link to='/login'>Sign in</Link><Link to='/register' className='nav-cta'>Get started <Arrow /></Link></div></nav>
    <section className='hero'><div className='hero-copy'><div className='eyebrow'>BUILT FOR AFRICAN CREATORS AND DEVELOPERS</div><h1>Build your craft.<br /><em>Grow your world.</em></h1><p>Nenogram gives independent talent one place to create, find meaningful work, collaborate, and get paid securely.</p><div className='actions'><Link to='/register' className='primary'>Start building free <Arrow /></Link><a href='#platform' className='secondary'>Explore the platform</a></div><div className='proof'><span>J</span><span>K</span><span>M</span><span>S</span><p>Join a growing community turning ideas into work that matters.</p></div></div><Preview /></section>
    <div className='marquee'>CREATE <i>✦</i> COLLABORATE <i>✦</i> GET PAID <i>✦</i> BUILD TOGETHER <i>✦</i></div>
    <section id='platform' className='platform'><div><div className='eyebrow'>ONE PLATFORM, ENDLESS MOMENTUM</div><h2>Everything your<br /><em>ambition needs.</em></h2></div><p className='lead'>The tools you use should make your next step clearer. Nenogram brings your work, people and payments into one considered space.</p><div className='features'>{features.map(([number,title,text,icon]) => <article key={number}><div><span>{number}</span><b>{icon}</b></div><h3>{title}</h3><p>{text}</p><Link to='/register'>Discover more <Arrow /></Link></article>)}</div></section>
    <section id='how' className='workflow'><div><div className='eyebrow'>MADE FOR MOMENTUM</div><h2>One place to<br />make progress.</h2><p>Whether you are a developer, designer, writer or ambitious client, Nenogram makes the path from idea to outcome feel natural.</p><Link to='/register' className='primary'>Create your account <Arrow /></Link></div><ol><li><span>01</span><p><b>Set up your space</b><small>Create a profile and bring your best work into Nano.</small></p></li><li><span>02</span><p><b>Connect with opportunity</b><small>Browse work, collaborate, or launch a service.</small></p></li><li><span>03</span><p><b>Deliver and grow</b><small>Manage milestones and get paid on your terms.</small></p></li></ol></section>
    <section id='community' className='community'><div><div className='eyebrow'>MORE THAN A MARKETPLACE</div><h2>Meet people who<br /><em>make things happen.</em></h2><p>Share what you are learning, join a hackathon, discover exceptional work, and find collaborators who understand the vision.</p><Link to='/register' className='secondary'>Join the community <Arrow /></Link></div><div className='posts'><article className='post-one'><header><span>MK</span><p><b>muriuki.k</b><small>Product designer</small></p></header><h3>Just shipped my first client project through Nenogram.</h3><p>From the initial brief to final payment, every step felt like it had a place.</p><footer>♥ 24 &nbsp;&nbsp; ◌ 8 comments</footer></article><article className='post-two'><small>ACTIVE HACKATHON</small><h3>Build for tomorrow</h3><p>48 hours · KSh 100,000 in prizes</p><div><span>AO</span><span>NM</span><span>+96</span></div></article></div></section>
    <section className='final'><div className='eyebrow'>YOUR NEXT CHAPTER STARTS HERE</div><h2>Let your work<br /><em>go further.</em></h2><p>Join Nenogram and turn the things you make into the life you want to build.</p><Link to='/register' className='primary'>Get started for free <Arrow /></Link></section>
    <footer className='site-footer'><Logo /><p>© {new Date().getFullYear()} Nenogram. Built for possibility.</p><div><Link to='/login'>Sign in</Link><Link to='/register'>Create an account</Link></div></footer>
  </main>
}
