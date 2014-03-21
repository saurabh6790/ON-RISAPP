cur_frm.cscript.show_images = function(doc, dt ,dn){
	wn.call({
		method:"clinical.doctype.patient_report.patient_report.get_server_id",
		callback:function(r){
			window.open("http://"+r.message+"/Launch_Viewer.asp?PatientID='"+doc.patient_id+"'&AccessionNumber='"+doc.encounter_id+"'");
		}
	})
	
}