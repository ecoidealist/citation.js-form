/** 
 * @file jquery.Citation-0.2.js
 * 
 * @description
 * # Description
 * 
 * This plugin builds a form for input for the `Cite` object. Uses the templates in `html/`.
 * 
 * # Dependencies
 * 
 * * jQuery
 * * jQuery UI
 * * Citeproc
 * * Citation.js
 * 
 * @projectname Citationjs
 * 
 * @author Lars Willighagen [lars.willighagen@gmail.com]
 * @version 0.2
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

/**
 * 
 */
jQuery.fn.CJSMultipleInput = function () {
  var elm = $( this ).selector
  
  $( elm ).each( function () {
    $(this).addClass( 'cjs-multipleinput' )
    
    $(this).change( function () {
           if (  $(this).val() &&  $(elm).last().val() )
	$(this).after( $(this).clone( true ).val( '' ) )
      
      else if (  $(this).val() && !$(elm).next().val() )
	$(this).next().remove()
      
      else if ( !$(this).val() &&  $(elm).next().val() )
	$(this).remove()
    } )
  } )
}

var jQueryCite = (function(){
  
  var emptyForm = function () {
    this._draft.reset()
    this.updateDraft()
    
    var section = this._form.in.find( 'section.cjs-active' )
    
    section.find( 'input, textarea').val('')
    section.find('.cjs-chapterauthor').slice(1).remove()
    section.find('.cjs-author').slice(1).remove()
    section.find('.cjs-editor').slice(1).remove()
    section.find('.cjs-place').slice(1).remove()
  }
  
  var activateForm = function ( elm ) {
    elm
      .addClass( 'cjs-active' )
      .parent()
      .children( 'section' )
      .not( elm )
      .removeClass( 'cjs-active' )
  }
  
  /**
   * 
   */
  function jQueryCite ( options ) {
    
    // Making it Scope-Safe
    if ( !( this instanceof jQueryCite ) )
      return new jQueryCite( options )
    
    /**
    * 
    */
    this._options = Object.assign( {
      lang: 'en',
      form: '../src/html/form-en.html',
      add : function ( self ) {
	console.log(self._form.out,self._data.get())
	self._form.out.html( self._data.get() )
      }
    }, options || {} )
    
    /**
     * 
     */
    this._form = {}
    
    /**
     * 
     */
    this._draft = new Cite()
    
    /**
     * 
     */
    this._data = new Cite()
    
    /**
     * 
     */
    this.updateDraft = function () {
      this._form.in.find( '.cjs-draft' ).html( this._draft.get( {}, true ) )
      
      return this
    }
    
    /**
     * 
     */
    this.updateFields = function () {
      var form = this._form.in
        , val = form.find('select.cjs-type').val()
      
      form.find( '#cjs-in-form fieldset' ).each( function () {
	if ( $( this ).hasClass( 'cjs-' + val ) )
	  $( this ).show()
	else
	  $( this ).hide()
      } )
      
      return this
    }
    
    /**
     * 
     */
    this.insertOutputForm = function ( form, options ) {
      var self = this
        , options = Object.assign( options || {}, self._options )
      
      self._form.out = form
      
      form.attr( {
	id: '',
	class: 'cjs cjs-out'
      } )
    }
    
    /**
     * 
     */
    this.insertInputForm = function ( form, options ) {
      var self = this
      
      if ( self._form.hasOwnProperty( 'in' ) ) {
	form.html( $( '.cjs-in' ) )
	return self
      }
      
      form.empty = function () { emptyForm.call( self ) }
      
      self._form.in = form
      
      var options = Object.assign( options || {}, self._options )
      
      form.addClass( 'cjs cjs-in' ).load( options.form, function () {
	
	//BEGIN Event listeners
	form.find( '.cjs-chapterauthor, .cjs-author, .cjs-editor, .cjs-place' ).CJSMultipleInput()
	
	form.find( '#cjs-opt select.cjs' ).change( function () {
	  var options = {
	    format: 'string'
	  , type:   form.find('#cjs-opt .cjs-type').val()
	  , style:  form.find('#cjs-opt .cjs-style').val()
	  , lang:   form.find('#cjs-opt .cjs-lan').val()
	  }
	  
	  self._data.options( options, true )
	  self._draft.options( options, true )
	  
	  self.updateDraft()
	} )
	
	form.find( '#cjs-in-form select.cjs-type' ).change( self.updateFields )
	
	form.find( 'input[type="submit"]' ).click( function ( e ) {
	  e.preventDefault()
	  
	  self._data.add( self._draft.data )
	  
	  options.add( self )
	  
	  form.empty()
	} )
	
	form.find( 'input[type="reset"]' ).click( function ( e ) {
	  e.preventDefault()
	  
	  form.empty()
	} )
	
	form.find( '#cjs-in-json, #cjs-in-bibtex' ).find( 'textarea' ).change( function () {
	  self._draft.set( $( this ).val() )
	  
	  self.updateDraft()
	} )
	
	form.find( '#cjs-in-form' ).find( 'input' ).change( function () {
	  var data = {
	    //TODO
	  }
	  
	  for ( var i in data ) {
	    if ( !data[ i ] || data[ i ] === '' )
	      delete data[ i ]
	  }
	  
	  self._draft.set( data )
	  
	  self.updateDraft()
	} )
	//END
	
	//BEGIN Triggering stuff
	form.find( '.cjs-input' ).tabs( {
	  hide: { effect: 'slide', direction: 'left', duration: 50 },
	  show: { effect: 'slide', direction: 'right', duration: 150 }
	} )
	
	self.updateFields()
	
	form.find( '#cjs-opt .cjs-type' ).change()
	//END
	
      } )
      
      return self
    }
    
  }
  
  return jQueryCite
})()