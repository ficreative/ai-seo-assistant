import{A as e,L as t,j as n}from"./chunk-5KNZJZUH-CXZH0_bv.js";import{t as r}from"./jsx-runtime-DH9-qhHI.js";import{C as i,D as a,P as o,S as s,t as c,w as l}from"./Page-BNa-5ixz.js";import{t as u}from"./Banner-BosuaafW.js";import{t as d}from"./Card-Cj-qXULP.js";import{t as f}from"./Divider-DyQHWfX5.js";import{t as p}from"./List-BRe_nbPB.js";import{t as m}from"./ProgressBar-J_SQ70GB.js";var h=r();function g(e,t,n){return Math.max(t,Math.min(n,e))}function _({children:e}){return(0,h.jsx)(`div`,{className:`gsCard`,children:(0,h.jsx)(d,{children:(0,h.jsx)(`div`,{className:`gsCardInner`,children:e})})})}var v=t(function(){let{settings:t,billing:r,stats:d}=e(),v=n(),y=e=>{let t=v.search||``;return t?e.includes(`?`)?`${e}&${t.replace(/^\?/,``)}`:`${e}${t}`:e},b=t&&(t.brandName||t.brandVoiceGuidelines||t.targetKeyword),x=!!b,S=(d?.productJobs||0)>0,C=(d?.totalJobs||0)>0,w=(d?.imageJobs||0)>0,T=(d?.blogJobs||0)>0,E=[{key:`settings`,label:`Complete Settings`,done:x,href:`/app/settings`},{key:`product`,label:`Generate SEO for products`,done:S,href:`/app/seo-tools?tab=products`},{key:`review`,label:`Review results in Generation History`,done:C,href:`/app/generation-history`},{key:`images`,label:`Generate ALT text for images`,done:w,href:`/app/seo-tools?tab=images`,proOnly:!0},{key:`blog`,label:`Generate SEO for blog articles`,done:T,href:`/app/seo-tools?tab=blog`,proOnly:!0}],D=E.filter(e=>e.done).length,O=g(Math.round(D/E.length*100),0,100),k=String(r?.planKey||``).toLowerCase(),A=!!r?.isPro||k.includes(`pro`)||k.includes(`monthly`)||k.includes(`yearly`)||k.includes(`annual`),j=r?.free?.used||0,M=r?.free?.limit||r?.free?.monthlyLimit||0,N=typeof r?.free?.remaining==`number`?r.free.remaining:Math.max(0,M-j);return(0,h.jsxs)(c,{title:`Get started`,fullWidth:!0,children:[(0,h.jsx)(`style`,{children:`
        .gsPage {
          width: 100%;
          box-sizing: border-box;
        }

        .gsGrid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: stretch;
          box-sizing: border-box;
        }

        .gsCard {
          width: 100%;
          min-width: 0;
          height: 100%;
          min-height: 300px;
          box-sizing: border-box;
        }

        .gsCard > .Polaris-Card {
          height: 100%;
          width: 100%;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          overflow: hidden;
        }

        .gsCard .Polaris-ShadowBevel {
          border-radius: 18px;
        }

        .gsCardInner {
          height: 100%;
          min-height: 300px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .gsCardInner > .Polaris-BlockStack {
          flex: 1;
        }

        .gsChecklistItem {
          width: 100%;
          min-width: 0;
        }

        .gsChecklistContent {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 768px) {
          .gsGrid {
            grid-template-columns: 1fr;
          }

          .gsCard,
          .gsCard > .Polaris-Card,
          .gsCardInner {
            min-height: auto;
          }
        }
      `}),(0,h.jsx)(`div`,{className:`gsPage`,children:(0,h.jsxs)(`div`,{className:`gsGrid`,children:[(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`400`,children:[(0,h.jsxs)(l,{align:`space-between`,blockAlign:`center`,children:[(0,h.jsxs)(i,{gap:`100`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Onboarding checklist`}),(0,h.jsxs)(o,{as:`p`,variant:`bodySm`,children:[D,` / `,E.length,` completed`]})]}),(0,h.jsxs)(s,{tone:O===100?`success`:`info`,children:[O,`%`]})]}),(0,h.jsx)(m,{progress:O}),(0,h.jsx)(f,{}),(0,h.jsx)(p,{type:`bullet`,children:E.map(e=>{let t=!!e.proOnly&&!A;return(0,h.jsx)(p.Item,{children:(0,h.jsx)(`div`,{className:`gsChecklistItem`,children:(0,h.jsxs)(l,{align:`space-between`,blockAlign:`center`,gap:`300`,wrap:!1,children:[(0,h.jsx)(`div`,{className:`gsChecklistContent`,children:(0,h.jsxs)(l,{gap:`200`,blockAlign:`center`,wrap:!1,children:[(0,h.jsx)(s,{tone:e.done?`success`:t?`critical`:`info`,children:e.done?`Done`:t?`Pro`:`Todo`}),(0,h.jsx)(o,{as:`span`,variant:`bodyMd`,children:e.label})]})}),(0,h.jsx)(a,{size:`slim`,disabled:t,url:y(e.href),variant:e.done?`secondary`:`primary`,children:e.done?`Open`:t?`Upgrade`:`Start`})]})})},e.key)})})]})}),(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`400`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Quick actions`}),(0,h.jsxs)(l,{gap:`300`,wrap:!0,children:[(0,h.jsx)(a,{variant:`primary`,url:y(`/app/seo-tools?tab=products`),children:`Generate for products`}),(0,h.jsx)(a,{disabled:!A,url:y(`/app/seo-tools?tab=images`),children:`Generate ALT for images`}),(0,h.jsx)(a,{disabled:!A,url:y(`/app/seo-tools?tab=blog`),children:`Generate for blog articles`}),(0,h.jsx)(a,{url:y(`/app/generation-history`),children:`View history`})]}),A?(0,h.jsx)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:`Your Pro plan is active. Product SEO, Image ALT, and Blog SEO generators are unlocked.`}):(0,h.jsx)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:`Image ALT and Blog generators are Pro features.`})]})}),(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Plan & limits`}),A?(0,h.jsx)(u,{tone:`success`,title:`Pro plan active`,children:(0,h.jsxs)(i,{gap:`200`,children:[(0,h.jsx)(o,{as:`p`,variant:`bodyMd`,children:`Your Pro plan is active. All AI SEO generators are unlocked.`}),(0,h.jsx)(o,{as:`p`,variant:`bodyMd`,children:`You can generate SEO titles and descriptions for products, ALT text for product images, and SEO metadata for blog articles.`}),(0,h.jsxs)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:[`Plan: `,(0,h.jsx)(`b`,{children:r?.planKey||`Pro`})]})]})}):(0,h.jsxs)(u,{tone:`info`,title:`Free plan limits`,action:{content:`Upgrade to Pro`,url:y(`/app/billing`)},children:[(0,h.jsx)(o,{as:`p`,variant:`bodyMd`,children:`Product SEO generation is available with a monthly limit. Image ALT and Blog SEO are Pro features.`}),M?(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Monthly product usage: `,(0,h.jsx)(`b`,{children:j}),` /`,` `,(0,h.jsx)(`b`,{children:M}),` `,`(remaining: `,(0,h.jsx)(`b`,{children:N}),`)`]}):null]})]})}),(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Activity`}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Product jobs: `,(0,h.jsx)(`b`,{children:d?.productJobs||0})]}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Image jobs: `,(0,h.jsx)(`b`,{children:d?.imageJobs||0})]}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Blog jobs: `,(0,h.jsx)(`b`,{children:d?.blogJobs||0})]}),(0,h.jsxs)(o,{as:`p`,variant:`bodyMd`,children:[`Total jobs: `,(0,h.jsx)(`b`,{children:d?.totalJobs||0})]}),(0,h.jsx)(f,{}),(0,h.jsx)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:`Tip: Start with 5–10 products, review the results, then scale up.`})]})}),(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Best practices`}),(0,h.jsxs)(p,{type:`bullet`,children:[(0,h.jsx)(p.Item,{children:`Keep titles under ~60 characters.`}),(0,h.jsx)(p.Item,{children:`Use one clear keyword, avoid stuffing.`}),(0,h.jsx)(p.Item,{children:`Write descriptions that match the product and audience.`}),(0,h.jsx)(p.Item,{children:`ALT text: describe what you see + product context.`})]})]})}),(0,h.jsx)(_,{children:(0,h.jsxs)(i,{gap:`300`,children:[(0,h.jsx)(o,{as:`h2`,variant:`headingMd`,children:`Shortcuts`}),(0,h.jsxs)(l,{gap:`200`,wrap:!0,children:[(0,h.jsx)(a,{url:y(`/app/seo-tools`),children:`SEO Tools`}),(0,h.jsx)(a,{url:y(`/app/generation-history`),children:`Generation History`}),(0,h.jsx)(a,{url:y(`/app/settings`),children:`Settings`}),(0,h.jsx)(a,{url:y(`/app/billing`),children:`Billing`})]}),b?null:(0,h.jsx)(o,{as:`p`,variant:`bodySm`,tone:`subdued`,children:`Complete Settings to get the best results.`})]})})]})})]})});export{v as default};