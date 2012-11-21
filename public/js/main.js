var AppRouter = Backbone.Router.extend({

    routes: {
        ""                      : "home",
        "accounts"              : "list",
        "accounts/page/:page"   : "list",
        "accounts/add"          : "addAccount",
        "accounts/login"        : "accountLogin",
        "accounts/:id"          : "accountDetails",
        "about"                 : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        //$('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

     list: function(page) {
            var p = page ? parseInt(page, 10) : 1;
            var accountList = new AccountCollection();
            accountList.fetch({success: function(){
                $("#content").html(new AccountListView({model: accountList, page: p}).el);
            }});
            this.headerView.selectMenuItem('home-menu');
        },

     accountDetails: function (id) {
        var account = new Account({_id: id});
        account.fetch({success: function(){
            $("#content").html(new AccountView({model: account}).el);
        }});
        this.headerView.selectMenuItem();
    },

     addAccount: function() {
            var account  = new Account();
            $('#content').html(new AccountView({model: account}).el);
            this.headerView.selectMenuItem('add-menu');
     },

     accountLogin: function() {
        var accountLogin = new AccountLogin();
        $('#content').html(new AccountLoginView({model: accountLogin}).el);
        this.headerView.selectMenuItem('account-login');
     },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'AccountView', 'AccountListItemView', 'AccountLoginView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
