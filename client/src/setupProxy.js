const proxy = require("http-proxy-middleware")
module.exports = function(app) {
  app.use(
    proxy(["/api/tracks/**", "/api/comments/**", "/audio/**", "/imgs/**", "/api/members/**"], {
      //   target: "http://localhost:3001/"
      target: "https://salty-bayou-12671.herokuapp.com/"
    })
  )
}
