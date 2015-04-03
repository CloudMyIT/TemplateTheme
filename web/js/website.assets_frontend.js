/*
For Reference Only,
DO NOT EDIT ANY OF THE VALUES IN THIS SHEET
*/
/* /website/static/src/js/website.js defined in bundle 'website.assets_frontend' */
odoo.define('website.website',function(require){"use strict";var ajax=require('web.ajax');var core=require('web.core');var session=require('web.session');var _t=core._t;var browser;if($.browser.webkit)browser="webkit";else if($.browser.safari)browser="safari";else if($.browser.opera)browser="opera";else if($.browser.msie||($.browser.mozilla&&+$.browser.version.replace(/^([0-9]+\.[0-9]+).*/,'\$1')<20))browser="msie";else if($.browser.mozilla)browser="mozilla";browser+=","+$.browser.version;if(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))browser+=",mobile";document.documentElement.setAttribute('data-browser',browser);var translatable=!!$('html').data('translatable');var data={id:undefined,session:undefined,};function get_context(dict){var html=document.documentElement;return _.extend({lang:html.getAttribute('lang').replace('-','_'),website_id:html.getAttribute('data-website-id')|0},dict);}
function parseQS(qs){var match,params={},pl=/\+/g,search=/([^&=]+)=?([^&]*)/g;while((match=search.exec(qs))){var name=decodeURIComponent(match[1].replace(pl," "));var value=decodeURIComponent(match[2].replace(pl," "));params[name]=value;}
return params;}
var _parsedSearch;function parseSearch(){if(!_parsedSearch){_parsedSearch=parseQS(window.location.search.substring(1));}
return _parsedSearch;}
function parseHash(){return parseQS(window.location.hash.substring(1));}
function reload(){location.hash="scrollTop="+window.document.body.scrollTop;if(location.search.indexOf("enable_editor")>-1){window.location.href=window.location.href.replace(/enable_editor(=[^&]*)?/g,'');}else{window.location.reload();}}
function prompt(options,qweb){if(typeof options==='string'){options={text:options};}
if(_.isUndefined(qweb)){qweb='website.prompt';}
options=_.extend({window_title:'',field_name:'','default':'',init:function(){},},options||{});var type=_.intersection(Object.keys(options),['input','textarea','select']);type=type.length?type[0]:'text';options.field_type=type;options.field_name=options.field_name||options[type];var def=$.Deferred();var dialog=$(core.qweb.render(qweb,options)).appendTo("body");options.$dialog=dialog;var field=dialog.find(options.field_type).first();field.val(options['default']);field.fillWith=function(data){if(field.is('select')){var select=field[0];data.forEach(function(item){select.options[select.options.length]=new Option(item[1],item[0]);});}else{field.val(data);}};var init=options.init(field,dialog);$.when(init).then(function(fill){if(fill){field.fillWith(fill);}
dialog.modal('show');field.focus();dialog.on('click','.btn-primary',function(){def.resolve(field.val(),field,dialog);dialog.remove();$('.modal-backdrop').remove();});});dialog.on('hidden.bs.modal',function(){def.reject();dialog.remove();$('.modal-backdrop').remove();});if(field.is('input[type="text"], select')){field.keypress(function(e){if(e.which==13){e.preventDefault();dialog.find('.btn-primary').trigger('click');}});}
return def;}
function error(data,url){var $error=$(core.qweb.render('website.error_dialog',{'title':data.data?data.data.arguments[0]:"",'message':data.data?data.data.arguments[1]:data.statusText,'backend_url':url}));$error.appendTo("body");$error.modal('show');}
function form(url,method,params){var htmlform=document.createElement('form');htmlform.setAttribute('action',url);htmlform.setAttribute('method',method);_.each(params,function(v,k){var param=document.createElement('input');param.setAttribute('type','hidden');param.setAttribute('name',k);param.setAttribute('value',v);htmlform.appendChild(param);});document.body.appendChild(htmlform);htmlform.submit();}
function init_kanban($kanban){$('.js_kanban_col',$kanban).each(function(){var $col=$(this);var $pagination=$('.pagination',$col);if(!$pagination.size()){return;}
var page_count=$col.data('page_count');var scope=$pagination.last().find("li").size()-2;var kanban_url_col=$pagination.find("li a:first").attr("href").replace(/[0-9]+$/,'');var data={'domain':$col.data('domain'),'model':$col.data('model'),'template':$col.data('template'),'step':$col.data('step'),'orderby':$col.data('orderby')};$pagination.on('click','a',function(ev){ev.preventDefault();var $a=$(ev.target);if($a.parent().hasClass('active')){return;}
var page=+$a.attr("href").split(",").pop().split('-')[1];data.page=page;$.post('/website/kanban',data,function(col){$col.find("> .thumbnail").remove();$pagination.last().before(col);});var page_start=page-parseInt(Math.floor((scope-1)/2),10);if(page_start<1)page_start=1;var page_end=page_start+(scope-1);if(page_end>page_count)page_end=page_count;if(page_end-page_start<scope){page_start=page_end-scope>0?page_end-scope:1;}
$pagination.find('li.prev a').attr("href",kanban_url_col+(page-1>0?page-1:1));$pagination.find('li.next a').attr("href",kanban_url_col+(page<page_end?page+1:page_end));for(var i=0;i<scope;i++){$pagination.find('li:not(.prev):not(.next):eq('+i+') a').attr("href",kanban_url_col+(page_start+i)).html(page_start+i);}
$pagination.find('li.active').removeClass('active');$pagination.find('li:has(a[href="'+kanban_url_col+page+'"])').addClass('active');});});}
var templates_def=$.Deferred().resolve();function add_template_file(template){var def=$.Deferred();templates_def=templates_def.then(function(){core.qweb.add_template(template,function(err){if(err){def.reject(err);}else{def.resolve();}});return def;});return def;}
add_template_file('/website/static/src/xml/website.xml');var dom_ready=$.Deferred();$(document).ready(function(){dom_ready.resolve();if($.fn.placeholder)$('input, textarea').placeholder();});function if_dom_contains(selector,fn){dom_ready.then(function(){var elems=$(selector);if(elems.length){fn(elems);}});}
var all_ready=null;function ready(){if(!all_ready){all_ready=dom_ready.then(function(){return templates_def;}).then(function(){if($('[data-oe-model]').size()){$("#oe_editzone").show();}
if($('html').data('website-id')){data.id=$('html').data('website-id');data.session=session;return ajax.jsonRpc('/website/translations','call',{'lang':get_context().lang}).then(function(trans){_t.database.set_bundle(trans);});}}).then(function(){var templates=core.qweb.templates;var keys=_.keys(templates);for(var i=0;i<keys.length;i++){treat_node(templates[keys[i]]);}}).promise();}
return all_ready;}
function treat_node(node){if(node.nodeType===3){if(node.nodeValue.match(/\S/)){var text_value=$.trim(node.nodeValue);var spaces=node.nodeValue.split(text_value);node.nodeValue=spaces[0]+_t(text_value)+spaces[1];}}
else if(node.nodeType===1&&node.hasChildNodes()){_.each(node.childNodes,function(subnode){treat_node(subnode);});}};function inject_tour(){}
dom_ready.then(function(){$(document).on('click','.js_publish_management .js_publish_btn',function(){var $data=$(this).parents(".js_publish_management:first");ajax.jsonRpc($data.data('controller')||'/website/publish','call',{'id':+$data.data('id'),'object':$data.data('object')}).then(function(result){$data.toggleClass("css_unpublished css_published");$data.parents("[data-publish]").attr("data-publish",+result?'on':'off');}).fail(function(err,data){error(data,'/web#return_label=Website&model='+$data.data('object')+'&id='+$data.data('id'));});});$('.js_kanban').each(function(){init_kanban(this);});setTimeout(function(){if(window.location.hash.indexOf("scrollTop=")>-1){window.document.body.scrollTop=+location.hash.match(/scrollTop=([0-9]+)/)[1];}},0);var $collapse=$('#oe_applications ul.dropdown-menu').clone().attr("id","oe_applications_collapse").attr("class","nav navbar-nav navbar-left navbar-collapse collapse");$('#oe_applications').before($collapse);$collapse.wrap('<div class="visible-xs"/>');$('[data-target="#oe_applications"]').attr("data-target","#oe_applications_collapse");});return{translatable:translatable,get_context:get_context,parseQS:parseQS,parseSearch:parseSearch,parseHash:parseHash,reload:reload,prompt:prompt,error:error,form:form,init_kanban:init_kanban,add_template_file:add_template_file,dom_ready:dom_ready,if_dom_contains:if_dom_contains,ready:ready,inject_tour:inject_tour,data:data,};});odoo.define('web.session',function(require){"use strict";var Session=require('web.Session');return new Session(null,null,{modules:['website']});});;

/* /website/static/src/js/website.share.js defined in bundle 'website.assets_frontend' */
odoo.define('website.share',function(require){"use strict";var core=require('web.core');var Widget=require('web.Widget');var website=require('website.website');var qweb=core.qweb;website.add_template_file('/website/static/src/xml/website.share.xml');var SocialShare=Widget.extend({template:'website.social_hover',init:function(parent){this._super.apply(this,arguments);this.element=parent;if(parent.data('social')){this.social_list=(parent.data('social')).split();}else{this.social_list=['facebook','twitter','linkedin','google-plus'];}
this.hashtags=parent.data('hashtags')||'';this.renderElement();this.bind_events();},bind_events:function(){$('.oe_social_facebook').click($.proxy(this.renderSocial,this,'facebook'));$('.oe_social_twitter').click($.proxy(this.renderSocial,this,'twitter'));$('.oe_social_linkedin').click($.proxy(this.renderSocial,this,'linkedin'));$('.oe_social_google-plus').click($.proxy(this.renderSocial,this,'google-plus'));},renderElement:function(){this.$el.append(qweb.render('website.social_hover',{medias:this.social_list}));this.element.popover({'content':this.$el.html(),'placement':'bottom','container':this.element,'html':true,'trigger':'manual','animation':false,}).popover("show").on("mouseleave",function(){var self=this;setTimeout(function(){if(!$(".popover:hover").length){$(self).popover("destroy");}},200);});},renderSocial:function(social){var url=document.URL.split(/[?#]/)[0];var title=document.title.split(" | ")[0];var hashtags=' #'+document.title.split(" | ")[1].replace(' ','')+' '+this.hashtags;var social_network={'facebook':'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url),'twitter':'https://twitter.com/intent/tweet?original_referer='+encodeURIComponent(url)+'&text='+encodeURIComponent(title+hashtags+' - '+url),'linkedin':'https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(url)+'&title='+encodeURIComponent(title),'google-plus':'https://plus.google.com/share?url='+encodeURIComponent(url)};if(!_.contains(_.keys(social_network),social))return;var window_height=500,window_width=500;window.open(social_network[social],'','menubar=no, toolbar=no, resizable=yes, scrollbar=yes, height='+window_height+',width='+window_width);},});website.ready().done(function(){$('.oe_social_share').mouseenter(function(){new SocialShare($(this));});});return SocialShare;});;

/* /website/static/src/js/website.snippets.animation.js defined in bundle 'website.assets_frontend' */
odoo.define('website.snippets.animation',function(require){'use strict';var ajax=require('web.ajax');var core=require('web.core');var website=require('website.website');var readyAnimation=[];var animationRegistry=Object.create(null);function load_called_template(){var ids_or_xml_ids=_.uniq($("[data-oe-call]").map(function(){return $(this).data('oe-call');}).get());if(ids_or_xml_ids.length){ajax.jsonRpc('/website/multi_render','call',{'ids_or_xml_ids':ids_or_xml_ids}).then(function(data){for(var k in data){var $data=$(data[k]).addClass('o_block_'+k);$("[data-oe-call='"+k+"']").each(function(){$(this).replaceWith($data.clone());});}});}}
function start_animation(editable_mode,$target){for(var k in animationRegistry){var Animation=animationRegistry[k];var selector="";if(Animation.prototype.selector){if(selector!=="")selector+=", ";selector+=Animation.prototype.selector;}
if($target){if($target.is(selector))selector=$target;else continue;}
$(selector).each(function(){var $snipped_id=$(this);if(!$snipped_id.parents("#oe_snippets").length&&!$snipped_id.parent("body").length&&!$snipped_id.data("snippet-view")){readyAnimation.push($snipped_id);$snipped_id.data("snippet-view",new Animation($snipped_id,editable_mode));}else if($snipped_id.data("snippet-view")){$snipped_id.data("snippet-view").start(editable_mode);}});}}
function stop_animation(){$(readyAnimation).each(function(){var $snipped_id=$(this);if($snipped_id.data("snippet-view")){$snipped_id.data("snippet-view").stop();}});}
load_called_template();$(document).ready(function(){if($(".o_gallery:not(.oe_slideshow)").size()){website.add_template_file('/website/static/src/xml/website.gallery.xml');}
start_animation();});var Animation=core.Class.extend({selector:false,$:function(){return this.$el.find.apply(this.$el,arguments);},init:function(dom,editable_mode){this.$el=this.$target=$(dom);this.start(editable_mode);},start:function(){},stop:function(){},});animationRegistry.slider=Animation.extend({selector:".carousel",start:function(){this.$target.carousel();},stop:function(){this.$target.carousel('pause');this.$target.removeData("bs.carousel");},});animationRegistry.parallax=Animation.extend({selector:".parallax",start:function(){var self=this;setTimeout(function(){self.set_values();});this.on_scroll=function(){var speed=parseFloat(self.$target.attr("data-scroll-background-ratio")||0);if(speed==1)return;var offset=parseFloat(self.$target.attr("data-scroll-background-offset")||0);var top=offset+window.scrollY*speed;self.$target.css("background-position","0px "+top+"px");};this.on_resize=function(){self.set_values();};$(window).on("scroll",this.on_scroll);$(window).on("resize",this.on_resize);},stop:function(){$(window).off("scroll",this.on_scroll).off("resize",this.on_resize);},set_values:function(){var self=this;var speed=parseFloat(self.$target.attr("data-scroll-background-ratio")||0);if(speed===1||this.$target.css("background-image")==="none"){this.$target.css("background-attachment","fixed").css("background-position","0px 0px");return;}else{this.$target.css("background-attachment","scroll");}
this.$target.attr("data-scroll-background-offset",0);var img=new Image();img.onload=function(){var offset=0;var padding=parseInt($(document.body).css("padding-top"));if(speed>1){var inner_offset=-self.$target.outerHeight()+this.height/this.width*document.body.clientWidth;var outer_offset=self.$target.offset().top-(document.body.clientHeight-self.$target.outerHeight())-padding;offset=-outer_offset*speed+inner_offset;}else{offset=-self.$target.offset().top*speed;}
self.$target.attr("data-scroll-background-offset",offset>0?0:offset);$(window).scroll();};img.src=this.$target.css("background-image").replace(/url\(['"]*|['"]*\)/g,"");$(window).scroll();}});animationRegistry.share=Animation.extend({selector:".oe_share",start:function(){var url=encodeURIComponent(window.location.href);var title=encodeURIComponent($("title").text());this.$("a").each(function(){var $a=$(this);$a.attr("href",$(this).attr("href").replace("{url}",url).replace("{title}",title));if($a.attr("target")&&$a.attr("target").match(/_blank/i)&&!$a.closest('.o_editable').length){$a.on('click',function(){window.open(this.href,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=550,width=600');return false;});}});}});animationRegistry.media_video=Animation.extend({selector:".media_iframe_video",start:function(){if(!this.$target.has('.media_iframe_video_size')){var editor='<div class="css_editable_mode_display">&nbsp;</div>';var size='<div class="media_iframe_video_size">&nbsp;</div>';this.$target.html(editor+size+'<iframe src="'+this.$target.data("src")+'" frameborder="0" allowfullscreen="allowfullscreen"></iframe>');}},});animationRegistry.ul=Animation.extend({selector:"ul.o_ul_folded, ol.o_ul_folded",start:function(){this.$('.o_ul_toggle_self').off('click').on('click',function(event){$(this).toggleClass('o_open');$(this).closest('li').find('ul,ol').toggleClass('o_close');event.preventDefault();});this.$('.o_ul_toggle_next').off('click').on('click',function(event){$(this).toggleClass('o_open');$(this).closest('li').next().toggleClass('o_close');event.preventDefault();});},});animationRegistry.gallery=Animation.extend({selector:".o_gallery:not(.o_slideshow)",start:function(){this.$el.on("click","img",this.click_handler);},click_handler:function(event){var $cur=$(event.currentTarget);var edition_mode=($cur.closest("[contenteditable='true']").size()!==0);if(!edition_mode){var urls=[],idx=undefined,milliseconds=undefined,params=undefined,$images=$cur.closest(".o_gallery").find("img"),size=0.8,dimensions={min_width:Math.round(window.innerWidth*size*0.9),min_height:Math.round(window.innerHeight*size),max_width:Math.round(window.innerWidth*size*0.9),max_height:Math.round(window.innerHeight*size),width:Math.round(window.innerWidth*size*0.9),height:Math.round(window.innerHeight*size)};$images.each(function(){urls.push($(this).attr("src"));});var $img=($cur.is("img")===true)?$cur:$cur.closest("img");idx=urls.indexOf($img.attr("src"));milliseconds=$cur.closest(".o_gallery").data("interval")||false;params={srcs:urls,index:idx,dim:dimensions,interval:milliseconds,id:_.uniqueId("slideshow_")};var $modal=$(core.qweb.render('website.gallery.slideshow.lightbox',params));$modal.modal({keyboard:true,backdrop:true});$modal.on('hidden.bs.modal',function(){$(this).hide();$(this).siblings().filter(".modal-backdrop").remove();$(this).remove();});$modal.find(".modal-content, .modal-body.o_slideshow").css("height","100%");$modal.appendTo(document.body);this.carousel=new animationRegistry.gallery_slider($modal.find(".carousel").carousel());}}});animationRegistry.gallery_slider=Animation.extend({selector:".o_slideshow",start:function(){var $carousel=this.$target.is(".carousel")?this.$target:this.$target.find(".carousel");var $indicator=$carousel.find('.carousel-indicators');var $lis=$indicator.find('li:not(.fa)');var $prev=$indicator.find('li.fa:first');var $next=$indicator.find('li.fa:last');var index=($lis.filter('.active').index()||1)-1;var page=Math.floor(index/10);var nb=Math.ceil($lis.length/10);$carousel.on('slide.bs.carousel',function(){setTimeout(function(){var $item=$carousel.find('.carousel-inner .prev, .carousel-inner .next');var index=$item.index();$lis.removeClass("active").filter('[data-slide-to="'+index+'"]').addClass("active");},0);});function hide(){$lis.addClass('hidden').each(function(i){if(i>=page*10&&i<(page+1)*10){$(this).removeClass('hidden');}});$prev.css('visibility',page===0?'hidden':'');$next.css('visibility',(page+1)>=nb?'hidden':'');}
$indicator.find('li.fa').on('click',function(){page=(page+($(this).hasClass('o_indicators_left')?-1:1))%nb;$carousel.carousel(page*10);hide();});hide();$carousel.on('slid.bs.carousel',function(){var index=($lis.filter('.active').index()||1)-1;page=Math.floor(index/10);hide();});}});return{Animation:Animation,readyAnimation:readyAnimation,start_animation:start_animation,stop_animation:stop_animation,registry:animationRegistry,};});;

/* /web/static/lib/bootstrap/js/bootstrap.js defined in bundle 'website.assets_frontend' */
if(typeof jQuery==='undefined'){throw new Error('Bootstrap\'s JavaScript requires jQuery')}
+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false
var $el=this
$(this).one('bsTransitionEnd',function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()
if(!$.support.transition)return
$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);+function($){'use strict';var dismiss='[data-dismiss="alert"]'
var Alert=function(el){$(el).on('click',dismiss,this.close)}
Alert.VERSION='3.2.0'
Alert.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=$(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.hasClass('alert')?$this:$this.parent()}
$parent.trigger(e=$.Event('close.bs.alert'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.detach().trigger('closed.bs.alert').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one('bsTransitionEnd',removeElement).emulateTransitionEnd(150):removeElement()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.alert')
if(!data)$this.data('bs.alert',(data=new Alert(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.alert
$.fn.alert=Plugin
$.fn.alert.Constructor=Alert
$.fn.alert.noConflict=function(){$.fn.alert=old
return this}
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close)}(jQuery);+function($){'use strict';var Button=function(element,options){this.$element=$(element)
this.options=$.extend({},Button.DEFAULTS,options)
this.isLoading=false}
Button.VERSION='3.2.0'
Button.DEFAULTS={loadingText:'loading...'}
Button.prototype.setState=function(state){var d='disabled'
var $el=this.$element
var val=$el.is('input')?'val':'html'
var data=$el.data()
state=state+'Text'
if(data.resetText==null)$el.data('resetText',$el[val]())
$el[val](data[state]==null?this.options[state]:data[state])
setTimeout($.proxy(function(){if(state=='loadingText'){this.isLoading=true
$el.addClass(d).attr(d,d)}else if(this.isLoading){this.isLoading=false
$el.removeClass(d).removeAttr(d)}},this),0)}
Button.prototype.toggle=function(){var changed=true
var $parent=this.$element.closest('[data-toggle="buttons"]')
if($parent.length){var $input=this.$element.find('input')
if($input.prop('type')=='radio'){if($input.prop('checked')&&this.$element.hasClass('active'))changed=false
else $parent.find('.active').removeClass('active')}
if(changed)$input.prop('checked',!this.$element.hasClass('active')).trigger('change')}
if(changed)this.$element.toggleClass('active')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.button')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.button',(data=new Button(this,options)))
if(option=='toggle')data.toggle()
else if(option)data.setState(option)})}
var old=$.fn.button
$.fn.button=Plugin
$.fn.button.Constructor=Button
$.fn.button.noConflict=function(){$.fn.button=old
return this}
$(document).on('click.bs.button.data-api','[data-toggle^="button"]',function(e){var $btn=$(e.target)
if(!$btn.hasClass('btn'))$btn=$btn.closest('.btn')
Plugin.call($btn,'toggle')
e.preventDefault()})}(jQuery);+function($){'use strict';var Carousel=function(element,options){this.$element=$(element).on('keydown.bs.carousel',$.proxy(this.keydown,this))
this.$indicators=this.$element.find('.carousel-indicators')
this.options=options
this.paused=this.sliding=this.interval=this.$active=this.$items=null
this.options.pause=='hover'&&this.$element.on('mouseenter.bs.carousel',$.proxy(this.pause,this)).on('mouseleave.bs.carousel',$.proxy(this.cycle,this))}
Carousel.VERSION='3.2.0'
Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true}
Carousel.prototype.keydown=function(e){switch(e.which){case 37:this.prev();break
case 39:this.next();break
default:return}
e.preventDefault()}
Carousel.prototype.cycle=function(e){e||(this.paused=false)
this.interval&&clearInterval(this.interval)
this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval))
return this}
Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children('.item')
return this.$items.index(item||this.$active)}
Carousel.prototype.to=function(pos){var that=this
var activeIndex=this.getItemIndex(this.$active=this.$element.find('.item.active'))
if(pos>(this.$items.length-1)||pos<0)return
if(this.sliding)return this.$element.one('slid.bs.carousel',function(){that.to(pos)})
if(activeIndex==pos)return this.pause().cycle()
return this.slide(pos>activeIndex?'next':'prev',$(this.$items[pos]))}
Carousel.prototype.pause=function(e){e||(this.paused=true)
if(this.$element.find('.next, .prev').length&&$.support.transition){this.$element.trigger($.support.transition.end)
this.cycle(true)}
this.interval=clearInterval(this.interval)
return this}
Carousel.prototype.next=function(){if(this.sliding)return
return this.slide('next')}
Carousel.prototype.prev=function(){if(this.sliding)return
return this.slide('prev')}
Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active')
var $next=next||$active[type]()
var isCycling=this.interval
var direction=type=='next'?'left':'right'
var fallback=type=='next'?'first':'last'
var that=this
if(!$next.length){if(!this.options.wrap)return
$next=this.$element.find('.item')[fallback]()}
if($next.hasClass('active'))return(this.sliding=false)
var relatedTarget=$next[0]
var slideEvent=$.Event('slide.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
this.$element.trigger(slideEvent)
if(slideEvent.isDefaultPrevented())return
this.sliding=true
isCycling&&this.pause()
if(this.$indicators.length){this.$indicators.find('.active').removeClass('active')
var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)])
$nextIndicator&&$nextIndicator.addClass('active')}
var slidEvent=$.Event('slid.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
if($.support.transition&&this.$element.hasClass('slide')){$next.addClass(type)
$next[0].offsetWidth
$active.addClass(direction)
$next.addClass(direction)
$active.one('bsTransitionEnd',function(){$next.removeClass([type,direction].join(' ')).addClass('active')
$active.removeClass(['active',direction].join(' '))
that.sliding=false
setTimeout(function(){that.$element.trigger(slidEvent)},0)}).emulateTransitionEnd($active.css('transition-duration').slice(0,-1)*1000)}else{$active.removeClass('active')
$next.addClass('active')
this.sliding=false
this.$element.trigger(slidEvent)}
isCycling&&this.cycle()
return this}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.carousel')
var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=='object'&&option)
var action=typeof option=='string'?option:options.slide
if(!data)$this.data('bs.carousel',(data=new Carousel(this,options)))
if(typeof option=='number')data.to(option)
else if(action)data[action]()
else if(options.interval)data.pause().cycle()})}
var old=$.fn.carousel
$.fn.carousel=Plugin
$.fn.carousel.Constructor=Carousel
$.fn.carousel.noConflict=function(){$.fn.carousel=old
return this}
$(document).on('click.bs.carousel.data-api','[data-slide], [data-slide-to]',function(e){var href
var $this=$(this)
var $target=$($this.attr('data-target')||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''))
if(!$target.hasClass('carousel'))return
var options=$.extend({},$target.data(),$this.data())
var slideIndex=$this.attr('data-slide-to')
if(slideIndex)options.interval=false
Plugin.call($target,options)
if(slideIndex){$target.data('bs.carousel').to(slideIndex)}
e.preventDefault()})
$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this)
Plugin.call($carousel,$carousel.data())})})}(jQuery);+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.transitioning=null
if(this.options.parent)this.$parent=$(this.options.parent)
if(this.options.toggle)this.toggle()}
Collapse.VERSION='3.2.0'
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var actives=this.$parent&&this.$parent.find('> .panel > .in')
if(actives&&actives.length){var hasData=actives.data('bs.collapse')
if(hasData&&hasData.transitioning)return
Plugin.call(actives,'hide')
hasData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')[dimension](0)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element[dimension](this.$element[dimension]())[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse').removeClass('in')
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.trigger('hidden.bs.collapse').removeClass('collapsing').addClass('collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(350)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&option=='show')option=!option
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.collapse
$.fn.collapse=Plugin
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var href
var $this=$(this)
var target=$this.attr('data-target')||e.preventDefault()||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
var $target=$(target)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
var parent=$this.attr('data-parent')
var $parent=parent&&$(parent)
if(!data||!data.transitioning){if($parent)$parent.find('[data-toggle="collapse"][data-parent="'+parent+'"]').not($this).addClass('collapsed')
$this[$target.hasClass('in')?'addClass':'removeClass']('collapsed')}
Plugin.call($target,option)})}(jQuery);+function($){'use strict';var backdrop='.dropdown-backdrop'
var toggle='[data-toggle="dropdown"]'
var Dropdown=function(element){$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.VERSION='3.2.0'
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click',clearMenus)}
var relatedTarget={relatedTarget:this}
$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.trigger('focus')
$parent.toggleClass('open').trigger('shown.bs.dropdown',relatedTarget)}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27)/.test(e.keyCode))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if(!isActive||(isActive&&e.keyCode==27)){if(e.which==27)$parent.find(toggle).trigger('focus')
return $this.trigger('click')}
var desc=' li:not(.divider):visible a'
var $items=$parent.find('[role="menu"]'+desc+', [role="listbox"]'+desc)
if(!$items.length)return
var index=$items.index($items.filter(':focus'))
if(e.keyCode==38&&index>0)index--
if(e.keyCode==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).trigger('focus')}
function clearMenus(e){if(e&&e.which===3)return
$(backdrop).remove()
$(toggle).each(function(){var $parent=getParent($(this))
var relatedTarget={relatedTarget:this}
if(!$parent.hasClass('open'))return
$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$parent.removeClass('open').trigger('hidden.bs.dropdown',relatedTarget)})}
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector&&$(selector)
return $parent&&$parent.length?$parent:$this.parent()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.dropdown')
if(!data)$this.data('bs.dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.dropdown
$.fn.dropdown=Plugin
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle+', [role="menu"], [role="listbox"]',Dropdown.prototype.keydown)}(jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
this.$body=$(document.body)
this.$element=$(element)
this.$backdrop=this.isShown=null
this.scrollbarWidth=0
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.VERSION='3.2.0'
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.checkScrollbar()
this.$body.addClass('modal-open')
this.setScrollbar()
this.escape()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(that.$body)}
that.$element.show().scrollTop(0)
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in').attr('aria-hidden',false)
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$element.find('.modal-dialog').one('bsTransitionEnd',function(){that.$element.trigger('focus').trigger(e)}).emulateTransitionEnd(300):that.$element.trigger('focus').trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.$body.removeClass('modal-open')
this.resetScrollbar()
this.escape()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').attr('aria-hidden',true).off('click.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one('bsTransitionEnd',$.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.trigger('focus')}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keyup.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keyup.dismiss.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var that=this
var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').appendTo(this.$body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus.call(this.$element[0]):this.hide.call(this)},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one('bsTransitionEnd',callback).emulateTransitionEnd(150):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
var callbackRemove=function(){that.removeBackdrop()
callback&&callback()}
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one('bsTransitionEnd',callbackRemove).emulateTransitionEnd(150):callbackRemove()}else if(callback){callback()}}
Modal.prototype.checkScrollbar=function(){if(document.body.clientWidth>=window.innerWidth)return
this.scrollbarWidth=this.scrollbarWidth||this.measureScrollbar()}
Modal.prototype.setScrollbar=function(){var bodyPad=parseInt((this.$body.css('padding-right')||0),10)
if(this.scrollbarWidth)this.$body.css('padding-right',bodyPad+this.scrollbarWidth)}
Modal.prototype.resetScrollbar=function(){this.$body.css('padding-right','')}
Modal.prototype.measureScrollbar=function(){var scrollDiv=document.createElement('div')
scrollDiv.className='modal-scrollbar-measure'
this.$body.append(scrollDiv)
var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth
this.$body[0].removeChild(scrollDiv)
return scrollbarWidth}
function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
var old=$.fn.modal
$.fn.modal=Plugin
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var $target=$($this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,'')))
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.one('show.bs.modal',function(showEvent){if(showEvent.isDefaultPrevented())return
$target.one('hidden.bs.modal',function(){$this.is(':visible')&&$this.trigger('focus')})})
Plugin.call($target,option,this)})}(jQuery);+function($){'use strict';var Tooltip=function(element,options){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null
this.init('tooltip',element,options)}
Tooltip.VERSION='3.2.0'
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false,viewport:{selector:'body',padding:0}}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.$viewport=this.options.viewport&&$(this.options.viewport.selector||this.options.viewport)
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
var inDom=$.contains(document.documentElement,this.$element[0])
if(e.isDefaultPrevented()||!inDom)return
var that=this
var $tip=this.tip()
var tipId=this.getUID(this.type)
this.setContent()
$tip.attr('id',tipId)
this.$element.attr('aria-describedby',tipId)
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var orgPlacement=placement
var $parent=this.$element.parent()
var parentDim=this.getPosition($parent)
placement=placement=='bottom'&&pos.top+pos.height+actualHeight-parentDim.scroll>parentDim.height?'top':placement=='top'&&pos.top-parentDim.scroll-actualHeight<0?'bottom':placement=='right'&&pos.right+actualWidth>parentDim.width?'left':placement=='left'&&pos.left-actualWidth<parentDim.left?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
var complete=function(){that.$element.trigger('shown.bs.'+that.type)
that.hoverState=null}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(150):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top=offset.top+marginTop
offset.left=offset.left+marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight}
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight)
if(delta.left)offset.left+=delta.left
else offset.top+=delta.top
var arrowDelta=delta.left?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight
var arrowPosition=delta.left?'left':'top'
var arrowOffsetPosition=delta.left?'offsetWidth':'offsetHeight'
$tip.offset(offset)
this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],arrowPosition)}
Tooltip.prototype.replaceArrow=function(delta,dimension,position){this.arrow().css(position,delta?(50*(1-delta/dimension)+'%'):'')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(){var that=this
var $tip=this.tip()
var e=$.Event('hide.bs.'+this.type)
this.$element.removeAttr('aria-describedby')
function complete(){if(that.hoverState!='in')$tip.detach()
that.$element.trigger('hidden.bs.'+that.type)}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(150):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof($e.attr('data-original-title'))!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function($element){$element=$element||this.$element
var el=$element[0]
var isBody=el.tagName=='BODY'
return $.extend({},(typeof el.getBoundingClientRect=='function')?el.getBoundingClientRect():null,{scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop(),width:isBody?$(window).width():$element.outerWidth(),height:isBody?$(window).height():$element.outerHeight()},isBody?{top:0,left:0}:$element.offset())}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0}
if(!this.$viewport)return delta
var viewportPadding=this.options.viewport&&this.options.viewport.padding||0
var viewportDimensions=this.getPosition(this.$viewport)
if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll
var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight
if(topEdgeOffset<viewportDimensions.top){delta.top=viewportDimensions.top-topEdgeOffset}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}}else{var leftEdgeOffset=pos.left-viewportPadding
var rightEdgeOffset=pos.left+viewportPadding+actualWidth
if(leftEdgeOffset<viewportDimensions.left){delta.left=viewportDimensions.left-leftEdgeOffset}else if(rightEdgeOffset>viewportDimensions.width){delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}}
return delta}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1000000)
while(document.getElementById(prefix))
return prefix}
Tooltip.prototype.tip=function(){return(this.$tip=this.$tip||$(this.options.template))}
Tooltip.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow'))}
Tooltip.prototype.validate=function(){if(!this.$element[0].parentNode){this.hide()
this.$element=null
this.options=null}}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=this
if(e){self=$(e.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions())
$(e.currentTarget).data('bs.'+this.type,self)}}
self.tip().hasClass('in')?self.leave(self):self.enter(self)}
Tooltip.prototype.destroy=function(){clearTimeout(this.timeout)
this.hide().$element.off('.'+this.type).removeData('bs.'+this.type)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&option=='destroy')return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tooltip
$.fn.tooltip=Plugin
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);+function($){'use strict';var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.VERSION='3.2.0'
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
$tip.find('.popover-title')[this.options.html?'html':'text'](title)
$tip.find('.popover-content').empty()[this.options.html?(typeof content=='string'?'html':'append'):'text'](content)
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.arrow'))}
Popover.prototype.tip=function(){if(!this.$tip)this.$tip=$(this.options.template)
return this.$tip}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data&&option=='destroy')return
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.popover
$.fn.popover=Plugin
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);+function($){'use strict';function ScrollSpy(element,options){var process=$.proxy(this.process,this)
this.$body=$('body')
this.$scrollElement=$(element).is('body')?$(window):$(element)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||'')+' .nav li > a'
this.offsets=[]
this.targets=[]
this.activeTarget=null
this.scrollHeight=0
this.$scrollElement.on('scroll.bs.scrollspy',process)
this.refresh()
this.process()}
ScrollSpy.VERSION='3.2.0'
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)}
ScrollSpy.prototype.refresh=function(){var offsetMethod='offset'
var offsetBase=0
if(!$.isWindow(this.$scrollElement[0])){offsetMethod='position'
offsetBase=this.$scrollElement.scrollTop()}
this.offsets=[]
this.targets=[]
this.scrollHeight=this.getScrollHeight()
var self=this
this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#./.test(href)&&$(href)
return($href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+offsetBase,href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){self.offsets.push(this[0])
self.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.getScrollHeight()
var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(this.scrollHeight!=scrollHeight){this.refresh()}
if(scrollTop>=maxScroll){return activeTarget!=(i=targets[targets.length-1])&&this.activate(i)}
if(activeTarget&&scrollTop<=offsets[0]){return activeTarget!=(i=targets[0])&&this.activate(i)}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(!offsets[i+1]||scrollTop<=offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active')
var selector=this.selector+'[data-target="'+target+'"],'+
this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate.bs.scrollspy')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.scrollspy
$.fn.scrollspy=Plugin
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load.bs.scrollspy.data-api',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
Plugin.call($spy,$spy.data())})})}(jQuery);+function($){'use strict';var Tab=function(element){this.element=$(element)}
Tab.VERSION='3.2.0'
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var previous=$ul.find('.active:last a')[0]
var e=$.Event('show.bs.tab',{relatedTarget:previous})
$this.trigger(e)
if(e.isDefaultPrevented())return
var $target=$(selector)
this.activate($this.closest('li'),$ul)
this.activate($target,$target.parent(),function(){$this.trigger({type:'shown.bs.tab',relatedTarget:previous})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&$active.hasClass('fade')
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active')
element.addClass('active')
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu')){element.closest('li.dropdown').addClass('active')}
callback&&callback()}
transition?$active.one('bsTransitionEnd',next).emulateTransitionEnd(150):next()
$active.removeClass('in')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tab
$.fn.tab=Plugin
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"], [data-toggle="pill"]',function(e){e.preventDefault()
Plugin.call($(this),'show')})}(jQuery);+function($){'use strict';var Affix=function(element,options){this.options=$.extend({},Affix.DEFAULTS,options)
this.$target=$(this.options.target).on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this))
this.$element=$(element)
this.affixed=this.unpin=this.pinnedOffset=null
this.checkPosition()}
Affix.VERSION='3.2.0'
Affix.RESET='affix affix-top affix-bottom'
Affix.DEFAULTS={offset:0,target:window}
Affix.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset
this.$element.removeClass(Affix.RESET).addClass('affix')
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
return(this.pinnedOffset=position.top-scrollTop)}
Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1)}
Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return
var scrollHeight=$(document).height()
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
var offset=this.options.offset
var offsetTop=offset.top
var offsetBottom=offset.bottom
if(typeof offset!='object')offsetBottom=offsetTop=offset
if(typeof offsetTop=='function')offsetTop=offset.top(this.$element)
if(typeof offsetBottom=='function')offsetBottom=offset.bottom(this.$element)
var affix=this.unpin!=null&&(scrollTop+this.unpin<=position.top)?false:offsetBottom!=null&&(position.top+this.$element.height()>=scrollHeight-offsetBottom)?'bottom':offsetTop!=null&&(scrollTop<=offsetTop)?'top':false
if(this.affixed===affix)return
if(this.unpin!=null)this.$element.css('top','')
var affixType='affix'+(affix?'-'+affix:'')
var e=$.Event(affixType+'.bs.affix')
this.$element.trigger(e)
if(e.isDefaultPrevented())return
this.affixed=affix
this.unpin=affix=='bottom'?this.getPinnedOffset():null
this.$element.removeClass(Affix.RESET).addClass(affixType).trigger($.Event(affixType.replace('affix','affixed')))
if(affix=='bottom'){this.$element.offset({top:scrollHeight-this.$element.height()-offsetBottom})}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.affix')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.affix',(data=new Affix(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.affix
$.fn.affix=Plugin
$.fn.affix.Constructor=Affix
$.fn.affix.noConflict=function(){$.fn.affix=old
return this}
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this)
var data=$spy.data()
data.offset=data.offset||{}
if(data.offsetBottom)data.offset.bottom=data.offsetBottom
if(data.offsetTop)data.offset.top=data.offsetTop
Plugin.call($spy,data)})})}(jQuery);;

/* /web/static/lib/select2/select2.js defined in bundle 'website.assets_frontend' */
(function($){if(typeof $.fn.each2=="undefined"){$.extend($.fn,{each2:function(c){var j=$([0]),i=-1,l=this.length;while(++i<l&&(j.context=j[0]=this[i])&&c.call(j[0],i,j)!==false);return this;}});}})(jQuery);(function($,undefined){"use strict";if(window.Select2!==undefined){return;}
var KEY,AbstractSelect2,SingleSelect2,MultiSelect2,nextUid,sizer,lastMousePosition={x:0,y:0},$document,scrollBarDimensions,KEY={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(k){k=k.which?k.which:k;switch(k){case KEY.LEFT:case KEY.RIGHT:case KEY.UP:case KEY.DOWN:return true;}
return false;},isControl:function(e){var k=e.which;switch(k){case KEY.SHIFT:case KEY.CTRL:case KEY.ALT:return true;}
if(e.metaKey)return true;return false;},isFunctionKey:function(k){k=k.which?k.which:k;return k>=112&&k<=123;}},MEASURE_SCROLLBAR_TEMPLATE="<div class='select2-measure-scrollbar'></div>",DIACRITICS={"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z","\u0386":"\u0391","\u0388":"\u0395","\u0389":"\u0397","\u038A":"\u0399","\u03AA":"\u0399","\u038C":"\u039F","\u038E":"\u03A5","\u03AB":"\u03A5","\u038F":"\u03A9","\u03AC":"\u03B1","\u03AD":"\u03B5","\u03AE":"\u03B7","\u03AF":"\u03B9","\u03CA":"\u03B9","\u0390":"\u03B9","\u03CC":"\u03BF","\u03CD":"\u03C5","\u03CB":"\u03C5","\u03B0":"\u03C5","\u03C9":"\u03C9","\u03C2":"\u03C3"};$document=$(document);nextUid=(function(){var counter=1;return function(){return counter++;};}());function reinsertElement(element){var placeholder=$(document.createTextNode(''));element.before(placeholder);placeholder.before(element);placeholder.remove();}
function stripDiacritics(str){function match(a){return DIACRITICS[a]||a;}
return str.replace(/[^\u0000-\u007E]/g,match);}
function indexOf(value,array){var i=0,l=array.length;for(;i<l;i=i+1){if(equal(value,array[i]))return i;}
return-1;}
function measureScrollbar(){var $template=$(MEASURE_SCROLLBAR_TEMPLATE);$template.appendTo('body');var dim={width:$template.width()-$template[0].clientWidth,height:$template.height()-$template[0].clientHeight};$template.remove();return dim;}
function equal(a,b){if(a===b)return true;if(a===undefined||b===undefined)return false;if(a===null||b===null)return false;if(a.constructor===String)return a+''===b+'';if(b.constructor===String)return b+''===a+'';return false;}
function splitVal(string,separator){var val,i,l;if(string===null||string.length<1)return[];val=string.split(separator);for(i=0,l=val.length;i<l;i=i+1)val[i]=$.trim(val[i]);return val;}
function getSideBorderPadding(element){return element.outerWidth(false)-element.width();}
function installKeyUpChangeEvent(element){var key="keyup-change-value";element.on("keydown",function(){if($.data(element,key)===undefined){$.data(element,key,element.val());}});element.on("keyup",function(){var val=$.data(element,key);if(val!==undefined&&element.val()!==val){$.removeData(element,key);element.trigger("keyup-change");}});}
function installFilteredMouseMove(element){element.on("mousemove",function(e){var lastpos=lastMousePosition;if(lastpos===undefined||lastpos.x!==e.pageX||lastpos.y!==e.pageY){$(e.target).trigger("mousemove-filtered",e);}});}
function debounce(quietMillis,fn,ctx){ctx=ctx||undefined;var timeout;return function(){var args=arguments;window.clearTimeout(timeout);timeout=window.setTimeout(function(){fn.apply(ctx,args);},quietMillis);};}
function installDebouncedScroll(threshold,element){var notify=debounce(threshold,function(e){element.trigger("scroll-debounced",e);});element.on("scroll",function(e){if(indexOf(e.target,element.get())>=0)notify(e);});}
function focus($el){if($el[0]===document.activeElement)return;window.setTimeout(function(){var el=$el[0],pos=$el.val().length,range;$el.focus();var isVisible=(el.offsetWidth>0||el.offsetHeight>0);if(isVisible&&el===document.activeElement){if(el.setSelectionRange)
{el.setSelectionRange(pos,pos);}
else if(el.createTextRange){range=el.createTextRange();range.collapse(false);range.select();}}},0);}
function getCursorInfo(el){el=$(el)[0];var offset=0;var length=0;if('selectionStart'in el){offset=el.selectionStart;length=el.selectionEnd-offset;}else if('selection'in document){el.focus();var sel=document.selection.createRange();length=document.selection.createRange().text.length;sel.moveStart('character',-el.value.length);offset=sel.text.length-length;}
return{offset:offset,length:length};}
function killEvent(event){event.preventDefault();event.stopPropagation();}
function killEventImmediately(event){event.preventDefault();event.stopImmediatePropagation();}
function measureTextWidth(e){if(!sizer){var style=e[0].currentStyle||window.getComputedStyle(e[0],null);sizer=$(document.createElement("div")).css({position:"absolute",left:"-10000px",top:"-10000px",display:"none",fontSize:style.fontSize,fontFamily:style.fontFamily,fontStyle:style.fontStyle,fontWeight:style.fontWeight,letterSpacing:style.letterSpacing,textTransform:style.textTransform,whiteSpace:"nowrap"});sizer.attr("class","select2-sizer");$("body").append(sizer);}
sizer.text(e.val());return sizer.width();}
function syncCssClasses(dest,src,adapter){var classes,replacements=[],adapted;classes=$.trim(dest.attr("class"));if(classes){classes=''+classes;$(classes.split(/\s+/)).each2(function(){if(this.indexOf("select2-")===0){replacements.push(this);}});}
classes=$.trim(src.attr("class"));if(classes){classes=''+classes;$(classes.split(/\s+/)).each2(function(){if(this.indexOf("select2-")!==0){adapted=adapter(this);if(adapted){replacements.push(adapted);}}});}
dest.attr("class",replacements.join(" "));}
function markMatch(text,term,markup,escapeMarkup){var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),tl=term.length;if(match<0){markup.push(escapeMarkup(text));return;}
markup.push(escapeMarkup(text.substring(0,match)));markup.push("<span class='select2-match'>");markup.push(escapeMarkup(text.substring(match,match+tl)));markup.push("</span>");markup.push(escapeMarkup(text.substring(match+tl,text.length)));}
function defaultEscapeMarkup(markup){var replace_map={'\\':'&#92;','&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',"/":'&#47;'};return String(markup).replace(/[&<>"'\/\\]/g,function(match){return replace_map[match];});}
function ajax(options){var timeout,handler=null,quietMillis=options.quietMillis||100,ajaxUrl=options.url,self=this;return function(query){window.clearTimeout(timeout);timeout=window.setTimeout(function(){var data=options.data,url=ajaxUrl,transport=options.transport||$.fn.select2.ajaxDefaults.transport,deprecated={type:options.type||'GET',cache:options.cache||false,jsonpCallback:options.jsonpCallback||undefined,dataType:options.dataType||"json"},params=$.extend({},$.fn.select2.ajaxDefaults.params,deprecated);data=data?data.call(self,query.term,query.page,query.context):null;url=(typeof url==='function')?url.call(self,query.term,query.page,query.context):url;if(handler&&typeof handler.abort==="function"){handler.abort();}
if(options.params){if($.isFunction(options.params)){$.extend(params,options.params.call(self));}else{$.extend(params,options.params);}}
$.extend(params,{url:url,dataType:options.dataType,data:data,success:function(data){var results=options.results(data,query.page,query);query.callback(results);},error:function(jqXHR,textStatus,errorThrown){var results={hasError:true,jqXHR:jqXHR,textStatus:textStatus,errorThrown:errorThrown,};query.callback(results);}});handler=transport.call(self,params);},quietMillis);};}
function local(options){var data=options,dataText,tmp,text=function(item){return""+item.text;};if($.isArray(data)){tmp=data;data={results:tmp};}
if($.isFunction(data)===false){tmp=data;data=function(){return tmp;};}
var dataItem=data();if(dataItem.text){text=dataItem.text;if(!$.isFunction(text)){dataText=dataItem.text;text=function(item){return item[dataText];};}}
return function(query){var t=query.term,filtered={results:[]},process;if(t===""){query.callback(data());return;}
process=function(datum,collection){var group,attr;datum=datum[0];if(datum.children){group={};for(attr in datum){if(datum.hasOwnProperty(attr))group[attr]=datum[attr];}
group.children=[];$(datum.children).each2(function(i,childDatum){process(childDatum,group.children);});if(group.children.length||query.matcher(t,text(group),datum)){collection.push(group);}}else{if(query.matcher(t,text(datum),datum)){collection.push(datum);}}};$(data().results).each2(function(i,datum){process(datum,filtered.results);});query.callback(filtered);};}
function tags(data){var isFunc=$.isFunction(data);return function(query){var t=query.term,filtered={results:[]};var result=isFunc?data(query):data;if($.isArray(result)){$(result).each(function(){var isObject=this.text!==undefined,text=isObject?this.text:this;if(t===""||query.matcher(t,text)){filtered.results.push(isObject?this:{id:this,text:this});}});query.callback(filtered);}};}
function checkFormatter(formatter,formatterName){if($.isFunction(formatter))return true;if(!formatter)return false;if(typeof(formatter)==='string')return true;throw new Error(formatterName+" must be a string, function, or falsy value");}
function evaluate(val,context){if($.isFunction(val)){var args=Array.prototype.slice.call(arguments,2);return val.apply(context,args);}
return val;}
function countResults(results){var count=0;$.each(results,function(i,item){if(item.children){count+=countResults(item.children);}else{count++;}});return count;}
function defaultTokenizer(input,selection,selectCallback,opts){var original=input,dupe=false,token,index,i,l,separator;if(!opts.createSearchChoice||!opts.tokenSeparators||opts.tokenSeparators.length<1)return undefined;while(true){index=-1;for(i=0,l=opts.tokenSeparators.length;i<l;i++){separator=opts.tokenSeparators[i];index=input.indexOf(separator);if(index>=0)break;}
if(index<0)break;token=input.substring(0,index);input=input.substring(index+separator.length);if(token.length>0){token=opts.createSearchChoice.call(this,token,selection);if(token!==undefined&&token!==null&&opts.id(token)!==undefined&&opts.id(token)!==null){dupe=false;for(i=0,l=selection.length;i<l;i++){if(equal(opts.id(token),opts.id(selection[i]))){dupe=true;break;}}
if(!dupe)selectCallback(token);}}}
if(original!==input)return input;}
function cleanupJQueryElements(){var self=this;$.each(arguments,function(i,element){self[element].remove();self[element]=null;});}
function clazz(SuperClass,methods){var constructor=function(){};constructor.prototype=new SuperClass;constructor.prototype.constructor=constructor;constructor.prototype.parent=SuperClass.prototype;constructor.prototype=$.extend(constructor.prototype,methods);return constructor;}
AbstractSelect2=clazz(Object,{bind:function(func){var self=this;return function(){func.apply(self,arguments);};},init:function(opts){var results,search,resultsSelector=".select2-results";this.opts=opts=this.prepareOpts(opts);this.id=opts.id;if(opts.element.data("select2")!==undefined&&opts.element.data("select2")!==null){opts.element.data("select2").destroy();}
this.container=this.createContainer();this.liveRegion=$("<span>",{role:"status","aria-live":"polite"}).addClass("select2-hidden-accessible").appendTo(document.body);this.containerId="s2id_"+(opts.element.attr("id")||"autogen"+nextUid());this.containerEventName=this.containerId.replace(/([.])/g,'_').replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,'\\$1');this.container.attr("id",this.containerId);this.container.attr("title",opts.element.attr("title"));this.body=$("body");syncCssClasses(this.container,this.opts.element,this.opts.adaptContainerCssClass);this.container.attr("style",opts.element.attr("style"));this.container.css(evaluate(opts.containerCss,this.opts.element));this.container.addClass(evaluate(opts.containerCssClass,this.opts.element));this.elementTabIndex=this.opts.element.attr("tabindex");this.opts.element.data("select2",this).attr("tabindex","-1").before(this.container).on("click.select2",killEvent);this.container.data("select2",this);this.dropdown=this.container.find(".select2-drop");syncCssClasses(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass);this.dropdown.addClass(evaluate(opts.dropdownCssClass,this.opts.element));this.dropdown.data("select2",this);this.dropdown.on("click",killEvent);this.results=results=this.container.find(resultsSelector);this.search=search=this.container.find("input.select2-input");this.queryCount=0;this.resultsPage=0;this.context=null;this.initContainer();this.container.on("click",killEvent);installFilteredMouseMove(this.results);this.dropdown.on("mousemove-filtered",resultsSelector,this.bind(this.highlightUnderEvent));this.dropdown.on("touchstart touchmove touchend",resultsSelector,this.bind(function(event){this._touchEvent=true;this.highlightUnderEvent(event);}));this.dropdown.on("touchmove",resultsSelector,this.bind(this.touchMoved));this.dropdown.on("touchstart touchend",resultsSelector,this.bind(this.clearTouchMoved));this.dropdown.on('click',this.bind(function(event){if(this._touchEvent){this._touchEvent=false;this.selectHighlighted();}}));installDebouncedScroll(80,this.results);this.dropdown.on("scroll-debounced",resultsSelector,this.bind(this.loadMoreIfNeeded));$(this.container).on("change",".select2-input",function(e){e.stopPropagation();});$(this.dropdown).on("change",".select2-input",function(e){e.stopPropagation();});if($.fn.mousewheel){results.mousewheel(function(e,delta,deltaX,deltaY){var top=results.scrollTop();if(deltaY>0&&top-deltaY<=0){results.scrollTop(0);killEvent(e);}else if(deltaY<0&&results.get(0).scrollHeight-results.scrollTop()+deltaY<=results.height()){results.scrollTop(results.get(0).scrollHeight-results.height());killEvent(e);}});}
installKeyUpChangeEvent(search);search.on("keyup-change input paste",this.bind(this.updateResults));search.on("focus",function(){search.addClass("select2-focused");});search.on("blur",function(){search.removeClass("select2-focused");});this.dropdown.on("mouseup",resultsSelector,this.bind(function(e){if($(e.target).closest(".select2-result-selectable").length>0){this.highlightUnderEvent(e);this.selectHighlighted(e);}}));this.dropdown.on("click mouseup mousedown touchstart touchend focusin",function(e){e.stopPropagation();});this.nextSearchTerm=undefined;if($.isFunction(this.opts.initSelection)){this.initSelection();this.monitorSource();}
if(opts.maximumInputLength!==null){this.search.attr("maxlength",opts.maximumInputLength);}
var disabled=opts.element.prop("disabled");if(disabled===undefined)disabled=false;this.enable(!disabled);var readonly=opts.element.prop("readonly");if(readonly===undefined)readonly=false;this.readonly(readonly);scrollBarDimensions=scrollBarDimensions||measureScrollbar();this.autofocus=opts.element.prop("autofocus");opts.element.prop("autofocus",false);if(this.autofocus)this.focus();this.search.attr("placeholder",opts.searchInputPlaceholder);},destroy:function(){var element=this.opts.element,select2=element.data("select2"),self=this;this.close();if(element.length&&element[0].detachEvent){element.each(function(){this.detachEvent("onpropertychange",self._sync);});}
if(this.propertyObserver){this.propertyObserver.disconnect();this.propertyObserver=null;}
this._sync=null;if(select2!==undefined){select2.container.remove();select2.liveRegion.remove();select2.dropdown.remove();element.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus",this.autofocus||false);if(this.elementTabIndex){element.attr({tabindex:this.elementTabIndex});}else{element.removeAttr("tabindex");}
element.show();}
cleanupJQueryElements.call(this,"container","liveRegion","dropdown","results","search");},optionToData:function(element){if(element.is("option")){return{id:element.prop("value"),text:element.text(),element:element.get(),css:element.attr("class"),disabled:element.prop("disabled"),locked:equal(element.attr("locked"),"locked")||equal(element.data("locked"),true)};}else if(element.is("optgroup")){return{text:element.attr("label"),children:[],element:element.get(),css:element.attr("class")};}},prepareOpts:function(opts){var element,select,idKey,ajaxUrl,self=this;element=opts.element;if(element.get(0).tagName.toLowerCase()==="select"){this.select=select=opts.element;}
if(select){$.each(["id","multiple","ajax","query","createSearchChoice","initSelection","data","tags"],function(){if(this in opts){throw new Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.");}});}
opts=$.extend({},{populateResults:function(container,results,query){var populate,id=this.opts.id,liveRegion=this.liveRegion;populate=function(results,container,depth){var i,l,result,selectable,disabled,compound,node,label,innerContainer,formatted;results=opts.sortResults(results,container,query);var nodes=[];for(i=0,l=results.length;i<l;i=i+1){result=results[i];disabled=(result.disabled===true);selectable=(!disabled)&&(id(result)!==undefined);compound=result.children&&result.children.length>0;node=$("<li></li>");node.addClass("select2-results-dept-"+depth);node.addClass("select2-result");node.addClass(selectable?"select2-result-selectable":"select2-result-unselectable");if(disabled){node.addClass("select2-disabled");}
if(compound){node.addClass("select2-result-with-children");}
node.addClass(self.opts.formatResultCssClass(result));node.attr("role","presentation");label=$(document.createElement("div"));label.addClass("select2-result-label");label.attr("id","select2-result-label-"+nextUid());label.attr("role","option");formatted=opts.formatResult(result,label,query,self.opts.escapeMarkup);if(formatted!==undefined){label.html(formatted);node.append(label);}
if(compound){innerContainer=$("<ul></ul>");innerContainer.addClass("select2-result-sub");populate(result.children,innerContainer,depth+1);node.append(innerContainer);}
node.data("select2-data",result);nodes.push(node[0]);}
container.append(nodes);liveRegion.text(opts.formatMatches(results.length));};populate(results,container,0);}},$.fn.select2.defaults,opts);if(typeof(opts.id)!=="function"){idKey=opts.id;opts.id=function(e){return e[idKey];};}
if($.isArray(opts.element.data("select2Tags"))){if("tags"in opts){throw"tags specified as both an attribute 'data-select2-tags' and in options of Select2 "+opts.element.attr("id");}
opts.tags=opts.element.data("select2Tags");}
if(select){opts.query=this.bind(function(query){var data={results:[],more:false},term=query.term,children,placeholderOption,process;process=function(element,collection){var group;if(element.is("option")){if(query.matcher(term,element.text(),element)){collection.push(self.optionToData(element));}}else if(element.is("optgroup")){group=self.optionToData(element);element.children().each2(function(i,elm){process(elm,group.children);});if(group.children.length>0){collection.push(group);}}};children=element.children();if(this.getPlaceholder()!==undefined&&children.length>0){placeholderOption=this.getPlaceholderOption();if(placeholderOption){children=children.not(placeholderOption);}}
children.each2(function(i,elm){process(elm,data.results);});query.callback(data);});opts.id=function(e){return e.id;};}else{if(!("query"in opts)){if("ajax"in opts){ajaxUrl=opts.element.data("ajax-url");if(ajaxUrl&&ajaxUrl.length>0){opts.ajax.url=ajaxUrl;}
opts.query=ajax.call(opts.element,opts.ajax);}else if("data"in opts){opts.query=local(opts.data);}else if("tags"in opts){opts.query=tags(opts.tags);if(opts.createSearchChoice===undefined){opts.createSearchChoice=function(term){return{id:$.trim(term),text:$.trim(term)};};}
if(opts.initSelection===undefined){opts.initSelection=function(element,callback){var data=[];$(splitVal(element.val(),opts.separator)).each(function(){var obj={id:this,text:this},tags=opts.tags;if($.isFunction(tags))tags=tags();$(tags).each(function(){if(equal(this.id,obj.id)){obj=this;return false;}});data.push(obj);});callback(data);};}}}}
if(typeof(opts.query)!=="function"){throw"query function not defined for Select2 "+opts.element.attr("id");}
if(opts.createSearchChoicePosition==='top'){opts.createSearchChoicePosition=function(list,item){list.unshift(item);};}
else if(opts.createSearchChoicePosition==='bottom'){opts.createSearchChoicePosition=function(list,item){list.push(item);};}
else if(typeof(opts.createSearchChoicePosition)!=="function"){throw"invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";}
return opts;},monitorSource:function(){var el=this.opts.element,observer,self=this;el.on("change.select2",this.bind(function(e){if(this.opts.element.data("select2-change-triggered")!==true){this.initSelection();}}));this._sync=this.bind(function(){var disabled=el.prop("disabled");if(disabled===undefined)disabled=false;this.enable(!disabled);var readonly=el.prop("readonly");if(readonly===undefined)readonly=false;this.readonly(readonly);syncCssClasses(this.container,this.opts.element,this.opts.adaptContainerCssClass);this.container.addClass(evaluate(this.opts.containerCssClass,this.opts.element));syncCssClasses(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass);this.dropdown.addClass(evaluate(this.opts.dropdownCssClass,this.opts.element));});if(el.length&&el[0].attachEvent){el.each(function(){this.attachEvent("onpropertychange",self._sync);});}
observer=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;if(observer!==undefined){if(this.propertyObserver){delete this.propertyObserver;this.propertyObserver=null;}
this.propertyObserver=new observer(function(mutations){$.each(mutations,self._sync);});this.propertyObserver.observe(el.get(0),{attributes:true,subtree:false});}},triggerSelect:function(data){var evt=$.Event("select2-selecting",{val:this.id(data),object:data,choice:data});this.opts.element.trigger(evt);return!evt.isDefaultPrevented();},triggerChange:function(details){details=details||{};details=$.extend({},details,{type:"change",val:this.val()});this.opts.element.data("select2-change-triggered",true);this.opts.element.trigger(details);this.opts.element.data("select2-change-triggered",false);this.opts.element.click();if(this.opts.blurOnChange)
this.opts.element.blur();},isInterfaceEnabled:function()
{return this.enabledInterface===true;},enableInterface:function(){var enabled=this._enabled&&!this._readonly,disabled=!enabled;if(enabled===this.enabledInterface)return false;this.container.toggleClass("select2-container-disabled",disabled);this.close();this.enabledInterface=enabled;return true;},enable:function(enabled){if(enabled===undefined)enabled=true;if(this._enabled===enabled)return;this._enabled=enabled;this.opts.element.prop("disabled",!enabled);this.enableInterface();},disable:function(){this.enable(false);},readonly:function(enabled){if(enabled===undefined)enabled=false;if(this._readonly===enabled)return;this._readonly=enabled;this.opts.element.prop("readonly",enabled);this.enableInterface();},opened:function(){return(this.container)?this.container.hasClass("select2-dropdown-open"):false;},positionDropdown:function(){var $dropdown=this.dropdown,offset=this.container.offset(),height=this.container.outerHeight(false),width=this.container.outerWidth(false),dropHeight=$dropdown.outerHeight(false),$window=$(window),windowWidth=$window.width(),windowHeight=$window.height(),viewPortRight=$window.scrollLeft()+windowWidth,viewportBottom=$window.scrollTop()+windowHeight,dropTop=offset.top+height,dropLeft=offset.left,enoughRoomBelow=dropTop+dropHeight<=viewportBottom,enoughRoomAbove=(offset.top-dropHeight)>=$window.scrollTop(),dropWidth=$dropdown.outerWidth(false),enoughRoomOnRight=dropLeft+dropWidth<=viewPortRight,aboveNow=$dropdown.hasClass("select2-drop-above"),bodyOffset,above,changeDirection,css,resultsListNode;if(aboveNow){above=true;if(!enoughRoomAbove&&enoughRoomBelow){changeDirection=true;above=false;}}else{above=false;if(!enoughRoomBelow&&enoughRoomAbove){changeDirection=true;above=true;}}
if(changeDirection){$dropdown.hide();offset=this.container.offset();height=this.container.outerHeight(false);width=this.container.outerWidth(false);dropHeight=$dropdown.outerHeight(false);viewPortRight=$window.scrollLeft()+windowWidth;viewportBottom=$window.scrollTop()+windowHeight;dropTop=offset.top+height;dropLeft=offset.left;dropWidth=$dropdown.outerWidth(false);enoughRoomOnRight=dropLeft+dropWidth<=viewPortRight;$dropdown.show();this.focusSearch();}
if(this.opts.dropdownAutoWidth){resultsListNode=$('.select2-results',$dropdown)[0];$dropdown.addClass('select2-drop-auto-width');$dropdown.css('width','');dropWidth=$dropdown.outerWidth(false)+(resultsListNode.scrollHeight===resultsListNode.clientHeight?0:scrollBarDimensions.width);dropWidth>width?width=dropWidth:dropWidth=width;dropHeight=$dropdown.outerHeight(false);enoughRoomOnRight=dropLeft+dropWidth<=viewPortRight;}
else{this.container.removeClass('select2-drop-auto-width');}
if(this.body.css('position')!=='static'){bodyOffset=this.body.offset();dropTop-=bodyOffset.top;dropLeft-=bodyOffset.left;}
if(!enoughRoomOnRight){dropLeft=offset.left+this.container.outerWidth(false)-dropWidth;}
css={left:dropLeft,width:width};if(above){css.top=offset.top-dropHeight;css.bottom='auto';this.container.addClass("select2-drop-above");$dropdown.addClass("select2-drop-above");}
else{css.top=dropTop;css.bottom='auto';this.container.removeClass("select2-drop-above");$dropdown.removeClass("select2-drop-above");}
css=$.extend(css,evaluate(this.opts.dropdownCss,this.opts.element));$dropdown.css(css);},shouldOpen:function(){var event;if(this.opened())return false;if(this._enabled===false||this._readonly===true)return false;event=$.Event("select2-opening");this.opts.element.trigger(event);return!event.isDefaultPrevented();},clearDropdownAlignmentPreference:function(){this.container.removeClass("select2-drop-above");this.dropdown.removeClass("select2-drop-above");},open:function(){if(!this.shouldOpen())return false;this.opening();$document.on("mousemove.select2Event",function(e){lastMousePosition.x=e.pageX;lastMousePosition.y=e.pageY;});return true;},opening:function(){var cid=this.containerEventName,scroll="scroll."+cid,resize="resize."+cid,orient="orientationchange."+cid,mask;this.container.addClass("select2-dropdown-open").addClass("select2-container-active");this.clearDropdownAlignmentPreference();if(this.dropdown[0]!==this.body.children().last()[0]){this.dropdown.detach().appendTo(this.body);}
mask=$("#select2-drop-mask");if(mask.length==0){mask=$(document.createElement("div"));mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");mask.hide();mask.appendTo(this.body);mask.on("mousedown touchstart click",function(e){reinsertElement(mask);var dropdown=$("#select2-drop"),self;if(dropdown.length>0){self=dropdown.data("select2");if(self.opts.selectOnBlur){self.selectHighlighted({noFocus:true});}
self.close();e.preventDefault();e.stopPropagation();}});}
if(this.dropdown.prev()[0]!==mask[0]){this.dropdown.before(mask);}
$("#select2-drop").removeAttr("id");this.dropdown.attr("id","select2-drop");mask.show();this.positionDropdown();this.dropdown.show();this.positionDropdown();this.dropdown.addClass("select2-drop-active");var that=this;this.container.parents().add(window).each(function(){$(this).on(resize+" "+scroll+" "+orient,function(e){if(that.opened())that.positionDropdown();});});},close:function(){if(!this.opened())return;var cid=this.containerEventName,scroll="scroll."+cid,resize="resize."+cid,orient="orientationchange."+cid;this.container.parents().add(window).each(function(){$(this).off(scroll).off(resize).off(orient);});this.clearDropdownAlignmentPreference();$("#select2-drop-mask").hide();this.dropdown.removeAttr("id");this.dropdown.hide();this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");this.results.empty();$document.off("mousemove.select2Event");this.clearSearch();this.search.removeClass("select2-active");this.opts.element.trigger($.Event("select2-close"));},externalSearch:function(term){this.open();this.search.val(term);this.updateResults(false);},clearSearch:function(){},getMaximumSelectionSize:function(){return evaluate(this.opts.maximumSelectionSize,this.opts.element);},ensureHighlightVisible:function(){var results=this.results,children,index,child,hb,rb,y,more,topOffset;index=this.highlight();if(index<0)return;if(index==0){results.scrollTop(0);return;}
children=this.findHighlightableChoices().find('.select2-result-label');child=$(children[index]);topOffset=(child.offset()||{}).top||0;hb=topOffset+child.outerHeight(true);if(index===children.length-1){more=results.find("li.select2-more-results");if(more.length>0){hb=more.offset().top+more.outerHeight(true);}}
rb=results.offset().top+results.outerHeight(true);if(hb>rb){results.scrollTop(results.scrollTop()+(hb-rb));}
y=topOffset-results.offset().top;if(y<0&&child.css('display')!='none'){results.scrollTop(results.scrollTop()+y);}},findHighlightableChoices:function(){return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");},moveHighlight:function(delta){var choices=this.findHighlightableChoices(),index=this.highlight();while(index>-1&&index<choices.length){index+=delta;var choice=$(choices[index]);if(choice.hasClass("select2-result-selectable")&&!choice.hasClass("select2-disabled")&&!choice.hasClass("select2-selected")){this.highlight(index);break;}}},highlight:function(index){var choices=this.findHighlightableChoices(),choice,data;if(arguments.length===0){return indexOf(choices.filter(".select2-highlighted")[0],choices.get());}
if(index>=choices.length)index=choices.length-1;if(index<0)index=0;this.removeHighlight();choice=$(choices[index]);choice.addClass("select2-highlighted");this.search.attr("aria-activedescendant",choice.find(".select2-result-label").attr("id"));this.ensureHighlightVisible();this.liveRegion.text(choice.text());data=choice.data("select2-data");if(data){this.opts.element.trigger({type:"select2-highlight",val:this.id(data),choice:data});}},removeHighlight:function(){this.results.find(".select2-highlighted").removeClass("select2-highlighted");},touchMoved:function(){this._touchMoved=true;},clearTouchMoved:function(){this._touchMoved=false;},countSelectableResults:function(){return this.findHighlightableChoices().length;},highlightUnderEvent:function(event){var el=$(event.target).closest(".select2-result-selectable");if(el.length>0&&!el.is(".select2-highlighted")){var choices=this.findHighlightableChoices();this.highlight(choices.index(el));}else if(el.length==0){this.removeHighlight();}},loadMoreIfNeeded:function(){var results=this.results,more=results.find("li.select2-more-results"),below,page=this.resultsPage+1,self=this,term=this.search.val(),context=this.context;if(more.length===0)return;below=more.offset().top-results.offset().top-results.height();if(below<=this.opts.loadMorePadding){more.addClass("select2-active");this.opts.query({element:this.opts.element,term:term,page:page,context:context,matcher:this.opts.matcher,callback:this.bind(function(data){if(!self.opened())return;self.opts.populateResults.call(this,results,data.results,{term:term,page:page,context:context});self.postprocessResults(data,false,false);if(data.more===true){more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore,self.opts.element,page+1));window.setTimeout(function(){self.loadMoreIfNeeded();},10);}else{more.remove();}
self.positionDropdown();self.resultsPage=page;self.context=data.context;this.opts.element.trigger({type:"select2-loaded",items:data});})});}},tokenize:function(){},updateResults:function(initial){var search=this.search,results=this.results,opts=this.opts,data,self=this,input,term=search.val(),lastTerm=$.data(this.container,"select2-last-term"),queryNumber;if(initial!==true&&lastTerm&&equal(term,lastTerm))return;$.data(this.container,"select2-last-term",term);if(initial!==true&&(this.showSearchInput===false||!this.opened())){return;}
function postRender(){search.removeClass("select2-active");self.positionDropdown();if(results.find('.select2-no-results,.select2-selection-limit,.select2-searching').length){self.liveRegion.text(results.text());}
else{self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable').length));}}
function render(html){results.html(html);postRender();}
queryNumber=++this.queryCount;var maxSelSize=this.getMaximumSelectionSize();if(maxSelSize>=1){data=this.data();if($.isArray(data)&&data.length>=maxSelSize&&checkFormatter(opts.formatSelectionTooBig,"formatSelectionTooBig")){render("<li class='select2-selection-limit'>"+evaluate(opts.formatSelectionTooBig,opts.element,maxSelSize)+"</li>");return;}}
if(search.val().length<opts.minimumInputLength){if(checkFormatter(opts.formatInputTooShort,"formatInputTooShort")){render("<li class='select2-no-results'>"+evaluate(opts.formatInputTooShort,opts.element,search.val(),opts.minimumInputLength)+"</li>");}else{render("");}
if(initial&&this.showSearch)this.showSearch(true);return;}
if(opts.maximumInputLength&&search.val().length>opts.maximumInputLength){if(checkFormatter(opts.formatInputTooLong,"formatInputTooLong")){render("<li class='select2-no-results'>"+evaluate(opts.formatInputTooLong,opts.element,search.val(),opts.maximumInputLength)+"</li>");}else{render("");}
return;}
if(opts.formatSearching&&this.findHighlightableChoices().length===0){render("<li class='select2-searching'>"+evaluate(opts.formatSearching,opts.element)+"</li>");}
search.addClass("select2-active");this.removeHighlight();input=this.tokenize();if(input!=undefined&&input!=null){search.val(input);}
this.resultsPage=1;opts.query({element:opts.element,term:search.val(),page:this.resultsPage,context:null,matcher:opts.matcher,callback:this.bind(function(data){var def;if(queryNumber!=this.queryCount){return;}
if(!this.opened()){this.search.removeClass("select2-active");return;}
if(data.hasError!==undefined&&checkFormatter(opts.formatAjaxError,"formatAjaxError")){render("<li class='select2-ajax-error'>"+evaluate(opts.formatAjaxError,opts.element,data.jqXHR,data.textStatus,data.errorThrown)+"</li>");return;}
this.context=(data.context===undefined)?null:data.context;if(this.opts.createSearchChoice&&search.val()!==""){def=this.opts.createSearchChoice.call(self,search.val(),data.results);if(def!==undefined&&def!==null&&self.id(def)!==undefined&&self.id(def)!==null){if($(data.results).filter(function(){return equal(self.id(this),self.id(def));}).length===0){this.opts.createSearchChoicePosition(data.results,def);}}}
if(data.results.length===0&&checkFormatter(opts.formatNoMatches,"formatNoMatches")){render("<li class='select2-no-results'>"+evaluate(opts.formatNoMatches,opts.element,search.val())+"</li>");return;}
results.empty();self.opts.populateResults.call(this,results,data.results,{term:search.val(),page:this.resultsPage,context:null});if(data.more===true&&checkFormatter(opts.formatLoadMore,"formatLoadMore")){results.append("<li class='select2-more-results'>"+opts.escapeMarkup(evaluate(opts.formatLoadMore,opts.element,this.resultsPage))+"</li>");window.setTimeout(function(){self.loadMoreIfNeeded();},10);}
this.postprocessResults(data,initial);postRender();this.opts.element.trigger({type:"select2-loaded",items:data});})});},cancel:function(){this.close();},blur:function(){if(this.opts.selectOnBlur)
this.selectHighlighted({noFocus:true});this.close();this.container.removeClass("select2-container-active");if(this.search[0]===document.activeElement){this.search.blur();}
this.clearSearch();this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");},focusSearch:function(){focus(this.search);},selectHighlighted:function(options){if(this._touchMoved){this.clearTouchMoved();return;}
var index=this.highlight(),highlighted=this.results.find(".select2-highlighted"),data=highlighted.closest('.select2-result').data("select2-data");if(data){this.highlight(index);this.onSelect(data,options);}else if(options&&options.noFocus){this.close();}},getPlaceholder:function(){var placeholderOption;return this.opts.element.attr("placeholder")||this.opts.element.attr("data-placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder||((placeholderOption=this.getPlaceholderOption())!==undefined?placeholderOption.text():undefined);},getPlaceholderOption:function(){if(this.select){var firstOption=this.select.children('option').first();if(this.opts.placeholderOption!==undefined){return(this.opts.placeholderOption==="first"&&firstOption)||(typeof this.opts.placeholderOption==="function"&&this.opts.placeholderOption(this.select));}else if($.trim(firstOption.text())===""&&firstOption.val()===""){return firstOption;}}},initContainerWidth:function(){function resolveContainerWidth(){var style,attrs,matches,i,l,attr;if(this.opts.width==="off"){return null;}else if(this.opts.width==="element"){return this.opts.element.outerWidth(false)===0?'auto':this.opts.element.outerWidth(false)+'px';}else if(this.opts.width==="copy"||this.opts.width==="resolve"){style=this.opts.element.attr('style');if(style!==undefined){attrs=style.split(';');for(i=0,l=attrs.length;i<l;i=i+1){attr=attrs[i].replace(/\s/g,'');matches=attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);if(matches!==null&&matches.length>=1)
return matches[1];}}
if(this.opts.width==="resolve"){style=this.opts.element.css('width');if(style.indexOf("%")>0)return style;return(this.opts.element.outerWidth(false)===0?'auto':this.opts.element.outerWidth(false)+'px');}
return null;}else if($.isFunction(this.opts.width)){return this.opts.width();}else{return this.opts.width;}};var width=resolveContainerWidth.call(this);if(width!==null){this.container.css("width",width);}}});SingleSelect2=clazz(AbstractSelect2,{createContainer:function(){var container=$(document.createElement("div")).attr({"class":"select2-container"}).html(["<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>","   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>","   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>","</a>","<label for='' class='select2-offscreen'></label>","<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />","<div class='select2-drop select2-display-none'>","   <div class='select2-search'>","       <label for='' class='select2-offscreen'></label>","       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'","       aria-autocomplete='list' />","   </div>","   <ul class='select2-results' role='listbox'>","   </ul>","</div>"].join(""));return container;},enableInterface:function(){if(this.parent.enableInterface.apply(this,arguments)){this.focusser.prop("disabled",!this.isInterfaceEnabled());}},opening:function(){var el,range,len;if(this.opts.minimumResultsForSearch>=0){this.showSearch(true);}
this.parent.opening.apply(this,arguments);if(this.showSearchInput!==false){this.search.val(this.focusser.val());}
if(this.opts.shouldFocusInput(this)){this.search.focus();el=this.search.get(0);if(el.createTextRange){range=el.createTextRange();range.collapse(false);range.select();}else if(el.setSelectionRange){len=this.search.val().length;el.setSelectionRange(len,len);}}
if(this.search.val()===""){if(this.nextSearchTerm!=undefined){this.search.val(this.nextSearchTerm);this.search.select();}}
this.focusser.prop("disabled",true).val("");this.updateResults(true);this.opts.element.trigger($.Event("select2-open"));},close:function(){if(!this.opened())return;this.parent.close.apply(this,arguments);this.focusser.prop("disabled",false);if(this.opts.shouldFocusInput(this)){this.focusser.focus();}},focus:function(){if(this.opened()){this.close();}else{this.focusser.prop("disabled",false);if(this.opts.shouldFocusInput(this)){this.focusser.focus();}}},isFocused:function(){return this.container.hasClass("select2-container-active");},cancel:function(){this.parent.cancel.apply(this,arguments);this.focusser.prop("disabled",false);if(this.opts.shouldFocusInput(this)){this.focusser.focus();}},destroy:function(){$("label[for='"+this.focusser.attr('id')+"']").attr('for',this.opts.element.attr("id"));this.parent.destroy.apply(this,arguments);cleanupJQueryElements.call(this,"selection","focusser");},initContainer:function(){var selection,container=this.container,dropdown=this.dropdown,idSuffix=nextUid(),elementLabel;if(this.opts.minimumResultsForSearch<0){this.showSearch(false);}else{this.showSearch(true);}
this.selection=selection=container.find(".select2-choice");this.focusser=container.find(".select2-focusser");selection.find(".select2-chosen").attr("id","select2-chosen-"+idSuffix);this.focusser.attr("aria-labelledby","select2-chosen-"+idSuffix);this.results.attr("id","select2-results-"+idSuffix);this.search.attr("aria-owns","select2-results-"+idSuffix);this.focusser.attr("id","s2id_autogen"+idSuffix);elementLabel=$("label[for='"+this.opts.element.attr("id")+"']");this.focusser.prev().text(elementLabel.text()).attr('for',this.focusser.attr('id'));var originalTitle=this.opts.element.attr("title");this.opts.element.attr("title",(originalTitle||elementLabel.text()));this.focusser.attr("tabindex",this.elementTabIndex);this.search.attr("id",this.focusser.attr('id')+'_search');this.search.prev().text($("label[for='"+this.focusser.attr('id')+"']").text()).attr('for',this.search.attr('id'));this.search.on("keydown",this.bind(function(e){if(!this.isInterfaceEnabled())return;if(229==e.keyCode)return;if(e.which===KEY.PAGE_UP||e.which===KEY.PAGE_DOWN){killEvent(e);return;}
switch(e.which){case KEY.UP:case KEY.DOWN:this.moveHighlight((e.which===KEY.UP)?-1:1);killEvent(e);return;case KEY.ENTER:this.selectHighlighted();killEvent(e);return;case KEY.TAB:this.selectHighlighted({noFocus:true});return;case KEY.ESC:this.cancel(e);killEvent(e);return;}}));this.search.on("blur",this.bind(function(e){if(document.activeElement===this.body.get(0)){window.setTimeout(this.bind(function(){if(this.opened()){this.search.focus();}}),0);}}));this.focusser.on("keydown",this.bind(function(e){if(!this.isInterfaceEnabled())return;if(e.which===KEY.TAB||KEY.isControl(e)||KEY.isFunctionKey(e)||e.which===KEY.ESC){return;}
if(this.opts.openOnEnter===false&&e.which===KEY.ENTER){killEvent(e);return;}
if(e.which==KEY.DOWN||e.which==KEY.UP||(e.which==KEY.ENTER&&this.opts.openOnEnter)){if(e.altKey||e.ctrlKey||e.shiftKey||e.metaKey)return;this.open();killEvent(e);return;}
if(e.which==KEY.DELETE||e.which==KEY.BACKSPACE){if(this.opts.allowClear){this.clear();}
killEvent(e);return;}}));installKeyUpChangeEvent(this.focusser);this.focusser.on("keyup-change input",this.bind(function(e){if(this.opts.minimumResultsForSearch>=0){e.stopPropagation();if(this.opened())return;this.open();}}));selection.on("mousedown touchstart","abbr",this.bind(function(e){if(!this.isInterfaceEnabled())return;this.clear();killEventImmediately(e);this.close();this.selection.focus();}));selection.on("mousedown touchstart",this.bind(function(e){reinsertElement(selection);if(!this.container.hasClass("select2-container-active")){this.opts.element.trigger($.Event("select2-focus"));}
if(this.opened()){this.close();}else if(this.isInterfaceEnabled()){this.open();}
killEvent(e);}));dropdown.on("mousedown touchstart",this.bind(function(){if(this.opts.shouldFocusInput(this)){this.search.focus();}}));selection.on("focus",this.bind(function(e){killEvent(e);}));this.focusser.on("focus",this.bind(function(){if(!this.container.hasClass("select2-container-active")){this.opts.element.trigger($.Event("select2-focus"));}
this.container.addClass("select2-container-active");})).on("blur",this.bind(function(){if(!this.opened()){this.container.removeClass("select2-container-active");this.opts.element.trigger($.Event("select2-blur"));}}));this.search.on("focus",this.bind(function(){if(!this.container.hasClass("select2-container-active")){this.opts.element.trigger($.Event("select2-focus"));}
this.container.addClass("select2-container-active");}));this.initContainerWidth();this.opts.element.addClass("select2-offscreen");this.setPlaceholder();},clear:function(triggerChange){var data=this.selection.data("select2-data");if(data){var evt=$.Event("select2-clearing");this.opts.element.trigger(evt);if(evt.isDefaultPrevented()){return;}
var placeholderOption=this.getPlaceholderOption();this.opts.element.val(placeholderOption?placeholderOption.val():"");this.selection.find(".select2-chosen").empty();this.selection.removeData("select2-data");this.setPlaceholder();if(triggerChange!==false){this.opts.element.trigger({type:"select2-removed",val:this.id(data),choice:data});this.triggerChange({removed:data});}}},initSelection:function(){var selected;if(this.isPlaceholderOptionSelected()){this.updateSelection(null);this.close();this.setPlaceholder();}else{var self=this;this.opts.initSelection.call(null,this.opts.element,function(selected){if(selected!==undefined&&selected!==null){self.updateSelection(selected);self.close();self.setPlaceholder();self.nextSearchTerm=self.opts.nextSearchTerm(selected,self.search.val());}});}},isPlaceholderOptionSelected:function(){var placeholderOption;if(this.getPlaceholder()===undefined)return false;return((placeholderOption=this.getPlaceholderOption())!==undefined&&placeholderOption.prop("selected"))||(this.opts.element.val()==="")||(this.opts.element.val()===undefined)||(this.opts.element.val()===null);},prepareOpts:function(){var opts=this.parent.prepareOpts.apply(this,arguments),self=this;if(opts.element.get(0).tagName.toLowerCase()==="select"){opts.initSelection=function(element,callback){var selected=element.find("option").filter(function(){return this.selected&&!this.disabled});callback(self.optionToData(selected));};}else if("data"in opts){opts.initSelection=opts.initSelection||function(element,callback){var id=element.val();var match=null;opts.query({matcher:function(term,text,el){var is_match=equal(id,opts.id(el));if(is_match){match=el;}
return is_match;},callback:!$.isFunction(callback)?$.noop:function(){callback(match);}});};}
return opts;},getPlaceholder:function(){if(this.select){if(this.getPlaceholderOption()===undefined){return undefined;}}
return this.parent.getPlaceholder.apply(this,arguments);},setPlaceholder:function(){var placeholder=this.getPlaceholder();if(this.isPlaceholderOptionSelected()&&placeholder!==undefined){if(this.select&&this.getPlaceholderOption()===undefined)return;this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));this.selection.addClass("select2-default");this.container.removeClass("select2-allowclear");}},postprocessResults:function(data,initial,noHighlightUpdate){var selected=0,self=this,showSearchInput=true;this.findHighlightableChoices().each2(function(i,elm){if(equal(self.id(elm.data("select2-data")),self.opts.element.val())){selected=i;return false;}});if(noHighlightUpdate!==false){if(initial===true&&selected>=0){this.highlight(selected);}else{this.highlight(0);}}
if(initial===true){var min=this.opts.minimumResultsForSearch;if(min>=0){this.showSearch(countResults(data.results)>=min);}}},showSearch:function(showSearchInput){if(this.showSearchInput===showSearchInput)return;this.showSearchInput=showSearchInput;this.dropdown.find(".select2-search").toggleClass("select2-search-hidden",!showSearchInput);this.dropdown.find(".select2-search").toggleClass("select2-offscreen",!showSearchInput);$(this.dropdown,this.container).toggleClass("select2-with-searchbox",showSearchInput);},onSelect:function(data,options){if(!this.triggerSelect(data)){return;}
var old=this.opts.element.val(),oldData=this.data();this.opts.element.val(this.id(data));this.updateSelection(data);this.opts.element.trigger({type:"select2-selected",val:this.id(data),choice:data});this.nextSearchTerm=this.opts.nextSearchTerm(data,this.search.val());this.close();if((!options||!options.noFocus)&&this.opts.shouldFocusInput(this)){this.focusser.focus();}
if(!equal(old,this.id(data))){this.triggerChange({added:data,removed:oldData});}},updateSelection:function(data){var container=this.selection.find(".select2-chosen"),formatted,cssClass;this.selection.data("select2-data",data);container.empty();if(data!==null){formatted=this.opts.formatSelection(data,container,this.opts.escapeMarkup);}
if(formatted!==undefined){container.append(formatted);}
cssClass=this.opts.formatSelectionCssClass(data,container);if(cssClass!==undefined){container.addClass(cssClass);}
this.selection.removeClass("select2-default");if(this.opts.allowClear&&this.getPlaceholder()!==undefined){this.container.addClass("select2-allowclear");}},val:function(){var val,triggerChange=false,data=null,self=this,oldData=this.data();if(arguments.length===0){return this.opts.element.val();}
val=arguments[0];if(arguments.length>1){triggerChange=arguments[1];}
if(this.select){this.select.val(val).find("option").filter(function(){return this.selected}).each2(function(i,elm){data=self.optionToData(elm);return false;});this.updateSelection(data);this.setPlaceholder();if(triggerChange){this.triggerChange({added:data,removed:oldData});}}else{if(!val&&val!==0){this.clear(triggerChange);return;}
if(this.opts.initSelection===undefined){throw new Error("cannot call val() if initSelection() is not defined");}
this.opts.element.val(val);this.opts.initSelection(this.opts.element,function(data){self.opts.element.val(!data?"":self.id(data));self.updateSelection(data);self.setPlaceholder();if(triggerChange){self.triggerChange({added:data,removed:oldData});}});}},clearSearch:function(){this.search.val("");this.focusser.val("");},data:function(value){var data,triggerChange=false;if(arguments.length===0){data=this.selection.data("select2-data");if(data==undefined)data=null;return data;}else{if(arguments.length>1){triggerChange=arguments[1];}
if(!value){this.clear(triggerChange);}else{data=this.data();this.opts.element.val(!value?"":this.id(value));this.updateSelection(value);if(triggerChange){this.triggerChange({added:value,removed:data});}}}}});MultiSelect2=clazz(AbstractSelect2,{createContainer:function(){var container=$(document.createElement("div")).attr({"class":"select2-container select2-container-multi"}).html(["<ul class='select2-choices'>","  <li class='select2-search-field'>","    <label for='' class='select2-offscreen'></label>","    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>","  </li>","</ul>","<div class='select2-drop select2-drop-multi select2-display-none'>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return container;},prepareOpts:function(){var opts=this.parent.prepareOpts.apply(this,arguments),self=this;if(opts.element.get(0).tagName.toLowerCase()==="select"){opts.initSelection=function(element,callback){var data=[];element.find("option").filter(function(){return this.selected&&!this.disabled}).each2(function(i,elm){data.push(self.optionToData(elm));});callback(data);};}else if("data"in opts){opts.initSelection=opts.initSelection||function(element,callback){var ids=splitVal(element.val(),opts.separator);var matches=[];opts.query({matcher:function(term,text,el){var is_match=$.grep(ids,function(id){return equal(id,opts.id(el));}).length;if(is_match){matches.push(el);}
return is_match;},callback:!$.isFunction(callback)?$.noop:function(){var ordered=[];for(var i=0;i<ids.length;i++){var id=ids[i];for(var j=0;j<matches.length;j++){var match=matches[j];if(equal(id,opts.id(match))){ordered.push(match);matches.splice(j,1);break;}}}
callback(ordered);}});};}
return opts;},selectChoice:function(choice){var selected=this.container.find(".select2-search-choice-focus");if(selected.length&&choice&&choice[0]==selected[0]){}else{if(selected.length){this.opts.element.trigger("choice-deselected",selected);}
selected.removeClass("select2-search-choice-focus");if(choice&&choice.length){this.close();choice.addClass("select2-search-choice-focus");this.opts.element.trigger("choice-selected",choice);}}},destroy:function(){$("label[for='"+this.search.attr('id')+"']").attr('for',this.opts.element.attr("id"));this.parent.destroy.apply(this,arguments);cleanupJQueryElements.call(this,"searchContainer","selection");},initContainer:function(){var selector=".select2-choices",selection;this.searchContainer=this.container.find(".select2-search-field");this.selection=selection=this.container.find(selector);var _this=this;this.selection.on("click",".select2-search-choice:not(.select2-locked)",function(e){_this.search[0].focus();_this.selectChoice($(this));});this.search.attr("id","s2id_autogen"+nextUid());this.search.prev().text($("label[for='"+this.opts.element.attr("id")+"']").text()).attr('for',this.search.attr('id'));this.search.on("input paste",this.bind(function(){if(this.search.attr('placeholder')&&this.search.val().length==0)return;if(!this.isInterfaceEnabled())return;if(!this.opened()){this.open();}}));this.search.attr("tabindex",this.elementTabIndex);this.keydowns=0;this.search.on("keydown",this.bind(function(e){if(!this.isInterfaceEnabled())return;++this.keydowns;var selected=selection.find(".select2-search-choice-focus");var prev=selected.prev(".select2-search-choice:not(.select2-locked)");var next=selected.next(".select2-search-choice:not(.select2-locked)");var pos=getCursorInfo(this.search);if(selected.length&&(e.which==KEY.LEFT||e.which==KEY.RIGHT||e.which==KEY.BACKSPACE||e.which==KEY.DELETE||e.which==KEY.ENTER)){var selectedChoice=selected;if(e.which==KEY.LEFT&&prev.length){selectedChoice=prev;}
else if(e.which==KEY.RIGHT){selectedChoice=next.length?next:null;}
else if(e.which===KEY.BACKSPACE){if(this.unselect(selected.first())){this.search.width(10);selectedChoice=prev.length?prev:next;}}else if(e.which==KEY.DELETE){if(this.unselect(selected.first())){this.search.width(10);selectedChoice=next.length?next:null;}}else if(e.which==KEY.ENTER){selectedChoice=null;}
this.selectChoice(selectedChoice);killEvent(e);if(!selectedChoice||!selectedChoice.length){this.open();}
return;}else if(((e.which===KEY.BACKSPACE&&this.keydowns==1)||e.which==KEY.LEFT)&&(pos.offset==0&&!pos.length)){this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());killEvent(e);return;}else{this.selectChoice(null);}
if(this.opened()){switch(e.which){case KEY.UP:case KEY.DOWN:this.moveHighlight((e.which===KEY.UP)?-1:1);killEvent(e);return;case KEY.ENTER:this.selectHighlighted();killEvent(e);return;case KEY.TAB:this.selectHighlighted({noFocus:true});this.close();return;case KEY.ESC:this.cancel(e);killEvent(e);return;}}
if(e.which===KEY.TAB||KEY.isControl(e)||KEY.isFunctionKey(e)||e.which===KEY.BACKSPACE||e.which===KEY.ESC){return;}
if(e.which===KEY.ENTER){if(this.opts.openOnEnter===false){return;}else if(e.altKey||e.ctrlKey||e.shiftKey||e.metaKey){return;}}
this.open();if(e.which===KEY.PAGE_UP||e.which===KEY.PAGE_DOWN){killEvent(e);}
if(e.which===KEY.ENTER){killEvent(e);}}));this.search.on("keyup",this.bind(function(e){this.keydowns=0;this.resizeSearch();}));this.search.on("blur",this.bind(function(e){this.container.removeClass("select2-container-active");this.search.removeClass("select2-focused");this.selectChoice(null);if(!this.opened())this.clearSearch();e.stopImmediatePropagation();this.opts.element.trigger($.Event("select2-blur"));}));this.container.on("click",selector,this.bind(function(e){if(!this.isInterfaceEnabled())return;if($(e.target).closest(".select2-search-choice").length>0){return;}
this.selectChoice(null);this.clearPlaceholder();if(!this.container.hasClass("select2-container-active")){this.opts.element.trigger($.Event("select2-focus"));}
this.open();this.focusSearch();e.preventDefault();}));this.container.on("focus",selector,this.bind(function(){if(!this.isInterfaceEnabled())return;if(!this.container.hasClass("select2-container-active")){this.opts.element.trigger($.Event("select2-focus"));}
this.container.addClass("select2-container-active");this.dropdown.addClass("select2-drop-active");this.clearPlaceholder();}));this.initContainerWidth();this.opts.element.addClass("select2-offscreen");this.clearSearch();},enableInterface:function(){if(this.parent.enableInterface.apply(this,arguments)){this.search.prop("disabled",!this.isInterfaceEnabled());}},initSelection:function(){var data;if(this.opts.element.val()===""&&this.opts.element.text()===""){this.updateSelection([]);this.close();this.clearSearch();}
if(this.select||this.opts.element.val()!==""){var self=this;this.opts.initSelection.call(null,this.opts.element,function(data){if(data!==undefined&&data!==null){self.updateSelection(data);self.close();self.clearSearch();}});}},clearSearch:function(){var placeholder=this.getPlaceholder(),maxWidth=this.getMaxSearchWidth();if(placeholder!==undefined&&this.getVal().length===0&&this.search.hasClass("select2-focused")===false){this.search.val(placeholder).addClass("select2-default");this.search.width(maxWidth>0?maxWidth:this.container.css("width"));}else{this.search.val("").width(10);}},clearPlaceholder:function(){if(this.search.hasClass("select2-default")){this.search.val("").removeClass("select2-default");}},opening:function(){this.clearPlaceholder();this.resizeSearch();this.parent.opening.apply(this,arguments);this.focusSearch();if(this.search.val()===""){if(this.nextSearchTerm!=undefined){this.search.val(this.nextSearchTerm);this.search.select();}}
this.updateResults(true);if(this.opts.shouldFocusInput(this)){this.search.focus();}
this.opts.element.trigger($.Event("select2-open"));},close:function(){if(!this.opened())return;this.parent.close.apply(this,arguments);},focus:function(){this.close();this.search.focus();},isFocused:function(){return this.search.hasClass("select2-focused");},updateSelection:function(data){var ids=[],filtered=[],self=this;$(data).each(function(){if(indexOf(self.id(this),ids)<0){ids.push(self.id(this));filtered.push(this);}});data=filtered;this.selection.find(".select2-search-choice").remove();$(data).each(function(){self.addSelectedChoice(this);});self.postprocessResults();},tokenize:function(){var input=this.search.val();input=this.opts.tokenizer.call(this,input,this.data(),this.bind(this.onSelect),this.opts);if(input!=null&&input!=undefined){this.search.val(input);if(input.length>0){this.open();}}},onSelect:function(data,options){if(!this.triggerSelect(data)||data.text===""){return;}
this.addSelectedChoice(data);this.opts.element.trigger({type:"selected",val:this.id(data),choice:data});this.nextSearchTerm=this.opts.nextSearchTerm(data,this.search.val());this.clearSearch();this.updateResults();if(this.select||!this.opts.closeOnSelect)this.postprocessResults(data,false,this.opts.closeOnSelect===true);if(this.opts.closeOnSelect){this.close();this.search.width(10);}else{if(this.countSelectableResults()>0){this.search.width(10);this.resizeSearch();if(this.getMaximumSelectionSize()>0&&this.val().length>=this.getMaximumSelectionSize()){this.updateResults(true);}else{if(this.nextSearchTerm!=undefined){this.search.val(this.nextSearchTerm);this.updateResults();this.search.select();}}
this.positionDropdown();}else{this.close();this.search.width(10);}}
this.triggerChange({added:data});if(!options||!options.noFocus)
this.focusSearch();},cancel:function(){this.close();this.focusSearch();},addSelectedChoice:function(data){var enableChoice=!data.locked,enabledItem=$("<li class='select2-search-choice'>"+"    <div></div>"+"    <a href='#' class='select2-search-choice-close' tabindex='-1'></a>"+"</li>"),disabledItem=$("<li class='select2-search-choice select2-locked'>"+"<div></div>"+"</li>");var choice=enableChoice?enabledItem:disabledItem,id=this.id(data),val=this.getVal(),formatted,cssClass;formatted=this.opts.formatSelection(data,choice.find("div"),this.opts.escapeMarkup);if(formatted!=undefined){choice.find("div").replaceWith("<div>"+formatted+"</div>");}
cssClass=this.opts.formatSelectionCssClass(data,choice.find("div"));if(cssClass!=undefined){choice.addClass(cssClass);}
if(enableChoice){choice.find(".select2-search-choice-close").on("mousedown",killEvent).on("click dblclick",this.bind(function(e){if(!this.isInterfaceEnabled())return;this.unselect($(e.target));this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");killEvent(e);this.close();this.focusSearch();})).on("focus",this.bind(function(){if(!this.isInterfaceEnabled())return;this.container.addClass("select2-container-active");this.dropdown.addClass("select2-drop-active");}));}
choice.data("select2-data",data);choice.insertBefore(this.searchContainer);val.push(id);this.setVal(val);},unselect:function(selected){var val=this.getVal(),data,index;selected=selected.closest(".select2-search-choice");if(selected.length===0){throw"Invalid argument: "+selected+". Must be .select2-search-choice";}
data=selected.data("select2-data");if(!data){return;}
var evt=$.Event("select2-removing");evt.val=this.id(data);evt.choice=data;this.opts.element.trigger(evt);if(evt.isDefaultPrevented()){return false;}
while((index=indexOf(this.id(data),val))>=0){val.splice(index,1);this.setVal(val);if(this.select)this.postprocessResults();}
selected.remove();this.opts.element.trigger({type:"select2-removed",val:this.id(data),choice:data});this.triggerChange({removed:data});return true;},postprocessResults:function(data,initial,noHighlightUpdate){var val=this.getVal(),choices=this.results.find(".select2-result"),compound=this.results.find(".select2-result-with-children"),self=this;choices.each2(function(i,choice){var id=self.id(choice.data("select2-data"));if(indexOf(id,val)>=0){choice.addClass("select2-selected");choice.find(".select2-result-selectable").addClass("select2-selected");}});compound.each2(function(i,choice){if(!choice.is('.select2-result-selectable')&&choice.find(".select2-result-selectable:not(.select2-selected)").length===0){choice.addClass("select2-selected");}});if(this.highlight()==-1&&noHighlightUpdate!==false){self.highlight(0);}
if(!this.opts.createSearchChoice&&!choices.filter('.select2-result:not(.select2-selected)').length>0){if(!data||data&&!data.more&&this.results.find(".select2-no-results").length===0){if(checkFormatter(self.opts.formatNoMatches,"formatNoMatches")){this.results.append("<li class='select2-no-results'>"+evaluate(self.opts.formatNoMatches,self.opts.element,self.search.val())+"</li>");}}}},getMaxSearchWidth:function(){return this.selection.width()-getSideBorderPadding(this.search);},resizeSearch:function(){var minimumWidth,left,maxWidth,containerLeft,searchWidth,sideBorderPadding=getSideBorderPadding(this.search);minimumWidth=measureTextWidth(this.search)+10;left=this.search.offset().left;maxWidth=this.selection.width();containerLeft=this.selection.offset().left;searchWidth=maxWidth-(left-containerLeft)-sideBorderPadding;if(searchWidth<minimumWidth){searchWidth=maxWidth-sideBorderPadding;}
if(searchWidth<40){searchWidth=maxWidth-sideBorderPadding;}
if(searchWidth<=0){searchWidth=minimumWidth;}
this.search.width(Math.floor(searchWidth));},getVal:function(){var val;if(this.select){val=this.select.val();return val===null?[]:val;}else{val=this.opts.element.val();return splitVal(val,this.opts.separator);}},setVal:function(val){var unique;if(this.select){this.select.val(val);}else{unique=[];$(val).each(function(){if(indexOf(this,unique)<0)unique.push(this);});this.opts.element.val(unique.length===0?"":unique.join(this.opts.separator));}},buildChangeDetails:function(old,current){var current=current.slice(0),old=old.slice(0);for(var i=0;i<current.length;i++){for(var j=0;j<old.length;j++){if(equal(this.opts.id(current[i]),this.opts.id(old[j]))){current.splice(i,1);if(i>0){i--;}
old.splice(j,1);j--;}}}
return{added:current,removed:old};},val:function(val,triggerChange){var oldData,self=this;if(arguments.length===0){return this.getVal();}
oldData=this.data();if(!oldData.length)oldData=[];if(!val&&val!==0){this.opts.element.val("");this.updateSelection([]);this.clearSearch();if(triggerChange){this.triggerChange({added:this.data(),removed:oldData});}
return;}
this.setVal(val);if(this.select){this.opts.initSelection(this.select,this.bind(this.updateSelection));if(triggerChange){this.triggerChange(this.buildChangeDetails(oldData,this.data()));}}else{if(this.opts.initSelection===undefined){throw new Error("val() cannot be called if initSelection() is not defined");}
this.opts.initSelection(this.opts.element,function(data){var ids=$.map(data,self.id);self.setVal(ids);self.updateSelection(data);self.clearSearch();if(triggerChange){self.triggerChange(self.buildChangeDetails(oldData,self.data()));}});}
this.clearSearch();},onSortStart:function(){if(this.select){throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");}
this.search.width(0);this.searchContainer.hide();},onSortEnd:function(){var val=[],self=this;this.searchContainer.show();this.searchContainer.appendTo(this.searchContainer.parent());this.resizeSearch();this.selection.find(".select2-search-choice").each(function(){val.push(self.opts.id($(this).data("select2-data")));});this.setVal(val);this.triggerChange();},data:function(values,triggerChange){var self=this,ids,old;if(arguments.length===0){return this.selection.children(".select2-search-choice").map(function(){return $(this).data("select2-data");}).get();}else{old=this.data();if(!values){values=[];}
ids=$.map(values,function(e){return self.opts.id(e);});this.setVal(ids);this.updateSelection(values);this.clearSearch();if(triggerChange){this.triggerChange(this.buildChangeDetails(old,this.data()));}}}});$.fn.select2=function(){var args=Array.prototype.slice.call(arguments,0),opts,select2,method,value,multiple,allowedMethods=["val","destroy","opened","open","close","focus","isFocused","container","dropdown","onSortStart","onSortEnd","enable","disable","readonly","positionDropdown","data","search"],valueMethods=["opened","isFocused","container","dropdown"],propertyMethods=["val","data"],methodsMap={search:"externalSearch"};this.each(function(){if(args.length===0||typeof(args[0])==="object"){opts=args.length===0?{}:$.extend({},args[0]);opts.element=$(this);if(opts.element.get(0).tagName.toLowerCase()==="select"){multiple=opts.element.prop("multiple");}else{multiple=opts.multiple||false;if("tags"in opts){opts.multiple=multiple=true;}}
select2=multiple?new window.Select2["class"].multi():new window.Select2["class"].single();select2.init(opts);}else if(typeof(args[0])==="string"){if(indexOf(args[0],allowedMethods)<0){throw"Unknown method: "+args[0];}
value=undefined;select2=$(this).data("select2");if(select2===undefined)return;method=args[0];if(method==="container"){value=select2.container;}else if(method==="dropdown"){value=select2.dropdown;}else{if(methodsMap[method])method=methodsMap[method];value=select2[method].apply(select2,args.slice(1));}
if(indexOf(args[0],valueMethods)>=0||(indexOf(args[0],propertyMethods)>=0&&args.length==1)){return false;}}else{throw"Invalid arguments to select2 plugin: "+args;}});return(value===undefined)?this:value;};$.fn.select2.defaults={width:"copy",loadMorePadding:0,closeOnSelect:true,openOnEnter:true,containerCss:{},dropdownCss:{},containerCssClass:"",dropdownCssClass:"",formatResult:function(result,container,query,escapeMarkup){var markup=[];markMatch(result.text,query.term,markup,escapeMarkup);return markup.join("");},formatSelection:function(data,container,escapeMarkup){return data?escapeMarkup(data.text):undefined;},sortResults:function(results,container,query){return results;},formatResultCssClass:function(data){return data.css;},formatSelectionCssClass:function(data,container){return undefined;},minimumResultsForSearch:0,minimumInputLength:0,maximumInputLength:null,maximumSelectionSize:0,id:function(e){return e==undefined?null:e.id;},matcher:function(term,text){return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase())>=0;},separator:",",tokenSeparators:[],tokenizer:defaultTokenizer,escapeMarkup:defaultEscapeMarkup,blurOnChange:false,selectOnBlur:false,adaptContainerCssClass:function(c){return c;},adaptDropdownCssClass:function(c){return null;},nextSearchTerm:function(selectedObject,currentSearchTerm){return undefined;},searchInputPlaceholder:'',createSearchChoicePosition:'top',shouldFocusInput:function(instance){var supportsTouchEvents=(('ontouchstart'in window)||(navigator.msMaxTouchPoints>0));if(!supportsTouchEvents){return true;}
if(instance.opts.minimumResultsForSearch<0){return false;}
return true;}};$.fn.select2.locales=[];$.fn.select2.locales['en']={formatMatches:function(matches){if(matches===1){return"One result is available, press enter to select it.";}return matches+" results are available, use up and down arrow keys to navigate.";},formatNoMatches:function(){return"No matches found";},formatAjaxError:function(jqXHR,textStatus,errorThrown){return"Loading failed";},formatInputTooShort:function(input,min){var n=min-input.length;return"Please enter "+n+" or more character"+(n==1?"":"s");},formatInputTooLong:function(input,max){var n=input.length-max;return"Please delete "+n+" character"+(n==1?"":"s");},formatSelectionTooBig:function(limit){return"You can only select "+limit+" item"+(limit==1?"":"s");},formatLoadMore:function(pageNumber){return"Loading more resultsâ€¦";},formatSearching:function(){return"Searchingâ€¦";},};$.extend($.fn.select2.defaults,$.fn.select2.locales['en']);$.fn.select2.ajaxDefaults={transport:$.ajax,params:{type:"GET",cache:false,dataType:"json"}};window.Select2={query:{ajax:ajax,local:local,tags:tags},util:{debounce:debounce,markMatch:markMatch,escapeMarkup:defaultEscapeMarkup,stripDiacritics:stripDiacritics},"class":{"abstract":AbstractSelect2,"single":SingleSelect2,"multi":MultiSelect2}};}(jQuery));;

/* /website_mail/static/src/js/follow.js defined in bundle 'website.assets_frontend' */
odoo.define('website_mail.follow',function(require){'use strict';var ajax=require('web.ajax');var animation=require('website.snippets.animation');animation.registry.follow=animation.Animation.extend({selector:".js_follow",start:function(editable_mode){var self=this;this.is_user=false;ajax.jsonRpc('/website_mail/is_follower','call',{model:this.$target.data('object'),id:this.$target.data('id'),}).always(function(data){self.is_user=data.is_user;self.email=data.email;self.toggle_subscription(data.is_follower,data.email);self.$target.removeClass("hidden");});if(!editable_mode){$('.js_follow > .alert').addClass("hidden");$('.js_follow > .input-group-btn.hidden').removeClass("hidden");this.$target.find('.js_follow_btn, .js_unfollow_btn').on('click',function(event){event.preventDefault();self.on_click();});}
return;},on_click:function(){var self=this;var $email=this.$target.find(".js_follow_email");if($email.length&&!$email.val().match(/.+@.+/)){this.$target.addClass('has-error');return false;}
this.$target.removeClass('has-error');var email=$email.length?$email.val():false;if(email||this.is_user){ajax.jsonRpc('/website_mail/follow','call',{'id':+this.$target.data('id'),'object':this.$target.data('object'),'message_is_follower':this.$target.attr("data-follow")||"off",'email':email,}).then(function(follow){self.toggle_subscription(follow,email);});}},toggle_subscription:function(follow,email){follow=follow||(!email&&this.$target.attr('data-unsubscribe'));if(follow){this.$target.find(".js_follow_btn").addClass("hidden");this.$target.find(".js_unfollow_btn").removeClass("hidden");}
else{this.$target.find(".js_follow_btn").removeClass("hidden");this.$target.find(".js_unfollow_btn").addClass("hidden");}
this.$target.find('input.js_follow_email').val(email||"").attr("disabled",email&&(follow||this.is_user)?"disabled":false);this.$target.attr("data-follow",follow?'on':'off');},});});;

/* /website_sale/static/src/js/website_sale.js defined in bundle 'website.assets_frontend' */
odoo.define('website_sale.website_sale',function(require){"use strict";var ajax=require('web.ajax');$(document).ready(function(){$('.oe_website_sale').each(function(){var oe_website_sale=this;var $shippingDifferent=$("select[name='shipping_id']",oe_website_sale);$shippingDifferent.change(function(){var value=+$shippingDifferent.val();var data=$shippingDifferent.find("option:selected").data();var $snipping=$(".js_shipping",oe_website_sale);var $inputs=$snipping.find("input");var $selects=$snipping.find("select");$snipping.toggle(!!value);$inputs.attr("readonly",value<=0?null:"readonly").prop("readonly",value<=0?null:"readonly");$selects.attr("disabled",value<=0?null:"disabled").prop("disabled",value<=0?null:"disabled");$inputs.each(function(){$(this).val(data[$(this).attr("name")]||"");});});$(oe_website_sale).on('mouseup touchend','.js_publish',function(ev){$(ev.currentTarget).parents(".thumbnail").toggleClass("disabled");});$(oe_website_sale).on("change",".oe_cart input.js_quantity",function(){var $input=$(this);var value=parseInt($input.val(),10);var line_id=parseInt($input.data('line-id'),10);if(isNaN(value))value=0;ajax.jsonRpc("/shop/cart/update_json",'call',{'line_id':line_id,'product_id':parseInt($input.data('product-id'),10),'set_qty':value}).then(function(data){if(!data.quantity){location.reload();return;}
var $q=$(".my_cart_quantity");$q.parent().parent().removeClass("hidden",!data.quantity);$q.html(data.cart_quantity).hide().fadeIn(600);$input.val(data.quantity);$('.js_quantity[data-line-id='+line_id+']').val(data.quantity).html(data.quantity);$("#cart_total").replaceWith(data['website_sale.total']);if(data.warning){var cart_alert=$('.oe_cart').parent().find('#data_warning');if(cart_alert.length===0){$('.oe_cart').prepend('<div class="alert alert-danger alert-dismissable" role="alert" id="data_warning">'+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> '+data.warning+'</div>');}
else{cart_alert.html('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> '+data.warning);}
$input.val(data.quantity);}});});$(oe_website_sale).on('click','a.js_add_cart_json',function(ev){ev.preventDefault();var $link=$(ev.currentTarget);var $input=$link.parent().find("input");var min=parseFloat($input.data("min")||0);var max=parseFloat($input.data("max")||Infinity);var quantity=($link.has(".fa-minus").length?-1:1)+parseFloat($input.val(),10);$input.val(quantity>min?(quantity<max?quantity:max):min);$('input[name="'+$input.attr("name")+'"]').val(quantity>min?(quantity<max?quantity:max):min);$input.change();return false;});$('.oe_website_sale .a-submit, #comment .a-submit').off('click').on('click',function(){$(this).closest('form').submit();});$('form.js_attributes input, form.js_attributes select',oe_website_sale).on('change',function(){$(this).closest("form").submit();});$('form.js_add_cart_json label',oe_website_sale).on('mouseup touchend',function(){var $label=$(this);var $price=$label.parents("form:first").find(".oe_price .oe_currency_value");if(!$price.data("price")){$price.data("price",parseFloat($price.text()));}
var value=$price.data("price")+parseFloat($label.find(".badge span").text()||0);var dec=value%1;$price.html(value+(dec<0.01?".00":(dec<1?"0":"")));});$('.css_attribute_color input',oe_website_sale).on('change',function(){$('.css_attribute_color').removeClass("active");$('.css_attribute_color:has(input:checked)').addClass("active");});function price_to_str(price){price=Math.round(price*100)/100;var dec=Math.round((price%1)*100);return price+(dec?'':'.0')+(dec%10?'':'0');}
$(oe_website_sale).on('change','input.js_product_change',function(){var $parent=$(this).closest('.js_product');$parent.find(".oe_default_price:first .oe_currency_value").html(price_to_str(+$(this).data('lst_price')));$parent.find(".oe_price:first .oe_currency_value").html(price_to_str(+$(this).data('price')));var $img=$(this).closest('tr.js_product, .oe_website_sale').find('span[data-oe-model^="product."][data-oe-type="image"] img:first, img.product_detail_img');$img.attr("src","/website/image/product.product/"+$(this).val()+"/image");});$(oe_website_sale).on('change','input.js_variant_change, select.js_variant_change',function(){var $ul=$(this).parents('ul.js_add_cart_variants:first');var $parent=$ul.closest('.js_product');var $product_id=$parent.find('input.product_id').first();var $price=$parent.find(".oe_price:first .oe_currency_value");var $default_price=$parent.find(".oe_default_price:first .oe_currency_value");var variant_ids=$ul.data("attribute_value_ids");var values=[];$parent.find('input.js_variant_change:checked, select.js_variant_change').each(function(){values.push(+$(this).val());});$parent.find("label").removeClass("text-muted css_not_available");var product_id=false;for(var k in variant_ids){if(_.isEmpty(_.difference(variant_ids[k][1],values))){$price.html(price_to_str(variant_ids[k][2]));$default_price.html(price_to_str(variant_ids[k][3]));if(variant_ids[k][3]-variant_ids[k][2]>0.2){$default_price.closest('.oe_website_sale').addClass("discount");}else{$default_price.closest('.oe_website_sale').removeClass("discount");}
product_id=variant_ids[k][0];break;}}
if(product_id){var $img=$(this).closest('tr.js_product, .oe_website_sale').find('span[data-oe-model^="product."][data-oe-type="image"] img:first, img.product_detail_img');$img.attr("src","/website/image/product.product/"+product_id+"/image");$img.parent().attr('data-oe-model','product.product').attr('data-oe-id',product_id).data('oe-model','product.product').data('oe-id',product_id);}
$parent.find("input.js_variant_change:radio, select.js_variant_change").each(function(){var $input=$(this);var id=+$input.val();var values=[id];$parent.find("ul:not(:has(input.js_variant_change[value='"+id+"'])) input.js_variant_change:checked, select").each(function(){values.push(+$(this).val());});for(var k in variant_ids){if(!_.difference(values,variant_ids[k][1]).length){return;}}
$input.closest("label").addClass("css_not_available");$input.find("option[value='"+id+"']").addClass("css_not_available");});if(product_id){$parent.removeClass("css_not_available");$product_id.val(product_id);$parent.find(".js_check_product").removeAttr("disabled");}else{$parent.addClass("css_not_available");$product_id.val(0);$parent.find(".js_check_product").attr("disabled","disabled");}});$('ul.js_add_cart_variants',oe_website_sale).each(function(){$('input.js_variant_change, select.js_variant_change',this).first().trigger('change');});$(oe_website_sale).on('change',"select[name='country_id']",function(){var $select=$("select[name='state_id']");$select.find("option:not(:first)").hide();var nb=$select.find("option[data-country_id="+($(this).val()||0)+"]").show().size();$select.parent().toggle(nb>1);});$(oe_website_sale).find("select[name='country_id']").change();$(oe_website_sale).on('change',"select[name='shipping_country_id']",function(){var $select=$("select[name='shipping_state_id']");$select.find("option:not(:first)").hide();var nb=$select.find("option[data-country_id="+($(this).val()||0)+"]").show().size();$select.parent().toggle(nb>1);});$(oe_website_sale).find("select[name='shipping_country_id']").change();});});});;

/* /website_sale/static/src/js/website_sale_payment.js defined in bundle 'website.assets_frontend' */
odoo.define('website_sale.payment',function(require){"use strict";var ajax=require('web.ajax');$(document).ready(function(){var $payment=$("#payment_method");$payment.on("click","input[name='acquirer']",function(ev){var payment_id=$(ev.currentTarget).val();$("div.oe_sale_acquirer_button[data-id]",$payment).addClass("hidden");$("div.oe_sale_acquirer_button[data-id='"+payment_id+"']",$payment).removeClass("hidden");}).find("input[name='acquirer']:checked").click();$payment.on("click",'button[type="submit"],button[name="submit"]',function(ev){ev.preventDefault();ev.stopPropagation();var $form=$(ev.currentTarget).parents('form');var acquirer_id=$(ev.currentTarget).parents('div.oe_sale_acquirer_button').first().data('id');if(!acquirer_id){return false;}
ajax.jsonRpc('/shop/payment/transaction/'+acquirer_id,'call',{}).then(function(){$form.submit();});});});});;

/* /website_sale/static/src/js/website_sale_validate.js defined in bundle 'website.assets_frontend' */
odoo.define('website_sale.validate',function(require){"use strict";var ajax=require('web.ajax');$(document).ready(function(){var _poll_nbr=0;function payment_transaction_poll_status(){var order_node=$('div.oe_website_sale_tx_status');if(!order_node||order_node.data('order-id')===undefined){return;}
var order_id=order_node.data('order-id');return ajax.jsonRpc('/shop/payment/get_status/'+order_id,'call',{}).then(function(result){_poll_nbr+=1;if(result.recall&&_poll_nbr<=5){setTimeout(function(){payment_transaction_poll_status();},1000);}
$('div.oe_website_sale_tx_status').html(result.message);});}
payment_transaction_poll_status();});});;

/* /website_sale/static/src/js/website_sale_tour_buy.js defined in bundle 'website.assets_frontend' */
odoo.define('website_sale.tour',function(require){'use strict';var Tour=require('web.Tour');Tour.register({id:'shop_buy_product',name:"Try to buy products",path:'/shop',mode:'test',steps:[{title:"search ipod",element:'form:has(input[name="search"]) a.a-submit',onload:function(){$('input[name="search"]').val("ipod");}},{title:"select ipod",element:'.oe_product_cart a:contains("iPod")',},{title:"select ipod 32GB",waitFor:'#product_detail',element:'label:contains(32 GB) input',},{title:"click on add to cart",waitFor:'label:contains(32 GB) input:propChecked',element:'#product_detail form[action^="/shop/cart/update"] .btn',},{title:"add suggested",waitNot:'#cart_products:contains("[A8767] Apple In-Ear Headphones")',element:'.oe_cart a:contains("Add to Cart")',},{title:"add one more iPod",waitFor:'.my_cart_quantity:contains(2)',element:'#cart_products tr:contains("32 GB") a.js_add_cart_json:eq(1)',},{title:"remove Headphones",waitFor:'#cart_products tr:contains("32 GB") input.js_quantity:propValue(2)',element:'#cart_products tr:contains("Apple In-Ear Headphones") a.js_add_cart_json:first',},{title:"set one iPod",waitNot:'#cart_products tr:contains("Apple In-Ear Headphones")',element:'#cart_products input.js_quantity',sampleText:'1',},{title:"go to checkout",waitFor:'#cart_products input.js_quantity:propValue(1)',element:'a[href="/shop/checkout"]',},{title:"test with input error",element:'form[action="/shop/confirm_order"] .btn:contains("Confirm")',onload:function(tour){$("input[name='phone']").val("");},},{title:"test without input error",waitFor:'form[action="/shop/confirm_order"] .has-error',element:'form[action="/shop/confirm_order"] .btn:contains("Confirm")',onload:function(tour){if($("input[name='name']").val()==="")
$("input[name='name']").val("website_sale-test-shoptest");if($("input[name='email']").val()==="")
$("input[name='email']").val("website_sale_test_shoptest@websitesaletest.odoo.com");$("input[name='phone']").val("123");$("input[name='street2']").val("123");$("input[name='city']").val("123");$("input[name='zip']").val("123");$("select[name='country_id']").val("21");},},{title:"select payment",element:'#payment_method label:has(img[title="Wire Transfer"]) input',},{title:"Pay Now",waitFor:'#payment_method label:has(input:checked):has(img[title="Wire Transfer"])',element:'.oe_sale_acquirer_button .btn[type="submit"]:visible',},{title:"finish",waitFor:'.oe_website_sale:contains("Thank you for your order")',}]});});;

/* /website_sale/static/src/js/website_sale_tracking.js defined in bundle 'website.assets_frontend' */
odoo.define('website_sale.tracking',function(require){var ajax=require('web.ajax');$(document).ready(function(){if($("#product_detail.oe_website_sale").length){var prod_id=$("input[name='product_id']").attr('value');vpv("/stats/ecom/product_view/"+prod_id);}
$(".oe_website_sale form[action='/shop/cart/update'] a.a-submit").on('click',function(o){var prod_id=$("input[name='product_id']").attr('value');vpv("/stats/ecom/product_add_to_cart/"+prod_id);});$(".oe_website_sale a[href='/shop/checkout']").on('click',function(o){vpv("/stats/ecom/customer_checkout");});$(".oe_website_sale div.oe_cart a[href^='/web?redirect'][href$='/shop/checkout']").on('click',function(o){vpv("/stats/ecom/customer_signin");});$(".oe_website_sale form[action='/shop/confirm_order'] a.a-submit").on('click',function(o){if($("#top_menu > li > a[href='/web/login']").length){vpv("/stats/ecom/customer_signup");}
vpv("/stats/ecom/order_checkout");});$(".oe_website_sale form[target='_self'] button[type=submit]").on('click',function(o){var method=$("#payment_method input[name=acquirer]:checked").nextAll("span:first").text();vpv("/stats/ecom/order_payment/"+method);});if($(".oe_website_sale div.oe_cart div.oe_website_sale_tx_status").length){track_ga('require','ecommerce');var order_id=$(".oe_website_sale div.oe_cart div.oe_website_sale_tx_status").data("order-id");vpv("/stats/ecom/order_confirmed/"+order_id);ajax.jsonRpc("/shop/tracking_last_order/").then(function(o){track_ga('ecommerce:clear');if(o.transaction&&o.lines){track_ga('ecommerce:addTransaction',o.transaction);_.forEach(o.lines,function(line){track_ga('ecommerce:addItem',line);});}
track_ga('ecommerce:send');});}
function vpv(page){track_ga('send','pageview',{'page':page,'title':document.title,});}
function track_ga(){website_ga=this._gaw||function(){};website_ga.apply(this,arguments);}});});