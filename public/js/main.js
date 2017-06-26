$(document).ready(function(){
	$('#login').click(function(event) {
		event.preventDefault();
		var data = {};
			data.user_name = $('#form').find('#user_name').val();
			data.user_pass = $('#form').find('#user_pass').val();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'auth',						
			success: function(data) {		
				//console.log('success');
				alert(JSON.stringify(data));
				//console.log(JSON.stringify(data));
				//alert(JSON.stringify(data))
				location.replace("/"); 
			}
		});
});
});


