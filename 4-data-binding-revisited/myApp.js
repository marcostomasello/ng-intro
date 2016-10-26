/**
 * Created by martomdev.com
 * on October 2016 as part of the Angular Intro tutorial
 * MIT license
 */
angular.module('exampleModule', [])
    .controller('MainController', [function() {
        var self = this;

        self.comments = [];

        self.addCommment = function(comment) {
            self.comments.push(comment);
            self.newComment = "";
        }
    }]);
