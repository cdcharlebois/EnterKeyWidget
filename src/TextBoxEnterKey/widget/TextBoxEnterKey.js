/*global logger*/
/*
    TextBoxEnterKey
    ========================

    @file      : TextBoxEnterKey.js
    @version   : 1.1
    @author    : Christiaan Westgeest, Emile Broeders
    @date      : Fri, 26 Feb 2016 10:42:29 GMT
    @copyright :
    @license   :

    Documentation
    ========================
    Describe your widget here.
*/

define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/keys",
    "dojo/dom-attr",
    "dojo/text!TextBoxEnterKey/widget/template/TextBoxEnterKey.html"
], function(declare, _WidgetBase, _TemplatedMixin, dojoKeys, dojoAttr,
  widgetTemplate) {
    "use strict";

    // Declare widget's prototype.
    return declare("TextBoxEnterKey.widget.TextBoxEnterKey", [ _WidgetBase,
        _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        inputBox: null,
        resetButton: null,
        obj: null,
        subHandle: null,

        // Parameters configured in the Modeler.
        mfToExecute: "",
        progressBar: "",
        progressMsg: "",
        inputValue: "",
        async: "",
        placeholder: "",


        // Internal variables. Non-primitives created in the prototype are
        // shared between all widget instances.
        _contextObj: null,
        _alertDiv: null,

        // dojo.declare.constructor is called to construct the widget instance.
        // Implement to initialize non-primitive properties.
        constructor: function() {
            // Uncomment the following line to enable debug messages
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor ");
        },

        // dijit._WidgetBase.postCreate is called after constructing the
        // widget. Implement to do extra setup work.
        postCreate: function() {
            logger.debug(this.id + ".postCreate ");
            this.connect(this.inputBox, "onkeyup",
                this.onEnterClick.bind(this));
            this.connect(this.resetButton, "onclick",
                this.resetForm.bind(this));
            if (!this._isEmptyString(this.placeholder)) {
                    dojoAttr.set(this.inputBox, "placeholder",
                        this.placeholder);
            }
        },

        // mxui.widget._WidgetBase.update is called when context is changed or
        // initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
          logger.debug(this.id + ".update ");
          this.obj = obj;
          if (this.obj) {
            // in some cases update may be called with a null obj
            this.changeInput();
          }

          if (callback) {
            callback();
          }
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is
        // destroyed. Implement to do special tear-down work.
        uninitialize: function() {
          logger.debug(this.id + ".uninitialize ");
          // Clean up listeners, helper objects, etc. There is no need to
          // remove listeners added with this.connect / this.subscribe /
          // this.own.
        },

        changeInput: function() {
          this.inputBox.value = this.obj.get(this.inputValue);
        },

        onEnterClick: function(event) {
          console.log(event.key);
          this.obj.set(this.inputValue, this.inputBox.value);
          if (event.keyCode == dojoKeys.ENTER) {
            if (this.mfToExecute !== "") {
              this.executeMicroflow(this.mfToExecute, this.async,
                  this.progressBar);
            }
          }
        },

        resetForm: function(event) {
          this.inputBox.value = "";
        },

       _isEmptyString: function (str) {
          return (!str || 0 === str.trim().length);
        },

        executeMicroflow : function (mf, async, showProgress) {
          if (mf && this.obj) {
            if (showProgress) {
              var isModal = true; var pid =
                mx.ui.showProgress(this.progressMsg, isModal);
            }
            mx.data.action({
              async : async,
              store: {
                caller: this.mxform
              },
              params: {
                actionname  : mf,
                applyto     : "selection",
                guids       : [this.obj.getGuid()],
              },
              callback: (function () {
                this.changeInput();
                if (showProgress) {
                  mx.ui.hideProgress(pid);
                }
              }).bind(this),
              error: function () {
                if (showProgress) {
                  mx.ui.hideProgress(pid);
                }
              }
            });
          }
        }
    });
});

require(["TextBoxEnterKey/widget/TextBoxEnterKey"], function() {
    "use strict ";
});
