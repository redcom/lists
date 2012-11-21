window.AccountLoginView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .login"   : "beforeLogin",
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeLogin: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.loginAccount();
        return false;
    },

    loginAccount: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                if (model && model.id) {
                    app.navigate('/accounts', false);
                    utils.showAlert('Success!', 'Account saved successfully', 'alert-success');
                } else {
                    utils.showAlert('Error', 'An error occurred while trying to login', 'alert-error');
                }
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to login with this account', 'alert-error');
            }
        });
    }
});
