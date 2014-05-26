import webnotes

@webnotes.whitelist()
def get_masters():
	modality = webnotes.conn.sql("select name from tabModality",as_list=1)
	study = webnotes.conn.sql("select name from tabStudy",as_list=1)
	patient = webnotes.conn.sql("select concat(name, ', ', first_name)  from `tabPatient Register`",as_list=1)
	accession_number = webnotes.conn.sql("select name from `tabPatient Encounter Entry`",as_list=1)
	return modality, study, patient, accession_number

@webnotes.whitelist()
def get_patient_encounter_details():
	cols, cond = '', ''

	filters = eval(webnotes.form_dict.get('filter_data'))

	if webnotes.form_dict.get('cols'):
		cols = eval(webnotes.form_dict.get('cols'))

	columns = make_columns()
	conditions = make_conditions(filters)

	if conditions:
		cond = 'where %s'%('and'.join(conditions))

	return webnotes.conn.sql("select %(columns)s from `tabPatient Encounter Entry` %(cond)s"%{'cond':cond, 'columns':columns}, debug=1), columns

def make_columns():
	stored_cols = webnotes.conn.get_value("User Cols", webnotes.session.user, 'columns')
	if stored_cols:
		return stored_cols

	else:
		return "name, patient, status, encounter, study, radiologist_name"

def make_conditions(filters):
	condition = []
	import datetime

	if filters.get("modality") and filters.get("modality") != 'All':
		condition.append(' encounter = "%s"'%filters.get("modality"))

	if filters.get("study") and filters.get("study") != 'All':
		condition.append(' study = "%s"'%filters.get("study"))

	if filters.get("patient") and filters.get("patient") != 'All':
		condition.append(' patient = "%s"'%filters.get("patient").split(',')[0])

	if filters.get("status") and filters.get("status") != 'All':
		condition.append(' status = "%s"'%filters.get("status"))

	if filters.get("accession_number") and filters.get('accession_number') != 'All':
		condition.append(' name = "%s"'%filters.get("accession_number"))

	if filters.get("datepicker1") and filters.get("datepicker2"):
		from_date = get_date(filters.get("datepicker1"))
		to_date = get_date(filters.get("datepicker2"))
		if from_date > to_date:
			webnotes.msgprint("To date should not be less than from date",raise_exception=1)
		else:
			condition.append(' encounter_date between "%s" and "%s"'%(from_date, to_date))


	return condition

def get_date(string):
	import datetime
	return datetime.datetime.strptime(string, '%m/%d/%Y').strftime('%Y-%m-%d')

def add_columns(col_str):
	from webnotes.model.doc import Document
	user_cols = webnotes.conn.get_value("User Cols", webnotes.session.user, 'columns')
	
	if not user_cols:
		d = Document("User Cols")
		d.user_name = webnotes.session.user
		d.columns = col_str
		d.save()

	else:
		user_cols = remove_redundant_cols(user_cols, col_str)
		d = Document("User Cols", webnotes.session.user)
		d.columns = user_cols
		d.save()

def remove_redundant_cols(user_cols, col_str):
	col_list = col_str.split(',')
	user_cols = user_cols.split(",")

	for col in col_list:
		if not col in user_cols:
			user_cols.append(col)

	return ','.join(user_cols)


@webnotes.whitelist()
def get_cols():
	filters = webnotes.form_dict.get('doctype')
	cols = webnotes.conn.sql("select columns from `tabReport Column` where name = '%s' "%(webnotes.form_dict.get('doctype')),as_list=1)
	if cols and cols[0][0]:
		columns = form_cols_list(cols[0][0].split(','))
	return columns

def form_cols_list(cols):
	columns = []
	count = 0 
	mapper = {' radiologist': 'radiologist note', ' radiologist_':'radiologist', ' front_dest':'front_desk'}
	for i in cols:
		if mapper.has_key(i):
			# webnotes.errprint(i)
			i = mapper[i]

		if count%11 == 0:
			columns.append({"fieldtype":'Column Break', "fieldname":'cb'+str(count)})
			columns.append({"fieldtype":'Check', "fieldname":'%s'%(i), "label":i.upper()})
		else:
			columns.append({"fieldtype":'Check', "fieldname":'%s'%(i), "label":i.upper().replace('_', ' ')})
		count = count + 1

	columns.append({"fieldtype":'Section Break', "fieldname":'SB' })
	columns.append({"fieldtype":'Button', "fieldname":'save', "label":"Save Columns " })             

	return columns

@webnotes.whitelist()
def set_columns():
	columns = []
	if webnotes.form_dict.get('cols'):
		cols = eval(webnotes.form_dict.get('cols'))

	if cols:
		for key in sorted(cols):
			columns.append(key)

		add_columns(','.join(columns))