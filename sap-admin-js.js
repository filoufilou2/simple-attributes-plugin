jQuery(document).ready(function($) {
	// Create a wireframe for group items
	var $groupframe = $('li.groupframe').clone().removeClass('groupframe');
	$('ul li', $groupframe).remove();

	// Create a wireframe for groups
	var $itemframe = $('li.groupframe li:eq(0)').clone();

	// There seems to be no group in pace, add one
	if ($('.group:not(.groupframe)').length < 1 && $('#sap-atts > ul').length) {
		var $new_group = $groupframe.wrap('<div>').parent().html();
		$('#sap-atts > ul').append($new_group.replace(/%group%/g, random_id()));
	}
	
	$('#add-group').click(function() {
		var $new_group = $groupframe.wrap('<div>').parent().html();
		$new_group = $new_group.replace(/%group%/g, random_id());
		$new_group = $new_group.replace(/%%%/g, new Date().getTime());

		$('#sap-atts > ul').append($new_group);
		return false;
	});

	$('.add-attr').live('click', function() {
		var $new_item = $itemframe.wrap('<div>').parent().html();
		
		// Generate a unique item ID
		$new_item = $new_item.replace(/%%%/g, new Date().getTime());

		// Figure out the group for this item
		$group_id = $('.sap-group', $(this).parent().siblings('.header')).val();

		if ($group_id == undefined)
			$group_id = random_id();

		$new_item = $new_item.replace(/%group%/g, $group_id);

		$(this).parent().siblings('ul').append($new_item);
		return false;
	});

	$('.add-adv-type-options').live('click', function() {
		var $adv_type_options_frame = $(this).siblings('ul').find('li.frame').clone().removeClass('frame');
		$(this).siblings('ul').append($adv_type_options_frame.wrap('<div>').parent().html().replace(/%advanced%/g, new Date().getTime()));
		return false;
	});

	$('.sap-common-options select').each(function() {
		$adv_options = $(this).attr('id') + '-' + $('option:selected', this).val();
		$('.'+ $adv_options).show();

	}).live('change', function() {
		$adv_options_id = $(this).attr('id');
		$adv_options = $(this).attr('id') + '-' + $('option:selected', this).val();

		$('.'+ $adv_options).fadeIn();
		$('.'+ $adv_options_id +':not(.'+ $adv_options +')').hide();
	});

	$('.sap-delete-attr').live('click', function() {
		var $id = $(this).attr('href');
		$($id).remove();
	});

	$('#sap-atts ul').sortable({
		items: '> li',
		placeholder: 'highlight',
		axis: 'y',
		distance: 10,
		beforeStop: function(e, ui) {
			//var $group_index = $(ui.item).parent().parent('.group').index();
			//$('input.sap-group', ui.item).val($group_index);
		}
	});

	function random_id() {
	    var id = "";
	    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for ( var i=0; i < 5; i++ )
	        id += chars.charAt(Math.floor(Math.random() * chars.length));

	    return id;
	}

	$('.cpt_atts_new').live('click', function() {
		var $frame = $(this).parent().siblings('.frame').clone().removeClass('frame');
		$frame = $frame.wrap('<div>').parent().html().replace(/%%%/g, new Date().getTime());
		$(this).parent().before($frame);
	});

	$('.cpt_atts_delete').live('click', function() {
		var $id = $(this).attr('href');
		console.log($id);
		$($id).remove();
	});

	$('.sap-file-tools .remove a').live('click', function() {
		$($(this).attr('href')).val('');
		$('img', $($(this).attr('href')).parent()).fadeOut();
		return false;
	});


	/* 
		File Uploads 
	*/
	
	$('.cpt_atts a.sap-choose-existing').live('click', function() {
		// Insert a temporary hidden field with this file DOM id
		$(this).before('<input type="hidden" id="cpt-input-for-file" value="'+ $(this).attr('rel') +'" />');
		// Show the thickbox
		tb_show('', $(this).attr('href'));
		return false;
	});

	$('.media-item .filename.new').each(function() {
		$(this).before('<a href="#" class="cpt-choose-file button">Choose</a>');
	});

	$('.cpt-choose-file').live('click', function() {
		var $file_id = $(this).parent().attr('id');
		$file_id = $file_id.replace(/[^\d]+/,'');
		
		// Send back to the window
		var win = window.dialogArguments || opener || parent || top;
		win.update_image_file($file_id);
		win.tb_remove(); // Close the modal window
		return false;
	});	

	window.update_image_file = function ($file_id) {
		var $input_for_file = $('#cpt-input-for-file').val(); // Read the file_id from the temp placeholder
		$('#cpt-input-for-file').remove(); // Remove the placeholder
		$('#' + $input_for_file).val($file_id); // Set the new file_id value
		
		// Get the new preview
		$.post(ajaxurl, {
			action: "sap_get_file_preview", 
			file_id: $file_id,
			_ajax_nonce: $('input[name="_wpnonce"]').val()
		}, function(str) {
			$('#' + $input_for_file + '-image').hide().html(str).fadeIn();
		});		
	}

});