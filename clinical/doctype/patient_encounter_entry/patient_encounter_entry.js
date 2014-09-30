cur_frm.add_fetch('patient', 'customer_name', 'patient_name')
cur_frm.add_fetch('doctor', 'lead_name', 'doctor_name')
// cur_frm.add_fetch('referrer_name','rules','rules')
// cur_frm.add_fetch('referrer_name','value','value')
cur_frm.add_fetch('radiologist_name', 'employee_name', 'radiologist_');
cur_frm.add_fetch('referrer_name', 'lead_name', 'referral');
cur_frm.add_fetch('technologist', 'employee_name', 'technologist_name');
cur_frm.add_fetch('appointment_slot', 'start_time', 'start_time');
cur_frm.add_fetch('appointment_slot', 'end_time', 'end_time');
cur_frm.add_fetch('patient', 'patient_online_id', 'global_id')
cur_frm.add_fetch('undertaking', 'template_data', 'undertacking_details')
cur_frm.add_fetch("patient","birth_date","patient_birth_date")
cur_frm.add_fetch("patient","age","age")
cur_frm.add_fetch("patient","gender","gender")

cur_frm.cscript.images = function(doc, cdt, cdn){
	var WshShell = new ActiveXObject("WScript.Shell");
    WshShell.Run("Iexplore " + "http://yahoo.com");
}
cur_frm.cscript.onload = function(doc, cdt, cdn) {
	// cur_frm.cscript.referrer_name(doc)
	// alert(this.frm.doc.encounter)
	var me = this;
	console.log(this.frm.doc.encounter,this.frm.doc.study,this.frm.doc.start_time,this.frm.doc.end_time)
	if(this.frm.doc.encounter){
		wn.call({
			method: "clinical.doctype.patient_encounter_entry.patient_encounter_entry.set_slot",
			args:{modality:this.frm.doc.encounter, study:this.frm.doc.study,start_time:this.frm.doc.start_time, end_time:this.frm.doc.end_time, patient_id: this.frm.doc.patient},
			callback: function(r) {
					cur_frm.set_value("start_time", r.message[0]);
					cur_frm.set_value("end_time", r.message[1]);
					console.log(me.frm.doc.__islocal)
				if(me.frm.doc.__islocal){
					cur_frm.set_value("patient_name",r.message[2].first_name);
					cur_frm.set_value('patient_birth_date', r.message[2].birth_date);
					cur_frm.set_value('age',r.message[2].age)
					cur_frm.set_value('gender',r.message[2].gender)
					cur_frm.set_value('referrer_name',r.message[2].referred_by)
					cur_frm.set_value('referral',r.message[2].referral_name)
					refresh_field('study_items')
					refresh_field('patient_name')
					refresh_field('patient_birth_date')
					refresh_field('age')
					refresh_field('gender')
					refresh_field('referrer_name')
					refresh_field('referral')
				}
			}
		})
		// return $c('runserverobj', args={'method':'fill_study_items', 'arg':this.frm.doc.study , 'docs': wn.model.compress(make_doclist(doc.doctype, doc.name))}, function(r,rt) {
		// 	refresh_field('study_items')
		// })
	}
	if(this.frm.doc.__islocal) {
		doc.encounter_date=get_today();
		cur_frm.set_value('encounter_date', get_today())
	}
}
/*cur_frm.cscript.refresh = function(doc){
	cur_frm.cscript.referrer_name(doc)
}*/

cur_frm.get_field("encounter").get_query=function(doc,cdt,cdn)
{
   return "select name from `tabModality` where active='Yes'"
}

cur_frm.get_field("study").get_query=function(doc,cdt,cdn)
{
   return "select name from `tabStudy` where modality= '"+doc.encounter+"' "
}

cur_frm.get_field("appointment_slot").get_query=function(doc,cdt,cdn){

//	return "select name from tabSlots where modality='"+doc.encounter+"' and active='Yes' and study='"+doc.study+"'"
	return "select name from tabSlots where modality='"+doc.encounter+"' and active='Yes' and study='"+doc.study+"' and name not in (SELECT slot FROM `tabSlot Child` where status='Confirm' and start_time not like (date_format(sysdate(),'%Y-%m-%d %H:%i')))"
}

// cur_frm.cscript.rules = function(doc){
// 	 cur_frm.cscript.referrer_name(doc)
// }

var a={"patient_data":". Patient Details","encounter_data":". Encounter Details","referral_fee_data":". Patient History","disc":". Notes"};

cur_frm.cscript.disc=function(doc,cdt,cdn){
make_linking('disc')

}

function make_linking(show_key){
	for (var key in a){
		// console.log(key)
		$('button[data-fieldname='+key+']').css("width","200");
		if(key==show_key){
			if(key=='encounter_data'){
				$(".row:contains('"+a[key]+"')").show();
				$(".row:contains('. Other Info')").show()
				$(".row:contains('. Alerts')").show()
				$(".row:contains('. Procedure')").show()
				$(".row:contains('. Send Report/Image By')").show()
			}
			else{
	        	$(".row:contains('"+a[key]+"')").show();
				$(".row:contains('. Other Info')").hide()
				$(".row:contains('. Alerts')").hide()
				$(".row:contains('. Procedure')").hide()
				$(".row:contains('. Send Report/Image By')").hide()
			}
		}
		else{	
	    $(".row:contains('"+a[key]+"')").hide()
		}
	}
}

cur_frm.cscript.patient_data=function(doc,cdt,cdn){
make_linking('patient_data')

}

cur_frm.cscript.referral_fee_data=function(doc,cdt,cdn){

make_linking('referral_fee_data')
}

cur_frm.cscript.encounter_data=function(doc,cdt,cdn){
make_linking('encounter_data')

}

cur_frm.cscript.refresh = function(doc, cdt, cdn){
	// cur_frm.cscript.referrer_name(doc)
	if(doc.status != 'Canceled'){
		cur_frm.appframe.add_primary_action(wn._('Make Bill'), cur_frm.cscript['Make Bill'])
		if(doc.status == 'Confirmed'){
	        cur_frm.appframe.add_primary_action(wn._('Make Report'), cur_frm.cscript['Make Report'])
		}
	}
	setTimeout(function(){
                        for (var key in a)
                        {
                                $('button[data-fieldname='+key+']').css("width","200");
                        }

                },10);



}

cur_frm.cscript['Make Bill'] = function() {
	var doc = cur_frm.doc
	if(doc.patient)
        {
                patient=doc.patient
        }
        else
        {
                patient=doc.first_name
        }

        return $c('runserverobj', args={'method':'child_entry', 'arg':patient , 'docs': wn.model.compress(make_doclist(doc.doctype, doc.name))}, function(r,rt) {
                        var si = wn.model.make_new_doc_and_get_name('Sales Invoice');
                        si = locals['Sales Invoice'][si];
                        si.customer = cur_frm.doc.patient;
                        si.patient_name = cur_frm.doc.patient_name;
                        si.posting_date = dateutil.obj_to_str(new Date());
                        si.discount_as_amount = cur_frm.doc.discount_as_amount;
                        si.discount_in_percent = cur_frm.doc.discount_in_percent;
                        si.discount_type = cur_frm.doc.discount_type;
                        for(i=0;i<(r.message).length;i++)
                        {
                                var d1 = wn.model.add_child(si, 'Sales Invoice Item', 'entries');
                                d1.study=r.message[i]['study']
				d1.item=r.message[i]['item']
				d1.qty=r.message[i]['qty']
                                d1.modality=r.message[i]['modality']
                                d1.description=r.message[i]['study_detials']
                                d1.referrer_name = r.message[i]['referrer_name']
                                d1.referrer_physician_credit_to=r.message[i]['referrer_physician_credit_to']
                                d1.export_rate=r.message[i]['export_rate']
                                d1.basic_charges=r.message[i]['basic_charges']
                                d1.referral_rule=r.message[i]['referral_rule']
                                d1.discount_type=r.message[i]['discount_type']
                                d1.discount_in_amt=r.message[i]['discount_in_amt']
                                d1.referral_fee=r.message[i]['referral_fee']
                                d1.discount=r.message[i]['dis_value']
				d1.warehouse=r.message[i]['warehouse']
				d1.referrer_physician_debit_to=r.message[i]['default_cash_account']
				d1.income_account=r.message[i]['default_cash_account']
                                si.patient_amount = r.message[i]['amount']
                                si.patient_credit_to = r.message[i]['patient_credit_to']
                                d1.encounter_id = r.message[i]['name']
                        }
                        loaddoc('Sales Invoice', si.name);
                });

}

cur_frm.cscript.checked_in = function(doc,dt,dn){
	if(doc.checked_in==1){
		cur_frm.set_value('status', 'Confirmed') 
    	// set_field_permlevel('checked_in', 1); 
    	refresh_field('status')
	}
	else{
		cur_frm.set_value('status', 'Waiting') 
    	// set_field_permlevel('checked_in', 1); 
    	refresh_field('status')
	}
    
}

cur_frm.cscript.status=function(doc){
	if(doc.checked_in == 1){
		wn.call({
			method:'clinical.doctype.patient_encounter_entry.patient_encounter_entry.status_validate',
			callback: function(r) {
				cur_frm.set_value('status', 'Confirmed') 
				refresh_field('status')
			}
		})
	}
	if(doc.status=='Confirmed'){
		cur_frm.set_value('checked_in',1)
		refresh_field('checked_in')
	}
}

cur_frm.cscript['Make Report'] = function() {
	//console.log("in the create quetionnnaire");
	wn.model.open_mapped_doc({
		method: "clinical.doctype.patient_encounter_entry.patient_encounter_entry.make_report",
		source_name: cur_frm.doc.name
	})					
}

cur_frm.fields_dict.referrer_name.get_query = function(doc,cdt,cdn) {
  return{
    query:"controllers.queries.lead_query",
  }
}

cur_frm.fields_dict.patient.get_query = function(doc,cdt,cdn) {
  return{
    query:"clinical.doctype.patient_encounter_entry.patient_encounter_entry.get_patient_details"
  }
}

cur_frm.fields_dict.radiologist_name.get_query = function(doc,cdt,cdn) {
	return{	
		query:"controllers.queries.employee_query",
		filters: {
			'designation':'Radiologist' 
		}
	}
}

cur_frm.fields_dict.technologist.get_query =function(doc,cdt,cdn)
{
   return{
   		query:"controllers.queries.employee_query",
   		filters: {
			'designation':'Technologist' 
		}
   	}
}

cur_frm.cscript.get_patient = function(doc, dt ,dn) {
	var d = new wn.ui.Dialog({
		title:wn._('Get patient'),
		fields: [
			{fieldtype:'Data', fieldname:'patient_id', label:wn._('Patient Id'), reqd:true, 
				description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Button', fieldname:'fetch_patient', label:wn._('Fetch Patient') }
		]
	})
	var fd = d.fields_dict;
	$(fd.fetch_patient.input).click(function() {
			var btn = this;
			$(btn).set_working();
			var patient_id  = d.get_values();
			if(!patient_id) return;	
			return wn.call({
				args: patient_id,
				method:'clinical.doctype.patient_encounter_entry.patient_encounter_entry.get_patient',
				callback: function(r) {
					$(btn).done_working();
					d.hide();
				}
			});
		});

	d.show();
}


cur_frm.cscript.patient_entry = function(doc, dt ,dn) {
	var d = new wn.ui.Dialog({
		title:wn._('Patient Entry'),
		fields: [
			{fieldtype:'Data', fieldname:'first_name', label:wn._('First Name'), reqd:true, 
				description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Data', fieldname:'last_name', label:wn._('Last Name'), reqd:true, 
				description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Select', fieldname:'gender', label:wn._('Gender'), reqd:true, 
				options:'Male\nFemale',description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Date', fieldname:'date_of_birth', label:wn._('DOB'), reqd:true, 
				description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Data', fieldname:'mobile_no', label:wn._('Mobile Number'), reqd:true, 
				description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Data', fieldname:'email', label:wn._('email'), reqd:true, 
				description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Link', fieldname:'branch', label:wn._('Branch Id'), reqd:true,
				options:'LabBranch', description: wn._("Enter Patient Global Id")+
				wn._("Enter Patient Global Id")},
			{fieldtype:'Button', fieldname:'fetch_patient', label:wn._('New Patient Entry') }
		]
	})
	var fd = d.fields_dict;
	$(fd.fetch_patient.input).click(function() {
			var btn = this;
			$(btn).set_working();
			var patient_id  = d.get_values();
			if(!patient_id) return;	
			return wn.call({
				args: patient_id,
				method:'clinical.doctype.patient_encounter_entry.patient_encounter_entry.create_patient',
				callback: function(r) {
					// console.log(r)
					doc.patient = r.message
					refresh_field('patient');
					$(btn).done_working();
					d.hide();
				}
			});
		});

	d.show();
}

