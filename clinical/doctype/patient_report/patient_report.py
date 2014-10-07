# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

# For license information, please see license.txt

from __future__ import unicode_literals
import webnotes
from webnotes.utils import cstr
import os, json
from webnotes.utils import get_base_path
from install_erpnext import exec_in_shell
from webnotes.model.doc import Document

class DocType:
	def __init__(self, d, dl):
		self.doc, self.doclist = d, dl

	def validate(self):
		get_head_field=webnotes.conn.sql("""select field from `tabSingles` where doctype='Patient Report Setting' and value=1 and field!='show_table_border'""",as_list=1)
		label_size=webnotes.conn.sql("""select value from `tabSingles` where doctype='Patient Report Setting' and field='lable_size' """)
		label_font=webnotes.conn.sql("""select value from `tabSingles` where doctype='Patient Report Setting' and field='lable_font' """)
		show_border=webnotes.conn.sql("""select value from `tabSingles` where doctype='Patient Report Setting' and field='show_table_border' """)
		branch_id=webnotes.conn.sql("""select value from `tabSingles` where doctype='Patient Report Setting' and field='branch_id'""")
		subtitle=webnotes.conn.sql("""select value from `tabSingles` where doctype='Patient Report Setting' and field='subtitle'""")
		company=webnotes.conn.sql("select value from tabSingles where doctype = 'Global Defaults' and field = 'default_company'")

		webnotes.errprint(company)
		field_list=[]
		print_dic={}
		for field in get_head_field:
			webnotes.errprint(field[0])
		  	field_list.append(field[0])
		print_dic={"head_fields":field_list,"label_size":label_size[0][0],"label_font":label_font[0][0],"show_border":show_border[0][0],"subtitle":subtitle[0][0],"company":company[0][0]}
		if branch_id:
			print_dic['branch_id']=branch_id[0][0] 
		
		strjson=json.dumps(print_dic)
		# webnotes.errprint(strjson)
		self.doc.print_details = strjson
		signature_path=webnotes.conn.sql("""select signature_image from `tabProfile` where name in (select user_id from `tabEmployee` where name='%s')"""%(self.doc.technologist_id),as_list=1) 
		# webnotes.errprint(signature_path)
		if signature_path:
			self.doc.signiture_image=signature_path[0][0]

	def on_update(self):
		self.doc.report_status = 'New'
		self.update_report_state('New')

	def on_submit(self):
		set_report_status(self.doc.name)
		self.update_report_state('Final')
		# self.run_method('update_after_submit')

	def update_report_state(self, state):
		webnotes.conn.sql(""" update `tabPatient Encounter Entry`
				set report_status = '%(state)s' 
				where name = "%(encounter)s"
			"""%{'state':state, 'encounter': self.doc.accession_number})

@webnotes.whitelist()
def get_server_id():
	return webnotes.conn.sql("select value from tabSingles where doctype = 'Global Defaults' and field = 'pacs_server_id'")[0][0]
# def show_images(self):pass
# 	from selenium import webdriver
# 	driver = webdriver.Ie()
# med syn 25650411/12    9881495351/2


@webnotes.whitelist()
def set_report_status(name):
	webnotes.conn.sql(""" update `tabPatient Report`
				set report_status = '%(state)s' 
				where name = "%(name)s"
			"""%{'state':'Final', 'name': name })
	webnotes.conn.commit()


@webnotes.whitelist()
def get_encounters(doctype, txt, searchfield, start, page_len, filters):
        return webnotes.conn.sql("""select name, patient, patient_name from `tabPatient Encounter Entry` 
        	where (%(key)s like "%(txt)s" 
				or patient_name like "%(txt)s") """%{'key': searchfield, 'txt': "%%%s%%" % txt})