# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

# For license information, please see license.txt

from __future__ import unicode_literals
import webnotes

class DocType:
	def __init__(self, d, dl):
		self.doc, self.doclist = d, dl
	def autoname(self):
		self.doc.name = self.doc.study_aim

@webnotes.whitelist()
def get_modality(doctype, txt, searchfield, start, page_len, filters):
	return webnotes.conn.sql("select name from tabModality where active = 'Yes'", as_list=1)
