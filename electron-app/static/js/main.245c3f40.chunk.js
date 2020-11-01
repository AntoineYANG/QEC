(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{13:function(e,t,n){},14:function(e,t,n){},15:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),o=n(7),c=n.n(o),r=(n(13),n(14),n(2)),l=n(3),s=n(5),m=n(4),u=function(e){return i.a.createElement("div",{title:e.name,className:"windowbutton",onClick:e.trigger},i.a.createElement("svg",{width:"100%",height:"100%",viewBox:"0 0 100 100"},i.a.createElement("path",{d:e.path})))},d=window.win,h=!1,v=function(){return h},f=function(e){Object(s.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).state={},a}return Object(l.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{className:"header"},i.a.createElement("div",{key:"left",className:"header-strip"},i.a.createElement("label",{key:"icon",className:"header-item",style:{width:"16.1px",height:"16.1px",margin:"0 7px",display:"inline-block",transform:"translateY(-2px)",fontWeight:"bold",fontSize:"119%"}},"Z"),i.a.createElement("label",{key:"filename",className:"header-btn-groups",style:{height:"16.1px",display:"inline-block",transform:"translateY(1.8px)",margin:"0 2em",width:"35vw",overflow:"hidden",textOverflow:"ellipsis"}},"Start with new file")),i.a.createElement("div",{key:"right",className:"header-btn-groups"},i.a.createElement(u,{key:"minimize",name:"minimize",path:"M28,50 L72,50",trigger:function(){d.minimize()}}),i.a.createElement(u,{key:"maximize",name:v?"maximize":"unmaximize",path:v?"M28,46 L60,46 L60,70 L28,70 Z M38,36 L70,36 L70,58 L38,58 Z":"M30,34 L70,34 L70,69 L30,69 Z",trigger:function(){h?d.maximize():d.unmaximize(),h=!h}}),i.a.createElement(u,{key:"close",name:"close",path:"M32,32 L68,68 M32,68 L68,32",trigger:function(){d.close()}})))}},{key:"componentDidMount",value:function(){var e,t=this;null===(e=d)||void 0===e||e.on("maximize",(function(){return t.forceUpdate()}))}}]),n}(a.Component),p=n(1),b=n.n(p),w={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",27:"esc",32:"space",37:"left",38:"up",39:"right",40:"down",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",186:";",187:"+",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},y=[],g=function(){return y.map((function(e){return e[0]})).join("+")},x={},k=function(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,i=t.join("+");return(void 0===x[e][i]||x[e][i][1]<a)&&(x[e][i]=[n,a],!0)},E=function(e,t){var n=t.join("+");x[e][n]=void 0},D=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];b()(e)[0].tabIndex=1,b()(e)[0].addEventListener("keydown",(function(e){var n=w[e.which];t&&n&&e.preventDefault(),y.length&&y[y.length-1][0]===n||y.push([n,!0])})),b()(e)[0].addEventListener("keyup",(function(n){var a=w[n.which];if(t&&n.preventDefault(),a){var i=x[e][g()];i&&i[0]();for(var o=y.length-1;o>=0;o--)if(y[o][0]===a&&y[o][1]){if(o===y.length-1){for(var c=[],r=!0,l=o-1;l>=0;l--)r&&!y[l][1]||(c.push(y[l]),r=!1);y=c.reverse()}else y[o][1]=!1;break}}})),x[e]={}};D("body"),window.onblur=function(){y=[]},window.onfocus=function(){y=[]};var j=function(e){Object(s.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).containerID=void 0,a.state={active:!1},a.containerID=Math.floor(1e6*Math.random()),a}return Object(l.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{id:"command-box-".concat(this.containerID),style:{display:this.state.active?"flex":"none",position:"absolute",bottom:"40px",left:0,width:"100vw",alignItems:"center",justifyContent:"center"},onKeyDown:function(e){e.stopPropagation()}},i.a.createElement("input",{className:"command-box",type:"text",name:"command-input-".concat(this.containerID),style:{border:"1px solid white",width:"calc(100vw - 200px)",minHeight:"1em",padding:"6px 12px"}}))}},{key:"componentDidMount",value:function(){var e=this;D("#command-box-".concat(this.containerID),!1),k("#command-box-".concat(this.containerID),["esc"],(function(){e.close()}),10)}},{key:"componentDidUpdate",value:function(){this.state.active&&b()("#command-box-".concat(this.containerID," input")).val("").focus()}},{key:"componentWillUnmount",value:function(){E("#command-box-".concat(this.containerID),["esc"])}},{key:"create",value:function(){this.state.active||(b()("#command-box-".concat(this.containerID," input")).val(""),this.setState({active:!0}))}},{key:"close",value:function(){this.state.active&&(b()("#command-box-".concat(this.containerID," input")).val(""),this.setState({active:!1}))}}]),n}(a.Component),L=function(e){Object(s.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).newCommand=void 0,a.state={},a.newCommand=i.a.createRef(),a}return Object(l.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{className:"container"},i.a.createElement(f,null),i.a.createElement(j,{ref:this.newCommand}))}},{key:"componentDidMount",value:function(){var e=this;k("body",["ctrl","enter"],(function(){var t;null===(t=e.newCommand.current)||void 0===t||t.create()}),5)}},{key:"componentWillUnmount",value:function(){E("body",["ctrl","enter"])}}]),n}(a.Component);var I=function(){return i.a.createElement(L,null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(I,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},8:function(e,t,n){e.exports=n(15)}},[[8,1,2]]]);
//# sourceMappingURL=main.245c3f40.chunk.js.map