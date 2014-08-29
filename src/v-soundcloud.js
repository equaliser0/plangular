// Vue Plangular component

'use strict';


var jsonp = require('jsonp');
var audio = require('./audio');
var player = require('./player');
var plangular = require('./v-plangular');

var Plangular = Vue.extend({

  data: {
    player: player,
    index: null,
    value: null,
    track: null,
    time: 0,
    dur: 0
  },

  computed: {
    currentTime: function() {
      if (player.tracks[player.i] == this.track) {
        this.time = player.currentTime;
        return this.time;
      } else {
        this.time = 0;
        return this.time;
      }
    },
    duration: function() {
      if (player.tracks[player.i] == this.track) {
        this.dur = player.duration;
        return this.dur;
      } else {
        return this.dur;
      }
    }
  },

  methods: {

    play: function(playlistIndex) {
      player.play(this.index, playlistIndex);
    },

    pause: function() {
      player.pause();
    },

    playPause: function(playlistIndex) {
      player.playPause(this.index, playlistIndex);
    },

    seek: function(e) {
      if (player.tracks[player.i] == this.track) {
        player.seek(e);
      }
    }

  },

  directives: {

    'src': function(value) {

      var self = this;
      self.vm.value = value;

      var elements = document.querySelectorAll('[v-src]');
      for (var i = 0; i < elements.length; i++) {
        if (this.el == elements[i]) {
          self.vm.index = i;
        }
      }

      var apiUrl = plangular.api + '?url=' + value + '&client_id=' + plangular.clientID;

      if (plangular.data[value]) {
        for (var key in plangular.data[value]) {
          self.vm.$data[key] = plangular.data[value][key];
        }
        self.vm.track = plangular.data[value];
        player.load(plangular.data[value], self.vm.index);
      } else {
        jsonp(apiUrl, function(error, response) {
          plangular.data[value] = response;
          for (var key in response) {
            self.vm.$data[key] = response[key];
          }
          self.vm.track = plangular.data[value];
          player.load(plangular.data[value], self.vm.index);
        });
      }

    }

  }

});

Vue.component('plangular', Plangular);

