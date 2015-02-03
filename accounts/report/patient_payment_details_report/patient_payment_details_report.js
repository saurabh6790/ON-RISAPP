// Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

wn.query_reports["Patient payment details report"] = {
	"filters": [
		{
			fieldname: "from_date",
			label: wn._("From Date"),
			fieldtype: "Date",
			default: wn.defaults.get_user_default("year_start_date"),
		},
		{
			fieldname: "to_date",
			label: wn._("To Date"),
			fieldtype: "Date",
			default: wn.defaults.get_user_default("year_end_date"),
		},
		{
			fieldname:"patient_name",
			label: wn._("Patient Name"),
			fieldtype: "Link",
			options: "Patient Register",
			get_query: function() {
				return {
					query: "clinical.doctype.patient_encounter_entry.patient_encounter_entry.get_patient_details"
				}
			}
		},
		{
			fieldname:"referrer_name",
			label: wn._("Referrer Name"),
			fieldtype: "Link",
			options: "Lead",
			get_query: function() {
				return {
					query:"controllers.queries.lead_query",
				}
			}
		},
	]
}