module.exports = {

    plugins: [
        require('flowbite/plugin')
    ]
  
  }
  
  module.exports = {
  
    content: [
        "./node_modules/flowbite/**/*.js"
    ]
  
  }
  
  plugins: [
    require('flowbite/plugin')({
        charts: true,
    }),
    // ... other plugins
  ]