(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6492c2f2"],{"19ce":function(t,e,n){t.exports={panel:"demonstration_panel_1x-xP"}},"212b":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"demonstration"},[n("section",{class:t.$style.content},[n("Panel",{class:t.$style.panel},[t.flag?n("Demonstration",{attrs:{"get-list":t.CourseList,"get-item":t.item},on:{"get-sel-data":t.getSelData}}):t._e()],1)],1)])},s=[],i=n("873c"),o=n("f8f0"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"layout"},[n("Layout",{style:{minHeight:"80vh"}},[n("Layout",[n("Content",{style:{padding:"0 16px 16px"}},[n("Card",[n("h1",[t._v(t._s(t.getItem.header.title))]),n("div",{attrs:{id:"soild"}}),n("span",[t._v(t._s(t.getItem.header.introduction))])]),n("div",t._l(t.getItem.body.project,function(e,a){return n("Card",{key:a},[n("Row",[n("Col",{attrs:{span:"1"}},[n("Icon",{attrs:{type:"ios-navigate"}})],1),n("Col",{attrs:{span:"2"}},[t._v("演示"+t._s(e.project_id))]),n("Col",{attrs:{span:"8"}},[t._v(t._s(e.title))]),n("Col",{attrs:{span:"13","class-name":"rightbtn"}},[n("Button",{attrs:{type:"primary",icon:"logo-twitter"},on:{click:function(n){return t.goToProjectvideo(t.getItem.course_id,e.project_id)}}},[t._v(" 开始演示")])],1)],1),n("Row",[t._v(t._s(e.content))])],1)}),1)],1)],1),n("Sider",{attrs:{collapsible:"","collapsed-width":80,"reverse-arrow":!0,width:"320"},model:{value:t.isCollapsed,callback:function(e){t.isCollapsed=e},expression:"isCollapsed"}},[n("Menu",{class:t.menuitemClasses,attrs:{"active-name":t.getList[0].course_id,theme:"dark",width:"320"},on:{"on-select":t.getID}},t._l(t.getList,function(e,a){return n("MenuItem",{key:a,attrs:{name:e.course_id}},[n("Icon",{attrs:{type:"ios-navigate"}}),n("span",[t._v(t._s(e.course_id)+"、"+t._s(e.course_name))])],1)}),1)],1)],1)],1)},c=[],u=(n("3ae7"),{data:function(){return{API_HOST:"",isCollapsed:!1}},computed:{menuitemClasses:function(){return["menu-item",this.isCollapsed?"collapsed-menu":""]}},props:{getList:{type:Array,default:function(){return[]}},getItem:{type:Object,default:function(){return{}}}},methods:{goToProjectvideo:function(t,e){var n={course_id:t,project_id:e};this.$store.state.demonstration.course_id=t,this.$store.state.demonstration.project_id=e,this.$router.params=n,this.$router.push({path:"/demonstration/".concat(t,"/Projectvideo?project_id=").concat(e)})},getID:function(t){this.$emit("get-sel-data",t)}}}),l=u,d=(n("7089"),n("6691")),f=Object(d["a"])(l,r,c,!1,null,"03a90399",null),p=f.exports,m=n("5a8b"),_=n("ea75"),h={name:"demonstration",components:{Panel:o["a"],Demonstration:p},data:function(){return{CourseList:[],TempCourseList:[],item:{},SelData:null,flag:!1}},created:function(){var t=this;Object(m["a"])().then(function(e){t.CourseList=Object(i["a"])(e.msg.data),t.CourseList.shift(),Object(_["a"])(t.CourseList[0].course_id).then(function(e){200===e.status&&(t.item=e.msg.data),t.flag=!0})})},methods:{getSelData:function(t){var e=this;this.SelData=t,Object(_["a"])(this.SelData).then(function(t){200===t.status&&(e.item=t.msg.data)})}}},v=h,g=n("77b9");function b(t){this["$style"]=g["default"].locals||g["default"]}var C=Object(d["a"])(v,a,s,!1,b,null,null);e["default"]=C.exports},"3ae7":function(t,e,n){"use strict";n.d(e,"a",function(){return s});var a=n("eeb9");function s(t,e){return Object(a["a"])({url:"/api/v1/project?course_id="+t+"&project_id="+e,method:"get",withCredentials:!0,data:{course_id:t,project_id:e}})}},4861:function(t,e,n){"use strict";var a=n("bf6c"),s=n.n(a);s.a},"5a8b":function(t,e,n){"use strict";n.d(e,"a",function(){return s});var a=n("eeb9");function s(t){return Object(a["a"])({url:"/api/v1/course",method:"get",withCredentials:!0,data:t})}},7089:function(t,e,n){"use strict";var a=n("fe3a"),s=n.n(a);s.a},"77b9":function(t,e,n){"use strict";var a=n("19ce"),s=n.n(a);e["default"]=s.a},bf6c:function(t,e,n){},ea75:function(t,e,n){"use strict";n.d(e,"a",function(){return s});var a=n("eeb9");function s(t){return Object(a["a"])({url:"/api/v1/course/"+t,method:"get",withCredentials:!0})}},f8f0:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{class:[t.panelClass,t.cname]},[t._t("default")],2)},s=[],i={props:{cname:{type:String,default:""}},data:function(){return{panelClass:"panel"}}},o=i,r=(n("4861"),n("6691")),c=Object(r["a"])(o,a,s,!1,null,null,null);e["a"]=c.exports},fe3a:function(t,e,n){}}]);