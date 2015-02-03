# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import webnotes
from webnotes import msgprint, _

def execute(filters=None):
	if not filters: filters = {}
	
	columns = get_columns()
	#webnotes.errprint(['columns-',columns])
	entries = get_entries(filters)
	#webnotes.errprint(['entries --',entries])	
	data = []
	_old_inv = '0'
	_new_inv = '0'
	_old_d = []

	i = 0
	received_amount = 0
	remaining_amount = 0
	net_pay = 0
	temp_data = [];
	if len(entries) ==0:
		row = ['','','','','','','','','','']
		#data.append(row)
		return columns, data
	for d in entries:
		#webnotes.errprint("-------------------- ** ------------------------------")
		#webnotes.errprint(['d[10]--',d])
		#webnotes.conn.sql("select paid_amount_data from `tabSales Invoice` where name=%s",)
		if i == 0:
			_old_inv = _new_inv = d['name']
			#row = [d['Patient Id'],d['patient_name'],d['study'],d['export_rate'],d['discount'],d['Net Pay'],d['Payment received'],d['referrer_name'],d['lead_name'],d['Reffere Payment'],d['patient_name'],d['discount_type']]
			received_amount = d['Payment received']
			_old_d = d
			net_pay = d['Net Pay']
			#webnotes.errprint(" IN i = 0 ")
			#webnotes.errprint(net_pay)
			#webnotes.errprint(_old_d)
		elif i > 0:
			_new_inv = d['name']
			#webnotes.errprint (["New invoice ", _new_inv])
			#row = [d['Patient Id'],d['patient_name'],d['study'],d['export_rate'],d['discount'],d['Net Pay'],d['Payment received'],d['referrer_name'],d['lead_name'],d['Reffere Payment'],d['patient_name'],d['discount_type']]			
			if _old_inv != _new_inv:
				#webnotes.errprint ("invvoice not match: New Inv")
				#webnotes.errprint (_new_inv)
				#webnotes.errprint ("Old Inv : ")
				#webnotes.errprint (_old_inv)
				if _old_d['discount_type']=='Referral discount': 
					row = [_old_d['Patient Id'],_old_d['patient_name'],_old_d['study'],_old_d['export_rate'],_old_d['discount'],_old_d['Net Pay'],received_amount,_old_d['referrer_name'],_old_d['lead_name'],0,_old_d['name'],_old_d['discount_type']]
				else :	
					row = [_old_d['Patient Id'],_old_d['patient_name'],_old_d['study'],_old_d['export_rate'],_old_d['discount'],_old_d['Net Pay'],received_amount,_old_d['referrer_name'],_old_d['lead_name'],_old_d['Reffere Payment'],_old_d['name'],_old_d['discount_type']]
				data.append(row)
				#webnotes.errprint("Added a row to the result ")
				#webnotes.errprint (row)
				#row = [d['Patient Id'],d['patient_name'],d['study'],d['export_rate'],d['discount'],d['Net Pay'],d['Payment received'],d['referrer_name'],d['lead_name'],d['Reffere Payment'],d['patient_name'],d['discount_type']]
				_old_d = d
				received_amount = d['Payment received']
				_old_inv = _new_inv
			else :
				#net_pay += d['Net Pay']
				#webnotes.errprint("Invoice matched : ")
				if received_amount >= _old_d['Net Pay']:
					#webnotes.errprint("Received amount is more than equal to Net Pay")
					row = [_old_d['Patient Id'],_old_d['patient_name'],_old_d['study'],_old_d['export_rate'],_old_d['discount'],_old_d['Net Pay'],_old_d['Net Pay'],_old_d['referrer_name'],_old_d['lead_name'],_old_d['Reffere Payment'],_old_d['name'],_old_d['discount_type']]
					data.append(row)
					#webnotes.errprint("Printing row in the matched great  ")
					#webnotes.errprint (row)
					received_amount = received_amount - _old_d['Net Pay']
					_old_d = []
					_old_d = d
				elif received_amount < 	_old_d['Net Pay']:
					#webnotes.errprint("Received amount is less than Net Pay")
					row = [_old_d['Patient Id'],_old_d['patient_name'],_old_d['study'],_old_d['export_rate'],_old_d['discount'],_old_d['Net Pay'],received_amount,_old_d['referrer_name'],_old_d['lead_name'],_old_d['Reffere Payment'],_old_d['name'],_old_d['discount_type']]
					data.append(row)
					#webnotes.errprint("Printing row in the matched less  ")
					#webnotes.errprint (row)
					received_amount = 0
					_old_d = []
					_old_d = d
			# pass
		# if d['export_rate']>='Referral discount': 
		# 	pass
		# else:
		# 	row = [d['Patient Id'],d['patient_name'],d['study'],d['export_rate'],d['discount'],d['Net Pay'],d['Payment received'],d['referrer_name'],d['lead_name'],d['Reffere Payment'],d['patient_name'],d['discount_type']]
			#if d[10]=='Referral discount':
			#data.append(row)	
		i+=1
		#webnotes.errprint("-------------------- ** ------------------------------")
	#webnotes.errprint("Ending program")	
	row = [_old_d['Patient Id'],_old_d['patient_name'],_old_d['study'],_old_d['export_rate'],_old_d['discount'],_old_d['Net Pay'],received_amount,_old_d['referrer_name'],_old_d['lead_name'],_old_d['Reffere Payment'],_old_d['name'],_old_d['discount_type']]
	#webnotes.errprint(row)
	data.append(row)
	ttamt=totdis=totnet=totrec=totref=0.0
	for rows in data:
		if rows[3]:
			ttamt+=float(rows[3])
		if rows[4]:
			totdis+=float(rows[4])
		if rows[5]:
			totnet+=float(rows[5])
		if rows[6]:
			totrec+=float(rows[6])
		#webnotes.errprint(type(rows[9]))
		if rows[9]:
			totref+=float(rows[9])
		#webnotes.errprint(totref)
	#webnotes.errprint(totref)
	row = ['Total','','',ttamt,totdis,totnet,totrec,'','',totref]
	data.append(row)
	return columns, data
	
def get_columns():
	return ["Patient Id:Link/Patient Register:150","Patient Name:data :100","Study:data :80",
	"Total Amount:data:100","Discount:data:70","Net Pay:data:70","Received Amount:data:120",
	"Referrer Id:Link/Lead:130","Referrer Name:data:120","Referrer Payment:data:120","Bill No:Link/Sales Invoice:120"
	]

def get_entries(filters):
	conditions = get_conditions(filters)
	qry="""select a.customer as `Patient Id`,a.patient_name ,b.study ,b.export_rate ,
	(case when b.discount_type='Referral discount' then case when b.referral_rule='Percent' then b.referral_fee*b.export_rate/100 else b.referral_fee end when b.discount_type= 'Regular discount' then case when b.discount_in_amt=0 or b.discount_in_amt is null then b.discount*b.export_rate/100 when b.discount=0 or b.discount is null then b.discount_in_amt when b.discount_in_amt>0 and b.discount>0 then b.discount_in_amt else 0 end else b.discount_in_amt end) as `discount`,  
	b.basic_charges as `Net Pay` ,a.paid_amount_data as `Payment received`,b.referrer_name ,c.lead_name ,
	ROUND(IFNULL((case when (b.discount_type='Referral discount') then 0.0 else (case when (b.referral_rule='Percent') then (b.export_rate*b.referral_fee/100) else  b.referral_fee  end) end),0),2) as `Reffere Payment`,b.discount_type,a.name from `tabSales Invoice` 
	a ,`tabSales Invoice Item` b,`tabLead` c where a.name=b.parent and c.name=b.referrer_name and a.docstatus=1"""+conditions +" order by a.name,b.name "
	#webnotes.errprint(qry)
	entries =  webnotes.conn.sql(qry,debug=1,as_dict=1)
	#entries =  webnotes.conn.sql("""select a.customer as `Patient Id`,a.patient_name ,b.study ,b.export_rate ,
	#(case when b.discount_type='Referral discount' then case when b.referral_rule='Percent' then b.referral_fee*b.export_rate/100 else b.referral_fee end when b.discount_type= 'Regular discount' then case when b.discount_in_amt=0 or b.discount_in_amt is null then b.discount*b.export_rate/100 when b.discount=0 or b.discount is null then b.discount_in_amt when b.discount_in_amt>0 and b.discount>0 then b.discount_in_amt else 0 end else b.discount_in_amt end) as `discount`,  
	#b.basic_charges as `Net Pay` ,a.paid_amount_data as `Payment received`,b.referrer_name ,c.lead_name ,
	#IFNULL((case when (b.discount_type='Referral discount') then 0.0 else (case when (b.referral_rule='Percent') then (b.export_rate*b.referral_fee/100) else  b.referral_fee  end) end),0) as `Reffere Payment`,b.discount_type,a.name from `tabSales Invoice` 
	#a ,`tabSales Invoice Item` b,`tabLead` c where a.name=b.parent and c.name=b.referrer_name and a.docstatus=1 order by a.name,b.name""" ,as_dict=1)		
	return entries

def get_conditions(filters):
	conditions = ""
	cond=''
	if filters.get("from_date"):
		dtsa =filters.get("from_date")
		cond+= " and a.posting_date >= '"+dtsa+"'"
	if filters.get("to_date"):
		dtsa =filters.get("to_date")
		cond+= " and a.posting_date <= '"+dtsa+"'"
	if filters.get("patient_name"):
		dtsa =filters.get("patient_name")
		cond+= " and a.customer = '"+dtsa+"'"
	if filters.get("referrer_name"):
		dtsa =filters.get("referrer_name")
		cond+= " and c.name like '%"+dtsa+"%'"
	#webnotes.errprint(cond)
	return cond