define(["./models/user","sulusecurity/models/role","sulusecurity/models/permission","sulucontact/model/contact","./collections/roles","./models/userRole"],function(a,b,c,d,e,f){"use strict";return{name:"Sulu Contact Permissions",initialize:function(){"form"===this.options.display&&this.renderForm(),this.bindCustomEvents()},bindCustomEvents:function(){this.sandbox.on("sulu.user.permissions.save",function(a){this.save(a)}.bind(this)),this.sandbox.on("sulu.contacts.contacts.list",function(){this.sandbox.emit("sulu.router.navigate","contacts/contacts")},this),this.sandbox.on("sulu.user.permissions.delete",function(a){this.confirmDeleteDialog(function(b){if(b){var c=d.findOrCreate({id:a});this.sandbox.emit("sulu.header.toolbar.item.loading","options-button"),c.destroy({success:function(){this.sandbox.emit("sulu.router.navigate","contacts/contacts")}.bind(this)})}}.bind(this))},this)},save:function(a){this.sandbox.emit("sulu.header.toolbar.item.loading","save-button"),this.user.set("username",a.user.username),this.user.set("contact",this.contact),this.user.set("locale",a.user.locale),a.user.password&&""!==a.user.password?this.user.set("password",a.user.password):this.user.set("password",""),this.user.url=a.user.id?"/admin/api/users/"+a.user.id:"/admin/api/users",this.sandbox.util.each(a.deselectedRoles,function(a,b){var c;this.user.get("userRoles").length>0&&(c=this.user.get("userRoles").findWhere({role:this.roles.get(b)}),c&&this.user.get("userRoles").remove(c))}.bind(this)),this.sandbox.util.each(a.selectedRolesAndConfig,function(a,b){var c,d=new f;this.user.get("userRoles").length>0&&(c=this.user.get("userRoles").findWhere({role:this.roles.get(b.roleId)}),c&&(d=c)),d.set("role",this.roles.get(b.roleId)),d.set("locales",b.selection),this.user.get("userRoles").add(d)}.bind(this)),this.user.save(null,{success:function(a){this.sandbox.emit("sulu.user.permissions.saved",a.toJSON())}.bind(this),error:function(){this.sandbox.logger.log("error while saving profile")}.bind(this)})},renderForm:function(){this.user=null,this.contact=null,this.options.id?this.loadRoles():this.sandbox.logger.log("error: form not accessible without contact id")},loadRoles:function(){this.roles=new e,this.roles.fetch({success:function(){this.loadUser()}.bind(this),error:function(){}})},loadUser:function(){this.user=new a,this.user.url="/admin/api/users?contactId="+this.options.id,this.user.fetch({success:function(a,b,c){200===c.xhr.status?(this.contact=this.user.get("contact").toJSON(),this.startComponent()):this.loadContact()}.bind(this),error:function(){}.bind(this)})},loadContact:function(){this.contact=new d({id:this.options.id}),this.contact.fetch({success:function(){this.contact=this.contact.toJSON(),this.startComponent()}.bind(this),error:function(){this.sandbox.logger.log("failed to load contact")}.bind(this)})},startComponent:function(){var a={},b=$('<div id="roles-form-container"/>');a.contact=this.contact,this.user&&(a.user=this.user.toJSON()),a.roles=this.roles.toJSON(),this.html(b),this.sandbox.start([{name:"permissions/components/form@sulusecurity",options:{el:b,data:a}}])},confirmDeleteDialog:function(a){if(a&&"function"!=typeof a)throw"callback is not a function";this.sandbox.emit("sulu.dialog.confirmation.show",{content:{title:"Be careful!",content:"<p>The operation you are about to do will delete data.<br/>This is not undoable!</p><p>Please think about it and accept or decline.</p>"},footer:{buttonCancelText:"Don't do it",buttonSubmitText:"Do it, I understand"},callback:{submit:function(){this.sandbox.emit("husky.dialog.hide"),a&&a(!0)}.bind(this),cancel:function(){this.sandbox.emit("husky.dialog.hide"),a&&a(!1)}.bind(this)}})}}});