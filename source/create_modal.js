/*
 * Creates view in the HTML document given the jQuery $ object and the modal.
 * on_complete is a function that takes an object with the result of the
 * inputs as argument. It is called when the dialog completes.
 * TODO: allow for multiple modals.
 */
function create_modal($, modal_name, modal, on_complete) {
  //$("#wrapper").append("hello, world");
  // Initialize modal
  var modal_view = $("<div/>", {"class": "modal fade", "id": modal_name});
  var modal_dialog = $("<div/>", {"class": "modal-dialog"});
  var modal_content = $("<div/>", {"class": "modal-content"});
  var modal_header = $('<h4 class="js-title-step"></h4>');
  var modal_body = $("<div/>", {"class": "modal-body"});
  var modal_footer = $('<div class="modal-footer"> \
    <button type="button" class="btn btn-default js-btn-step pull-left" data-orientation="cancel" data-dismiss="modal"></button> \
    <button type="button" class="btn btn-warning js-btn-step" data-orientation="previous"></button> \
    <button type="button" class="btn btn-success js-btn-step" data-orientation="next"></button> \
    </div>');
    var getters = {};

  // Add steps
  for (var i = 0; i < modal.length; i++) {
    var step_data = modal[i];
    var step = $("<div/>", {"class": "row hide", "data-step": (i+1).toString(), "data-title": step_data.title});
    var content = $("<div/>", {"class": "col-md-12"});

    for (var j = 0; j < step_data.objects.length; j++) {
      var element = create_element($, step_data.objects[j], getters);
      content.append(element);
    }

    step.append(content);
    modal_body.append(step);
  }


  // Add modal to HTML
  // TODO: consider just returning the element
  modal_content.append(modal_header).append(modal_body).append(modal_footer);
  modal_dialog.append(modal_content);
  modal_view.append(modal_dialog);
  $("body").append(modal_view);
  modal_view.modalSteps({
    "completeCallback": function() {
      var result = {};
      for (var key in getters) {
        result[key] = getters[key]();
      }
      on_complete(result);
    }
  });
}

/*
 * Creates an HTML input element using jQuery and predefined object.
 * Currently supports checkboxes and fields.
 */
function create_element($, obj, getters) {
  var element = null;
  switch (obj.type) {
    case "checkbox":
      element = $("<div/>", {"class": "checkbox"});
      var checkbox = $("<label/>", {"text": obj.label});
      checkbox.prepend($("<input/>", {"id": obj.name, "type": "checkbox", "checked": obj.checked}));
      element.append(checkbox);
      // Add getter to getters
      var getter = function() { return $("#" + obj.name).is(":checked"); };
      getters[obj.name] = getter;
      break;
    case "radio":
      element = $("<div/>");
      for (var i = 0; i < obj.buttons.length; i++) {
        var wrapper = $("<div/>", {"class": "radio", });
        var label = $("<label/>", {"text": obj.buttons[i].label});
        var button = $("<input/>", {"type": "radio", "name": obj.name, "value": obj.buttons[i].value, "checked": i == 0});
        label.prepend(button);
        wrapper.append(label);
        element.append(wrapper);
        // Add getter to getters
        var getter = function() { return $("input[name=" + obj.name + "]:checked").val(); };
        getters[obj.name] = getter;
      }
      break;
    default:
      break;
  }
  return element;
}
