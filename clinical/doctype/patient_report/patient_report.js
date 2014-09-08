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
cur_frm.add_fetch("report","report_template","template_details")
cur_frm.add_fetch("patient_id","first_name","patient_name")
cur_frm.add_fetch("patient_id","birth_date","patient_birth_date")
cur_frm.add_fetch("patient_id","age","age")
cur_frm.add_fetch("patient_id","gender","sex")
cur_frm.add_fetch("accession_number","encounter","modality")
cur_frm.add_fetch("accession_number","study","study")
cur_frm.add_fetch("accession_number","referrer_name","referral_name")
cur_frm.add_fetch('technologist_id', 'employee_name', 'technologist_name');