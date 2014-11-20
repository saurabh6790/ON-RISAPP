wn.query_reports["Referral Payment Info"] = {
	"filters": [
		{
			"fieldname":"from_date",
			"label": "From Date",
			"fieldtype": "Date",
			"width": "80"
		},
		{
			"fieldname":"to_date",
			"label": "To Date",
			"fieldtype": "Date",
			"default": get_today()
		},
		{
			"fieldname":"referral_name",
			"label": "Referral Name",
			"fieldtype": "Link",
			"options":"Lead"
			// "default": get_today()
		}
	]
}
