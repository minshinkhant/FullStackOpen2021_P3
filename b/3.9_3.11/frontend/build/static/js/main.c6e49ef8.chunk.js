(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{19:function(e,t,n){},39:function(e,t,n){"use strict";n.r(t);var c=n(14),a=n.n(c),r=(n(19),n(3)),i=n(2),o=n(0),d=function(e){return Object(o.jsx)(o.Fragment,{children:Object(o.jsx)("form",{children:Object(o.jsxs)("div",{children:["filter shown with ",Object(o.jsx)("input",{value:e.newFilter,onChange:e.handleFilterChange})]})})})},s=function(e){return Object(o.jsx)(o.Fragment,{children:Object(o.jsx)("form",{onSubmit:e.addPerson,children:Object(o.jsx)("table",{children:Object(o.jsxs)("tbody",{children:[Object(o.jsxs)("tr",{children:[Object(o.jsx)("td",{children:"name:"}),Object(o.jsx)("td",{children:Object(o.jsx)("input",{value:e.newName,onChange:e.handleNameChange})})]}),Object(o.jsxs)("tr",{children:[Object(o.jsx)("td",{children:"number:"}),Object(o.jsx)("td",{children:Object(o.jsx)("input",{value:e.newNumber,onChange:e.handleNumberChange})})]}),Object(o.jsxs)("tr",{children:[Object(o.jsx)("td",{}),Object(o.jsx)("td",{children:Object(o.jsx)("button",{type:"submit",children:"add"})})]})]})})})})},u=function(e){var t=e.filterPersons,n=e.deleteContact;return Object(o.jsxs)("table",{children:[Object(o.jsx)("thead",{children:Object(o.jsxs)("tr",{children:[Object(o.jsx)("th",{children:"Name"}),Object(o.jsx)("th",{children:"Number"})]})}),Object(o.jsx)("tbody",{children:t.map((function(e,t){return Object(o.jsxs)("tr",{children:[Object(o.jsx)("td",{children:e.name}),Object(o.jsx)("td",{children:e.number}),Object(o.jsx)("td",{children:Object(o.jsx)("input",{type:"button",value:"delete",onClick:n(e.id,e.name)})})]},t)}))})]})},l=n(4),j=n.n(l),b="/api/persons",h={getAll:function(){return j.a.get(b).then((function(e){return e.data}))},create:function(e){return j.a.post(b,e).then((function(e){return e.data}))},update:function(e,t){return j.a.put("".concat(b,"/").concat(e),t).then((function(e){return e.data}))},deleteContact:function(e,t){return function(){if(window.confirm("Do you want to delete ".concat(t))){var n=j.a.delete("".concat(b,"/").concat(e)).then((function(e){return e.data}));return window.location.reload(),n}return!1}}},O=function(){var e=Object(i.useState)([]),t=Object(r.a)(e,2),n=t[0],c=t[1],a=Object(i.useState)(""),l=Object(r.a)(a,2),j=l[0],b=l[1],O=Object(i.useState)(""),m=Object(r.a)(O,2),f=m[0],x=m[1],w=Object(i.useState)(""),v=Object(r.a)(w,2),g=v[0],p=v[1],C=Object(i.useState)(null),N=Object(r.a)(C,2),y=N[0],S=N[1],F=Object(i.useState)(null),k=Object(r.a)(F,2),P=k[0],A=k[1];Object(i.useEffect)((function(){h.getAll().then((function(e){return c(e)}))}),[]);var _=n.filter((function(e){return e.name.toLowerCase().includes(g.toLowerCase())})),T=function(e){var t=e.message;return null===t?null:Object(o.jsx)("div",{className:"error",children:t})};return Object(o.jsxs)("div",{className:"main_div",children:[Object(o.jsx)("h1",{className:"header_div",children:"Phonebook"}),Object(o.jsx)(T,{message:y}),Object(o.jsx)(T,{message:P}),Object(o.jsx)(d,{newFilter:g,handleFilterChange:function(e){p(e.target.value)}}),Object(o.jsx)("h2",{className:"header_div",children:"Add a new contact"}),Object(o.jsx)(s,{addPerson:function(e){e.preventDefault();var t={name:j,number:f};n.find((function(e){return e.name===t.name}))?window.confirm("".concat(j," is already added to phonebook, \n      replace the old number with the new one?"))&&(t.id=n.find((function(e){return e.name===t.name})).id,h.update(t.id,t).then((function(e){b(""),x(""),S("Updated ".concat(e.name)),setTimeout((function(){S(null),window.location.reload()}),5e3)})).catch((function(e){A("Information of ".concat(t.name," has already \n              been removed from server")),console.log(e),setTimeout((function(){A(null),window.location.reload()}),3e3)}))):(t.id=n.length+1,h.create(t).then((function(e){c(e),b(""),x(""),S("Added ".concat(t.name)),setTimeout((function(){S(null)}),5e3)})))},newName:j,handleNameChange:function(e){b(e.target.value)},newNumber:f,handleNumberChange:function(e){x(e.target.value)}}),Object(o.jsx)("h2",{className:"header_div",children:"Contacts"}),Object(o.jsx)(u,{filterPersons:_,deleteContact:h.deleteContact})]})};a.a.render(Object(o.jsx)(O,{}),document.getElementById("root"))}},[[39,1,2]]]);
//# sourceMappingURL=main.c6e49ef8.chunk.js.map