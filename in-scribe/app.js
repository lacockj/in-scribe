(function(){
/**
 * Easy Writer
 * @module easy-writer
 * @version 0.1
 * @license Apache-2.0
 * Copyright 2015 Jacob Lacock
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @requires jQuery
 */
if (!window.jQuery) {
  var jq = document.createElement('script');
  jq.type = 'text/javascript';
  jq.src = 'easy-writer/assets/jquery-2.1.4.min.js';
  document.getElementsByTagName('head')[0].appendChild(jq);
}

/** Initialize after page is loaded. */
window.onload = function(){
  ezw.editing.off();
  ezw.load();
};

/**
 * @namespace
 */
var ezw = ezw || {};

ezw.load = function(){
  /*
  ezw.self.file = $('meta[name="self"]')[0].content;
  if (ezw.self.file.match(/\.\w+$/)) {
    ezw.self.base = ezw.self.file.replace(/\.\w+$/, "");
  } else {
    ezw.self.base = ezw.self.file;
  }
  */
  //console.log(ezw.self);
  $('head').append('<link rel="stylesheet" type="text/css" href="/easy-writer/style.css">');
  $.get("easy-writer/menu.php")
  .done(function(response){
    $('body').append(response);
    ezw.initialize();
  });
}

/**
 * @namespace
 * @property {string} file - The full file name of the page to be edited.
 * @property {string} base - The file name without it's type extension.
 */
/*
ezw.self = {
  file: null,
  base: null
}*/

/**
 * Initialize.
 * @function
 */
ezw.initialize = function(){
  ezw.bindControls();
  ezw.menu.show('off');
};

/**
 * Bind appropriate actions to keypress and mouseclick events.
 * @function
 */
ezw.bindControls = function(){
  $('body').keydown(ezw.keyboard);
  //$('.ez-writable').on('focus', function(e){
  //  console.log(e);
  //});
  $('[data-ezw-action="menu-idle"]').on('click', function(){ezw.menu.show("idle")});
  $('[data-ezw-action="menu-start"]').on('click', function(){if(ezw.editing.state){ezw.menu.show("start")}else{ezw.editing.on()}});
  $('[data-ezw-action="menu-file"]').on('click', function(){ezw.menu.show("file")});
  $('[data-ezw-action="menu-add"]').on('click', function(){ezw.menu.show("add")});
  $('[data-ezw-action="menu-h"]').on('click', function(){ezw.menu.show("h")});

  $('[data-ezw-action="edit-on"]').on('click', function(){ezw.editing.on();ezw.menu.show('idle');});
  $('[data-ezw-action="edit-off"]').on('click', function(){ezw.editing.off();ezw.menu.show('off');});

  $('[data-ezw-action="file-save"]').on('click', function(){ezw.file.save();ezw.menu.show('idle');});

  $('[data-ezw-action="add-p"]').on('click', function(){ezw.addSection('p');ezw.menu.show('idle');});
  $('[data-ezw-action="add-h1"]').on('click', function(){ezw.addSection('h1');ezw.menu.show('idle');});
  $('[data-ezw-action="add-h2"]').on('click', function(){ezw.addSection('h2');ezw.menu.show('idle');});
  $('[data-ezw-action="add-h3"]').on('click', function(){ezw.addSection('h3');ezw.menu.show('idle');});
  $('[data-ezw-action="add-h4"]').on('click', function(){ezw.addSection('h4');ezw.menu.show('idle');});
  $('[data-ezw-action="add-h5"]').on('click', function(){ezw.addSection('h5');ezw.menu.show('idle');});
  $('[data-ezw-action="add-h6"]').on('click', function(){ezw.addSection('h6');ezw.menu.show('idle');});
}

ezw.keyboard = function(e){
  //console.log(e.keyCode);

  // Escape Key //
  if (e.keyCode == 27) {
    if (ezw.menu.active) {
      ezw.menu.active = false;
      ezw.menu.activate('idle');
    } else {
      ezw.menu.active = true;
      ezw.menu.activate('start');
    }

  // Return Key //
  } else if (e.keyCode == 13) {
    e.preventDefault();
    var ne = ezw.addSection({
      tag: 'p',
      insert: 'after',
      element: $(':focus')[0]
    });

  // Alpha Keys when Menu Active //
  } else if ( ezw.menu.active && ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)) && !(e.altKey || e.ctrlKey || e.metaKey) ) {
    e.preventDefault();
    ezw.menu.key( String.fromCharCode( e.keyCode ) );
  }
};

/**
 * Quickly navigate the menu with the keyboard.
 * @function
 */
ezw.menu = {
  active: false,
  show: function( menu ){
    $('.ezw-menu').hide();
    $('#ezw-menu-' + menu).show();
  }
}

/**
 * Add a new section to the end of the document.
 * @function
 */
ezw.addSection = function( opts ){
  console.log( opts );
  if (typeof opts === 'string') {
    opts = {tag: opts};
  }
  if (!opts.element) opts.element = '.easy-writer:last';
  if (!opts.insert) opts.insert = 'append';
  console.log( opts );
  var newElement = $('<' + opts.tag + ' contenteditable="true">' + opts.tag + '</' + opts.tag + '>');
  console.log( newElement );
  $(opts.element)[opts.insert](newElement);
  newElement.focus();
  ezw.menu.reset();
  return newElement;
}

/**
 * Activate all elements with the class "ez-writable" as "contentEditable".
 * @function
 */
ezw.editing = {
  state: false,
  on: function(){
    $('.easy-writer *')
    .attr("contentEditable", true)
    .on('focus', function(){
      console.log("Editing:");
      console.log(this);
      var $this = $(this);
      var geometry = $this.offset();
      geometry.width = $this.outerWidth();
      geometry.height = $this.outerHeight();
      console.log(geometry);
    });
    this.state = true;
  },
  off: function(){
    $('.easy-writer *')
    .attr("contentEditable", false)
    .off('click');
    this.state = false;
  }
}

ezw.file = {
  save: function(){
    var data = {containers: []};
    console.log("Saving...");
    $('.easy-writer').each(function(){
      $this = $(this);
      console.log( $this );
      console.log( $this.data('ezw-file') );
      data.containers.push({
        file: $this.data('ezw-file'),
        content: $this.html()
      });
    });
    console.log( data );
    $.post("easy-writer/save.php", data)
    .done(function(response){
      console.log( response );
    });
  }
};

})();