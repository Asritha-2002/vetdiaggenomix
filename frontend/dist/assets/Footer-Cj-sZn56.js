import{o as e,t}from"./jsx-runtime-9YgKe2Eq.js";import{t as n}from"./react-CM_0bdEm.js";import{i as r,n as i}from"./index-_g8bnRej.js";import{t as a}from"./profile-O6gIG_UJ.js";import{t as o}from"./footer-logo-cmRzTRHh.js";import{a as s,n as c,o as l,r as u,s as d}from"./fa-CUeVdXNj.js";function f(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function p(e){if(Array.isArray(e))return e}function m(e){if(Array.isArray(e))return f(e)}function h(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function g(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,ae(r.key),r)}}function _(e,t,n){return t&&g(e.prototype,t),n&&g(e,n),Object.defineProperty(e,`prototype`,{writable:!1}),e}function v(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=se(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function y(e,t,n){return(t=ae(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function b(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function x(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function ee(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function te(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ne(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function S(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?ne(Object(n),!0).forEach(function(t){y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ne(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function re(e,t){return p(e)||x(e,t)||se(e,t)||ee()}function C(e){return m(e)||b(e)||se(e)||te()}function ie(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function ae(e){var t=ie(e,`string`);return typeof t==`symbol`?t:t+``}function oe(e){"@babel/helpers - typeof";return oe=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},oe(e)}function se(e,t){if(e){if(typeof e==`string`)return f(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}var ce=function(){},le={},ue={},de=null,fe={mark:ce,measure:ce};try{typeof window<`u`&&(le=window),typeof document<`u`&&(ue=document),typeof MutationObserver<`u`&&(de=MutationObserver),typeof performance<`u`&&(fe=performance)}catch{}var pe=(le.navigator||{}).userAgent,me=pe===void 0?``:pe,w=le,T=ue,he=de,ge=fe;w.document;var E=!!T.documentElement&&!!T.head&&typeof T.addEventListener==`function`&&typeof T.createElement==`function`,_e=~me.indexOf(`MSIE`)||~me.indexOf(`Trident/`),ve,ye=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,be=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,xe={classic:{fa:`solid`,fas:`solid`,"fa-solid":`solid`,far:`regular`,"fa-regular":`regular`,fal:`light`,"fa-light":`light`,fat:`thin`,"fa-thin":`thin`,fab:`brands`,"fa-brands":`brands`},duotone:{fa:`solid`,fad:`solid`,"fa-solid":`solid`,"fa-duotone":`solid`,fadr:`regular`,"fa-regular":`regular`,fadl:`light`,"fa-light":`light`,fadt:`thin`,"fa-thin":`thin`},sharp:{fa:`solid`,fass:`solid`,"fa-solid":`solid`,fasr:`regular`,"fa-regular":`regular`,fasl:`light`,"fa-light":`light`,fast:`thin`,"fa-thin":`thin`},"sharp-duotone":{fa:`solid`,fasds:`solid`,"fa-solid":`solid`,fasdr:`regular`,"fa-regular":`regular`,fasdl:`light`,"fa-light":`light`,fasdt:`thin`,"fa-thin":`thin`},slab:{"fa-regular":`regular`,faslr:`regular`},"slab-press":{"fa-regular":`regular`,faslpr:`regular`},thumbprint:{"fa-light":`light`,fatl:`light`},whiteboard:{"fa-semibold":`semibold`,fawsb:`semibold`},notdog:{"fa-solid":`solid`,fans:`solid`},"notdog-duo":{"fa-solid":`solid`,fands:`solid`},etch:{"fa-solid":`solid`,faes:`solid`},graphite:{"fa-thin":`thin`,fagt:`thin`},jelly:{"fa-regular":`regular`,fajr:`regular`},"jelly-fill":{"fa-regular":`regular`,fajfr:`regular`},"jelly-duo":{"fa-regular":`regular`,fajdr:`regular`},chisel:{"fa-regular":`regular`,facr:`regular`},utility:{"fa-semibold":`semibold`,fausb:`semibold`},"utility-duo":{"fa-semibold":`semibold`,faudsb:`semibold`},"utility-fill":{"fa-semibold":`semibold`,faufsb:`semibold`}},Se={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},Ce=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`],D=`classic`,O=`duotone`,we=`sharp`,Te=`sharp-duotone`,Ee=`chisel`,De=`etch`,Oe=`graphite`,ke=`jelly`,Ae=`jelly-duo`,je=`jelly-fill`,Me=`notdog`,Ne=`notdog-duo`,Pe=`slab`,Fe=`slab-press`,Ie=`thumbprint`,Le=`utility`,Re=`utility-duo`,ze=`utility-fill`,Be=`whiteboard`,Ve=`Classic`,He=`Duotone`,Ue=`Sharp`,We=`Sharp Duotone`,Ge=`Chisel`,Ke=`Etch`,qe=`Graphite`,Je=`Jelly`,Ye=`Jelly Duo`,Xe=`Jelly Fill`,Ze=`Notdog`,Qe=`Notdog Duo`,$e=`Slab`,et=`Slab Press`,tt=`Thumbprint`,nt=`Utility`,rt=`Utility Duo`,it=`Utility Fill`,at=`Whiteboard`,ot=[D,O,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be];ve={},y(y(y(y(y(y(y(y(y(y(ve,D,Ve),O,He),we,Ue),Te,We),Ee,Ge),De,Ke),Oe,qe),ke,Je),Ae,Ye),je,Xe),y(y(y(y(y(y(y(y(y(ve,Me,Ze),Ne,Qe),Pe,$e),Fe,et),Ie,tt),Le,nt),Re,rt),ze,it),Be,at);var st={classic:{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},duotone:{900:`fad`,400:`fadr`,300:`fadl`,100:`fadt`},sharp:{900:`fass`,400:`fasr`,300:`fasl`,100:`fast`},"sharp-duotone":{900:`fasds`,400:`fasdr`,300:`fasdl`,100:`fasdt`},slab:{400:`faslr`},"slab-press":{400:`faslpr`},whiteboard:{600:`fawsb`},thumbprint:{300:`fatl`},notdog:{900:`fans`},"notdog-duo":{900:`fands`},etch:{900:`faes`},graphite:{100:`fagt`},chisel:{400:`facr`},jelly:{400:`fajr`},"jelly-fill":{400:`fajfr`},"jelly-duo":{400:`fajdr`},utility:{600:`fausb`},"utility-duo":{600:`faudsb`},"utility-fill":{600:`faufsb`}},ct={"Font Awesome 7 Free":{900:`fas`,400:`far`},"Font Awesome 7 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},"Font Awesome 7 Brands":{400:`fab`,normal:`fab`},"Font Awesome 7 Duotone":{900:`fad`,400:`fadr`,normal:`fadr`,300:`fadl`,100:`fadt`},"Font Awesome 7 Sharp":{900:`fass`,400:`fasr`,normal:`fasr`,300:`fasl`,100:`fast`},"Font Awesome 7 Sharp Duotone":{900:`fasds`,400:`fasdr`,normal:`fasdr`,300:`fasdl`,100:`fasdt`},"Font Awesome 7 Jelly":{400:`fajr`,normal:`fajr`},"Font Awesome 7 Jelly Fill":{400:`fajfr`,normal:`fajfr`},"Font Awesome 7 Jelly Duo":{400:`fajdr`,normal:`fajdr`},"Font Awesome 7 Slab":{400:`faslr`,normal:`faslr`},"Font Awesome 7 Slab Press":{400:`faslpr`,normal:`faslpr`},"Font Awesome 7 Thumbprint":{300:`fatl`,normal:`fatl`},"Font Awesome 7 Notdog":{900:`fans`,normal:`fans`},"Font Awesome 7 Notdog Duo":{900:`fands`,normal:`fands`},"Font Awesome 7 Etch":{900:`faes`,normal:`faes`},"Font Awesome 7 Graphite":{100:`fagt`,normal:`fagt`},"Font Awesome 7 Chisel":{400:`facr`,normal:`facr`},"Font Awesome 7 Whiteboard":{600:`fawsb`,normal:`fawsb`},"Font Awesome 7 Utility":{600:`fausb`,normal:`fausb`},"Font Awesome 7 Utility Duo":{600:`faudsb`,normal:`faudsb`},"Font Awesome 7 Utility Fill":{600:`faufsb`,normal:`faufsb`}},lt=new Map([[`classic`,{defaultShortPrefixId:`fas`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`,`brands`],futureStyleIds:[],defaultFontWeight:900}],[`duotone`,{defaultShortPrefixId:`fad`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp`,{defaultShortPrefixId:`fass`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp-duotone`,{defaultShortPrefixId:`fasds`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`chisel`,{defaultShortPrefixId:`facr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`etch`,{defaultShortPrefixId:`faes`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`graphite`,{defaultShortPrefixId:`fagt`,defaultStyleId:`thin`,styleIds:[`thin`],futureStyleIds:[],defaultFontWeight:100}],[`jelly`,{defaultShortPrefixId:`fajr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-duo`,{defaultShortPrefixId:`fajdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-fill`,{defaultShortPrefixId:`fajfr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`notdog`,{defaultShortPrefixId:`fans`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog-duo`,{defaultShortPrefixId:`fands`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`slab`,{defaultShortPrefixId:`faslr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press`,{defaultShortPrefixId:`faslpr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`thumbprint`,{defaultShortPrefixId:`fatl`,defaultStyleId:`light`,styleIds:[`light`],futureStyleIds:[],defaultFontWeight:300}],[`utility`,{defaultShortPrefixId:`fausb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-duo`,{defaultShortPrefixId:`faudsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-fill`,{defaultShortPrefixId:`faufsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`whiteboard`,{defaultShortPrefixId:`fawsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}]]),ut={chisel:{regular:`facr`},classic:{brands:`fab`,light:`fal`,regular:`far`,solid:`fas`,thin:`fat`},duotone:{light:`fadl`,regular:`fadr`,solid:`fad`,thin:`fadt`},etch:{solid:`faes`},graphite:{thin:`fagt`},jelly:{regular:`fajr`},"jelly-duo":{regular:`fajdr`},"jelly-fill":{regular:`fajfr`},notdog:{solid:`fans`},"notdog-duo":{solid:`fands`},sharp:{light:`fasl`,regular:`fasr`,solid:`fass`,thin:`fast`},"sharp-duotone":{light:`fasdl`,regular:`fasdr`,solid:`fasds`,thin:`fasdt`},slab:{regular:`faslr`},"slab-press":{regular:`faslpr`},thumbprint:{light:`fatl`},utility:{semibold:`fausb`},"utility-duo":{semibold:`faudsb`},"utility-fill":{semibold:`faufsb`},whiteboard:{semibold:`fawsb`}},dt=[`fak`,`fa-kit`,`fakd`,`fa-kit-duotone`],ft={kit:{fak:`kit`,"fa-kit":`kit`},"kit-duotone":{fakd:`kit-duotone`,"fa-kit-duotone":`kit-duotone`}},pt=[`kit`];y(y({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var mt={kit:{"fa-kit":`fak`},"kit-duotone":{"fa-kit-duotone":`fakd`}},ht={"Font Awesome Kit":{400:`fak`,normal:`fak`},"Font Awesome Kit Duotone":{400:`fakd`,normal:`fakd`}},gt={kit:{fak:`fa-kit`},"kit-duotone":{fakd:`fa-kit-duotone`}},_t={kit:{kit:`fak`},"kit-duotone":{"kit-duotone":`fakd`}},vt,yt={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},bt=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`];vt={},y(y(y(y(y(y(y(y(y(y(vt,`classic`,`Classic`),`duotone`,`Duotone`),`sharp`,`Sharp`),`sharp-duotone`,`Sharp Duotone`),`chisel`,`Chisel`),`etch`,`Etch`),`graphite`,`Graphite`),`jelly`,`Jelly`),`jelly-duo`,`Jelly Duo`),`jelly-fill`,`Jelly Fill`),y(y(y(y(y(y(y(y(y(vt,`notdog`,`Notdog`),`notdog-duo`,`Notdog Duo`),`slab`,`Slab`),`slab-press`,`Slab Press`),`thumbprint`,`Thumbprint`),`utility`,`Utility`),`utility-duo`,`Utility Duo`),`utility-fill`,`Utility Fill`),`whiteboard`,`Whiteboard`),y(y({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var xt={classic:{"fa-brands":`fab`,"fa-duotone":`fad`,"fa-light":`fal`,"fa-regular":`far`,"fa-solid":`fas`,"fa-thin":`fat`},duotone:{"fa-regular":`fadr`,"fa-light":`fadl`,"fa-thin":`fadt`},sharp:{"fa-solid":`fass`,"fa-regular":`fasr`,"fa-light":`fasl`,"fa-thin":`fast`},"sharp-duotone":{"fa-solid":`fasds`,"fa-regular":`fasdr`,"fa-light":`fasdl`,"fa-thin":`fasdt`},slab:{"fa-regular":`faslr`},"slab-press":{"fa-regular":`faslpr`},whiteboard:{"fa-semibold":`fawsb`},thumbprint:{"fa-light":`fatl`},notdog:{"fa-solid":`fans`},"notdog-duo":{"fa-solid":`fands`},etch:{"fa-solid":`faes`},graphite:{"fa-thin":`fagt`},jelly:{"fa-regular":`fajr`},"jelly-fill":{"fa-regular":`fajfr`},"jelly-duo":{"fa-regular":`fajdr`},chisel:{"fa-regular":`facr`},utility:{"fa-semibold":`fausb`},"utility-duo":{"fa-semibold":`faudsb`},"utility-fill":{"fa-semibold":`faufsb`}},St={classic:[`fas`,`far`,`fal`,`fat`,`fad`],duotone:[`fadr`,`fadl`,`fadt`],sharp:[`fass`,`fasr`,`fasl`,`fast`],"sharp-duotone":[`fasds`,`fasdr`,`fasdl`,`fasdt`],slab:[`faslr`],"slab-press":[`faslpr`],whiteboard:[`fawsb`],thumbprint:[`fatl`],notdog:[`fans`],"notdog-duo":[`fands`],etch:[`faes`],graphite:[`fagt`],jelly:[`fajr`],"jelly-fill":[`fajfr`],"jelly-duo":[`fajdr`],chisel:[`facr`],utility:[`fausb`],"utility-duo":[`faudsb`],"utility-fill":[`faufsb`]},Ct={classic:{fab:`fa-brands`,fad:`fa-duotone`,fal:`fa-light`,far:`fa-regular`,fas:`fa-solid`,fat:`fa-thin`},duotone:{fadr:`fa-regular`,fadl:`fa-light`,fadt:`fa-thin`},sharp:{fass:`fa-solid`,fasr:`fa-regular`,fasl:`fa-light`,fast:`fa-thin`},"sharp-duotone":{fasds:`fa-solid`,fasdr:`fa-regular`,fasdl:`fa-light`,fasdt:`fa-thin`},slab:{faslr:`fa-regular`},"slab-press":{faslpr:`fa-regular`},whiteboard:{fawsb:`fa-semibold`},thumbprint:{fatl:`fa-light`},notdog:{fans:`fa-solid`},"notdog-duo":{fands:`fa-solid`},etch:{faes:`fa-solid`},graphite:{fagt:`fa-thin`},jelly:{fajr:`fa-regular`},"jelly-fill":{fajfr:`fa-regular`},"jelly-duo":{fajdr:`fa-regular`},chisel:{facr:`fa-regular`},utility:{fausb:`fa-semibold`},"utility-duo":{faudsb:`fa-semibold`},"utility-fill":{faufsb:`fa-semibold`}},wt=`fa.fas.far.fal.fat.fad.fadr.fadl.fadt.fab.fass.fasr.fasl.fast.fasds.fasdr.fasdl.fasdt.faslr.faslpr.fawsb.fatl.fans.fands.faes.fagt.fajr.fajfr.fajdr.facr.fausb.faudsb.faufsb`.split(`.`).concat(bt,[`fa-solid`,`fa-regular`,`fa-light`,`fa-thin`,`fa-duotone`,`fa-brands`,`fa-semibold`]),Tt=[`solid`,`regular`,`light`,`thin`,`duotone`,`brands`,`semibold`],Et=[1,2,3,4,5,6,7,8,9,10],Dt=Et.concat([11,12,13,14,15,16,17,18,19,20]),Ot=[].concat(C(Object.keys(St)),Tt,[`aw`,`fw`,`pull-left`,`pull-right`],[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`beat`,`border`,`fade`,`beat-fade`,`bounce`,`flip-both`,`flip-horizontal`,`flip-vertical`,`flip`,`inverse`,`layers`,`layers-bottom-left`,`layers-bottom-right`,`layers-counter`,`layers-text`,`layers-top-left`,`layers-top-right`,`li`,`pull-end`,`pull-start`,`pulse`,`rotate-180`,`rotate-270`,`rotate-90`,`rotate-by`,`shake`,`spin-pulse`,`spin-reverse`,`spin`,`stack-1x`,`stack-2x`,`stack`,`ul`,`width-auto`,`width-fixed`,yt.GROUP,yt.SWAP_OPACITY,yt.PRIMARY,yt.SECONDARY],Et.map(function(e){return`${e}x`}),Dt.map(function(e){return`w-${e}`})),kt={"Font Awesome 5 Free":{900:`fas`,400:`far`},"Font Awesome 5 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`},"Font Awesome 5 Brands":{400:`fab`,normal:`fab`},"Font Awesome 5 Duotone":{900:`fad`}},k=`___FONT_AWESOME___`,At=16,jt=`fa`,Mt=`svg-inline--fa`,A=`data-fa-i2svg`,Nt=`data-fa-pseudo-element`,Pt=`data-fa-pseudo-element-pending`,Ft=`data-prefix`,It=`data-icon`,Lt=`fontawesome-i2svg`,Rt=`async`,zt=[`HTML`,`HEAD`,`STYLE`,`SCRIPT`],Bt=[`::before`,`::after`,`:before`,`:after`],Vt=function(){try{return!0}catch{return!1}}();function Ht(e){return new Proxy(e,{get:function(e,t){return t in e?e[t]:e[D]}})}var Ut=S({},xe);Ut[D]=S(S(S(S({},{"fa-duotone":`duotone`}),xe[D]),ft.kit),ft[`kit-duotone`]);var Wt=Ht(Ut),Gt=S({},ut);Gt[D]=S(S(S(S({},{duotone:`fad`}),Gt[D]),_t.kit),_t[`kit-duotone`]);var Kt=Ht(Gt),qt=S({},Ct);qt[D]=S(S({},qt[D]),gt.kit);var Jt=Ht(qt),Yt=S({},xt);Yt[D]=S(S({},Yt[D]),mt.kit),Ht(Yt);var Xt=ye,Zt=`fa-layers-text`,Qt=be;Ht(S({},st));var $t=[`class`,`data-prefix`,`data-icon`,`data-fa-transform`,`data-fa-mask`],en=Se,tn=[].concat(C(pt),C(Ot)),j=w.FontAwesomeConfig||{};function nn(e){var t=T.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function rn(e){return e===``?!0:e===`false`?!1:e===`true`?!0:e}T&&typeof T.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-css-prefix`,`cssPrefix`],[`data-family-default`,`familyDefault`],[`data-style-default`,`styleDefault`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-search-pseudo-elements-warnings`,`searchPseudoElementsWarnings`],[`data-search-pseudo-elements-full-scan`,`searchPseudoElementsFullScan`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=re(e,2),n=t[0],r=t[1],i=rn(nn(n));i!=null&&(j[r]=i)});var an={styleDefault:`solid`,familyDefault:D,cssPrefix:jt,replacementClass:Mt,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};j.familyPrefix&&(j.cssPrefix=j.familyPrefix);var M=S(S({},an),j);M.autoReplaceSvg||(M.observeMutations=!1);var N={};Object.keys(an).forEach(function(e){Object.defineProperty(N,e,{enumerable:!0,set:function(t){M[e]=t,P.forEach(function(e){return e(N)})},get:function(){return M[e]}})}),Object.defineProperty(N,`familyPrefix`,{enumerable:!0,set:function(e){M.cssPrefix=e,P.forEach(function(e){return e(N)})},get:function(){return M.cssPrefix}}),w.FontAwesomeConfig=N;var P=[];function on(e){return P.push(e),function(){P.splice(P.indexOf(e),1)}}var F=At,I={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function sn(e){if(!(!e||!E)){var t=T.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=T.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return T.head.insertBefore(t,r),e}}var cn=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function ln(){for(var e=12,t=``;e-- >0;)t+=cn[Math.random()*62|0];return t}function L(e){for(var t=[],n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function un(e){return e.classList?L(e.classList):(e.getAttribute(`class`)||``).split(` `).filter(function(e){return e})}function dn(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function fn(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${dn(e[n])}" `},``).trim()}function pn(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n].trim()};`},``)}function mn(e){return e.size!==I.size||e.x!==I.x||e.y!==I.y||e.rotate!==I.rotate||e.flipX||e.flipY}function hn(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}function gn(e){var t=e.transform,n=e.width,r=n===void 0?At:n,i=e.height,a=i===void 0?At:i,o=e.startCentered,s=o===void 0?!1:o,c=``;return s&&_e?c+=`translate(${t.x/F-r/2}em, ${t.y/F-a/2}em) `:s?c+=`translate(calc(-50% + ${t.x/F}em), calc(-50% + ${t.y/F}em)) `:c+=`translate(${t.x/F}em, ${t.y/F}em) `,c+=`scale(${t.size/F*(t.flipX?-1:1)}, ${t.size/F*(t.flipY?-1:1)}) `,c+=`rotate(${t.rotate}deg) `,c}var _n=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function vn(){var e=jt,t=Mt,n=N.cssPrefix,r=N.replacementClass,i=_n;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var yn=!1;function bn(){N.autoAddCss&&!yn&&(sn(vn()),yn=!0)}var xn={mixout:function(){return{dom:{css:vn,insertCss:bn}}},hooks:function(){return{beforeDOMElementCreation:function(){bn()},beforeI2svg:function(){bn()}}}},R=w||{};R[k]||(R[k]={}),R[k].styles||(R[k].styles={}),R[k].hooks||(R[k].hooks={}),R[k].shims||(R[k].shims=[]);var z=R[k],Sn=[],Cn=function(){T.removeEventListener(`DOMContentLoaded`,Cn),wn=1,Sn.map(function(e){return e()})},wn=!1;E&&(wn=(T.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(T.readyState),wn||T.addEventListener(`DOMContentLoaded`,Cn));function Tn(e){E&&(wn?setTimeout(e,0):Sn.push(e))}function En(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?dn(e):`<${t} ${fn(r)}>${a.map(En).join(``)}</${t}>`}function Dn(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var On=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},kn=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:On(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function An(e){return C(e).length===1?e.codePointAt(0).toString(16):null}function jn(e){return Object.keys(e).reduce(function(t,n){var r=e[n];return r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function Mn(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n===void 0?!1:n,i=jn(t);typeof z.hooks.addPack==`function`&&!r?z.hooks.addPack(e,jn(t)):z.styles[e]=S(S({},z.styles[e]||{}),i),e===`fas`&&Mn(`fa`,t)}var Nn=z.styles,Pn=z.shims,Fn=Object.keys(Jt),In=Fn.reduce(function(e,t){return e[t]=Object.keys(Jt[t]),e},{}),Ln=null,Rn={},zn={},Bn={},Vn={},Hn={};function Un(e){return~tn.indexOf(e)}function Wn(e,t){var n=t.split(`-`),r=n[0],i=n.slice(1).join(`-`);return r===e&&i!==``&&!Un(i)?i:null}var Gn=function(){var e=function(e){return kn(Nn,function(t,n,r){return t[r]=kn(n,e,{}),t},{})};Rn=e(function(e,t,n){return t[3]&&(e[t[3]]=n),t[2]&&t[2].filter(function(e){return typeof e==`number`}).forEach(function(t){e[t.toString(16)]=n}),e}),zn=e(function(e,t,n){return e[n]=n,t[2]&&t[2].filter(function(e){return typeof e==`string`}).forEach(function(t){e[t]=n}),e}),Hn=e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in Nn||N.autoFetchSvg,n=kn(Pn,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),typeof r==`string`&&(e.names[r]={prefix:i,iconName:a}),typeof r==`number`&&(e.unicodes[r.toString(16)]={prefix:i,iconName:a}),e},{names:{},unicodes:{}});Bn=n.names,Vn=n.unicodes,Ln=Qn(N.styleDefault,{family:N.familyDefault})};on(function(e){Ln=Qn(e.styleDefault,{family:N.familyDefault})}),Gn();function Kn(e,t){return(Rn[e]||{})[t]}function qn(e,t){return(zn[e]||{})[t]}function B(e,t){return(Hn[e]||{})[t]}function Jn(e){return Bn[e]||{prefix:null,iconName:null}}function Yn(e){var t=Vn[e],n=Kn(`fas`,e);return t||(n?{prefix:`fas`,iconName:n}:null)||{prefix:null,iconName:null}}function V(){return Ln}var Xn=function(){return{prefix:null,iconName:null,rest:[]}};function Zn(e){var t=D,n=Fn.reduce(function(e,t){return e[t]=`${N.cssPrefix}-${t}`,e},{});return ot.forEach(function(r){(e.includes(n[r])||e.some(function(e){return In[r].includes(e)}))&&(t=r)}),t}function Qn(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).family,n=t===void 0?D:t,r=Wt[n][e];if(n===O&&!e)return`fad`;var i=Kt[n][e]||Kt[n][r],a=e in z.styles?e:null;return i||a||null}function $n(e){var t=[],n=null;return e.forEach(function(e){var r=Wn(N.cssPrefix,e);r?n=r:e&&t.push(e)}),{iconName:n,rest:t}}function er(e){return e.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var tr=wt.concat(dt);function nr(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).skipLookups,n=t===void 0?!1:t,r=null,i=er(e.filter(function(e){return tr.includes(e)})),a=er(e.filter(function(e){return!tr.includes(e)})),o=re(i.filter(function(e){return r=e,!Ce.includes(e)}),1)[0],s=o===void 0?null:o,c=Zn(i),l=S(S({},$n(a)),{},{prefix:Qn(s,{family:c})});return S(S(S({},l),or({values:e,family:c,styles:Nn,config:N,canonical:l,givenPrefix:r})),rr(n,r,l))}function rr(e,t,n){var r=n.prefix,i=n.iconName;if(e||!r||!i)return{prefix:r,iconName:i};var a=t===`fa`?Jn(i):{},o=B(r,i);return i=a.iconName||o||i,r=a.prefix||r,r===`far`&&!Nn.far&&Nn.fas&&!N.autoFetchSvg&&(r=`fas`),{prefix:r,iconName:i}}var ir=ot.filter(function(e){return e!==D||e!==O}),ar=Object.keys(Ct).filter(function(e){return e!==D}).map(function(e){return Object.keys(Ct[e])}).flat();function or(e){var t=e.values,n=e.family,r=e.canonical,i=e.givenPrefix,a=i===void 0?``:i,o=e.styles,s=o===void 0?{}:o,c=e.config,l=c===void 0?{}:c,u=n===O,d=t.includes(`fa-duotone`)||t.includes(`fad`),f=l.familyDefault===`duotone`,p=r.prefix===`fad`||r.prefix===`fa-duotone`;return!u&&(d||f||p)&&(r.prefix=`fad`),(t.includes(`fa-brands`)||t.includes(`fab`))&&(r.prefix=`fab`),!r.prefix&&ir.includes(n)&&(Object.keys(s).find(function(e){return ar.includes(e)})||l.autoFetchSvg)&&(r.prefix=lt.get(n).defaultShortPrefixId,r.iconName=B(r.prefix,r.iconName)||r.iconName),(r.prefix===`fa`||a===`fa`)&&(r.prefix=V()||`fas`),r}var sr=function(){function e(){h(this,e),this.definitions={}}return _(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=S(S({},e.definitions[n]||{}),t[n]),Mn(n,t[n]);var r=Jt[D][n];r&&Mn(r,t[n]),Gn()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon,s=o[2];e[i]||(e[i]={}),s.length>0&&s.forEach(function(t){typeof t==`string`&&(e[i][t]=o)}),e[i][a]=o}),e}}])}(),cr=[],H={},U={},lr=Object.keys(U);function ur(e,t){var n=t.mixoutsTo;return cr=e,H={},Object.keys(U).forEach(function(e){lr.indexOf(e)===-1&&delete U[e]}),cr.forEach(function(e){var t=e.mixout?e.mixout():{};if(Object.keys(t).forEach(function(e){typeof t[e]==`function`&&(n[e]=t[e]),oe(t[e])===`object`&&Object.keys(t[e]).forEach(function(r){n[e]||(n[e]={}),n[e][r]=t[e][r]})}),e.hooks){var r=e.hooks();Object.keys(r).forEach(function(e){H[e]||(H[e]=[]),H[e].push(r[e])})}e.provides&&e.provides(U)}),n}function dr(e,t){var n=[...arguments].slice(2);return(H[e]||[]).forEach(function(e){t=e.apply(null,[t].concat(n))}),t}function W(e){var t=[...arguments].slice(1);(H[e]||[]).forEach(function(e){e.apply(null,t)})}function G(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return U[e]?U[e].apply(null,t):void 0}function fr(e){e.prefix===`fa`&&(e.prefix=`fas`);var t=e.iconName,n=e.prefix||V();if(t)return t=B(n,t)||t,Dn(pr.definitions,n,t)||Dn(z.styles,n,t)}var pr=new sr,K={noAuto:function(){N.autoReplaceSvg=!1,N.observeMutations=!1,W(`noAuto`)},config:N,dom:{i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return E?(W(`beforeI2svg`,e),G(`pseudoElements2svg`,e),G(`i2svg`,e)):Promise.reject(Error(`Operation requires a DOM of some kind.`))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;N.autoReplaceSvg===!1&&(N.autoReplaceSvg=!0),N.observeMutations=!0,Tn(function(){mr({autoReplaceSvgRoot:t}),W(`watch`,e)})}},parse:{icon:function(e){if(e===null)return null;if(oe(e)===`object`&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:B(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf(`fa-`)===0?e[1].slice(3):e[1],n=Qn(e[0]);return{prefix:n,iconName:B(n,t)||t}}if(typeof e==`string`&&(e.indexOf(`${N.cssPrefix}-`)>-1||e.match(Xt))){var r=nr(e.split(` `),{skipLookups:!0});return{prefix:r.prefix||V(),iconName:B(r.prefix,r.iconName)||r.iconName}}if(typeof e==`string`){var i=V();return{prefix:i,iconName:B(i,e)||e}}}},library:pr,findIconDefinition:fr,toHtml:En},mr=function(){var e=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).autoReplaceSvgRoot,t=e===void 0?T:e;(Object.keys(z.styles).length>0||N.autoFetchSvg)&&E&&N.autoReplaceSvg&&K.dom.i2svg({node:t})};function hr(e,t){return Object.defineProperty(e,`abstract`,{get:t}),Object.defineProperty(e,`html`,{get:function(){return e.abstract.map(function(e){return En(e)})}}),Object.defineProperty(e,`node`,{get:function(){if(E){var t=T.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function gr(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(mn(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=pn(S(S({},a),{},{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function _r(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol,o=a===!0?`${t}-${N.cssPrefix}-${n}`:a;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:S(S({},i),{},{id:o}),children:r}]}]}function vr(e){return[`aria-label`,`aria-labelledby`,`title`,`role`].some(function(t){return t in e})}function yr(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.maskId,l=e.extra,u=e.watchable,d=u===void 0?!1:u,f=r.found?r:n,p=f.width,m=f.height,h=[N.replacementClass,a?`${N.cssPrefix}-${a}`:``].filter(function(e){return l.classes.indexOf(e)===-1}).filter(function(e){return e!==``||!!e}).concat(l.classes).join(` `),g={children:[],attributes:S(S({},l.attributes),{},{"data-prefix":i,"data-icon":a,class:h,role:l.attributes.role||`img`,viewBox:`0 0 ${p} ${m}`})};!vr(l.attributes)&&!l.attributes[`aria-hidden`]&&(g.attributes[`aria-hidden`]=`true`),d&&(g.attributes[A]=``);var _=S(S({},g),{},{prefix:i,iconName:a,main:n,mask:r,maskId:c,transform:o,symbol:s,styles:S({},l.styles)}),v=r.found&&n.found?G(`generateAbstractMask`,_)||{children:[],attributes:{}}:G(`generateAbstractIcon`,_)||{children:[],attributes:{}},y=v.children,b=v.attributes;return _.children=y,_.attributes=b,s?_r(_):gr(_)}function br(e){var t=e.content,n=e.width,r=e.height,i=e.transform,a=e.extra,o=e.watchable,s=o===void 0?!1:o,c=S(S({},a.attributes),{},{class:a.classes.join(` `)});s&&(c[A]=``);var l=S({},a.styles);mn(i)&&(l.transform=gn({transform:i,startCentered:!0,width:n,height:r}),l[`-webkit-transform`]=l.transform);var u=pn(l);u.length>0&&(c.style=u);var d=[];return d.push({tag:`span`,attributes:c,children:[t]}),d}function xr(e){var t=e.content,n=e.extra,r=S(S({},n.attributes),{},{class:n.classes.join(` `)}),i=pn(n.styles);i.length>0&&(r.style=i);var a=[];return a.push({tag:`span`,attributes:r,children:[t]}),a}var Sr=z.styles;function Cr(e){var t=e[0],n=e[1],r=re(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${N.cssPrefix}-${en.GROUP}`},children:[{tag:`path`,attributes:{class:`${N.cssPrefix}-${en.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${N.cssPrefix}-${en.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}var wr={found:!1,width:512,height:512};function Tr(e,t){!Vt&&!N.showMissingIcons&&e&&console.error(`Icon with name "${e}" and prefix "${t}" is missing.`)}function Er(e,t){var n=t;return t===`fa`&&N.styleDefault!==null&&(t=V()),new Promise(function(r,i){if(n===`fa`){var a=Jn(e)||{};e=a.iconName||e,t=a.prefix||t}if(e&&t&&Sr[t]&&Sr[t][e]){var o=Sr[t][e];return r(Cr(o))}Tr(e,t),r(S(S({},wr),{},{icon:N.showMissingIcons&&e&&G(`missingIconAbstract`)||{}}))})}var Dr=function(){},Or=N.measurePerformance&&ge&&ge.mark&&ge.measure?ge:{mark:Dr,measure:Dr},kr=`FA "7.2.0"`,Ar=function(e){return Or.mark(`${kr} ${e} begins`),function(){return jr(e)}},jr=function(e){Or.mark(`${kr} ${e} ends`),Or.measure(`${kr} ${e}`,`${kr} ${e} begins`,`${kr} ${e} ends`)},Mr={begin:Ar,end:jr},Nr=function(){};function Pr(e){return typeof(e.getAttribute?e.getAttribute(A):null)==`string`}function Fr(e){var t=e.getAttribute?e.getAttribute(Ft):null,n=e.getAttribute?e.getAttribute(It):null;return t&&n}function Ir(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(N.replacementClass)}function Lr(){return N.autoReplaceSvg===!0?Hr.replace:Hr[N.autoReplaceSvg]||Hr.replace}function Rr(e){return T.createElementNS(`http://www.w3.org/2000/svg`,e)}function zr(e){return T.createElement(e)}function Br(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).ceFn,n=t===void 0?e.tag===`svg`?Rr:zr:t;if(typeof e==`string`)return T.createTextNode(e);var r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(t){r.setAttribute(t,e.attributes[t])}),(e.children||[]).forEach(function(e){r.appendChild(Br(e,{ceFn:n}))}),r}function Vr(e){var t=` ${e.outerHTML} `;return t=`${t}Font Awesome fontawesome.com `,t}var Hr={replace:function(e){var t=e[0];if(t.parentNode)if(e[1].forEach(function(e){t.parentNode.insertBefore(Br(e),t)}),t.getAttribute(A)===null&&N.keepOriginalSource){var n=T.createComment(Vr(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){var t=e[0],n=e[1];if(~un(t).indexOf(N.replacementClass))return Hr.replace(e);var r=RegExp(`${N.cssPrefix}-.*`);if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(` `).reduce(function(e,t){return t===N.replacementClass||t.match(r)?e.toSvg.push(t):e.toNode.push(t),e},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(` `),i.toNode.length===0?t.removeAttribute(`class`):t.setAttribute(`class`,i.toNode.join(` `))}var a=n.map(function(e){return En(e)}).join(`
`);t.setAttribute(A,``),t.innerHTML=a}};function Ur(e){e()}function Wr(e,t){var n=typeof t==`function`?t:Nr;if(e.length===0)n();else{var r=Ur;N.mutateApproach===Rt&&(r=w.requestAnimationFrame||Ur),r(function(){var t=Lr(),r=Mr.begin(`mutate`);e.map(t),r(),n()})}}var Gr=!1;function Kr(){Gr=!0}function qr(){Gr=!1}var Jr=null;function Yr(e){if(he&&N.observeMutations){var t=e.treeCallback,n=t===void 0?Nr:t,r=e.nodeCallback,i=r===void 0?Nr:r,a=e.pseudoElementsCallback,o=a===void 0?Nr:a,s=e.observeMutationsRoot,c=s===void 0?T:s;Jr=new he(function(e){if(!Gr){var t=V();L(e).forEach(function(e){if(e.type===`childList`&&e.addedNodes.length>0&&!Pr(e.addedNodes[0])&&(N.searchPseudoElements&&o(e.target),n(e.target)),e.type===`attributes`&&e.target.parentNode&&N.searchPseudoElements&&o([e.target],!0),e.type===`attributes`&&Pr(e.target)&&~$t.indexOf(e.attributeName))if(e.attributeName===`class`&&Fr(e.target)){var r=nr(un(e.target)),a=r.prefix,s=r.iconName;e.target.setAttribute(Ft,a||t),s&&e.target.setAttribute(It,s)}else Ir(e.target)&&i(e.target)})}}),E&&Jr.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Xr(){Jr&&Jr.disconnect()}function Zr(e){var t=e.getAttribute(`style`),n=[];return t&&(n=t.split(`;`).reduce(function(e,t){var n=t.split(`:`),r=n[0],i=n.slice(1);return r&&i.length>0&&(e[r]=i.join(`:`).trim()),e},{})),n}function Qr(e){var t=e.getAttribute(`data-prefix`),n=e.getAttribute(`data-icon`),r=e.innerText===void 0?``:e.innerText.trim(),i=nr(un(e));return i.prefix||=V(),t&&n&&(i.prefix=t,i.iconName=n),i.iconName&&i.prefix?i:(i.prefix&&r.length>0&&(i.iconName=qn(i.prefix,e.innerText)||Kn(i.prefix,An(e.innerText))),!i.iconName&&N.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=e.firstChild.data),i)}function $r(e){return L(e.attributes).reduce(function(e,t){return e.name!==`class`&&e.name!==`style`&&(e[t.name]=t.value),e},{})}function ei(){return{iconName:null,prefix:null,transform:I,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function ti(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=Qr(e),r=n.iconName,i=n.prefix,a=n.rest,o=$r(e),s=dr(`parseNodeAttributes`,{},e);return S({iconName:r,prefix:i,transform:I,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:t.styleParser?Zr(e):[],attributes:o}},s)}var ni=z.styles;function ri(e){var t=N.autoReplaceSvg===`nest`?ti(e,{styleParser:!1}):ti(e);return~t.extra.classes.indexOf(Zt)?G(`generateLayersText`,e,t):G(`generateSvgReplacementMutation`,e,t)}function ii(){return[].concat(C(dt),C(wt))}function ai(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!E)return Promise.resolve();var n=T.documentElement.classList,r=function(e){return n.add(`${Lt}-${e}`)},i=function(e){return n.remove(`${Lt}-${e}`)},a=N.autoFetchSvg?ii():Ce.concat(Object.keys(ni));a.includes(`fa`)||a.push(`fa`);var o=[`.${Zt}:not([${A}])`].concat(a.map(function(e){return`.${e}:not([${A}])`})).join(`, `);if(o.length===0)return Promise.resolve();var s=[];try{s=L(e.querySelectorAll(o))}catch{}if(s.length>0)r(`pending`),i(`complete`);else return Promise.resolve();var c=Mr.begin(`onTree`),l=s.reduce(function(e,t){try{var n=ri(t);n&&e.push(n)}catch(e){Vt||e.name===`MissingIcon`&&console.error(e)}return e},[]);return new Promise(function(e,n){Promise.all(l).then(function(n){Wr(n,function(){r(`active`),r(`complete`),i(`pending`),typeof t==`function`&&t(),c(),e()})}).catch(function(e){c(),n(e)})})}function oi(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;ri(e).then(function(e){e&&Wr([e],t)})}function si(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:fr(t||{}),i=n.mask;return i&&=(i||{}).icon?i:fr(i||{}),e(r,S(S({},n),{},{mask:i}))}}var ci=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?I:n,i=t.symbol,a=i===void 0?!1:i,o=t.mask,s=o===void 0?null:o,c=t.maskId,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,_=e.iconName,v=e.icon;return hr(S({type:`icon`},e),function(){return W(`beforeDOMElementCreation`,{iconDefinition:e,params:t}),yr({icons:{main:Cr(v),mask:s?Cr(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:_,transform:S(S({},I),r),symbol:a,maskId:l,extra:{attributes:p,styles:h,classes:d}})})}},li={mixout:function(){return{icon:si(ci)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=ai,e.nodeCallback=oi,e}}},provides:function(e){e.i2svg=function(e){var t=e.node,n=t===void 0?T:t,r=e.callback;return ai(n,r===void 0?function(){}:r)},e.generateSvgReplacementMutation=function(e,t){var n=t.iconName,r=t.prefix,i=t.transform,a=t.symbol,o=t.mask,s=t.maskId,c=t.extra;return new Promise(function(t,l){Promise.all([Er(n,r),o.iconName?Er(o.iconName,o.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(o){var l=re(o,2),u=l[0],d=l[1];t([e,yr({icons:{main:u,mask:d},prefix:r,iconName:n,transform:i,symbol:a,maskId:s,extra:c,watchable:!0})])}).catch(l)})},e.generateAbstractIcon=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=pn(a);o.length>0&&(n.style=o);var s;return mn(i)&&(s=G(`generateAbstractTransformGrouping`,{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),t.push(s||r.icon),{children:t,attributes:n}}}},ui={mixout:function(){return{layer:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.classes,r=n===void 0?[]:n;return hr({type:`layer`},function(){W(`beforeDOMElementCreation`,{assembler:e,params:t});var n=[];return e(function(e){Array.isArray(e)?e.map(function(e){n=n.concat(e.abstract)}):n=n.concat(e.abstract)}),[{tag:`span`,attributes:{class:[`${N.cssPrefix}-layers`].concat(C(r)).join(` `)},children:n}]})}}}},di={mixout:function(){return{counter:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.title,r=n===void 0?null:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return hr({type:`counter`,content:e},function(){return W(`beforeDOMElementCreation`,{content:e,params:t}),xr({content:e.toString(),title:r,extra:{attributes:s,styles:l,classes:[`${N.cssPrefix}-layers-counter`].concat(C(a))}})})}}}},fi={mixout:function(){return{text:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?I:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return hr({type:`text`,content:e},function(){return W(`beforeDOMElementCreation`,{content:e,params:t}),br({content:e,transform:S(S({},I),r),extra:{attributes:s,styles:l,classes:[`${N.cssPrefix}-layers-text`].concat(C(a))}})})}}},provides:function(e){e.generateLayersText=function(e,t){var n=t.transform,r=t.extra,i=null,a=null;if(_e){var o=parseInt(getComputedStyle(e).fontSize,10),s=e.getBoundingClientRect();i=s.width/o,a=s.height/o}return Promise.resolve([e,br({content:e.innerHTML,width:i,height:a,transform:n,extra:r,watchable:!0})])}}},pi=RegExp(`"`,`ug`),mi=[1105920,1112319],hi=S(S(S(S({},{FontAwesome:{normal:`fas`,400:`fas`}}),ct),kt),ht),gi=Object.keys(hi).reduce(function(e,t){return e[t.toLowerCase()]=hi[t],e},{}),_i=Object.keys(gi).reduce(function(e,t){var n=gi[t];return e[t]=n[900]||C(Object.entries(n))[0][1],e},{});function vi(e){return An(C(e.replace(pi,``))[0]||``)}function yi(e){var t=e.getPropertyValue(`font-feature-settings`).includes(`ss01`),n=e.getPropertyValue(`content`).replace(pi,``),r=n.codePointAt(0),i=r>=mi[0]&&r<=mi[1],a=n.length===2?n[0]===n[1]:!1;return i||a||t}function bi(e,t){var n=e.replace(/^['"]|['"]$/g,``).toLowerCase(),r=parseInt(t),i=isNaN(r)?`normal`:r;return(gi[n]||{})[i]||_i[n]}function xi(e,t){var n=`${Pt}${t.replace(`:`,`-`)}`;return new Promise(function(r,i){if(e.getAttribute(n)!==null)return r();var a=L(e.children).filter(function(e){return e.getAttribute(Nt)===t})[0],o=w.getComputedStyle(e,t),s=o.getPropertyValue(`font-family`),c=s.match(Qt),l=o.getPropertyValue(`font-weight`),u=o.getPropertyValue(`content`);if(a&&!c)return e.removeChild(a),r();if(c&&u!==`none`&&u!==``){var d=o.getPropertyValue(`content`),f=bi(s,l),p=vi(d),m=c[0].startsWith(`FontAwesome`),h=yi(o),g=Kn(f,p),_=g;if(m){var v=Yn(p);v.iconName&&v.prefix&&(g=v.iconName,f=v.prefix)}if(g&&!h&&(!a||a.getAttribute(Ft)!==f||a.getAttribute(It)!==_)){e.setAttribute(n,_),a&&e.removeChild(a);var y=ei(),b=y.extra;b.attributes[Nt]=t,Er(g,f).then(function(i){var a=yr(S(S({},y),{},{icons:{main:i,mask:Xn()},prefix:f,iconName:_,extra:b,watchable:!0})),o=T.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t===`::before`?e.insertBefore(o,e.firstChild):e.appendChild(o),o.outerHTML=a.map(function(e){return En(e)}).join(`
`),e.removeAttribute(n),r()}).catch(i)}else r()}else r()})}function Si(e){return Promise.all([xi(e,`::before`),xi(e,`::after`)])}function Ci(e){return e.parentNode!==document.head&&!~zt.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Nt)&&(!e.parentNode||e.parentNode.tagName!==`svg`)}var wi=function(e){return!!e&&Bt.some(function(t){return e.includes(t)})},Ti=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(e){return e.trim()});n=n.flatMap(function(e){return e.includes(`(`)?e:e.split(`,`).map(function(e){return e.trim()})});var r=v(n),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;if(wi(a)){var o=Bt.reduce(function(e,t){return e.replace(t,``)},a);o!==``&&o!==`*`&&t.add(o)}}}catch(e){r.e(e)}finally{r.f()}return t};function Ei(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(E){var n;if(t)n=e;else if(N.searchPseudoElementsFullScan)n=e.querySelectorAll(`*`);else{var r=new Set,i=v(document.styleSheets),a;try{for(i.s();!(a=i.n()).done;){var o=a.value;try{var s=v(o.cssRules),c;try{for(s.s();!(c=s.n()).done;){var l=c.value,u=v(Ti(l.selectorText)),d;try{for(u.s();!(d=u.n()).done;){var f=d.value;r.add(f)}}catch(e){u.e(e)}finally{u.f()}}}catch(e){s.e(e)}finally{s.f()}}catch(e){N.searchPseudoElementsWarnings&&console.warn(`Font Awesome: cannot parse stylesheet: ${o.href} (${e.message})
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`)}}}catch(e){i.e(e)}finally{i.f()}if(!r.size)return;var p=Array.from(r).join(`, `);try{n=e.querySelectorAll(p)}catch{}}return new Promise(function(e,t){var r=L(n).filter(Ci).map(Si),i=Mr.begin(`searchPseudoElements`);Kr(),Promise.all(r).then(function(){i(),qr(),e()}).catch(function(){i(),qr(),t()})})}}var Di={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=Ei,e}}},provides:function(e){e.pseudoElements2svg=function(e){var t=e.node,n=t===void 0?T:t;N.searchPseudoElements&&Ei(n)}}},Oi=!1,ki={mixout:function(){return{dom:{unwatch:function(){Kr(),Oi=!0}}}},hooks:function(){return{bootstrap:function(){Yr(dr(`mutationObserverCallbacks`,{}))},noAuto:function(){Xr()},watch:function(e){var t=e.observeMutationsRoot;Oi?qr():Yr(dr(`mutationObserverCallbacks`,{observeMutationsRoot:t}))}}}},Ai=function(e){return e.toLowerCase().split(` `).reduce(function(e,t){var n=t.toLowerCase().split(`-`),r=n[0],i=n.slice(1).join(`-`);if(r&&i===`h`)return e.flipX=!0,e;if(r&&i===`v`)return e.flipY=!0,e;if(i=parseFloat(i),isNaN(i))return e;switch(r){case`grow`:e.size+=i;break;case`shrink`:e.size-=i;break;case`left`:e.x-=i;break;case`right`:e.x+=i;break;case`up`:e.y-=i;break;case`down`:e.y+=i;break;case`rotate`:e.rotate+=i;break}return e},{size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0})},ji={mixout:function(){return{parse:{transform:function(e){return Ai(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-transform`);return n&&(e.transform=Ai(n)),e}}},provides:function(e){e.generateAbstractTransformGrouping=function(e){var t=e.main,n=e.transform,r=e.containerWidth,i=e.iconWidth,a={outer:{transform:`translate(${r/2} 256)`},inner:{transform:`${`translate(${n.x*32}, ${n.y*32}) `} ${`scale(${n.size/16*(n.flipX?-1:1)}, ${n.size/16*(n.flipY?-1:1)}) `} ${`rotate(${n.rotate} 0 0)`}`},path:{transform:`translate(${i/2*-1} -256)`}};return{tag:`g`,attributes:S({},a.outer),children:[{tag:`g`,attributes:S({},a.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:S(S({},t.icon.attributes),a.path)}]}]}}}},Mi={x:0,y:0,width:`100%`,height:`100%`};function Ni(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function Pi(e){return e.tag===`g`?e.children:[e]}ur([xn,li,ui,di,fi,Di,ki,ji,{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-mask`),r=n?nr(n.split(` `).map(function(e){return e.trim()})):Xn();return r.prefix||=V(),e.mask=r,e.maskId=t.getAttribute(`data-fa-mask-id`),e}}},provides:function(e){e.generateAbstractMask=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.maskId,o=e.transform,s=r.width,c=r.icon,l=i.width,u=i.icon,d=hn({transform:o,containerWidth:l,iconWidth:s}),f={tag:`rect`,attributes:S(S({},Mi),{},{fill:`white`})},p=c.children?{children:c.children.map(Ni)}:{},m={tag:`g`,attributes:S({},d.inner),children:[Ni(S({tag:c.tag,attributes:S(S({},c.attributes),d.path)},p))]},h={tag:`g`,attributes:S({},d.outer),children:[m]},g=`mask-${a||ln()}`,_=`clip-${a||ln()}`,v={tag:`mask`,attributes:S(S({},Mi),{},{id:g,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[f,h]},y={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:_},children:Pi(u)},v]};return t.push(y,{tag:`rect`,attributes:S({fill:`currentColor`,"clip-path":`url(#${_})`,mask:`url(#${g})`},Mi)}),{children:t,attributes:n}}}},{provides:function(e){var t=!1;w.matchMedia&&(t=w.matchMedia(`(prefers-reduced-motion: reduce)`).matches),e.missingIconAbstract=function(){var e=[],n={fill:`currentColor`},r={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};e.push({tag:`path`,attributes:S(S({},n),{},{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`})});var i=S(S({},r),{},{attributeName:`opacity`}),a={tag:`circle`,attributes:S(S({},n),{},{cx:`256`,cy:`364`,r:`28`}),children:[]};return t||a.children.push({tag:`animate`,attributes:S(S({},r),{},{attributeName:`r`,values:`28;14;28;28;14;28;`})},{tag:`animate`,attributes:S(S({},i),{},{values:`1;0;1;1;0;1;`})}),e.push(a),e.push({tag:`path`,attributes:S(S({},n),{},{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),children:t?[]:[{tag:`animate`,attributes:S(S({},i),{},{values:`1;0;0;0;0;1;`})}]}),t||e.push({tag:`path`,attributes:S(S({},n),{},{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),children:[{tag:`animate`,attributes:S(S({},i),{},{values:`0;0;1;1;0;0;`})}]}),{tag:`g`,attributes:{class:`missing`},children:e}}}},{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-symbol`);return e.symbol=n===null?!1:n===``?!0:n,e}}}}],{mixoutsTo:K}),K.noAuto;var q=K.config;K.library,K.dom;var Fi=K.parse;K.findIconDefinition,K.toHtml;var Ii=K.icon;K.layer,K.text,K.counter;var J=e(n(),1),Y=t();function Li(e){return e-=0,e===e}function Ri(e){return Li(e)?e:(e=e.replace(/[_-]+(.)?/g,(e,t)=>t?t.toUpperCase():``),e.charAt(0).toLowerCase()+e.slice(1))}var zi=(e,t)=>J.createElement(`stop`,{key:`${t}-${e.offset}`,offset:e.offset,stopColor:e.color,...e.opacity!==void 0&&{stopOpacity:e.opacity}});function Bi(e){return e.charAt(0).toUpperCase()+e.slice(1)}var X=new Map,Vi=1e3;function Hi(e){if(X.has(e))return X.get(e);let t={},n=0,r=e.length;for(;n<r;){let i=e.indexOf(`;`,n),a=i===-1?r:i,o=e.slice(n,a).trim();if(o){let e=o.indexOf(`:`);if(e>0){let n=o.slice(0,e).trim(),r=o.slice(e+1).trim();if(n&&r){let e=Ri(n);t[e.startsWith(`webkit`)?Bi(e):e]=r}}}n=a+1}if(X.size===Vi){let e=X.keys().next().value;e&&X.delete(e)}return X.set(e,t),t}function Ui(e,t,n={}){if(typeof t==`string`)return t;let r=(t.children||[]).map(t=>{let r=t;return(`fill`in n||n.gradientFill)&&t.tag===`path`&&`fill`in t.attributes&&(r={...t,attributes:{...t.attributes,fill:void 0}}),Ui(e,r)}),i=t.attributes||{},a={};for(let[e,t]of Object.entries(i))switch(!0){case e===`class`:a.className=t;break;case e===`style`:a.style=Hi(String(t));break;case e.startsWith(`aria-`):case e.startsWith(`data-`):a[e.toLowerCase()]=t;break;default:a[Ri(e)]=t}let{style:o,role:s,"aria-label":c,gradientFill:l,...u}=n;if(o&&(a.style=a.style?{...a.style,...o}:o),s&&(a.role=s),c&&(a[`aria-label`]=c,a[`aria-hidden`]=`false`),l){a.fill=`url(#${l.id})`;let{type:t,stops:n=[],...i}=l;r.unshift(e(t===`linear`?`linearGradient`:`radialGradient`,{...i,id:l.id},n.map(zi)))}return e(t.tag,{...a,...u},...r)}var Wi=Ui.bind(null,J.createElement),Gi=(e,t)=>{let n=(0,J.useId)();return e||(t?n:void 0)},Ki=class{constructor(e=`react-fontawesome`){this.enabled=!1;let t=!1;try{t=typeof process<`u`&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}};typeof process<`u`&&{}?.FA_VERSION;var qi=`searchPseudoElementsFullScan`in q&&typeof q.searchPseudoElementsFullScan==`boolean`?`7.0.0`:`6.0.0`,Ji=Number.parseInt(qi)>=7,Yi=()=>Ji,Xi=`fa`,Z={beat:`fa-beat`,fade:`fa-fade`,beatFade:`fa-beat-fade`,bounce:`fa-bounce`,shake:`fa-shake`,spin:`fa-spin`,spinPulse:`fa-spin-pulse`,spinReverse:`fa-spin-reverse`,pulse:`fa-pulse`},Zi={left:`fa-pull-left`,right:`fa-pull-right`},Qi={90:`fa-rotate-90`,180:`fa-rotate-180`,270:`fa-rotate-270`},$i={"2xs":`fa-2xs`,xs:`fa-xs`,sm:`fa-sm`,lg:`fa-lg`,xl:`fa-xl`,"2xl":`fa-2xl`,"1x":`fa-1x`,"2x":`fa-2x`,"3x":`fa-3x`,"4x":`fa-4x`,"5x":`fa-5x`,"6x":`fa-6x`,"7x":`fa-7x`,"8x":`fa-8x`,"9x":`fa-9x`,"10x":`fa-10x`},Q={border:`fa-border`,fixedWidth:`fa-fw`,flip:`fa-flip`,flipHorizontal:`fa-flip-horizontal`,flipVertical:`fa-flip-vertical`,inverse:`fa-inverse`,rotateBy:`fa-rotate-by`,swapOpacity:`fa-swap-opacity`,widthAuto:`fa-width-auto`},ea={default:`fa-layers`};function ta(e){let t=q.cssPrefix||q.familyPrefix||Xi;return t===Xi?e:e.replace(new RegExp(String.raw`(?<=^|\s)${Xi}-`,`g`),`${t}-`)}function na(e){let{beat:t,fade:n,beatFade:r,bounce:i,shake:a,spin:o,spinPulse:s,spinReverse:c,pulse:l,fixedWidth:u,inverse:d,border:f,flip:p,size:m,rotation:h,pull:g,swapOpacity:_,rotateBy:v,widthAuto:y,className:b}=e,x=[];return b&&x.push(...b.split(` `)),t&&x.push(Z.beat),n&&x.push(Z.fade),r&&x.push(Z.beatFade),i&&x.push(Z.bounce),a&&x.push(Z.shake),o&&x.push(Z.spin),c&&x.push(Z.spinReverse),s&&x.push(Z.spinPulse),l&&x.push(Z.pulse),u&&x.push(Q.fixedWidth),d&&x.push(Q.inverse),f&&x.push(Q.border),p===!0&&x.push(Q.flip),(p===`horizontal`||p===`both`)&&x.push(Q.flipHorizontal),(p===`vertical`||p===`both`)&&x.push(Q.flipVertical),m!=null&&x.push($i[m]),h!=null&&h!==0&&x.push(Qi[h]),g!=null&&x.push(Zi[g]),_&&x.push(Q.swapOpacity),Yi()?(v&&x.push(Q.rotateBy),y&&x.push(Q.widthAuto),(q.cssPrefix||q.familyPrefix||Xi)===Xi?x:x.map(ta)):x}var ra=e=>typeof e==`object`&&`icon`in e&&!!e.icon;function ia(e){if(e)return ra(e)?e:Fi.icon(e)}function aa(e){return Object.keys(e)}var oa=new Ki(`FontAwesomeIcon`),sa={border:!1,className:``,mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:``,titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},ca=new Set(Object.keys(sa)),la=J.forwardRef((e,t)=>{let n={...sa,...e},{icon:r,mask:i,symbol:a,title:o,titleId:s,maskId:c,transform:l}=n,u=Gi(c,!!i),d=Gi(s,!!o),f=ia(r);if(!f)return oa.error(`Icon lookup is undefined`,r),null;let p=na(n),m=typeof l==`string`?Fi.transform(l):l,h=ia(i),g=Ii(f,{...p.length>0&&{classes:p},...m&&{transform:m},...h&&{mask:h},symbol:a,title:o,titleId:d,maskId:u});if(!g)return oa.error(`Could not find icon`,f),null;let{abstract:_}=g,v={ref:t};for(let e of aa(n))ca.has(e)||(v[e]=n[e]);return Wi(_[0],v)});la.displayName=`FontAwesomeIcon`,`${ea.default}${Q.fixedWidth}`;var ua={prefix:`fab`,iconName:`facebook`,icon:[512,512,[62e3],`f09a`,`M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z`]},da={prefix:`fab`,iconName:`instagram`,icon:[448,512,[],`f16d`,`M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z`]},fa={prefix:`fab`,iconName:`twitter`,icon:[512,512,[],`f099`,`M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z`]},pa=`/assets/logo-KuHtn3x2.png`,ma=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAt9JREFUeAHtWLtuFDEUPbuEhJAoSAQQgpaKggYK0qAgxEOiouAX+AN+gBZRUFGkoqKgCB0SEg/xEkgrJEQBFVrEQzyTECUsyS67+GaOMxfL9syQnUmKHOnIXvvaPr6+9toDbGJtqOWoFx4znDAcMuxh7WMuGz42fMjfhfvcwvQuG3eZlsE7HGsAgdm4EMNBw0UKqyHb0/8LO3lxyAgSz3aKNGwbPjXcjf5j1PA6x7ErlAnx1D0KE14wrKM8yHiHkAgUz9mYjEJm8sfwPtJYtJ3J8l9FIrrIssfayhiXkHpxINbRcaTBu9dT30Qy0/cojibbfvDU1ZGG1Qm3QmNC5T97OpIglhlvQ3EMs+2Cp06ELSHx7FFEBO5CHI2cdj7sYfoyUG9377gudAWOI47LTGU5TiLfBhKvnUYaOlcCdu08Gm6xk3bERh/agthmsXU9p40Pn1g/rQtdD+xgGhIo9qeQ7HJhi53WA7ZSJwd+h/ZnEfZ6i+kYImiw058RG1mymxywQ3s5JkaVzRjLerQR3kD8CHlF+0bEBq9p9AVxyNJNKYEhdjmRKWSfm0/Y5k3MqEmjJrIhnjyINHZ84r4aHkC+zXSb7d7pQtfl25n+QjbEM+Lx/UguF5OGh1n3wvCR6ifP/+yco8GLeeSIg5JwDZ74d12/lWlsk5SFGfyrYQWuQLvk86ge35huWIEzjoYVhHbXD1QPr1M2kkBv3IcEfkf1yPSgvj3PoXroe+JqHNZ9hVifTaL/HLwC9fZej3OwpfKrWrTAIZVfQPVYUvlBm9ECR1R+EdVD30GHbUYL1C/6LqqH3gNeD+qj5RzK+9zhg72pW3z0GYmgWaR3uaph3zrLIQOZxRmkV/nnLC/Tk/bD1DTSd855RC64YixX7jZFytl0BOVhH5KvFPbd8hY5HSKNrMvL/Dao3y2zHDuXQDG6WJFA/Ziv+YSEUKc4+Tw2abgT/cVvwweGz9RYm+g7/gIMsQo+Rc98UwAAAABJRU5ErkJggg==`,ha=()=>{let[e,t]=(0,J.useState)(!1),[n,o]=(0,J.useState)(!1),s=(0,J.useRef)([]),c=(0,J.useRef)(null),l=r(),[u,d]=(0,J.useState)(null),[f,p]=(0,J.useState)(null),[m,h]=(0,J.useState)(``),[g,_]=(0,J.useState)(``),v=e=>{d(u===e?null:e),p(null)},y=e=>{p(f===e?null:e)},b=[{name:`Home`,path:`/`},{name:`About`,path:`/about`},{name:`Shop`,path:`/shop`}],x=[`/services/cbc`,`/services/kft`,`/services/lft`,`/services/pcr`,`/services/rtpcr`,`/services/cbp`,`/services/act`,`/services/plt`,`/services/pet`];return(0,J.useEffect)(()=>{let e=s.current.findIndex(e=>e?.dataset?.path===l.pathname);if(x.includes(l.pathname)&&(e=b.length),l.pathname===`/contact`&&(e=b.length+1),e!==-1){let t=s.current[e],n=t.closest(`header`).getBoundingClientRect().left,r=t.getBoundingClientRect().left;c.current.style.left=r-n+`px`,c.current.style.width=t.offsetWidth+`px`}},[l]),(0,Y.jsxs)(`header`,{className:`fixed top-0 left-0 w-full bg-white border-b border-[#b50b0b] z-50`,children:[(0,Y.jsx)(`span`,{ref:c,className:`hidden md:block absolute top-0 h-[5px] bg-[#b50b0b] rounded-b-full transition-all duration-300 z-50`}),(0,Y.jsx)(`div`,{className:`max-w-7xl mx-auto px-4`,children:(0,Y.jsxs)(`div`,{className:`flex items-center py-3`,children:[(0,Y.jsx)(i,{to:`/`,children:(0,Y.jsx)(`img`,{src:pa,className:`w-[180px] md:w-[220px] lg:w-[250px] cursor-pointer`,alt:`logo`})}),(0,Y.jsxs)(`div`,{className:`hidden xl:flex items-center ml-auto gap-16`,children:[(0,Y.jsx)(`nav`,{className:`flex items-center`,children:(0,Y.jsxs)(`ul`,{className:`flex gap-6 items-center`,children:[b.map((e,t)=>(0,Y.jsx)(`li`,{ref:e=>s.current[t]=e,"data-path":e.path,className:`px-2 py-1`,children:(0,Y.jsx)(i,{to:e.path,className:({isActive:e})=>e?`text-[#b50b0b]`:`hover:text-[#b50b0b]`,children:e.name})},e.path)),(0,Y.jsxs)(`li`,{ref:e=>s.current[b.length]=e,className:`relative group px-2 py-1`,children:[(0,Y.jsx)(`span`,{className:`cursor-pointer hover:text-[#b50b0b]`,children:`Services`}),(0,Y.jsxs)(`div`,{className:`absolute top-8 left-0 hidden group-hover:block bg-white shadow-lg rounded p-3 w-72`,children:[(0,Y.jsxs)(`div`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>v(`hematology`),className:`flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]`,children:[`Hematology `,(0,Y.jsx)(`span`,{children:u===`hematology`?`▾`:`▸`})]}),u===`hematology`&&(0,Y.jsx)(`div`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/cbc`,className:`block py-1`,children:`Complete Blood Count (CBC)`})})]}),(0,Y.jsxs)(`div`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>v(`biochemistry`),className:`flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]`,children:[`Biochemistry `,(0,Y.jsx)(`span`,{children:u===`biochemistry`?`▾`:`▸`})]}),u===`biochemistry`&&(0,Y.jsxs)(`div`,{className:`ml-4 max-h-60 overflow-y-auto`,children:[(0,Y.jsx)(i,{to:`/services/kft`,className:`block py-1`,children:`Kidney Function Test (KFT)`}),(0,Y.jsx)(i,{to:`/services/lft`,className:`block py-1`,children:`Liver Function Test (LFT)`}),(0,Y.jsx)(i,{to:`/services/ast`,className:`block py-1`,children:`AST / ALT / ALP / Total Protein / Albumin / Bilirubin`}),(0,Y.jsx)(i,{to:`/services/urea`,className:`block py-1`,children:`Serum Creatinine / Urea / Uric Acid`}),(0,Y.jsx)(i,{to:`/services/t3`,className:`block py-1`,children:`Canine Specific T3`}),(0,Y.jsx)(i,{to:`/services/tsh`,className:`block py-1`,children:`Canine Specific TSH`}),(0,Y.jsx)(i,{to:`/services/t4`,className:`block py-1`,children:`Canine Specific T4`}),(0,Y.jsx)(i,{to:`/services/ldh`,className:`block py-1`,children:`LDH - Lactate Dehydrogenase`}),(0,Y.jsx)(i,{to:`/services/rbs`,className:`block py-1`,children:`Random Blood Sugar`}),(0,Y.jsx)(i,{to:`/services/sl`,className:`block py-1`,children:`Serum Lipase`}),(0,Y.jsx)(i,{to:`/services/sa`,className:`block py-1`,children:`Serum Analysis`}),(0,Y.jsx)(i,{to:`/services/b12`,className:`block py-1`,children:`Vitamin B12`}),(0,Y.jsx)(i,{to:`/services/d`,className:`block py-1`,children:`Vitamin D`})]})]}),(0,Y.jsxs)(`div`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>v(`molecular`),className:`flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]`,children:[`Molecular Biology - RT PCR`,(0,Y.jsx)(`span`,{children:u===`molecular`?`▾`:`▸`})]}),u===`molecular`&&(0,Y.jsxs)(`div`,{className:`ml-4 max-h-60 overflow-y-auto`,children:[(0,Y.jsx)(i,{to:`/services/cdv`,className:`block py-1`,children:`Canine Distemper Virus - RT-PCR`}),(0,Y.jsxs)(`div`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>y(`tick`),className:`flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]`,children:[`Canine Tick Fever Panel`,(0,Y.jsx)(`span`,{children:f===`tick`?`▾`:`▸`})]}),f===`tick`&&(0,Y.jsxs)(`div`,{className:`ml-4`,children:[(0,Y.jsx)(i,{to:`/services/ctfc-2`,className:`block py-1`,children:`Tick Fever Panel - 2 Organisms`}),(0,Y.jsx)(i,{to:`/services/ctfc-4`,className:`block py-1`,children:`Tick Fever Panel - 4 Organisms`}),(0,Y.jsx)(i,{to:`/services/ctfc-7`,className:`block py-1`,children:`Tick Fever Panel - 7 Organisms`}),(0,Y.jsx)(i,{to:`/services/ctfpbg`,className:`block py-1`,children:`Babesia Gibsoni`}),(0,Y.jsx)(i,{to:`/services/ctfpbc`,className:`block py-1`,children:`Babesia Canis`}),(0,Y.jsx)(i,{to:`/services/ctfpbr`,className:`block py-1`,children:`Babesia Rossi`}),(0,Y.jsx)(i,{to:`/services/ctfpbv`,className:`block py-1`,children:`Babesia Vogeli`}),(0,Y.jsx)(i,{to:`/services/ctfphc`,className:`block py-1`,children:`Hepatozoon Canis`}),(0,Y.jsx)(i,{to:`/services/ctfpec`,className:`block py-1`,children:`Ehrlichia Canis`}),(0,Y.jsx)(i,{to:`/services/ctfpap`,className:`block py-1`,children:`Anaplasma Platys`})]})]}),(0,Y.jsx)(i,{to:`/services/ap`,className:`block py-1`,children:`Anaplasma Phagocytophilum`}),(0,Y.jsx)(i,{to:`/services/cpv`,className:`block py-1`,children:`Canine Parvovirus (CPV)`}),(0,Y.jsx)(i,{to:`/services/leptospira`,className:`block py-1`,children:`Leptospira`})]})]}),(0,Y.jsxs)(`div`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>v(`histopathology`),className:`flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]`,children:[`Histopathology`,(0,Y.jsx)(`span`,{children:u===`histopathology`?`▾`:`▸`})]}),u===`histopathology`&&(0,Y.jsxs)(`div`,{className:`ml-4`,children:[(0,Y.jsx)(i,{to:`/services/biopsy`,className:`block py-1`,children:`Biopsy`}),(0,Y.jsx)(i,{to:`/services/fnac`,className:`block py-1`,children:`FNAC (Fine Needle Aspiration Cytology)`}),(0,Y.jsx)(i,{to:`/services/abst`,className:`block py-1`,children:`Culture & Antibiotic Sensitivity Test (ABST)`}),(0,Y.jsx)(i,{to:`/services/sse`,className:`block py-1`,children:`Skin Scraping Examination`})]})]}),(0,Y.jsx)(i,{to:`/services/pcr`,className:`block py-1`,children:`Polymerase Chain Reaction (PCR)`}),(0,Y.jsx)(i,{to:`/services/rtpcr`,className:`block py-1`,children:`Polymerase Chain Reaction (RT - PCR)`}),(0,Y.jsx)(i,{to:`/services/cbp`,className:`block py-1`,children:`Complete Blood Picture (CBP)`}),(0,Y.jsx)(i,{to:`/services/act`,className:`block py-1`,children:`Aerobic Culture Test (ACT)`}),(0,Y.jsx)(i,{to:`/services/plt`,className:`block py-1`,children:`Pancreatic Lipase Test (PLT)`}),(0,Y.jsx)(i,{to:`/services/pet`,className:`block py-1`,children:`Pancreatic Elastase (PE)`})]})]}),(0,Y.jsx)(`li`,{ref:e=>s.current[b.length+1]=e,"data-path":`/contact`,className:`px-2 py-1`,children:(0,Y.jsx)(i,{to:`/contact`,className:({isActive:e})=>e?`text-[#b50b0b]`:`hover:text-[#b50b0b]`,children:`Contact`})})]})}),(0,Y.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,Y.jsx)(`button`,{className:`bg-[#b50b0b] text-white px-4 py-2 rounded cursor:pointer`,children:(0,Y.jsx)(i,{to:`/book-appointment`,children:`Book Appointment`})}),(0,Y.jsxs)(`div`,{className:`relative`,children:[(0,Y.jsx)(`img`,{src:ma,className:`w-8`,alt:`cart`}),(0,Y.jsx)(`span`,{className:`absolute -top-2 -right-2 bg-[#b50b0b] text-white text-xs px-2 rounded-full`,children:`0`})]}),(0,Y.jsx)(i,{to:`/profile`,children:(0,Y.jsx)(`img`,{src:a,className:`w-10 h-10 rounded-full`,alt:`profile`})})]})]}),(0,Y.jsxs)(`div`,{className:`xl:hidden ml-auto flex gap-5`,children:[(0,Y.jsxs)(`div`,{className:`relative`,children:[(0,Y.jsx)(`img`,{src:ma,className:`w-8`,alt:`cart`}),(0,Y.jsx)(`span`,{className:`absolute -top-2 -right-2 bg-[#b50b0b] text-white text-xs px-2 rounded-full`,children:`0`})]}),(0,Y.jsx)(`button`,{onClick:()=>t(!0),className:`text-2xl`,children:`☰`})]})]})}),(0,Y.jsxs)(`div`,{className:`fixed top-0 right-0 h-full w-[280px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${e?`translate-x-0`:`translate-x-full`}`,children:[(0,Y.jsx)(`div`,{className:`flex justify-end p-4`,children:(0,Y.jsx)(`button`,{onClick:()=>t(!1),children:`✕`})}),(0,Y.jsx)(`div`,{className:`px-4`,children:(0,Y.jsx)(i,{to:`/`,children:(0,Y.jsx)(`img`,{src:pa,className:`w-[180px]`,alt:`logo`})})}),(0,Y.jsx)(`div`,{className:`flex items-center gap-3 px-4 mt-4`,children:(0,Y.jsx)(i,{to:`/profile`,children:(0,Y.jsx)(`img`,{src:a,className:`w-10 h-10 rounded-full`,alt:`profile`})})}),(0,Y.jsxs)(`ul`,{className:`mt-6 space-y-4 px-5`,children:[b.map(e=>(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:e.path,onClick:()=>t(!1),children:e.name})},e.path)),(0,Y.jsxs)(`li`,{children:[(0,Y.jsx)(`div`,{className:`flex justify-between items-center cursor-pointer`,onClick:()=>o(!n),children:(0,Y.jsxs)(`span`,{children:[`Services `,n?`▾`:`▸`]})}),(0,Y.jsx)(`div`,{className:`overflow-hidden transition-all duration-300 ${n?`max-h-[800px]`:`max-h-0`}`,children:(0,Y.jsxs)(`ul`,{className:`ml-3 mt-2 space-y-2 text-sm`,children:[(0,Y.jsxs)(`li`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>h(m===`hematology`?``:`hematology`),className:`flex justify-between cursor-pointer`,children:[`Hematology`,(0,Y.jsx)(`span`,{children:m===`hematology`?`▾`:`▸`})]}),m===`hematology`&&(0,Y.jsx)(`ul`,{className:`ml-4`,children:(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/services/cbc`,onClick:()=>t(!1),children:`Complete Blood Count (CBC)`})})})]}),(0,Y.jsxs)(`li`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>h(m===`biochemistry`?``:`biochemistry`),className:`flex justify-between cursor-pointer`,children:[`Biochemistry`,(0,Y.jsx)(`span`,{children:m===`biochemistry`?`▾`:`▸`})]}),m===`biochemistry`&&(0,Y.jsxs)(`ul`,{className:`ml-4`,children:[(0,Y.jsx)(i,{to:`/services/kft`,className:`block py-1`,children:`KFT`}),(0,Y.jsx)(i,{to:`/services/lft`,className:`block py-1`,children:`LFT`}),(0,Y.jsx)(i,{to:`/services/ast`,className:`block py-1`,children:`AST`}),(0,Y.jsx)(i,{to:`/services/urea`,className:`block py-1`,children:`Urea`}),(0,Y.jsx)(i,{to:`/services/t3`,className:`block py-1`,children:`T3`}),(0,Y.jsx)(i,{to:`/services/tsh`,className:`block py-1`,children:`TSH`}),(0,Y.jsx)(i,{to:`/services/t4`,className:`block py-1`,children:`T4`}),(0,Y.jsx)(i,{to:`/services/ldh`,className:`block py-1`,children:`LDH`}),(0,Y.jsx)(i,{to:`/services/rbs`,className:`block py-1`,children:`RBS`}),(0,Y.jsx)(i,{to:`/services/sl`,className:`block py-1`,children:`Serum Lipase`}),(0,Y.jsx)(i,{to:`/services/sa`,className:`block py-1`,children:`Serum Analysis`}),(0,Y.jsx)(i,{to:`/services/b12`,className:`block py-1`,children:`Vitamin B12`}),(0,Y.jsx)(i,{to:`/services/d`,className:`block py-1`,children:`Vitamin D`})]})]}),(0,Y.jsxs)(`li`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>h(m===`molecular`?``:`molecular`),className:`flex justify-between cursor-pointer`,children:[`Molecular Biology`,(0,Y.jsx)(`span`,{children:m===`molecular`?`▾`:`▸`})]}),m===`molecular`&&(0,Y.jsxs)(`ul`,{className:`ml-4`,children:[(0,Y.jsx)(i,{to:`/services/cdv`,children:`CDV`}),(0,Y.jsxs)(`li`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>_(g===`tick`?``:`tick`),className:`flex justify-between cursor-pointer`,children:[`Tick Fever Panel`,(0,Y.jsx)(`span`,{children:g===`tick`?`▾`:`▸`})]}),g===`tick`&&(0,Y.jsxs)(`ul`,{className:`ml-4`,children:[(0,Y.jsx)(i,{to:`/services/ctfc-2`,className:`block py-1`,children:`2 Organisms`}),(0,Y.jsx)(i,{to:`/services/ctfc-4`,className:`block py-1`,children:`4 Organisms`}),(0,Y.jsx)(i,{to:`/services/ctfc-7`,className:`block py-1`,children:`7 Organisms`}),(0,Y.jsx)(i,{to:`/services/ctfpbg`,className:`block py-1`,children:`Babesia Gibsoni`}),(0,Y.jsx)(i,{to:`/services/ctfpbc`,className:`block py-1`,children:`Babesia Canis`}),(0,Y.jsx)(i,{to:`/services/ctfpbr`,className:`block py-1`,children:`Babesia Rossi`}),(0,Y.jsx)(i,{to:`/services/ctfpbv`,className:`block py-1`,children:`Babesia Vogeli`}),(0,Y.jsx)(i,{to:`/services/ctfphc`,className:`block py-1`,children:`Hepatozoon Canis`}),(0,Y.jsx)(i,{to:`/services/ctfpec`,className:`block py-1`,children:`Ehrlichia Canis`}),(0,Y.jsx)(i,{to:`/services/ctfpap`,className:`block py-1`,children:`Anaplasma Platys`})]})]}),(0,Y.jsx)(i,{to:`/services/ap`,children:`Anaplasma`}),(0,Y.jsx)(i,{to:`/services/cpv`,children:`CPV`}),(0,Y.jsx)(i,{to:`/services/leptospira`,children:`Leptospira`})]})]}),(0,Y.jsxs)(`li`,{children:[(0,Y.jsxs)(`div`,{onClick:()=>h(m===`histopathology`?``:`histopathology`),className:`flex justify-between cursor-pointer`,children:[`Histopathology`,(0,Y.jsx)(`span`,{children:m===`histopathology`?`▾`:`▸`})]}),m===`histopathology`&&(0,Y.jsxs)(`ul`,{className:`ml-4`,children:[(0,Y.jsx)(i,{to:`/services/biopsy`,className:`block py-1`,children:`Biopsy`}),(0,Y.jsx)(i,{to:`/services/fnac`,className:`block py-1`,children:`FNAC`}),(0,Y.jsx)(i,{to:`/services/abst`,className:`block py-1`,children:`ABST`}),(0,Y.jsx)(i,{to:`/services/sse`,className:`block py-1`,children:`Skin Scraping`})]})]}),(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/services/pcr`,children:`Polymerase Chain Reaction (PCR)`})}),(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/services/rtpcr`,children:`Reverse Transcription Polymerase Chain Reaction (RT-PCR) Test`})}),(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/services/cbp`,children:`Complete Blood Picture (CBP)`})}),(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/services/act`,children:`Aerobic Culture Test(ACT)`})}),(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/services/plt`,children:`Pancreatic Lipase Test(PLT)`})}),(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/services/pet`,children:`Pancreatic Elastase(PE)`})})]})})]}),(0,Y.jsx)(`li`,{children:(0,Y.jsx)(i,{to:`/contact`,onClick:()=>t(!1),children:`Contact`})})]}),(0,Y.jsx)(`div`,{className:`px-4 mt-6`,children:(0,Y.jsx)(i,{to:`/book-appointment`,className:`w-full bg-[#b50b0b] text-white py-2 px-4 rounded cursor-pointer`,children:`Book Appointment`})}),(0,Y.jsxs)(`div`,{className:`flex gap-4 px-4 mt-6`,children:[(0,Y.jsx)(la,{icon:ua,className:`text-3xl`}),(0,Y.jsx)(la,{icon:fa,className:`text-3xl`}),(0,Y.jsx)(la,{icon:da,className:`text-3xl`})]})]}),e&&(0,Y.jsx)(`div`,{className:`fixed inset-0 bg-black/40 z-40`,onClick:()=>t(!1)})]})},$=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAALJJREFUeAHtlLsNwkAQRMd8REgXJMRUQDX0QAUUgEBC0BAxGTEBFSDhz45uT3bibCex7kmjy3Y8N7cGCoURvqaLqYKQ2tSaPqYZRGwGRo3SiPzdiOcKIuZukhPtIeqJQ59uwkRH0wIC2MnJTdjVDaJES9MD6epotEYwTHL34UxzReorDF7LG6kTmhwQ/KQrH55f1xbBXXAv8kLyDP/6HfoE4QaZxvWCcPl+pjPE/6zCBOkAqX0rHyrMV8cAAAAASUVORK5CYII=`,ga=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAA0RJREFUeAGlVk1IG1EQftn8a2pIkIRo/ozmUKGxFgweesulUBAJvXgLlTaC0YMHST0FipcerBcFD+JBIRBoSlMM9JRCICWYW0NLoSmFtNifQymtpuhutjPr27LZ5mcTBx7ZfTsz33zzZuaFkN7kTKVSnY2Ojj7b29vzdmNIyuWyzu/3P3Y4HNF2emtra9c9Hs8BAPEMw3Cw+IWFhSDP8+p2diQQCNwA5To88mgM6zcYMaSD5PN5i0aj+apWq8+Hh4dzYKNqqjg3NxcAp3Wj0fgOlba2tkzwzsE6VQKEDKampsLoA9d/jLLZrB7pIoB0XwLUwIg6jGxvb/uaAYIvFjPSEJzZbP6I6WlmsLu7ewWBIIAv0jRAajgaNQevD6Tf8Bn3+/r6Cg3Bud3uOGkhS0tLTnS4ublpJ40pUvl8vidwHpxWq/0udeh0Om9BIOz09PRVgR04IDab7U8rkFqtJjgfGRk5le4j+0qlcicWi/lZlrVC5FURqFqtvjAYDN+KxeJrgaVer/85MDDwqh0Lk8n0pl15hkIhH57D+Pj4fXEPytyBtqurq04yNDSUvGDfWHrz8/NjaKjT6Y5blqUkdf39/S/hsS7q0l/eYrEckvX1dTse1OLiokdqCAXxloJ3LGGUVCplQv3l5WW3uGe325/CeZ2I1XAOKalKI8ZUYTdDZ99WAkJt616v99+0gMK4BgVwIrxALm9iajCPshQc0eZSxEYC1vwDSA0WK2s8Btk07eJeZGdnx4xnY7VaH8mbC7u4FRAGsrKy4trf33d0ZIzOEAAjD4fDDUWQy+U0knEhDYCBZvwhzizolfedKlEwghFyjIzkUaGxOE6g7O9SZ3ivcIlEYjAajU7gN2jCT0qA1MgGHTYBYmBkHCIrcnElcFC6OvF7JBLxUqCqIkYI0gqoUCgYXS7XUalU0spt4fISgKAyPygCorceu7GxYSVdyMzMzBgCTU5OTnRUpqn7RW/MBFEolD0PQ/WeUgMVzK+HCISTN51O29qVKurTiuO6aWJBsIzRB94TcLCfk8mkqw1APR6PW0gvgk5mZ2dD9I+G0KAwn57jiA8GgzGcgZcCkEsmkxmEnB8IU5b+w8GrHBgb5Lp/ATR5vnqW8J6FAAAAAElFTkSuQmCC`,_a=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAhpJREFUeAGtVTlLZEEQrjdv3E32DHbZXZZdFRRMRWNDQU1MRNRUBEWcWEMTQUw0VhHFyCNTEw08EBSvwJ8gJoJ4X3hUOV/xip55M+3xwUe9rq76+qh+3UTxSDADZgGzlbnJvGU+Mq+Z28w2xGj8i1AA28y8h7CI9jFTsHvwC1ucvLxIwo5BYJH5JSb2K3MJcePwheSJHiSmTGKQJU63KIX4brQDygHp/I2EUfg+wH5j9jJnYL87/bryH+RRn3nmHb51j+sh8MA8oKgW9U7cFXMuj/7zSqTQ/aZdBsFlIyb+FfhLKNqeAeYNRXXNiiIkVhjfFvMI36Fjj5kbJrYS+f+tqLt3P2EPjU9mOonve8dOUHqligPYX5RjELcWAvkBC/Htnppi5qVpfzQ5sZATI8utNb4h+P6agYT/4B80/jqKTlhOnDKn8R0anyR3UHp7OtA+c+LkeB+TB0YofTclwCRmuU7R0RWumn7ddqnVcL4BROwPRJoo8/L7TOn6fHJWECD+Ef0BeWCHeeIIxcEe5x3yRAKz0Rr4oB3xpeR55etSF5AoxzLuDw4hqre1zc+LJMS1wNmSdcZriAvpFQ+XiDZCoIYyB5F2Nfob6JXQWe1S5rZJXwj/Fnzej5ULEZX3Qq74ffj06tDnVwd8E2RbqiDYBV8n2lX0gkLngm7bFITLYWfNJN4FeiufY4ALtJP0zpAV6fsvN7B3HZ4AZWN3tCUOepMAAAAASUVORK5CYII=`,va=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAqZJREFUeAHtVU9rGlEQf6sbKvUPaC1abJqWqNU19SIogoKgxaPRr+DRY/sBBA9+Ag/25Kfw0oIHpYLgqXEtWtuYNKlEe/Ao2/g6s76VzVYalOSWgdk3Ozszv/fe/FlCHmgL4vBRKBSehMNhP8dxErkj0ul0/Hw+H0HsCUkmk8ego/fFiUTiGE8iwQl4SulVsVh02e12l9ls/kN2JEmS+Hw+fwExz+A0z5bLpRyL2my2D7AugYeyglKO7EDgp8MVAL7hq8PhqOIqK7PZbBNy4gPRDfwDjMCe6reIjwA8+OFGv4N8GI/HA+l0uonfZJDpdOrsdDoDv9//Bl5fMqBrdNwCAK/lFPiVz+cLNptNERLvXIPwPI87IKIo9gRBOGJAp+h4G5AG4AD9+/3+CX7T6/V0DaKmXq8nut3uADoAj/8HpAI4UwDQX2t3AwRzgetwOOx7PB4BxBfA55uAVADnwPsAEFAAlDgbQVQGHALFYrG3ID8HvlQDYVEwgEv8Ho1GU3DV4sr9JsBGEFa+NBgMvm61Wh8NBsMQHO2g+9XtduXSrtVqewzAAb0waLfbn9B+5b65/Gkul3unACDDVfnJqmN/or5cLrvZO7VYLANFLpVKHhYD7ajX6/UpMVDJ4tJ/QFjSKbtr1O1hk9Xr9UehUKhiMpk+41qtVh+zgEqu0J5CboSNIJlM5j0K0CdHTDlmALzmGtXXqlPJit2YAeFGsckx7soQxsokEokIUN9fmOGBqnpk0iaUdbciK0Uhlz3UwAlMEK/Var1abwRmDM4uCsYj7S63IdVpMQ7ORHl2yVMYZz9My0mj0dgfjUYuML4mO9JisdDPZrMLmOhY9k8hlkRw3pN7/J+kUqmMfLxKpeI0Go2HcKKd/yNawtuB/vkKsX+TB9qG/gL/KIlDmdsaSQAAAABJRU5ErkJggg==`,ya=()=>{let[e,t]=(0,J.useState)(!1);return(0,Y.jsxs)(`div`,{className:``,children:[(0,Y.jsx)(`section`,{className:`bg-[#f0eff0]`,children:(0,Y.jsxs)(`div`,{className:`flex flex-col mx-8 py-4 md:flex-row md:items-center gap-[10px] md:gap-[30px] lg:gap-[40px] lg:ml-20`,children:[(0,Y.jsx)(`img`,{src:o,alt:``,className:`w-[280px] md:w-[240px] lg:w-[320px]`}),(0,Y.jsx)(`div`,{className:`hidden md:block border-1 h-16 border-[#dddcdd]`}),(0,Y.jsxs)(`div`,{children:[(0,Y.jsx)(`h2`,{className:`text-md md:text-1xl lg:text-2xl font-bold`,children:`Advanced Molecular Diagnostics for Optimal Animal Health`}),(0,Y.jsx)(`p`,{className:`text-xs md:text-md lg:text-lg text-[#3c3c3c]`,children:`Delivering accurate and reliable veterinary diagnostic services`})]})]})}),(0,Y.jsxs)(`section`,{className:`flex flex-col px-8 gap-[15px] lg:flex-row my-4 lg:justify-evenly lg:px-0 lg:gap-0`,children:[(0,Y.jsxs)(`div`,{className:`flex flex-col gap-[10px]`,children:[(0,Y.jsx)(`h3`,{className:`text-2xl md:text-xl lg:text-xl font-semibold`,children:`Quick Links`}),(0,Y.jsxs)(`ul`,{children:[(0,Y.jsxs)(`li`,{className:`flex gap-[2px] hover:text-[#b50b0b] cursor-pointer`,children:[(0,Y.jsx)(`img`,{src:$,alt:`>`}),(0,Y.jsx)(i,{to:`/`,children:`Home`})]}),(0,Y.jsxs)(`li`,{className:`flex gap-[2px] hover:text-[#b50b0b] cursor-pointer`,children:[(0,Y.jsx)(`img`,{src:$,alt:`>`}),(0,Y.jsx)(i,{to:`/about`,children:`About`})]}),(0,Y.jsxs)(`li`,{children:[(0,Y.jsx)(`div`,{className:`flex items-center justify-between cursor-pointer`,onClick:()=>t(!e),children:(0,Y.jsxs)(`div`,{className:`flex gap-[2px]`,children:[(0,Y.jsx)(`img`,{src:$,alt:`>`}),(0,Y.jsx)(`span`,{children:`Services`}),(0,Y.jsx)(`span`,{children:e?`▾`:`▸`})]})}),(0,Y.jsx)(`div`,{className:`overflow-hidden transition-all duration-300 ${e?`max-h-96 mt-2`:`max-h-0`}`,children:(0,Y.jsxs)(`ul`,{className:`ml-5 space-y-1 text-sm list-disc`,children:[(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/pcr`,className:`hover:text-[#b50b0b]`,children:`Polymerase Chain Reaction (PCR)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/rtpcr`,className:`hover:text-[#b50b0b]`,children:`Reverse Transcription PCR (RT-PCR)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/vcbp`,className:`hover:text-[#b50b0b]`,children:`Complete Blood Picture (CBP)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/ast`,className:`hover:text-[#b50b0b]`,children:`Antibiotic Sensitivity Test (AST)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/act`,className:`hover:text-[#b50b0b]`,children:`Aerobic Culture Test (ACT)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/lft`,className:`hover:text-[#b50b0b]`,children:`Liver Function Test (LFT)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/kft`,className:`hover:text-[#b50b0b]`,children:`Kidney Function Test (KFT)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/plt`,className:`hover:text-[#b50b0b]`,children:`Pancreatic Lipase Test (PLT)`})}),(0,Y.jsx)(`li`,{className:`ml-4`,children:(0,Y.jsx)(i,{to:`/services/pet`,className:`hover:text-[#b50b0b]`,children:`Pancreatic Elastase Test (PE)`})})]})})]}),(0,Y.jsxs)(`li`,{className:`flex gap-[2px] hover:text-[#b50b0b] cursor-pointer`,children:[(0,Y.jsx)(`img`,{src:$,alt:`>`}),(0,Y.jsx)(i,{to:`/shop`,children:`Shop`})]}),(0,Y.jsxs)(`li`,{className:`flex gap-[2px] hover:text-[#b50b0b] cursor-pointer`,children:[(0,Y.jsx)(`img`,{src:$,alt:`>`}),(0,Y.jsx)(i,{to:`/contact`,children:`Contact`})]})]})]}),(0,Y.jsx)(`div`,{className:`hidden lg:block border-l h-auto border-[#dddcdd] `}),(0,Y.jsx)(`hr`,{className:`border-t border-[#b50b0b] my-4 lg:hidden`}),(0,Y.jsxs)(`div`,{className:`flex flex-col gap-[10px]`,children:[(0,Y.jsx)(`h3`,{className:`text-2xl md:text-xl lg:text-xl font-semibold`,children:`Working Hours`}),(0,Y.jsxs)(`p`,{children:[`Monday - Saturday`,(0,Y.jsx)(`br`,{}),`08 AM - 08 PM`]}),(0,Y.jsxs)(`p`,{children:[`Sunday`,(0,Y.jsx)(`br`,{}),`08 AM - 01 PM`]})]}),(0,Y.jsx)(`div`,{className:`hidden lg:block border-l h-auto border-[#dddcdd] `}),(0,Y.jsx)(`hr`,{className:`border-t border-[#b50b0b] my-4 lg:hidden`}),(0,Y.jsxs)(`div`,{className:`flex flex-col gap-[10px]`,children:[(0,Y.jsx)(`h3`,{className:`text-2xl md:text-xl lg:text-xl font-semibold`,children:`Get in Touch`}),(0,Y.jsxs)(`div`,{className:`flex gap-[5px] items-start`,children:[(0,Y.jsx)(`img`,{src:_a,alt:``}),(0,Y.jsxs)(`p`,{children:[`D.No. 74-7-6/2, SB House,`,(0,Y.jsx)(`br`,{}),`Patamata, Vijayawada,520010`]})]}),(0,Y.jsxs)(`div`,{className:`flex gap-[5px] items-start`,children:[(0,Y.jsx)(`img`,{src:va}),(0,Y.jsx)(`p`,{children:`vetdiaggenomix@gmail.com`})]}),(0,Y.jsxs)(`div`,{className:`flex gap-[5px] items-start`,children:[(0,Y.jsx)(`img`,{src:ga}),(0,Y.jsxs)(`p`,{children:[`+91 6301867331`,(0,Y.jsx)(`br`,{}),`+91 6281798372`]})]})]}),(0,Y.jsx)(`div`,{className:`hidden lg:block border-l h-auto border-[#dddcdd] `}),(0,Y.jsx)(`hr`,{className:`border-t border-[#b50b0b] my-4 lg:hidden`}),(0,Y.jsxs)(`div`,{className:`flex flex-col gap-[10px]`,children:[(0,Y.jsx)(`h3`,{className:`text-2xl md:text-xl lg:text-xl font-semibold`,children:`Follow Us`}),(0,Y.jsxs)(`div`,{className:`flex flex-col gap-[10px]`,children:[(0,Y.jsx)(`p`,{children:`connect with us on social media`}),(0,Y.jsxs)(`div`,{className:`flex gap-4`,children:[(0,Y.jsx)(`div`,{className:`bg-[#b50b0b] text-white p-3 rounded-full`,children:(0,Y.jsx)(c,{})}),(0,Y.jsx)(`div`,{className:`bg-[#b50b0b] text-white p-3 rounded-full`,children:(0,Y.jsx)(s,{})}),(0,Y.jsx)(`div`,{className:`bg-[#b50b0b] text-white p-3 rounded-full`,children:(0,Y.jsx)(l,{})}),(0,Y.jsx)(`div`,{className:`bg-[#b50b0b] text-white p-3 rounded-full`,children:(0,Y.jsx)(d,{})}),(0,Y.jsx)(`div`,{className:`bg-[#b50b0b] text-white p-3 rounded-full`,children:(0,Y.jsx)(u,{})})]}),(0,Y.jsx)(`p`,{className:`text-[#b50b0b]`,children:`#vetdiaggenomix`})]})]})]}),(0,Y.jsx)(`section`,{className:`bg-[#f0eff0]`,children:(0,Y.jsxs)(`div`,{className:`flex flex-col text-xs items-center gap-[5px] py-2 md:flex-row justify-between px-8`,children:[(0,Y.jsxs)(`p`,{className:`text-[#787878]`,children:[(0,Y.jsx)(`span`,{className:`font-semibold`,children:`CIN:`}),` U75000AP2024PTC114031`]}),(0,Y.jsx)(`p`,{className:`text-[#787878]`,children:`© 2024 VetDiag Genomix Pvt Ltd | Privacy Policy | Terms of Service`})]})})]})};export{ha as n,ya as t};