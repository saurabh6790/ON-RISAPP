cur_frm.cscript.show_images = function(doc, dt ,dn){
	wn.call({
		method:"clinical.doctype.patient_report.patient_report.get_server_id",
		callback:function(r){
			window.open("http://"+r.message+"/Launch_Viewer.asp?PatientID='"+doc.patient_id+"'&AccessionNumber='"+doc.encounter_id+"'");
		}
	})	
}

cur_frm.fields_dict.technologist_id.get_query =function(doc,cdt,cdn)
{
   return{
   		query:"controllers.queries.employee_query",
   		filters: {
			'designation':'Technologist' 
		}
   	}
}

cur_frm.cscript.onload = function(){
	cur_frm.add_fetch("report","report_template","template_details")
	cur_frm.add_fetch("patient_id","customer_name","patient_name")
	cur_frm.add_fetch("patient_id","birth_date","patient_birth_date")
	cur_frm.add_fetch("patient_id","age","age")
	cur_frm.add_fetch("patient_id","gender","sex")
	cur_frm.add_fetch("accession_number","encounter","modality")
	cur_frm.add_fetch("accession_number","study","study")
	cur_frm.add_fetch("accession_number","referral","referral_name")
	cur_frm.add_fetch('technologist_id', 'employee_name', 'technologist_name');
	cur_frm.add_fetch("accession_number","problem_description","problem_description")
	cur_frm.add_fetch("accession_number", "encounter_date", "study_date");
	cur_frm.add_fetch("accession_number","patient","patient_id")
	cur_frm.add_fetch("accession_number","patient_name","patient_name")
	cur_frm.add_fetch("accession_number","patient_birth_date","patient_birth_date")
	cur_frm.add_fetch("accession_number","age","age")
	cur_frm.add_fetch("accession_number","gender","sex")
}

cur_frm.cscript.refresh = function(doc){
	if(doc.docstatus == 1){
		cur_frm.set_value('report_status', 'Final')
	}
	refresh_field("report_status")
}

cur_frm.fields_dict.accession_number.get_query =function(doc,cdt,cdn)
{
   return{
   		query:"clinical.doctype.patient_report.patient_report.get_pee",
   		
   	}
}
