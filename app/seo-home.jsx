import {SITE} from '@/lib/data';
export const faqs=[
 {q:'How do I find sewage cleanup near me?',a:'Sewage Clean Pros helps you request a connection with an independent sewage cleanup provider serving your area. Availability depends on your ZIP code.'},
 {q:'Does Sewage Clean Pros perform cleanup work?',a:'No. Sewage Clean Pros is a connection service. Independent providers perform cleanup work and determine their own service terms.'},
 {q:'What should I do after a sewage backup?',a:'Keep children and pets away from contaminated water. Avoid flooded areas with possible electrical hazards, and contact an appropriate cleanup professional.'},
 {q:'Can I request emergency sewage cleanup?',a:'You can request a connection for urgent sewage cleanup needs. Provider availability and response times vary by location.'}
];
const schema={'@context':'https://schema.org','@graph':[
 {'@type':'WebPage','@id':SITE+'/#webpage',url:SITE+'/',name:'Sewage Cleanup Near Me | Sewage Clean Pros',isPartOf:{'@id':SITE+'/#website'},about:{'@id':SITE+'/#organization'},inLanguage:'en-US'},
 {'@type':'FAQPage','@id':SITE+'/#faq',mainEntity:faqs.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))}
]};
export default function SeoHome(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><section className="section" aria-labelledby="faq-title"><div className="wrap"><div className="section-head"><div className="kicker">COMMON QUESTIONS</div><h2 id="faq-title">Sewage Cleanup FAQs</h2><p>Helpful answers about finding sewage cleanup services.</p></div><div style={{maxWidth:850,margin:'0 auto'}}>{faqs.map(x=><div key={x.q} style={{padding:'18px 0',borderBottom:'1px solid #d7e0e8'}}><h3 style={{margin:'0 0 8px'}}>{x.q}</h3><p style={{margin:0}}>{x.a}</p></div>)}</div><p style={{textAlign:'center',marginTop:20}}>For general sewage-related health information, see the <a href="https://www.cdc.gov/" target="_blank" rel="noopener noreferrer">Centers for Disease Control and Prevention</a>.</p></div></section></>}
