/** 
 * @file jquery.Citation-0.1.js
 * 
 * @description
 * # Description
 * 
 * This plugin builds a form for input for the `Cite` object. Uses the templates in `html/`.
 * 
 * # Use
 * 
 * ## `jQuery.buildCJSForm(opt,tmp)`
 * 
 * Builds the form. Parameters:
 * 
 * * `opt`: Default options (See [the docs](API/) for Citationjs)
 * * `tmp`: Path for the template, default: `"src/html/form-" + opt.lan + ".html"`
 * 
 * ## `jQuery.buildCJSOutput()`
 * 
 * Sets the place to show the output. No parameters.
 * 
 * # Dependencies
 * 
 * * jQuery
 * * Citation.js
 * 
 * <br /><br />
 * - - -
 * <br /><br />
 * 
 * @projectname Citationjs
 * 
 * @author Lars Willighagen [lars.willighagen@gmail.com]
 * @version 0.1
 * @license
 * Copyright (c) 2015-2016 Lars Willighagen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var CJS = {
  main:new Cite([]),
  draft:new Cite([]),
  options:{}
}

jQuery.fn.extend({
  CJSMultipleInput: function () {
    var elm = $(this).selector;
    $(elm).each(function(){
      $(this).addClass('cjs-multipleinput');
      $(this).change(function(){
	if ($(this).val()&&$(elm).last().val()) $(this).after($(this).clone(true).val(''));
	else if ($(this).val()&&!$(elm).next().val()) $(this).next().remove();
	else if (!$(this).val()&&$(elm).next().val()) $(this).remove();
      });
    });
  },
  dateInput: function() {
    var from = (($(this).filter('.cjs-from').val()||$(this).val())||'').split('-').reverse(),
	to = ($(this).filter('.cjs-to').val()||'').split('-').reverse()
    for (var i=0;i<from.length;i++) {
      if(parseInt(from[i]))from[i] = parseInt(from[i]);
      else from.pop(i);
    }
    for (var i=0;i<to.length;i++) {
      if(parseInt(to[i]))to[i] = parseInt(to[i]);
      else to.pop(i);
    }
	from = from.length == 0 ? undefined : from;
	to = to.length == 0 ? undefined : to;
    return {from:from,to:to};
  },
  /**
   * Sets the place to show the output. No parameters.
   * @method jQuery.buildCJSOutput
   */
  buildCJSOutput: function() {
    $(this).addClass('cjs','cjs-out');
  },
  /**
   * Builds the form. Parameters:
   * 
   * * `opt`: Default options (See [the docs](API/) for Citationjs)
   * * `tmp`: Path for the template, default: `"src/html/form-" + opt.lan + ".html"`
   * @method jQuery.buildCJSForm
   */
  buildCJSForm: function(opt,tmp) {
    $(this).addClass('cjs','cjs-in')
	opt = opt || {};
    var lan,
	add = opt.onAdd||function(){
	  $('.cjs-out').html(CJS.main.get(CJS.options));
	};
    
    switch(opt.lan){
      case 'en':case 'nl':
	lan=opt.lan;break;
      default:lan='en';break;
    }
    
    $(this).each(function(){
      var form = $(this);
	  CJS.form = form;
	  form.load(tmp||('src/html/form-'+lan+'.html'),function(){
	
	CJS.draft.options(CJS.options);
	
	var updateDraft = function () {
	  form.find('.cjs-draft').html(CJS.draft.get(CJS.options));
	}
	
	updateDraft();
	
	var emptyForm = function () {
	  CJS.draft.reset();
	  updateDraft();
	  form.find('section.cjs-active input,section.cjs-active textarea').val('');
	  $('.cjs-chapterauthor').slice(1).remove();
	  $('.cjs-author').slice(1).remove();
	  $('.cjs-editor').slice(1).remove();
	  $('.cjs-place').slice(1).remove();
	}
	
	// Initial things
	
	if((window.location.href.split('#')||[])[1]){
	  $('[href="#'+window.location.href.split('#')[1]+'"]').addClass('cjs-active');
	  $('#'+window.location.href.split('#')[1]).addClass('cjs-active');
	} else {
	  form.find('a.cjs').first().addClass('cjs-active');
	  form.find('section.cjs-inputform').first().addClass('cjs-active');
	}
	
	var val = form.find('select.cjs-type').val();
	form.find('#cjs-in-form fieldset').each(function(){
	  if($(this).hasClass('cjs-'+val))$(this).show();
	  else $(this).hide();
	});
	
	$('.cjs-chapterauthor').CJSMultipleInput();
	$('.cjs-author').CJSMultipleInput();
	$('.cjs-editor').CJSMultipleInput();
	$('.cjs-place').CJSMultipleInput();
	
	CJS.options.type  = form.find('#cjs-opt .cjs-type').val()||CJS.options.type,
	CJS.options.format= form.find('#cjs-opt .cjs-format').val()||CJS.options.format,
	CJS.options.style = form.find('#cjs-opt .cjs-style').val()||CJS.options.style,
	CJS.options.lan   = form.find('#cjs-opt .cjs-lan').val()||CJSo.ptions.lan
	
	// Event listeners
	
	form.find('a.cjs').click(function(e){
	  e.preventDefault();
	  window.location.href = window.location.href.split('#')[0] + $(this).attr('href');
	  $('.cjs-active').removeClass('cjs-active');
	  $(this).addClass('cjs-active');
	  $($(this).attr('href')).addClass('cjs-active');
	});
	
	form.find('#cjs-opt select.cjs').change(function(){
	  CJS.options.type  = form.find('#cjs-opt .cjs-type').val()||CJS.options.type,
	  CJS.options.format= form.find('#cjs-opt .cjs-format').val()||CJS.options.format,
	  CJS.options.style = form.find('#cjs-opt .cjs-style').val()||CJS.options.style,
	  CJS.options.lan   = form.find('#cjs-opt .cjs-lan').val()||CJS.options.lan;
	  updateDraft();
	});
	
	form.find('select.cjs-type').change(function(){
	  var val = $(this).val();
	  $('#cjs-in-form fieldset').each(function(){
	    if($(this).hasClass('cjs-'+val))$(this).show();
	    else $(this).hide();
	  });
	});
	
	form.find('input[type="submit"]').click(function(e){
	  e.preventDefault();
	  CJS.main.add(CJS.draft.data);
	  emptyForm();
	  (add)();
	});
	
	form.find('input[type="reset"]').click(function(e){
	  e.preventDefault();
	  emptyForm();
	});
	
	form.find('.cjs-input input.cjs,.cjs-input textarea.cjs,.cjs-input select.cjs').change(function(){
	  
	  switch(form.find('section.cjs-active').attr('id').replace(/^cjs-in-/,'').toLowerCase()){
	    case 'form':
	      var data = {
		type:form.find('select.cjs-type').val()||null,
		chapterauthor:(function(){
		  var arr = [];
		  form.find('.cjs-chapterauthor').each(function(){
		    if($(this).val())arr.push($(this).val());
		  });
		  return arr;
		})(),
		author:(function(){
		  var arr = [];
		  form.find('.cjs-author').each(function(){
		    if($(this).val())arr.push($(this).val());
		  });
		  return arr;
		})(),
		chapter:form.find('.cjs-chapter').val()||null,
		editor:(function(){
		  var arr = [];
		  form.find('.cjs-editor').each(function(){
		    if($(this).val())arr.push($(this).val());
		  });
		  return arr;
		})(),
		year:form.find('.cjs-year').val()||null,
		journal:form.find('.cjs-journal').val()||null,
		volume:form.find('.cjs-volume').val()||null,
		title:form.find('.cjs-title').val()||null,
		print:form.find('.cjs-print').val()||null,
		place:(function(){
		  var arr = [];
		  form.find('.cjs-place').each(function(){
		    if($(this).val())arr.push($(this).val());
		  });
		  return arr;
		})(),
		publisher:form.find('.cjs-publisher').val()||null,
		url:form.find('.cjs-url').val()||null,
		conference:{
		  name:form.find('.cjs-conname').val()||null,
		  org:form.find('.cjs-conorg').val()||null,
		  date:form.find('.cjs-condate').dateInput(),
		  place:form.find('.cjs-conplace').val()||null,
		  country:form.find('.cjs-concountry').val()||null
		},
		pages:[
		  form.find('.cjs-pages.cjs-from').val()||null,
		  form.find('.cjs-pages.cjs-to').val()||null
		],
		pubdate:form.find('.cjs-pubdate').dateInput(),
		date:form.find('.cjs-date').dateInput()
	      }
	      for(var i in data){if(!data[i]||data[i]=='')delete data[i]}
	      CJS.draft.set(data);
	      updateDraft();
	      break;
	    case 'json':case 'bibtex':default:
	      CJS.draft.set(form.find('section.cjs-active textarea').val());
	      updateDraft();
	      break;
	  };
	  
	});
	
      });
    });
  }
});