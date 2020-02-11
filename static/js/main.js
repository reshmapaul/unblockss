$(window).load(function () {
  $("#preloader").fadeOut("slow");
  $('.morelink').each(function( index ) {
  var id = $(this).attr('id');
     
      if(id == 'data0'){
         $(this).addClass("Demand_medical_records_read");  
      }
      else if(id == 'data1'){
         $(this).addClass("Acess_wearables_read"); 
      }
      else if(id == 'data2'){
          $(this).addClass("Need_for_transparency_read");
      }
      else if(id == 'data3'){
          $(this).addClass("Correction_of_error_read");
      }
      else if(id == 'data4'){
          $(this).addClass("Rise_for_patients_read");
      }
      else if(id == 'data5'){
          $(this).addClass("Decisions_for_care_read");
      }
      else if(id == 'data6'){
          $(this).addClass("Improve_patient_satisfaction_read");
      }
      else if(id == 'data7'){
          $(this).addClass("Healthcare_organizations_read");
      }  
     
});
});


$(document).ready(function () {

   /* Drop down multiselect with checkbox */
  !function($) {
   
      "use strict";// jshint ;_;

      if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
          ko.bindingHandlers.multiselect = {

              init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

                  var listOfSelectedItems = allBindingsAccessor().selectedOptions;
                  var config = ko.utils.unwrapObservable(valueAccessor());

                  $(element).multiselect(config);

                  if (isObservableArray(listOfSelectedItems)) {
                      
                      // Set the initial selection state on the multiselect list.
                      $(element).multiselect('select', ko.utils.unwrapObservable(listOfSelectedItems));
                      
                      // Subscribe to the selectedOptions: ko.observableArray
                      listOfSelectedItems.subscribe(function (changes) {
                          var addedArray = [], deletedArray = [];
                          forEach(changes, function (change) {
                              switch (change.status) {
                                  case 'added':
                                      addedArray.push(change.value);
                                      break;
                                  case 'deleted':
                                      deletedArray.push(change.value);
                                      break;
                              }
                          });
                          
                          if (addedArray.length > 0) {
                              $(element).multiselect('select', addedArray);
                          }
                          
                          if (deletedArray.length > 0) {
                              $(element).multiselect('deselect', deletedArray);
                          }
                      }, null, "arrayChange");
                  }
              },

              update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

                  var listOfItems = allBindingsAccessor().options,
                      ms = $(element).data('multiselect'),
                      config = ko.utils.unwrapObservable(valueAccessor());

                  if (isObservableArray(listOfItems)) {
                      // Subscribe to the options: ko.observableArray incase it changes later
                      listOfItems.subscribe(function (theArray) {
                          $(element).multiselect('rebuild');
                      });
                  }

                  if (!ms) {
                      $(element).multiselect(config);
                  }
                  else {
                      ms.updateOriginalOptions();
                  }
              }
          };
      }

    function isObservableArray(obj) {
        return ko.isObservable(obj) && !(obj.destroyAll === undefined);
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index]);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     * 
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);
        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);
        
        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();
        
        this.updateButtonText();
        this.updateSelectAll();
        
        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }
        
        this.$select.hide().after(this.$container);
    };

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText + ' <b class="caret"></b>';
                }
                else if (options.length == $('option', $(select)).length) {
                    return this.allSelectedText + ' <b class="caret"></b>';
                }
                else if (options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText + ' <b class="caret"></b>';
                }
                else {
                    var selected = '';
                    options.each(function() {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).html();

                        selected += label + ', ';
                    });
                    
                    return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else {
                    var selected = '';
                    options.each(function () {
                        selected += $(this).text() + ', ';
                    });
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Create a label.
             * 
             * @param {jQuery} element
             * @returns {String}
             */
            label: function(element){
                return $(element).attr('label') || $(element).html();
            },
            /**
             * Triggered on change of the multiselect.
             * 
             * Not triggered when selecting/deselecting options manually.
             * 
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange : function(option, checked) {

            },
            /**
             * Triggered when the dropdown is shown.
             * 
             * @param {jQuery} event
             */
            onDropdownShow: function(event) {
                
            },
            /**
             * Triggered when the dropdown is hidden.
             * 
             * @param {jQuery} event
             */
            onDropdownHide: function(event) {
                
            },
            /**
             * Triggered after the dropdown is shown.
             * 
             * @param {jQuery} event
             */
            onDropdownShown: function(event) {
                
            },
            /**
             * Triggered after the dropdown is hidden.
             * 
             * @param {jQuery} event
             */
            onDropdownHidden: function(event) {
                
            },
            buttonClass: 'btn btn-default',
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            checkboxName: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableClickableOptGroups: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'Please select all that apply*',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a href="javascript:void(0);"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function() {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function() {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);

            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width' : this.options.buttonWidth
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function() {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all nessecary events.
         * 
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function() {

            this.$select.children().each($.proxy(function(index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();
            
                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }
                
                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li input', this.$ul).on('change', $.proxy(function(event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {
                    if (checked) {
                        this.selectAll();
                    }
                    else {
                        this.deselectAll();
                    }
                }

                if(!isSelectAllOption){
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }
                }

                this.$select.change();

                this.updateButtonText();
                this.updateSelectAll();
                
                this.options.onChange($option, checked);

                if(this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('touchstart click', function(event) {
                event.stopPropagation();

                var $target = $(event.target);

                if (document.getSelection().type === 'Range') {
                  var $input = $(this).find("input:first");

                  $input.prop("checked", !$input.prop("checked"))
                      .trigger("change");
                }

                if (event.shiftKey) {
                    var checked = $target.prop('checked') || false;

                    if (checked) {
                        var prev = $target.closest('li')
                            .siblings('li[class="active"]:first');

                        var currentIdx = $target.closest('li')
                            .index();
                        var prevIdx = prev.index();

                        if (currentIdx > prevIdx) {
                            $target.closest("li").prevUntil(prev).each(
                                function() {
                                    $(this).find("input:first").prop("checked", true)
                                        .trigger("change");
                                }
                            );
                        }
                        else {
                            $target.closest("li").nextUntil(prev).each(
                                function() {
                                    $(this).find("input:first").prop("checked", true)
                                        .trigger("change");
                                }
                            );
                        }
                    }
                }

                $target.blur();
            });

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function(event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                    // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                        index++;
                    }
                    else if (!~index) {
                        index = 0;
                    }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if(this.options.enableClickableOptGroups && this.options.multiple) {
                $('li.multiselect-group', this.$ul).on('click', $.proxy(function(event) {
                    event.stopPropagation();

                    var group = $(event.target).parent();

                    // Search all option in optgroup
                    var $options = group.nextUntil('li.multiselect-group');

                    // check or uncheck items
                    var allChecked = true;
                    var optionInputs = $options.find('input');
                    optionInputs.each(function() {
                        allChecked = allChecked && $(this).prop('checked');
                    });

                    optionInputs.prop('checked', !allChecked).trigger('change');
               }, this));
            }
        },

        /**
         * Create an option using the given select option.
         * 
         * @param {jQuery} element
         */
        createOptionValue: function(element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.label(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);

            var $checkbox = $('<input/>').attr('type', inputType);

            if (this.options.checkboxName) {
                $checkbox.attr('name', this.options.checkboxName);
            }
            $label.append($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.append(" " + label);
            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         * 
         * @param {jQuery} element
         */
        createDivider: function(element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         * 
         * @param {jQuery} group
         */
        createOptgroup: function(group) {
            var groupName = $(group).prop('label');

            // Add a header for the group.
            var $li = $(this.options.templates.liGroup);
            $('label', $li).text(groupName);

            if (this.options.enableClickableOptGroups) {
                $li.addClass('multiselect-group-clickable');
            }

            this.$ul.append($li);

            if ($(group).is(':disabled')) {
                $li.addClass('disabled');
            }

            // Add the options of the group.
            $('option', group).each($.proxy(function(index, element) {
                this.createOptionValue(element);
            }, this));
        },

        /**
         * Build the selct all.
         * 
         * Checks if a select all has already been created.
         */
        buildSelectAll: function() {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }
            
            var alreadyHasSelectAll = this.hasSelectAll();
            
            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple
                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {
                
                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");
                
                if (this.options.selectAllName) {
                    $('label', $li).append('<input type="checkbox" name="' + this.options.selectAllName + '" />');
                }
                else {
                    $('label', $li).append('<input type="checkbox" />');
                }
                
                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                $('label', $li).append(" " + this.options.selectAllText);

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);
                    
                    // Adds optional filter clear button
                    if(this.options.includeFilterClearBtn){
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function(event){
                            clearTimeout(this.searchTimeout);
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass("filter-hidden");
                            this.updateSelectAll();
                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }
                    
                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function(event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function(event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                          event.preventDefault();
                        }
                        
                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function() {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function(index, element) {
                                    var value = $('input', element).val();
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior === 'text')) {
                                        filterCandidate = text;
                                    }
                                    else if ((this.options.filterBehavior === 'value')) {
                                        filterCandidate = value;
                                    }
                                    else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {
                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                            showElement = true;
                                        }
                                        else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        // Toggle current element (group or group item) according to showElement boolean.
                                        $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);
                                        
                                        // Differentiate groups and group items.
                                        if ($(element).hasClass('multiselect-group')) {
                                            // Remember group status.
                                            currentGroup = element;
                                            currentGroupVisible = showElement;
                                        }
                                        else {
                                            // Show group name when at least one of its items is visible.
                                            if (showElement) {
                                                $(currentGroup).show().removeClass('filter-hidden');
                                            }
                                            
                                            // Show all group items when group name satisfies filter.
                                            if (!showElement && currentGroupVisible) {
                                                $(element).show().removeClass('filter-hidden');
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();
                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function() {
            this.$container.remove();
            this.$select.show();
            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function() {
            $('option', this.$select).each($.proxy(function(index, element) {
                var $input = $('li input', this.$ul).filter(function() {
                    return $(this).val() === $(element).val();
                });

                if ($(element).is(':selected')) {
                    $input.prop('checked', true);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                }
                else {
                    $input.prop('checked', false);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                if ($(element).is(":disabled")) {
                    $input.attr('disabled', 'disabled')
                        .prop('disabled', true)
                        .closest('li')
                        .addClass('disabled');
                }
                else {
                    $input.prop('disabled', false)
                        .closest('li')
                        .removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Select all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         * 
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function(selectValues, triggerOnChange) {
            if(!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }
                
                if (!this.options.multiple) {
                    this.deselectAll(false);
                }
                
                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);
            }

            this.updateButtonText();
            this.updateSelectAll();

            if (triggerOnChange && selectValues.length === 1) {
                this.options.onChange($option, true);
            }
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Deselects all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         * 
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function(deselectValues, triggerOnChange) {
            if(!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);
            }

            this.updateButtonText();
            this.updateSelectAll();
            
            if (triggerOnChange && deselectValues.length === 1) {
                this.options.onChange($option, false);
            }
        },
        
        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         */
        selectAll: function (justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.$ul);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;
            
            if(justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").addClass(this.options.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).addClass(this.options.selectedClass);
            }
                
            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:enabled", this.$select).prop('selected', true);
            }
            else {
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }
        },

        /**
         * Deselects all options.
         * 
         * If justVisible is true or not specified, only visible options are deselected.
         * 
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            
            if(justVisible) {              
                var visibleCheckboxes = $("li input[type='checkbox']:enabled", this.$ul).filter(":visible");
                visibleCheckboxes.prop('checked', false);
                
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").removeClass(this.options.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.$ul).prop('checked', false);
                $("option:enabled", this.$select).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Rebuild the plugin.
         * 
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function() {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();
            
            this.updateButtonText();
            this.updateSelectAll();
            
            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            }
            
            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function(dataprovider) {
            var optionDOM = "";
            var groupCounter = 0;
            var tags = $(''); // create empty jQuery array

            $.each(dataprovider, function (index, option) {
                var tag;
                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;
                    tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter
                    });
                    forEach(option.children, function(subOption) { // add children option tags
                        tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected
                        }));
                    });

                    optionDOM += '</optgroup>';
                }
                else { // create option tag
                    tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        selected: !!option.selected
                    });
                }

                tags = tags.add(tag);
            });
            
            this.$select.empty().append(tags);
            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function() {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function() {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the options.
         * 
         * @param {Array} options
         */
        setOptions: function(options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         * 
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function(options) {
            return $.extend(true, {}, this.defaults, options);
        },
        
        /**
         * Checks whether a select all checkbox is present.
         * 
         * @returns {Boolean}
         */
        hasSelectAll: function() {
            return $('li.' + this.options.selectAllValue, this.$ul).length > 0;
        },
        
        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function() {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi  = $("li." + this.options.selectAllValue, this.$ul);
                var selectAllInput = selectAllLi.find("input");
                
                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                }
            }
        },
        
        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function() {
            var options = this.getSelected();
            
            // First update the displayed button text.
            $('.multiselect', this.$container).html(this.options.buttonText(options, this.$select));
            
            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         * 
         * @returns {jQUery}
         */
        getSelected: function() {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         * 
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function (value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        getInputByValue: function (value) {

            var checkboxes = $('li input', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function() {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                callback.apply(self || window, args);
            }, timeout);
        }
    };

    $.fn.multiselect = function(option, parameter, extraOptions) {
        return this.each(function() {
            var data = $(this).data('multiselect');
            var options = typeof option === 'object' && option;
            
            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);
                
                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function() {
        $("select[data-role=multiselect]").multiselect();
    });

}(window.jQuery);



    $(document).ready(function() {
        $('#survey-category').multiselect();
    });
   /* multi select with check box end */
  /*twitter hashtag feed */
  var ws = new WebSocket('wss://twint.netspective.io:8882');
  let count = 0;
  ws.onmessage = function (unblockTweets) {
    const tweets = unblockTweets.data;
    if (count === 0) {
      $(".twitter-loader").hide();
    }
    const tweetId = tweets.split(' ')[0];
    if (count < 50) {
      createTweet(tweetId);
    }
    count = count + 1;
  };
  /*twitter hashtag feed end */
 

$('.readmore-link').each(function( index ) {
      var id = $(this).attr('id');    
      if(id == 'loadMore0'){
         $(this).addClass("Health_information_management_read");  
      }
      else if(id == 'loadMore1'){
         $(this).addClass("Office_of_patient_experience_read"); 
      }
      else if(id == 'loadMore2'){
          $(this).addClass("Regulatory_read");
      }
      else if(id == 'loadMore3'){
          $(this).addClass("Patients_and_carepartners_read");
      }
      else if(id == 'showLess0'){
         $(this).addClass("Health_information_management_show");  
      }
      else if(id == 'showLess1'){
         $(this).addClass("Office_of_patient_experience_show"); 
      }
      else if(id == 'showLess2'){
          $(this).addClass("Regulatory_show");
      }
      else if(id == 'showLess3'){
          $(this).addClass("Patients_and_carepartners_show");
      }
  });

  /*$('#loadMore0').click(function(){
    $("#loadMore0").addClass("Health_information_management_read");
  });
  $('#showLess0').click(function(){
    $("#showLess0").addClass("Health_information_management_show");
  });
   $('#loadMore1').click(function(){
    $("#loadMore1").addClass("Office_of_patient_experience_read");
  });
  $('#showLess1').click(function(){
    $("#showLess1").addClass("Office_of_patient_experience_show");
  });
   $('#loadMore2').click(function(){
    $("#loadMore2").addClass("Regulatory_read");
  });
  $('#showLess2').click(function(){
    $("#showLess2").addClass("Regulatory_show");
  });
   $('#loadMore3').click(function(){
    $("#loadMore3").addClass("Patients_and_carepartners_read");
  });
  $('#showLess3').click(function(){
    $("#showLess3").addClass("Patients_and_carepartners_show");
  });*/
  
  $('ul li a').click(function(){
      $('li a').removeClass("active");
      $(this).addClass("active");
   });
  var pathname = window.location.pathname;
  
  if (pathname == '/faqs/') {
    $('#top-nav').addClass('confirmregistration');
    $('#top-nav').addClass('animated');
    $('#current').addClass('current');
     
    //$('#commonfooter').addClass('confirm-page-footer');
  }
  if(pathname.includes('/news/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#news').addClass('current'); 
  }
  if(pathname.includes('/press/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#press').addClass('current'); 
  }
  if(pathname.includes('/events/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#events').addClass('current'); 
  }
  if(pathname == '/faqs/'){
    $('#current').removeClass('current');
    $('#faq').addClass('current'); 
  }
  if(pathname.includes('/blog/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#blog').addClass('current'); 
  }
  if (pathname == '/404.html') {
    $('#top-nav').addClass('confirmregistration');
    $('#top-nav').addClass('animated');
  }

  new WOW().init();

  $('#top-nav').onePageNav({
    currentClass: 'current',
    changeHash: true,
    scrollSpeed: 1200
  });


  //animated header class
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    //console.log(scroll);
    if (scroll > 200) {
      //console.log('a');
      $(".navigation").addClass("animated");
    } else {
      //console.log('a');
      $(".navigation").removeClass("animated");
    }
  });

  $year = $('#countdown_dashboard').data('year');
  $month = $('#countdown_dashboard').data('month');
  $day = $('#countdown_dashboard').data('day');
  $hour = $('#countdown_dashboard').data('hour');
  $min = $('#countdown_dashboard').data('minute');
  $seconds = $('#countdown_dashboard').data('seconds');
  if ($('#countdown_dashboard').length != 0) {
    $('#countdown_dashboard').countDown({
      targetDate: {
        'day': $day,
        'month': $month,
        'year': $year,
        'hour': $hour,
        'min': $min,
        'sec': $seconds,
      },
      omitWeeks: true
    });
  }
  $(".about-slider").owlCarousel(
    {
      singleItem: true,
      pagination: true,
      autoPlay: 5000,
    }
  );
  //contact form validation
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
  var uid = uuidv4();
  //alert(uid);
  $('#cntbtn').click(function () {
    $('#patientoption').val('PA').trigger('change');
  })
  $('#hospitalhimbtn').click(function () {
    $('#patientoption').val('HIM').trigger('change');
  })
  $('#contact-submit').click(function (e) {
    var first_name = $('#quickname').val();
    var email = $('#quickemail').val();
    var subject = $('#quicksubject').val();
    var message = $('#message').val();
    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (first_name == '') {
      $('#quicknamealert').css('display', 'block');
      return false;
    }
    else {
      $('#quicknamealert').css('display', 'none');
    }
    if (email == '' || email.search(o) == -1) {
      $('#quickemailalert').css('display', 'block');
      return false;
    }
    else {
      $('#quickemailalert').css('display', 'none');
    }
    if (subject == '') {
      $('#quicksubjectalert').css('display', 'block');
      return false;
    }
    else {
      $('#quicksubjectalert').css('display', 'none');
    }
    if (message == '') {
      $('#messagealert').css('display', 'block');
      return false;
    }
    else {
      $('#messagealert').css('display', 'none');
    }

  });
  $('#subscribe-submit').click(function (e) {
    var first_name = $('#subscribename').val();
    var email = $('#subscribeemail').val();
    var title = $('#title').val();
    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (first_name == '') {
      $('#subscribenamealert').css('display', 'block');
      return false;
    }
    else {
      $('#subscribenamealert').css('display', 'none');
    }
    if (email == '' || email.search(o) == -1) {
      $('#subscribeemailalert').css('display', 'block');
      return false;
    }
    else {
      $('#subscribeemailalert').css('display', 'none');
    }

    var form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("client_id", "93d80a68-5ad0-878d-a787-5da44425070f");
    form.append("client_secret", "_S9UX^KZ&&t9W(aH");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://crm.unblock.health/Api/access_token",
      "method": "POST",
      "headers": {
        "Accept": "application/vnd.api+json"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {

      var obj = $.parseJSON(response);
      var access_token = obj.access_token;
      var settings = {
        "url": "https://crm.unblock.health/Api/V8/module",
        "method": "POST",
        "headers": {
          "Accept": "application/vnd.api+json",
          "Authorization": "Bearer " + access_token + "",
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \"" + uid + "\",\r\n    \"attributes\": {\r\n     \"first_name\":\"" + first_name + "\",\r\n     \"email1\":\"" + email + "\"\r\n,\r\n     \"lead_source\":\"Web Site\"\r\n,\r\n     \"title\":\"" + title + "\"\r\n   }\r\n  }\r\n}\r\n"
      }

      $.ajax(settings).done(function (response) {
        //console.log(response);
        var contactid = response.data.id;
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://crm.unblock.health/Api/V8/module/Accounts/aba27ce2-d758-bdeb-adef-5da4294bf9e8/relationships",
          "method": "POST",
          "headers": {
            "Accept": "application/vnd.api+json",
            "Authorization": "Bearer " + access_token + "",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\"" + contactid + "\"\r\n\t    \r\n      }\r\n}"
        }

        $.ajax(settings).done(function (response) {
          //console.log(response);
          if (response.meta.message != "") {
            $('#subscribename').val('');
            $('#subscribeemail').val('');
            var $subscribesuccess = $('#subscribesuccess'); // get the reference of the div
            $subscribesuccess.show().html('You have been successfully added to our Mailing List!');
          }
        });
      });
    });
  });
  $('#contact-submit-live').click(function (e) {
    var first_name = $('#name').val();
    var email = $('#email').val();
    var subject = $('#subject').val();
    var patientdetails = $('#patientoption').val();
    var message = $('#message').val();
    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (first_name == '') {
      $('#namealert').css('display', 'block');
      return false;
    }
    else {
      $('#namealert').css('display', 'none');
    }
    if (email == '' || email.search(o) == -1) {
      $('#emailalert').css('display', 'block');
      return false;
    }
    else {
      $('#emailalert').css('display', 'none');
    }
    if (subject == '') {
      $('#subjectalert').css('display', 'block');
      return false;
    }
    else {
      $('#subjectalert').css('display', 'none');
    }
    if (patientdetails == '') {
      $('#patientalert').css('display', 'block');
      return false;
    }
    else {
      $('#patientalert').css('display', 'none');
    }

    var form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("client_id", "93d80a68-5ad0-878d-a787-5da44425070f");
    form.append("client_secret", "_S9UX^KZ&&t9W(aH");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://crm.unblock.health/Api/access_token",
      "method": "POST",
      "headers": {
        "Accept": "application/vnd.api+json"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {

      var obj = $.parseJSON(response);
      var access_token = obj.access_token;
      var settings = {
        "url": "https://crm.unblock.health/Api/V8/module",
        "method": "POST",
        "headers": {
          "Accept": "application/vnd.api+json",
          "Authorization": "Bearer " + access_token + "",
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \"" + uid + "\",\r\n    \"attributes\": {\r\n     \"first_name\":\"" + first_name + "\",\r\n     \"email1\":\"" + email + "\"\r\n,\r\n     \"lead_source\":\"Web Site\"\r\n,\r\n     \"title\":\"" + patientdetails + "\"\r\n   }\r\n  }\r\n}\r\n"
      }

      $.ajax(settings).done(function (response) {
        //console.log(response);
        var contactid = response.data.id;
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://crm.unblock.health/Api/V8/module/Accounts/aba27ce2-d758-bdeb-adef-5da4294bf9e8/relationships",
          "method": "POST",
          "headers": {
            "Accept": "application/vnd.api+json",
            "Authorization": "Bearer " + access_token + "",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\"" + contactid + "\"\r\n\t    \r\n      }\r\n}"
        }

        $.ajax(settings).done(function (response) {
          //console.log(response);
          if (response.meta.message != "") {
            $('#name').val('');
            $('#email').val('');
            var $success = $('#success'); // get the reference of the div
            $success.show().html('Your Message was sent successfully');
          }
        });
      });
    });
  });
  $('#contact-submit').click(function (e) {
    var first_name = $('#quickname').val();
    var email = $('#quickemail').val();
    var subject = $('#quicksubject').val();
    var message = $('#quickmessage').val();
    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (first_name == '') {
      $('#quicknamealert').css('display', 'block');
      return false;
    }
    else {
      $('#quicknamealert').css('display', 'none');
    }
    if (email == '' || email.search(o) == -1) {
      $('#quickemailalert').css('display', 'block');
      return false;
    }
    else {
      $('#quickemailalert').css('display', 'none');
    }
    if (subject == '') {
      $('#quicksubjectalert').css('display', 'block');
      return false;
    }
    else {
      $('#quicksubjectalert').css('display', 'none');
    }
    if (message == '') {
      $('#messagealert').css('display', 'block');
      return false;
    }
    else {
      $('#messagealert').css('display', 'none');
    }
    var description = 'Subject: '+subject;
    description += '&#013;&#010;';
    description += 'Message: '+message;
    var form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("client_id", "93d80a68-5ad0-878d-a787-5da44425070f");
    form.append("client_secret", "_S9UX^KZ&&t9W(aH");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://crm.unblock.health/Api/access_token",
      "method": "POST",
      "headers": {
        "Accept": "application/vnd.api+json"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {

      var obj = $.parseJSON(response);
      var access_token = obj.access_token;
      var settings = {
        "url": "https://crm.unblock.health/Api/V8/module",
        "method": "POST",
        "headers": {
          "Accept": "application/vnd.api+json",
          "Authorization": "Bearer " + access_token + "",
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \"" + uid + "\",\r\n    \"attributes\": {\r\n     \"first_name\":\"" + first_name + "\",\r\n     \"email1\":\"" + email + "\"\r\n,\r\n     \"lead_source\":\"Web Site\"\r\n,\r\n     \"title\":\"GEN\"\r\n,\r\n     \"description\":\"" + description + "\"\r\n   }\r\n  }\r\n}\r\n"
      }

      $.ajax(settings).done(function (response) {
        //console.log(response);
        var contactid = response.data.id;
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://crm.unblock.health/Api/V8/module/Accounts/aba27ce2-d758-bdeb-adef-5da4294bf9e8/relationships",
          "method": "POST",
          "headers": {
            "Accept": "application/vnd.api+json",
            "Authorization": "Bearer " + access_token + "",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\"" + contactid + "\"\r\n\t    \r\n      }\r\n}"
        }

        $.ajax(settings).done(function (response) {
          //console.log(response);
          if (response.meta.message != "") {
            $("#contactform").trigger("reset");
            var $success = $('#successfooter'); // get the reference of the div
            $success.show().html('Your Message was sent successfully');
          }
        });
      });
    });
  });
  $('#community-form-submit').click(function (e) {
    var First_Name = $('#community_name').val();
    var Email_Address = $('#community_email').val();
    var Mobile_Number = $('#community_mobilenumber').val();
    var Category = $('#survey-category').val();
    var TwitterHandle = $('#community_twitterhandle').val();
    var LinkedInProfile = $('#community_linkedInprofile').val();
    var fromDate = $('#community_fromDate').val();
    var toDate = $('#community_toDate').val();
    var DateAttendingFrom = ( $('#community_fromDate').val() == '') ? null : '"'+fromDate+'"';
    var DateAttendingTo= ( $('#community_toDate').val() == '') ? null : '"'+toDate+'"';
    var YourInterest =  $('#yourinterest').val();
    var comments =  $('#community_comments').val();

    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    var filter = /^\d*(?:\.\d{1,2})?$/;
    if (First_Name == '') {
      $('#namealert').css('display', 'block');
      return false;
    }
    else {
      $('#namealert').css('display', 'none');
    }
    if (Email_Address == '' || Email_Address.search(o) == -1) {
      $('#emailalert').css('display', 'block');
      return false;
    }
    else {
      $('#emailalert').css('display', 'none');
    }
    if (Category == '') {
      $('#patientalert').css('display', 'block');
      return false;
    }
    else {
      $('#patientalert').css('display', 'none');
    }

  //description = '{ TwitterHandle : '+TwitterHandle+', LinkedInProfile : '+LinkedInProfile+', DateAttendingFrom : '+DateAttendingFrom+', DateAttendingTo  : '+DateAttendingTo+', Your Interest In Unblock Health : '+YourInterest+',Comments : '+comments+', Source:"HIMSS20"}';
  
  description = '{ "TwitterHandle" :\"'+ TwitterHandle +'\", "LinkedInProfile" :\"'+ LinkedInProfile +'\", "DateAttendingFrom" :\"'+ DateAttendingFrom +'\", "DateAttendingTo" :\"'+ DateAttendingTo +'\", "Your Interest In Unblock Health" :\"'+ YourInterest +'\", "Comments" :\"'+ comments +'\", "Source" :"HIMSS20"}';
  description = JSON.stringify(description);
   var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://test.admin.app.unblock.health/ubhweb/items/himss20_contact_details",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "processData": false,
  "data": "{\"status\": \"published\", \"full_name\": \"" + First_Name + "\", \"category\": \"" + Category + "\", \"e_mail\": \"" + Email_Address + "\", \"mobile_number\": \"" + Mobile_Number + "\", \"twitter_handle\": \"" + TwitterHandle + "\", \"linkedin_profile\": \"" + LinkedInProfile + "\", \"dates_attending_from\": "+ DateAttendingFrom + ", \"dates_attending_to\": "+ DateAttendingTo + ",  \"your_interest_in_unblock_health\": \"" + YourInterest + "\", \"comments\": \"" + comments + "\" ,  \r\n     \"source\":\"HIMSS20\"\r\n  } \r\n\r\n"
}

$.ajax(settings).done(function (response) {
  //console.log(response);
});
   
   var form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("client_id", "93d80a68-5ad0-878d-a787-5da44425070f");
    form.append("client_secret", "_S9UX^KZ&&t9W(aH");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://crm.unblock.health/Api/access_token",
      "method": "POST",
      "headers": {
        "Accept": "application/vnd.api+json"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }
    //var $success = $('#success'); // get the reference of the div
    //$success.show().html('<div id="loader">Loading...</div>');
    $.ajax(settings).done(function (response) {

      var obj = $.parseJSON(response);
      var access_token = obj.access_token;
      var settings = {
        "url": "https://crm.unblock.health/Api/V8/module",
        "method": "POST",
        "headers": {
          "Accept": "application/vnd.api+json",
          "Authorization": "Bearer " + access_token + "",
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \"" + uid + "\",\r\n    \"attributes\": {\r\n     \"first_name\":\"" + First_Name + "\",\r\n     \"email1\":\"" + Email_Address + "\"\r\n, \r\n     \"title\":\"" + Category + "\"\r\n,\r\n     \"description\": "+ description  +",\r\n     \"phone_mobile\":\"" + Mobile_Number + "\"\r\n, \r\n     \"lead_source\":\"Conference\"\r\n   }\r\n  }\r\n}\r\n"
      }

      $.ajax(settings).done(function (response) {
        //console.log(response);
        var contactid = response.data.id;
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://crm.unblock.health/Api/V8/module/Accounts/aba27ce2-d758-bdeb-adef-5da4294bf9e8/relationships",
          "method": "POST",
          "headers": {
            "Accept": "application/vnd.api+json",
            "Authorization": "Bearer " + access_token + "",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\"" + contactid + "\"\r\n\t    \r\n      }\r\n}"
        }

        $.ajax(settings).done(function (response) {
          //console.log(response);
          if (response.meta.message != "") {
            $("#communityform").trigger("reset");
            var $success = $('#community_success'); // get the reference of the div
            $success.show().html('Your Message was sent successfully');
          }
        });
      });
    });
  });
  var showChar = 85;
  var ellipsestext = "....";
  var moretext = "Read More";
  var lesstext = "Show Less";
  var i=0;
  $('.more').each(function (index) {
    var content = $(this).html();
    if (content.length > showChar) {
      //alert(i);
      var c = content.substr(0, showChar);
      //alert(c);
      var h = content.substr(showChar, content.length - showChar);
      //alert(h);
      var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a id="data'+i+'" href="" class="morelink">' + moretext + '</a></span>';

      $(this).html(html);
      i++;
    }
  });
  $(".morelink").click(function () {
    var id = $(this).attr('id');    
    if ($(this).hasClass("less")) {
      $(this).removeClass("less");
        if(id == 'data0'){
          $(this).removeClass("Demand_medical_records_show");
          $(this).addClass("Demand_medical_records_read");  
        }
        else if(id == 'data1'){
          $(this).removeClass("Acess_wearables_show");
          $(this).addClass("Acess_wearables_read");
        }
        else if(id == 'data2'){
          $(this).removeClass("Need_for_transparency_show");
          $(this).addClass("Need_for_transparency_read");
        }
        else if(id == 'data3'){
          $(this).removeClass("Correction_of_error_show");
          $(this).addClass("Correction_of_error_read");
        }
        else if(id == 'data4'){
          $(this).removeClass("Rise_for_patients_show");
          $(this).addClass("Rise_for_patients_read");
        }
        else if(id == 'data5'){
          $(this).removeClass("Decisions_for_care_show");
          $(this).addClass("Decisions_for_care_read");
        }
        else if(id == 'data6'){
          $(this).removeClass("Improve_patient_satisfaction_show");
          $(this).addClass("Improve_patient_satisfaction_read");
        }
        else if(id == 'data7'){
          $(this).removeClass("Healthcare_organizations_show");
          $(this).addClass("Healthcare_organizations_read");
        }
        $(this).html(moretext);
    }else {
      if(id == 'data0'){
         $(this).removeClass("Demand_medical_records_read");
         $(this).addClass("Demand_medical_records_show");  
      }
      else if(id == 'data1'){
         $(this).removeClass("Acess_wearables_read");
         $(this).addClass("Acess_wearables_show"); 
      }
      else if(id == 'data2'){
          $(this).removeClass("Need_for_transparency_read");
          $(this).addClass("Need_for_transparency_show");
      }
      else if(id == 'data3'){
          $(this).removeClass("Correction_of_error_read");
          $(this).addClass("Correction_of_error_show");
      }
      else if(id == 'data4'){
          $(this).removeClass("Rise_for_patients_read");
          $(this).addClass("Rise_for_patients_show");
      }
      else if(id == 'data5'){
          $(this).removeClass("Decisions_for_care_read");
          $(this).addClass("Decisions_for_care_show");
      }
      else if(id == 'data6'){
          $(this).removeClass("Improve_patient_satisfaction_read");
          $(this).addClass("Improve_patient_satisfaction_show");
      }
      else if(id == 'data7'){
          $(this).removeClass("Healthcare_organizations_read");
          $(this).addClass("Healthcare_organizations_show");
      }
      $(this).addClass("less");
      $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
  
  
  $('#myList1 li').each(function (index) {
    var size_li = 0;
    var size_li = $("#myList" + index + " li").size();
    //console.log(size_li);
    x = 1;
    $('#myList' + index + ' li:lt(' + x + ')').show();
    $('#showLess' + index).hide();
    $('#loadMore' + index).click(function () {
      $('#loadMore' + index).hide();
      x = (x + 5 <= size_li) ? x + 5 : size_li;
      //console.log(x);
      $('#myList' + index + ' li:lt(' + x + ')').show();
      $('#showLess' + index).show();
    });
    $('#showLess' + index).click(function () {
      $('#showLess' + index).hide();
      x1 = (x - 5 < 0) ? 2 : 1;
      console.log(x1);
      $('#myList' + index + ' li').not(':lt(' + x1 + ')').hide();
      $('#loadMore' + index).show();

    });
  });
  function timeSince(date) {
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);
    var duration = getDuration(seconds);
    var suffix = duration.interval > 1 || duration.interval === 0 ? 's' : '';
    return duration.interval + ' ' + duration.epoch + suffix;
  }
  function getDuration(seconds) {
    var epoch, interval;
    var DURATION_IN_SECONDS = {
      epochs: ['year', 'month', 'day', 'hour', 'minute'],
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (var i = 0; i < DURATION_IN_SECONDS.epochs.length; i++) {
      epoch = DURATION_IN_SECONDS.epochs[i];
      interval = Math.floor(seconds / DURATION_IN_SECONDS[epoch]);
      if (interval >= 1) {
        return {
          interval: interval,
          epoch: epoch
        };
      }
    }
  }
  $('#subscribe-submit').prop('disabled', 'disabled');
  $('#subscribe-submit').addClass('is-disabled');
  $('#subscribe').on('blur keyup change', 'textarea,input', function (event) {
    validateForm('#subscribe', '#subscribe-submit');
  });
  $('#contact-submit-live').prop('disabled', 'disabled');
  $('#contact-submit-live').addClass('is-disabled');
  $('#quickcontact').on('blur keyup change', 'textarea,input,select', function (event) {
     quickContactValidation = validateForm('#quickcontact', '#contact-submit-live');
     if((quickContactValidation==true)&&($("#name").val().length > 0)&&($("#email").val().length > 0)&&($("#patientoption").val()=="PA" ||$("#patientoption").val()=="HIM")){ 
        $('#contact-submit-live').prop('disabled', false);
        $('#contact-submit-live').removeClass('is-disabled');
     }
  });
  $('#community-form-submit').prop('disabled', 'disabled');
  $('#community-form-submit').addClass('is-disabled');
  $('#communityform').on('blur keyup change', 'textarea,input,select', function (event) {
    if ($("#community_name").val().length > 0 && $("#community_email").val().length > 0 && $("#survey-category").val() != null ){
      //console.log("got here");
       comunityValidation = validateForm('#communityform', '#community-form-submit');
      $('#community-form-submit').prop('disabled', false);
      $('#community-form-submit').removeClass('is-disabled');
    }
  });
  $('#contact-submit').prop('disabled', 'disabled');
  $('#contact-submit').addClass('is-disabled');
  $('#contactform').on('blur keyup change', 'textarea,input', function (event) {
    validateForm('#contactform', '#contact-submit');
  });
  function validateForm(id,buttonId) {
    var valid = $(id).validate().checkForm();
    if (valid) {
      $(buttonId).prop('disabled', false);
      $(buttonId).removeClass('is-disabled');
      return true;
    } else {
      $(buttonId).prop('disabled', 'disabled');
      $(buttonId).addClass('is-disabled');
      return false;
    }
  }
  $("#community_fromDate").datepicker({
        numberOfMonths: 1,
        dateFormat: 'yy-mm-dd', 
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() + 1);
            $("#community_toDate").datepicker("option", "minDate", dt);
        }
    });
    $("#community_toDate").datepicker({
        numberOfMonths: 1,
        dateFormat: 'yy-mm-dd', 
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() - 1);
            $("#community_fromDate").datepicker("option", "maxDate", dt);
        }
    });
});

function createTweet(tweetId) {
  twttr.widgets.createTweet(tweetId,
    document.getElementById('twitter_feed'),
    {
      align: 'left'
    })
    .then(function (el) {
      // console.log("Tweet displayed..")
    });
}
function twitterShare(tweet_id, screen_name) {
  if (tweet_id != undefined && screen_name != undefined) {
    if (tweet_id) {
      var url = "https://twitter.com/statuses/" + tweet_id;
      var text = '';
      window.open('https://twitter.com/home?status=' + encodeURIComponent(url), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
  }

console.log("client_credentials");
}








