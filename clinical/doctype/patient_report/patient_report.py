# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

# For license information, please see license.txt

from __future__ import unicode_literals
import webnotes

class DocType:
	def __init__(self, d, dl):
		self.doc, self.doclist = d, dl
@webnotes.whitelist()
def get_server_id():
	return webnotes.conn.sql("select value from tabSingles where doctype = 'Global Defaults' and field = 'pacs_server_id'")[0][0]
# def show_images(self):pass
# 	from selenium import webdriver
# 	driver = webdriver.Ie()


# med syn 25650411/12    9881495351/2

