import{A as e,L as t,j as n}from"./chunk-5KNZJZUH-CXZH0_bv.js";import{t as r}from"./jsx-runtime-DH9-qhHI.js";import{C as i,D as a,P as o,S as s,t as c,w as l}from"./Page-BNa-5ixz.js";import{t as u}from"./Banner-BosuaafW.js";import{t as d}from"./Card-Cj-qXULP.js";import{t as f}from"./Divider-DyQHWfX5.js";import{t as p}from"./List-BRe_nbPB.js";import{t as m}from"./ProgressBar-J_SQ70GB.js";var h=r();function g(e,t,n){return Math.max(t,Math.min(n,e))}function _({children:e}){return(0,h.jsx)(`div`,{className:`gsCardWrap`,children:(0,h.jsx)(d,{children:e})})}var v=t(function(){let{settings:t,billing:r,stats:d}=e(),v=n(),y=e=>`${e}${v.search||``}`,b=t&&(t.brandName||t.brandVoiceGuidelines||t.targetKeyword),x=!!b,S=(d?.productJobs||0)>0,C=(d?.totalJobs||0)>0,w=(d?.imageJobs||0)>0,T=(d?.blogJobs||0)>0,E=[{key:`settings`,label:`Complete Settings`,done:x,href:`/app/settings`},{key:`product`,label:`Generate SEO for products`,done:S,href:`/app/seo-tools?tab=products`},{key:`review`,label:`Review results in Generation History`,done:C,href:`/app/generation-history`},{key:`images`,label:`Generate ALT text for images`,done:w,href:`/app/seo-tools?tab=images`,proOnly:!0},{key:`blog`,label:`Generate SEO for blog articles`,done:T,href:`/app/seo-tools?tab=blog`,proOnly:!0}],D=E.filter(e=>e.done).length,O=g(Math.round(D/E.length*100),0,100),k=r?.free?.used||0,A=r?.free?.limit||r?.free?.monthlyLimit||0,j=typeof r?.free?.remaining==`number`?r.free.remaining:Math.max(0,A-k);return(0,h.jsx)(c,{title:`Get started`,fullWidth:!0,children:(0,h.jsxs)(`div`,{style:{width:`100%`,padding:`0`},children:[(0,h.jsx)(`style`,{children:`

.gsRows {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}
.gsRow {
  display: flex;
  gap: 16px;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
}
.gsCol {
  /* Strict 50/50 columns (gap-aware) */
  flex: 0 0 calc(50% - 8px);
  max-width: calc(50% - 8px);
  min-width: 0;
  display: flex;
  box-sizing: border-box;
}

.gsCardWrap {
  flex: 1;
  display: flex;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.gsCardWrap .Polaris-Card {
  flex: 1;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.gsCardWrap .Polaris-Card__Section { flex: 1; }

@media (max-width: 768px) {
  .gsRow { flex-direction: column; }
  .gsCol { flex: 0 0 100%; max-width: 100%; }
}
`}),(0,h.jsxs)(`div`,{className:`gsRows`,children:[(0,h.jsxs)(`div`,{className:`gsRow`,children:[(0,h.jsx)(`div`,{className:`gsCol`,children:(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`400`,children:[(0,h.jsxs)(l,{align:`space-between`,blockAlign:`center`,children:[(0,h.jsxs)(i,{gap:`100`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Onboarding checklist`}),(0,h.jsxs)(o,{as:`p`,variant:`bodySm`,children:[D,` / `,E.length,` completed`]})]}),(0,h.jsxs)(s,{tone:O===100?`success`:`info`,children:[O,`%`]})]}),(0,h.jsx)(m,{progress:O}),(0,h.jsx)(f,{}),(0,h.jsx)(p,{type:`bullet`,children:E.map(e=>{let t=!!e.proOnly&&!r?.isPro;return(0,h.jsx)(p.Item,{children:(0,h.jsxs)(l,{align:`space-between`,blockAlign:`center`,children:[(0,h.jsxs)(l,{gap:`200`,blockAlign:`center`,children:[(0,h.jsx)(s,{tone:e.done?`success`:t?`critical`:`info`,children:e.done?`Done`:t?`Pro`:`Todo`}),(0,h.jsx)(o,{as:`span`,variant:`bodyMd`,children:e.label})]}),(0,h.jsx)(a,{size:`slim`,disabled:t,url:y(e.href),variant:e.done?`secondary`:`primary`,children:e.done?`Open`:t?`Upgrade`:`Start`})]})},e.key)})})]})})}),(0,h.jsx)(`div`,{className:`gsCol`,children:(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`400`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Quick actions`}),(0,h.jsxs)(l,{gap:`300`,wrap:!0,children:[(0,h.jsx)(a,{variant:`primary`,url:y(`/app/seo-tools?tab=products`),children:`Generate for products`}),(0,h.jsx)(a,{disabled:!r?.isPro,url:y(`/app/seo-tools?tab=images`),children:`Generate ALT for images`}),(0,h.jsx)(a,{disabled:!r?.isPro,url:y(`/app/seo-tools?tab=blog`),children:`Generate for blog articles`}),(0,h.jsx)(a,{url:y(`/app/generation-history`),children:`View history`})]}),r?.isPro?null:(0,h.jsx)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:`Image ALT and Blog generators are Pro features.`})]})})})]}),(0,h.jsxs)(`div`,{className:`gsRow`,children:[(0,h.jsx)(`div`,{className:`gsCol`,children:(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Plan & limits`}),r?.isPro?(0,h.jsx)(u,{tone:`success`,title:`Pro plan active`,children:(0,h.jsx)(o,{as:`p`,variant:`bodyMd`,children:`All generators are unlocked.`})}):(0,h.jsxs)(u,{tone:`info`,title:`Free plan limits`,action:{content:`Upgrade to Pro`,url:y(`/app/billing`)},children:[(0,h.jsx)(o,{as:`p`,variant:`bodyMd`,children:`Product SEO generation is available with a monthly limit. Image ALT and Blog SEO are Pro features.`}),A?(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Monthly product usage: `,(0,h.jsx)(`b`,{children:k}),` / `,(0,h.jsx)(`b`,{children:A}),` (remaining: `,(0,h.jsx)(`b`,{children:j}),`)`]}):null]})]})})}),(0,h.jsx)(`div`,{className:`gsCol`,children:(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Activity`}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Product jobs: `,(0,h.jsx)(`b`,{children:d?.productJobs||0})]}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Image jobs: `,(0,h.jsx)(`b`,{children:d?.imageJobs||0})]}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Blog jobs: `,(0,h.jsx)(`b`,{children:d?.blogJobs||0})]}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Total jobs: `,(0,h.jsx)(`b`,{children:d?.totalJobs||0})]}),(0,h.jsx)(f,{}),(0,h.jsx)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:`Tip: Start with 5–10 products, review the results, then scale up.`})]})})})]}),(0,h.jsxs)(`div`,{className:`gsRow`,children:[(0,h.jsx)(`div`,{className:`gsCol`,children:(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Best practices`}),(0,h.jsxs)(p,{type:`bullet`,children:[(0,h.jsx)(p.Item,{children:`Keep titles under ~60 characters.`}),(0,h.jsx)(p.Item,{children:`Use one clear keyword, avoid stuffing.`}),(0,h.jsx)(p.Item,{children:`Write descriptions that match the product and audience.`}),(0,h.jsx)(p.Item,{children:`ALT text: describe what you see + product context.`})]})]})})}),(0,h.jsx)(`div`,{className:`gsCol`,children:(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Shortcuts`}),(0,h.jsxs)(l,{gap:`200`,wrap:!0,children:[(0,h.jsx)(a,{url:y(`/app/seo-tools`),children:`SEO Tools`}),(0,h.jsx)(a,{url:y(`/app/generation-history`),children:`Generation History`}),(0,h.jsx)(a,{url:y(`/app/settings`),children:`Settings`}),(0,h.jsx)(a,{url:y(`/app/billing`),children:`Billing`})]}),b?null:(0,h.jsx)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:`Complete Settings to get the best results.`})]})})})]})]})]})})});export{v as default};