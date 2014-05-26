wn.pages['dashboard'].onload = function(wrapper) { 
	wn.ui.make_app_page({
		parent: wrapper,
		title: 'DASHBOARD',
		single_column: true
	});	

	$('<head>\
		<script type="text/javascript" language="javascript" src="files/jquery.dataTables.js"></script>\
                <script type="text/javascript" charset="utf-8" src="files/TableTools.min.js"></script>\
                <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.3.0/build/cssreset/reset-min.css">\
                <link rel="shortcut icon" type="image/ico" href="http://www.datatables.net/media/images/favicon.ico" />\
                 <script type="text/javascript" charset="utf-8" src="files/new_ZeroClipboard.js"></script>\
                <style type="text/css" title="currentStyle">\
                        @import "files/demo_page.css";\
                        @import "files/demo_table.css";\
                        @import "files/TableTools.css";\
                </style>\
		<script>\
			$(function() {\
				$( "#datepicker1" ).datepicker();\
				$( "#datepicker2" ).datepicker();\
			});\
		</script></head>\
		<body id="dt_example">\
			<div width="100%" style="height:40px">\
				<h style="float:left;" id="records">\
					<a href="app.html#Calendar%2FPatient%20Encounter%20Entry">Patient Encounter Entry</a></h>\
				<h style="float:right;margin-right:10px">\
					<a href="app.html#Report/Patient%20Register">Patient Register</a></h>\
			</div>\
			<div id="background" width="50%" height="40%" align="center" style="background-color:#E6E6E6">\
				<table width="80%" align="center">\
					<tr><td>Modality</td>\
						<td style="vertical-align:center">\
							<select style="margin-left:5px;margin-top:5px;" class="col-md-12 input-with-feedback form-control input-sm" id="modality" >\
								<option value="All">All</option></select></td>\
						<td style="padding-left:15px;">Study</td>\
						<td style="vertical-align:center">\
							<select style="margin-left:5px;margin-top:5px;" class="col-md-12 input-with-feedback form-control input-sm" id="study" >\
								<option value="All">All</option></select></td>\
						<td style="padding-left:15px;">Status</td>\
						<td style="vertical-align:center">\
							<select style="margin-left:5px;margin-top:5px;" class="col-md-12 input-with-feedback form-control input-sm" id="status" >\
								<option value="All">All</option></select></td>\
						<td style="padding-left:15px;">Patient</td>\
						<td style="vertical-align:center">\
							<select style="margin-left:5px;margin-top:5px;" class="col-md-12 input-with-feedback form-control input-sm" id="patient" >\
								<option value="All">All</option></select></td>\
					</tr>\
					<tr>\
						<td>Accession Number</td>\
						<td style="vertical-align:center">\
							<select style="margin-left:5px;margin-top:5px;" class="col-md-12 input-with-feedback form-control input-sm" id="accession_number" >\
								<option value="All">All</option></select></td>\
						<td style="padding-left:15px;">From Date </td>\
							<td style="vertical-align:center">\
								<input type="text" style="margin-left:5px;margin-top:5px;" class="col-md-12 input-with-feedback form-control" id="datepicker1" /></td>\
						<td style="padding-left:15px;">To Date </td>\
							<td style="vertical-align:center">\
								<input type="text" style="margin-left:5px;margin-top:5px;" class="col-md-12 input-with-feedback form-control" id="datepicker2" /></td>\
					</tr>\
					<tr>\
						<td style="text-align:right;margin-top:15px" colspan="3">\
							<button type="text" id="search_button" class ="btn btn-primary" align="right" style="width:150px;margin-top:20px;margin-bottom:15px">\
							<i align="center" class="icon-search"></i></button>\
						</td>\
						<td style="text-align:right;margin-top:15px" colspan="3">\
							<button type="text" id="pickup_column" class="btn btn-default" align="right" style="width:150px;margin-top:20px;margin-bottom:15px">\
							Pickup Columns </button>\
						</td>\
					</tr>\
				</table>\
			</div>\
			<div id="container" style="width:100%;table-layout:fixed;">\
				<div style="width:100%;margin-top:20px" id="dynamic"></div>\
				<div class="spacer"></div>\
				<div style="margin-top:25px" id="demo1">\
			</div>\
		</body>').appendTo($(wrapper).find('.layout-main'));

	$(document).ready(function(){
		var dropdown = document.getElementById("modality");
		var dropdown1 = document.getElementById("study");
		var dropdown2 = document.getElementById("patient");
		var dropdown3 = document.getElementById("accession_number")

		wn.call({
			method: 'clinical.page.dashboard.dashboard.get_masters',
			callback: function(r) {
				for(var i=0;i<(r.message[0]).length;i++){
					var opt = document.createElement("option");
					opt.value = r.message[0][i];
					opt.text = r.message[0][i];
					dropdown.appendChild(opt);
				}
				for(var i=0;i<(r.message[1]).length;i++){
					var opt = document.createElement("option");
					opt.value = r.message[1][i];
					opt.text = r.message[1][i];
					dropdown1.appendChild(opt);
				}
				for(var i=0;i<(r.message[2]).length;i++){
					var opt = document.createElement("option");
					opt.value = r.message[2][i];
					opt.text = r.message[2][i];
					dropdown2.appendChild(opt);
				}
				for(var i=0;i<(r.message[3]).length;i++){
					var opt = document.createElement("option");
					opt.value = r.message[3][i];
					opt.text = r.message[3][i];
					dropdown3.appendChild(opt);
				}
			}
		});
	})

	var cols = '';

	$("#pickup_column").click(function(){
		wn.call({
			method:"clinical.page.dashboard.dashboard.get_cols",
			args:{doctype:"Patient Encounter Entry"},
			callback: function(r){
				create_popup(r.message)
			}
		})
	})

	function create_popup(field){
		var d = new wn.ui.Dialog({
			title:wn._('Select Columns'),
			fields:	field									
		})
		var fd = d.fields_dict;
		$(fd.save.input).click(function() {
				var btn = this;
				$(btn).set_working();
				cols  = d.get_values();
				console.log(cols)
				if(!cols) return;	
				return wn.call({
					args: {cols:cols},
					method:'clinical.page.dashboard.dashboard.set_columns',
					callback: function(r) {
						$(btn).done_working();
						d.hide();
					}
				});
			});

		d.show();
	}

	$("#search_button").click(function(){
		filter_data={'modality': $('#modality').val(),'study': $('#study').val(),'status': $('#status').val(),'patient': $('#patient').val(), "accession_number":$('#accession_number').val(), 
		'datepicker1':$('#datepicker1').val(), 'datepicker2':$('#datepicker2').val()};
		wn.call({
			method:"clinical.page.dashboard.dashboard.get_patient_encounter_details",
			args:{filter_data:filter_data, cols:cols},
			callback: function(r){
				render_data_table(r.message[0], r.message[1])
			}
		})
	})

	var oTable;

	function render_data_table(data, cols){
		if(oTable){
			oTable.fnClearTable();
		}

	    $("#dynamic").html('<table style="width:100%;overflow:none" class="display" id="data_table"></table>')

	    var arr = cols.split(',')
	    var columns = new Array();

		for(col in arr){
			columns.push({ "sTitle": arr[col].replace('_',' ').toUpperCase(),"sWidth":"100" })	
		}

		oTable=$("#data_table").dataTable({
			"aaData":data,
			"bFilter": false,
			"iDisplayLength": 50,
			"bInfo": false,
			"bSort":false,
			"bAutoWidth": false,
			"sScrollY":"auto",
			"bProcessing": true,
			"sRowSelect": "multi",
			"bLengthChange": false,
			"sScrollX": "auto",
			"aoColumns": columns
		});

		$('#data_table').css("cursor","pointer")
		$("tr.even td.sorting_1").css("background-color","white")
		$("#data_table tr td").css("width","5px")
		$("#data_table tr td").css("height","5px")
		$(".dataTables_scrollHead").css("background-color","#E9E9E9")
		$(".sorting").css("text-align","center")
		$("#data_table_wrapper").css("word-wrap","break-word")
		$("#data_table_wrapper").css("text-align","left");
		// $(".dataTables_scrollBody").css("overflow-x","hidden")
		$(".dataTables_scrollHead").css("border","1px solid black")
		$("#data_table_wrapper").css("border-bottom","1px solid black")
		$("#data_table_wrapper").css("font-size","10px");
		$("#data_table tr td").css("border","2px solid #686868")
		$(".paginate_disabled_previous").hide();
		$(".paginate_disabled_next").hide();
		$(".dataTables_scrollHead").css("background-color","#E9E9E9")
		$(".sorting_disabled").css("text-align","center")

	}
}