wn.pages['testdashboard'].onload = function(wrapper) { 
	wn.ui.make_app_page({
		parent: wrapper,
		title: 'dashboard',
		single_column: true
	});	
	wn.module_page["Clinical"] = [
        {
                top: true,
                title: wn._("Documents"),
                icon: "icon-copy",
                items: [
			{
                                label: wn._("Patient Registration"),
                                description: wn._("Patient Registration form."),
                                doctype:"Patient Register"
                        },
                        {
                                label: wn._("Patient Encounter Entry"),
                                description: wn._("Make Patient Encounter Entry"),
                                doctype:"Patient Encounter Entry"
                        },         
                        {
                                "label":wn._("Advance Payment Entry"),
                                doctype: "Advance Entry"
                        },                 
                        {
                                "label":wn._("Patient Report"),
                                doctype: "Patient Report"
                        },          
                ]
        }/*,
        {
                title: wn._("Masters"),
                icon: "icon-book",
                items: [
                        {
                                label: wn._("Contact"),
                                description: wn._("All Contacts."),
                                doctype:"Contact"
                        },
                ]
        },
        {
                title: wn._("Setup"),
                icon: "icon-cog",
                items: [
                        {
                                "label": wn._("Selling Settings"),
                                "route": "Form/Selling Settings",
                                "doctype":"Selling Settings",
                                "description": wn._("Settings for Selling Module")
                        },
                ]
        }*/
]
	// $($(document).find('.layout-main')[1])
	new wn.views.ReportViewPage('Patient Encounter Entry')
	setTimeout(function(){$($(document).find('.layout-main')[1]).append('<div id="module"></div>')},3000);
	setTimeout(function(){(wn.views.moduleview.make($('.appframe-titlebar'), "Clinical"))},3000);
}
