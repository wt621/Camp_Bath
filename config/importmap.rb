# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "map", to: "map.js"
pin "panel_manager", to: "map/panel_manager.js"
pin "map_markers", to: "map/map_markers.js"
pin "flash", to: "flash.js"
pin "favorites", to: "favorites.js"
