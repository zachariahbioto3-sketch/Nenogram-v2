const shimmer = `@keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }`
const skeletonBase = { background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.4s infinite linear', borderRadius: '6px' }

export function SkeletonBox({ width = '100%', height = '16px', radius = '6px', style = {} }) {
  return (<><style>{shimmer}</style><div style={{ ...skeletonBase, width, height, borderRadius: radius, flexShrink: 0, ...style }} /></>)
}
export function SkeletonHero() {
  return (<><style>{shimmer}</style><div style={{ ...skeletonBase, height: '280px', borderRadius: 'var(--radius-lg)' }} /></>)
}
export function SkeletonGridCard() {
  return (<><style>{shimmer}</style><div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}><div style={{ ...skeletonBase, height: '110px', borderRadius: 0 }} /><div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}><div style={{ ...skeletonBase, height: '13px', width: '85%' }} /><div style={{ ...skeletonBase, height: '13px', width: '65%' }} /><div style={{ ...skeletonBase, height: '10px', width: '40%' }} /></div></div></>)
}
export function SkeletonStatCard() {
  return (<><style>{shimmer}</style><div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '8px' }}><div style={{ ...skeletonBase, height: '11px', width: '50%' }} /><div style={{ ...skeletonBase, height: '28px', width: '70%' }} /><div style={{ ...skeletonBase, height: '10px', width: '45%' }} /></div></>)
}
export function SkeletonFeedCard() {
  return (<><style>{shimmer}</style><div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}><div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><div style={{ ...skeletonBase, width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} /><div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}><div style={{ ...skeletonBase, height: '12px', width: '40%' }} /><div style={{ ...skeletonBase, height: '10px', width: '25%' }} /></div></div><div style={{ ...skeletonBase, height: '14px', width: '90%' }} /><div style={{ ...skeletonBase, height: '14px', width: '70%' }} /></div></>)
}
export function SkeletonTxRow() {
  return (<><style>{shimmer}</style><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}><div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><div style={{ ...skeletonBase, height: '12px', width: '120px' }} /><div style={{ ...skeletonBase, height: '10px', width: '80px' }} /></div><div style={{ ...skeletonBase, height: '14px', width: '70px' }} /></div></>)
}
