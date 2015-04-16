var app = angular.module("AngularAuth", ["ui.router"]);

app.value('redirectToStateAfterLogin', { name: 'nn' });

app.controller("TestLoginController", 
	function ($scope, Auth, $state, $rootScope, redirectToStateAfterLogin) {
		$scope.loggedIn = function() {
			Auth.theUserIsLoggedIn();
			//console.log('logged in');
			$state.go(redirectToStateAfterLogin.name);
		};
	});

app.controller("TestUserController",
	function ($scope,Auth,$state) {
		$scope.logout = function() {
			//console.log('logging out');
			Auth.theUserIsLoggedOut();
			$state.go('login');
		};
	});

app.service('Auth', [
	 function () {
		 this.theUserIsLoggedIn = function() {
			 this.isLogged = true;
		 };
		 this.theUserIsLoggedOut = function () {
		 	this.isLogged = false;
		 };

	 }
]);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/user');

	$stateProvider
		.state('user', {
			url: '/user',
			templateUrl: 'user.html',
			controller: 'TestUserController'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'login.html',
			controller: 'TestLoginController',
			data: { requireLogin: true }
		})
		.state('details', {
			url: '/details',
			templateUrl: 'details.html',
			controller: 'TestUserController'
		});
}).run([
	'$rootScope', '$http', '$state', 'Auth', 'redirectToStateAfterLogin', function($rootScope, $http, $state, Auth, redirectToStateAfterLogin) {
		var timeoutValue = 100000;
		var timeout = Date.now() + timeoutValue;
		var increaseTimeout = function() {
			timeout = Date.now() + timeoutValue;
		};

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
			var isLogged = Auth.isLogged;
			var shouldLogin = !isLogged && toState.data == undefined;

			if (shouldLogin) {
				if (toState.name != 'login')
					redirectToStateAfterLogin.name = toState.name;
				$state.go('login');
				event.preventDefault();
				return;
			}
			if (Date.now() > timeout) {
				console.log('timeout');
				increaseTimeout();
				Auth.theUserIsLoggedOut();
				$state.go('login');
				event.preventDefault();
				return;

			}
		});

	}
]);




