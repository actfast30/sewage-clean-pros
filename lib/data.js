export const SITE = 'https://sewagecleanpros.com';
export const PHONE = process.env.NEXT_PUBLIC_TRACKING_PHONE || '';
export const services = [
 {slug:'sewage-backup-cleanup',name:'Sewage Backup Cleanup',desc:'Help finding cleanup providers for backed-up drains, toilets and sewer lines.',icon:'↗'},
 {slug:'basement-sewage-cleanup',name:'Basement Sewage Cleanup',desc:'Connect with professionals for basement sewage contamination and cleanup.',icon:'⌂'},
 {slug:'emergency-sewage-cleanup',name:'Emergency Sewage Cleanup',desc:'Find local providers for urgent sewage overflow and contaminated water situations.',icon:'✦'},
 {slug:'water-extraction',name:'Water Extraction Services',desc:'Locate professionals equipped to remove standing water and address affected areas.',icon:'≈'},
 {slug:'residential-sewage-cleanup',name:'Residential Sewage Cleanup',desc:'Help for sewage contamination affecting homes, bathrooms and living spaces.',icon:'⌁'},
 {slug:'crawl-space-sewage-cleanup',name:'Crawl Space Sewage Cleanup',desc:'Find help with hard-to-reach sewage contamination beneath a home.',icon:'▤'},
 {slug:'raw-sewage-cleanup',name:'Raw Sewage Cleanup',desc:'Connect with cleanup professionals for potentially hazardous raw sewage exposure.',icon:'◈'},
];
export const resources = [
 {slug:'sewage-cleanup-cost',name:'Sewage Cleanup Cost Guide',desc:'What affects cleanup pricing and what to ask before hiring a provider.'},
 {slug:'what-to-do-after-sewage-backup',name:'What to Do After a Sewage Backup',desc:'Practical first steps while waiting for professional assistance.'},
 {slug:'sewage-cleanup-safety',name:'Sewage Cleanup Safety',desc:'Understand common exposure risks and when to avoid entering an affected area.'},
];
export const locations = [
 ['Florida','FL','Miami'],['Minnesota','MN','Minneapolis'],['Colorado','CO','Denver'],['New York','NY','Brooklyn'],['Illinois','IL','Chicago'],['California','CA','Los Angeles'],['California','CA','Anaheim'],['Massachusetts','MA','Boston'],['Colorado','CO','Colorado Springs'],['Colorado','CO','Lakewood'],['Colorado','CO','Arvada'],['Colorado','CO','Golden'],['Colorado','CO','Centennial'],['Colorado','CO','Broomfield'],['Colorado','CO','Littleton'],['New Hampshire','NH','Greenland'],['New Hampshire','NH','Madbury'],['New Hampshire','NH','Salem'],['New Hampshire','NH','Milford'],['New Hampshire','NH','Portsmouth'],['Texas','TX','Richardson'],['Texas','TX','Carrollton'],['Utah','UT','American Fork'],['Utah','UT','Salt Lake City']
].map(([state,abbr,city])=>({state,abbr,city,stateSlug:slug(state),citySlug:slug(city)}));
export function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
export function states(){return [...new Set(locations.map(x=>x.state))].sort()}
